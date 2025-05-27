import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Menu, Provider } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../service/themeService';
import { getGroup } from '../service/groupService';
import { deleteCheckin } from '../service/checkinService';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/pt-br';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('pt-br');

export default function PostDetails({ route, navigation }) {
    const { theme } = useTheme();
    const { checkin } = route.params;

    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const user = await SecureStore.getItemAsync('user');
            if (user) {
            setCurrentUser(JSON.parse(user));
            }

            const response = await getGroup();
            setGroups(response || []);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        } finally {
            setLoading(false);
        }
        };
        fetchData();
    }, [checkin.group_id]);

    const group = groups.find(g => String(g.id) === String(checkin.group_id));
    const isOwner = currentUser?.id === checkin.user.id;

    const handleDeletePost = () => {
        Alert.alert("Apagar post", "Deseja apagar esta publicação?", [
        { text: "Cancelar", style: "cancel" },
        {
            text: "Apagar",
            style: "destructive",
            onPress: async () => {
            setDeleting(true);
            try {
                await deleteCheckin(checkin.id);
                Alert.alert("Sucesso", "Publicação apagada com sucesso.");
                navigation.goBack();
            } catch (error) {
                Alert.alert("Erro", "Não foi possível apagar a publicação.");
                console.error("Erro ao apagar post:", error);
            } finally {
                setDeleting(false);
            }
            }
        },
        ]);
    };

    const handleEditPost = () => {
        navigation.navigate("EditPost", { checkin });
    };

    if (loading || deleting) {
        return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
            <ActivityIndicator size="large" color={theme.text} />
        </SafeAreaView>
        );
    }

    return (
        <Provider>
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <View style={[styles.header, { backgroundColor: theme.background }]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={30} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.headerText, { color: theme.text }]}>Detalhes da Publicação</Text>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
            <View style={[styles.post, { backgroundColor: theme.cardBackground }]}>
                <View style={styles.postHeader}>
                {checkin.user.avatar && (
                    <Image source={{ uri: checkin.user.avatar }} style={styles.avatar} />
                )}

                <Text style={[styles.postTitle, { color: theme.text, flex: 1 }]}>
                    @{checkin.user.name}
                </Text>

                {isOwner && (
                    <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
                        <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
                        </TouchableOpacity>
                    }
                    >
                    <Menu.Item onPress={handleEditPost} title="Editar post" />
                    <Menu.Item onPress={handleDeletePost} title="Apagar post" />
                    </Menu>
                )}
                </View>

                {checkin.photo && (
                <Image source={{ uri: checkin.photo }} style={styles.postImage} />
                )}

                <Text style={[styles.postText, { color: theme.text }]}>{checkin.title}</Text>
                {checkin.description ? (
                    <Text style={[styles.postText, { color: theme.text }]}>Descrição: {checkin.description}</Text>
                ) : null}
                <Text style={[styles.postGroup, { color: theme.text }]}>
                Postado no grupo {group ? group.group_name : 'Grupo não encontrado'}
                </Text>
                <Text style={[styles.postDate, { color: theme.text }]}>
                Postado dia {dayjs(checkin.created_at)
                    .tz('America/Fortaleza')
                    .format('DD [de] MMMM [de] YYYY')}
                </Text>
            </View>
            </ScrollView>
        </SafeAreaView>
        </Provider>
    );
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    headerText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    post: {
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    postTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    postGroup: {
        fontSize: 14,
        marginBottom: 8,
    },
    postText: {
        fontSize: 14,
        marginVertical: 8,
    },
    postDate: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    postImage: {
        width: '100%',
        height: 320,
        resizeMode: 'cover',
        borderRadius: 10,
        marginBottom: 10,
    },
    menuButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
});

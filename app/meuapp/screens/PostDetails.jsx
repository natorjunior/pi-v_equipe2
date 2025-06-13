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
    Modal,
    Dimensions,
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
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('pt-br');

export default function PostDetails({ route, navigation }) {
    const { theme } = useTheme();
    const { checkin } = route.params;

    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const focalX = useSharedValue(0);
    const focalY = useSharedValue(0);

    const { width: screenWidth } = Dimensions.get('window');

    const pinchGesture = Gesture.Pinch()
        .onUpdate((event) => {
            scale.value = Math.max(1, Math.min(event.scale, 3));
            focalX.value = event.focalX;
            focalY.value = event.focalY;
            const scaledTranslateX = (focalX.value - screenWidth / 2) * (scale.value - 1) / scale.value;
            const scaledTranslateY = (focalY.value - 200) * (scale.value - 1) / scale.value;
            translateX.value = scaledTranslateX;
            translateY.value = scaledTranslateY;
        })
        .onEnd(() => {
            scale.value = withTiming(1);
            translateX.value = withTiming(0);
            translateY.value = withTiming(0);
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

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
                console.log("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [checkin.group_id]);

    const group = groups.find(g => String(g.id) === String(checkin.group_id));
    const isOwner = currentUser?.name && checkin.user?.name && String(currentUser.name) === String(checkin.user.name);

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
                        console.log("Erro ao apagar post:", error);
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
            <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
                <View style={[styles.header, { backgroundColor: theme.background }]}>
                    <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={30} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerText, { color: theme.text }]}>Detalhes da Publicação</Text>
                    <View style={styles.headerButton} />
                </View>

                <ScrollView contentContainerStyle={styles.container}>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalBackground}>
                            <TouchableOpacity style={styles.modalCloseArea} onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={30} color="#fff" />
                            </TouchableOpacity>
                            <Image
                                source={{ uri: checkin.user.avatar }}
                                style={styles.fullscreenImage}
                                resizeMode="cover"
                            />
                        </View>
                    </Modal>

                    <View style={[styles.post, { backgroundColor: theme.cardBackground }]}>
                        <View style={styles.postHeader}>
                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                                {avatarLoading && (
                                    <ActivityIndicator size="large" color={theme.mode === "dark" ? "#fff" : "#000"} style={styles.avatarLoader} />
                                )}
                                {checkin.user.avatar && !avatarLoading && (
                                    <Image
                                        source={{ uri: checkin.user.avatar }}
                                        style={styles.avatar}
                                        onLoadStart={() => setAvatarLoading(true)}
                                        onLoadEnd={() => setAvatarLoading(false)}
                                    />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.postTitle, { color: theme.text, flex: 1 }]}
                                onPress={() => {
                                    if (currentUser && checkin.user.email === currentUser.email) {
                                        navigation.navigate("AppDrawer", {
                                            screen: "Tabs",
                                            params: { screen: "Profile" }
                                        });
                                    } else {
                                        navigation.navigate("OtherProfile", { member: checkin.user })
                                    }
                                }}>
                                <Text style={[styles.postTitle, { color: theme.text, flex: 1 }]}>@{checkin.user.name}</Text>
                            </TouchableOpacity>

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
                            <GestureDetector gesture={pinchGesture}>
                                <Animated.View style={[styles.imageContainer, animatedStyle]}>
                                    <Image source={{ uri: checkin.photo }} style={styles.postImage} resizeMode="cover" />
                                </Animated.View>
                            </GestureDetector>
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
    safeArea: {
        flex: 1,
    },
    container: {
        padding: 15,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 10,
        zIndex: 1,
    },
    headerButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    headerText: {
        flex: 1,
        marginLeft: 20,
        textAlign: "center",
        fontSize: 18,
        fontWeight: 'bold',
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
        paddingVertical: 3,
        flex: 1,
        marginRight: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    postGroup: {
        fontSize: 14,
        marginBottom: 8,
    },
    postText: {
        fontSize: 16,
        marginVertical: 8,
        fontWeight: 'bold',
    },
    postDate: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    postImage: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 10,
    },
    imageContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        overflow: 'hidden',
    },
    menuButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.9)",
        justifyContent: "center",
        alignItems: "center",
    },
    fullscreenImage: {
        width: "90%",
        aspectRatio: 1,
    },
    modalCloseArea: {
        position: "absolute",
        top: 50,
        right: 30,
        zIndex: 2,
        padding: 10,
    },
});
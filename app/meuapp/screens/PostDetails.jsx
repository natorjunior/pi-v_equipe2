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
    Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Menu, Provider } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../service/themeService';
import { getGroup } from '../service/groupService';
import { deleteCheckin, postLikeById, deleteLikeById } from '../service/checkinService';
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
    const { checkin: initialCheckin } = route.params;

    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [checkin, setCheckin] = useState(initialCheckin);
    const [reportModalVisible, setReportModalVisible] = useState(false);
    const [selectedReason, setSelectedReason] = useState(null);

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

    const handleLike = async () => {
        try {
            const updatedCheckin = {
                ...checkin,
                liked_by_user: !checkin.liked_by_user,
                likes_count: checkin.liked_by_user 
                    ? checkin.likes_count - 1 
                    : checkin.likes_count + 1
            };
            setCheckin(updatedCheckin);

            if (checkin.liked_by_user) {
                await deleteLikeById(checkin.id);
            } else {
                await postLikeById(checkin.id);
            }
        } catch (error) {
            setCheckin(initialCheckin);
            Alert.alert("Erro", "Não foi possível atualizar a curtida.");
            console.log("Erro ao curtir/descurtir:", error);
        }
    };

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
                        navigation.navigate("AppDrawer", { refresh: true });
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

    const handleReportPost = () => {
        setReportModalVisible(true);
        setMenuVisible(false);
    };

    const handleSendReport = async () => {
        if (!selectedReason) {
            Alert.alert("Erro", "Por favor, selecione um motivo para a denúncia.");
            return;
        }

        try {
            const subject = encodeURIComponent(`Denúncia de Publicação - ID ${checkin.id}`);
            const body = encodeURIComponent(
                `Motivo da denúncia: ${selectedReason}\n` +
                `ID da Publicação: ${checkin.id}\n` +
                `Usuário: ${checkin.user.name}\n` +
                `Título: ${checkin.title}\n` +
                `Data: ${dayjs(checkin.created_at).tz('America/Fortaleza').format('DD/MM/YYYY, HH:mm')}`
            );
            const mailtoUrl = `mailto:stayandlearnfeedbacks@gmail.com?subject=${subject}&body=${body}`;
            await Linking.openURL(mailtoUrl);
            setReportModalVisible(false);
            setSelectedReason(null);
            Alert.alert("Sucesso", "Denúncia enviada com sucesso.");
        } catch (error) {
            Alert.alert("Erro", "Não foi possível enviar a denúncia.");
            console.log("Erro ao enviar denúncia:", error);
        }
    };

    const reportReasons = [
        "Nudez ou conteúdo sexual",
        "Conteúdo impróprio",
        "Discurso de ódio",
        "Spam",
        "Assédio ou bullying",
        "Informação falsa",
        "Outro"
    ];

    const truncateUsername = (username) => {
        if (username.length > 40) {
            return username.slice(0, 40) + "...";
        }
        return username;
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

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={reportModalVisible}
                        onRequestClose={() => setReportModalVisible(false)}
                    >
                        <View style={styles.modalBackground}>
                            <View style={[styles.reportModalContainer, { backgroundColor: theme.background }]}>
                                <Text style={[styles.reportModalTitle, { color: theme.text }]}>Denunciar Publicação</Text>
                                <Text style={[styles.reportModalSubtitle, { color: theme.text }]}>Selecione o motivo da denúncia:</Text>
                                {reportReasons.map((reason, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.reportOption,
                                            selectedReason === reason && { backgroundColor: theme.mode === 'dark' ? '#333' : '#e0e0e0' }
                                        ]}
                                        onPress={() => setSelectedReason(reason)}
                                    >
                                        <Text style={[styles.reportOptionText, { color: theme.text }]}>{reason}</Text>
                                    </TouchableOpacity>
                                ))}
                                <View style={styles.reportModalButtons}>
                                    <TouchableOpacity
                                        style={[styles.reportButton, { backgroundColor: theme.mode === 'dark' ? '#555' : '#ccc' }]}
                                        onPress={() => {
                                            setReportModalVisible(false);
                                            setSelectedReason(null);
                                        }}
                                    >
                                        <Text style={styles.reportButtonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.reportButton, { backgroundColor: theme.error || '#ff2d55' }]}
                                        onPress={handleSendReport}
                                    >
                                        <Text style={[styles.reportButtonText, { color: '#fff' }]}>Enviar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    <View style={[styles.post, { backgroundColor: theme.background}]}>
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
                            <View style={styles.headerTextContainer}>
                                <View style={styles.headerNameRow}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (currentUser && checkin.user.email === currentUser.email) {
                                                navigation.navigate("AppDrawer", {
                                                    screen: "Tabs",
                                                    params: { screen: "Profile" }
                                                });
                                            } else {
                                                navigation.navigate("OtherProfile", { member: checkin.user })
                                            }
                                        }}
                                    >
                                        <Text style={[styles.postTitle, { color: theme.text }]}>@{truncateUsername(checkin.user.name)}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Menu
                                visible={menuVisible}
                                onDismiss={() => setMenuVisible(false)}
                                anchor={
                                    <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
                                        <Ionicons name="ellipsis-vertical" size={20} color={theme.text} />
                                    </TouchableOpacity>
                                }
                            >
                                {isOwner ? (
                                    <>
                                        <Menu.Item onPress={handleEditPost} title="Editar post" />
                                        <Menu.Item onPress={handleDeletePost} title="Apagar post" />
                                    </>
                                ) : (
                                    <Menu.Item onPress={handleReportPost} title="Denunciar post" />
                                )}
                            </Menu>
                        </View>
                        {checkin.photo && (
                            <GestureDetector gesture={pinchGesture}>
                                <Animated.View style={[styles.imageContainer, animatedStyle]}>
                                    <Image source={{ uri: checkin.photo }} style={styles.postImage} resizeMode="cover" />
                                </Animated.View>
                            </GestureDetector>
                        )}
                        <View style={styles.textContent}>
                            <Text style={[styles.postText, { color: theme.text }]}>{checkin.title}</Text>
                            {checkin.description && (
                                <Text style={[styles.postDescription, { color: theme.text }]}>{checkin.description}</Text>
                            )}
                            <Text style={[styles.postGroup, { color: theme.text }]}>
                                Postado no grupo {group ? group.group_name : 'carregando...'}
                            </Text>
                            <Text style={[styles.postTimestamp, { color: theme.text }]}>
                                {dayjs(checkin.created_at)
                                .tz('America/Fortaleza')
                                .format('DD/MM/YYYY, HH:mm')}
                            </Text>
                            <View style={styles.likeContainer}>
                                <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
                                    <Ionicons
                                        name={checkin.liked_by_user ? "heart" : "heart-outline"}
                                        size={20}
                                        color={checkin.liked_by_user ? theme.error || "red" : theme.text}
                                    />
                                </TouchableOpacity>
                                <Text style={[styles.likeCount, { color: theme.text }]}>{checkin.likes_count} {checkin.likes_count === 1 ? 'curtida' : 'curtidas'}</Text>
                            </View>
                        </View>
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
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderWidth: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerTextContainer: {
        flexDirection: 'column',
        flex: 1,
    },
    headerNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 8,
    },
    avatarLoader: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 8,
    },
    postTitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    separatorDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginHorizontal: 6,
        opacity: 0.6,
    },
    postTimestamp: {
        fontSize: 12,
        opacity: 0.6,
    },
    postImage: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 5,
        zIndex: 0,
    },
    imageContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        overflow: 'hidden',
    },
    textContent: {
        zIndex: -1,
    },
    postText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    postDescription: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 4,
    },
    postGroup: {
        fontSize: 13,
        marginBottom: 4,
        opacity: 0.6,
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    likeButton: {
        padding: 4,
    },
    likeCount: {
        fontSize: 13,
        marginLeft: 4,
        fontWeight: '500',
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
        zIndex: 1,
    },
    modalCloseArea: {
        position: "absolute",
        top: 50,
        right: 30,
        zIndex: 2,
        padding: 10,
    },
    reportModalContainer: {
        width: '80%',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    reportModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    reportModalSubtitle: {
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
    },
    reportOption: {
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
    },
    reportOptionText: {
        fontSize: 14,
    },
    reportModalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    reportButton: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    reportButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
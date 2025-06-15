import { useEffect, useState, useCallback, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    SafeAreaView,
    Image,
    TouchableOpacity,
    RefreshControl,
    Modal,
    ScrollView,
    Animated,
    CommonActions
} from "react-native";
import { DrawerActions, useFocusEffect, useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../service/themeService";
import { getUser } from "../service/userService";
import { getGroup } from "../service/groupService";
import { getFeedByUser, postLikeById, deleteLikeById } from "../service/checkinService";
import { LinearGradient } from "expo-linear-gradient";

const logolight = require("../assets/logolight.png");
const logodark = require("../assets/logodark.png");

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

function Logo() {
    const { theme } = useTheme();
    return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Image
                source={theme.mode === "dark" ? logodark : logolight}
                style={{ width: 200, height: 35, resizeMode: "contain" }}
            />
        </View>
    );
}

export default function Home() {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [checkins, setCheckins] = useState([]);
    const [filteredCheckins, setFilteredCheckins] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [groups, setGroups] = useState([]);
    const flatListRef = useRef(null);
    
    const scrollY = useRef(new Animated.Value(0)).current;
    const headerHeight = 80;
    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, headerHeight],
        outputRange: [0, -headerHeight],
        extrapolate: 'clamp',
    });

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
    );

const fetchGroups = useCallback(async () => {
    try {
        const groupsData = await getGroup();
        const groupMap = new Map(groupsData.map((g) => [g.id, g.group_name]));
        const uniqueGroups = [...new Set(checkins.map((checkin) => checkin.group_id))]
            .map((group_id) => ({
                id: group_id,
                name: groupMap.get(group_id) || `Group ${group_id}`,
            }))
            .filter((group) => group.name);
        setGroups(uniqueGroups);
    } catch (error) {
        console.error("Error fetching groups:", error);
        const uniqueGroups = [...new Set(checkins.map((checkin) => checkin.group_id))].map((group_id) => ({
            id: group_id,
            name: `Group ${group_id}`,
        }));
        setGroups(uniqueGroups);
    }
}, [checkins]);
useEffect(() => {
        const loadGroups = async () => {
            await fetchGroups();
        };
        loadGroups();
    }, [checkins, fetchGroups]);

    const fetchData = async (pageNum = 1, isRefresh = false) => {
        try {
            if (!isRefresh && pageNum === 1) setLoading(true);
            const token = await SecureStore.getItemAsync("token");
            if (!token) {
                navigation.navigate("Login");
                return;
            }

            const checkinsData = await getFeedByUser(pageNum);
            const sortedCheckins =
                Array.isArray(checkinsData) && checkinsData.length > 0
                    ? checkinsData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    : [];

            if (isRefresh) {
                setCheckins(sortedCheckins);
                setFilteredCheckins(sortedCheckins);
            } else {
                setCheckins((prev) => [...prev, ...sortedCheckins]);
                setFilteredCheckins((prev) => [...prev, ...sortedCheckins]);
            }

            setHasMore(checkinsData !== null && checkinsData.length > 0);
            setError(null);
            await getUser(token);
        } catch (error) {
            const status =
                error?.response?.status ||
                error?.status ||
                (error.message?.includes("401") ? 401 : error.message?.includes("404") ? 404 : null);

            if (status === 401) {
                navigation.navigate("Login");
                return;
            }

            setError(error.message || "Erro ao carregar o feed.");
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        setPage(1);
        setHasMore(true);
        setSelectedGroups([]);
        await fetchData(1, true);
        setRefreshing(false);
    }, []);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            setLoading(true);
            const nextPage = page + 1;
            setPage(nextPage);
            fetchData(nextPage);
        }
    }, [loading, hasMore, page]);

    const handleLike = async (checkinId) => {
        try {
            const checkin = checkins.find((item) => item.id === checkinId);
            if (!checkin) return;

            const updatedCheckins = checkins.map((item) => {
                if (item.id === checkinId) {
                    return {
                        ...item,
                        liked_by_user: !item.liked_by_user,
                        likes_count: item.liked_by_user ? item.likes_count - 1 : item.likes_count + 1,
                    };
                }
                return item;
            });
            setCheckins(updatedCheckins);
            setFilteredCheckins(
                updatedCheckins.filter((item) => selectedGroups.length === 0 || selectedGroups.includes(item.group_id))
            );

            if (checkin.liked_by_user) {
                await deleteLikeById(checkinId);
            } else {
                await postLikeById(checkinId);
            }
        } catch (error) {
            setError(error.message || "Erro ao curtir/descurtir a publicação.");
            await fetchData(1, true);
        }
    };

    const toggleGroupSelection = (groupId) => {
        setSelectedGroups((prev) =>
            prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
        );
    };

    const applyFilter = () => {
        if (selectedGroups.length === 0) {
            setFilteredCheckins(checkins);
        } else {
            setFilteredCheckins(checkins.filter((checkin) => selectedGroups.includes(checkin.group_id)));
        }
        setFilterModalVisible(false);
    };

    const clearFilter = () => {
        setSelectedGroups([]);
        setFilteredCheckins(checkins);
        setFilterModalVisible(false);
    };

    useFocusEffect(
        useCallback(() => {
            setPage(1);
            setHasMore(true);
            setCheckins([]);
            setFilteredCheckins([]);
            fetchData(1, true);
        }, [])
    );

    const renderFooter = () => {
        if (loading && !refreshing) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={theme.text} />
                </View>
            );
        }
        if (!hasMore && !loading && filteredCheckins.length > 0) {
            return (
            <TouchableOpacity 
                style={styles.messageContainer}
                onPress={async () => {
                    setPage(1);
                    setHasMore(true);
                    setRefreshing(true);
                    try {
                        await fetchData(1, true);
                        await new Promise(resolve => setTimeout(resolve, 100));
                        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
                    } finally {
                        setRefreshing(false);
                    }
                }}
            >
                <View style={[styles.line, { borderColor: theme.border }]} />
                <Ionicons name="sparkles-outline" size={32} color={theme.text} style={styles.icon} />
                <Text style={[styles.text, { color: theme.text }]}>Você chegou ao fim ✨</Text>
                <Text style={[styles.subtext, { color: theme.text }]}>
                    Toque para recarregar ou novas publicações aparecerão lá em cima!
                </Text>
            </TouchableOpacity>
            );
        }
        return null;
    };

    const renderEmptyComponent = () => {
        if (loading && !refreshing) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.text} />
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.messageContainer}>
                    <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
                </View>
            );
        }

        return (
            <View style={styles.messageContainer}>
                <Text style={[styles.text, { color: theme.text }]}>
                    Nenhuma publicação encontrada no seu feed.{"\n"}
                    Faça um check-in ou junte-se a um grupo!
                </Text>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#fff" }]}
                    onPress={() => navigation.navigate("CreateGroup")}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.buttonText, { color: theme.text }]}>Criar um grupo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#fff" }]}
                    onPress={() => navigation.navigate("JoinGroup")}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.buttonText, { color: theme.text }]}>Entrar em um grupo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.mode === "dark" ? "#fff" : "#000" }]}
                    onPress={() => navigation.navigate("SuggestedGroups")}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.buttonText, { color: theme.mode === "dark" ? "#000" : "#fff" }]}>
                        Grupos oficiais
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <LinearGradient
                colors={[theme.mode === "dark" ? "#0D0058" : "#f0f0f0", theme.mode === "dark" ? "#000000" : "#d0d0d0"]}
                style={{ flex: 1 }}
            >
                <Animated.View style={[
                    styles.header, 
                    { 
                        transform: [{ translateY: headerTranslateY }],
                        backgroundColor: theme.mode === "dark" ? "#0D0058" : "#f0f0f0",
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 10,
                        height: headerHeight,
                    }
                ]}>
                    <View style={styles.leftHeader}>
                        <TouchableOpacity
                            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                            style={[styles.hamburgerButton, { padding: 5, borderRadius: 100 }]}
                        >
                            <Ionicons name="menu" size={30} color={theme.text} />
                        </TouchableOpacity>
                        <View style={styles.logo}>
                            <Logo />
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            if (checkins.length === 0) {
                                navigation.navigate("InfoPage");
                            } else {
                                setFilterModalVisible(true);
                            }
                        }}
                        style={[styles.infoButton, { padding: 5, borderRadius: 100 }]}
                    >
                        <Ionicons
                            name={checkins.length === 0 ? "information-circle-outline" : "funnel-outline"}
                            size={30}
                            color={theme.text}
                        />
                    </TouchableOpacity>
                </Animated.View>

                <AnimatedFlatList
                    style={styles.list}
                    data={filteredCheckins}
                    ref={flatListRef}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ 
                        paddingTop: headerHeight + 20,
                        paddingHorizontal: 20,
                        paddingBottom: 20 
                    }}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.navigate("PostDetails", { checkin: item })}>
                            <View style={[styles.post, { backgroundColor: theme.background, borderColor: theme.text }]}>
                                <View style={styles.postHeader}>
                                    {item.user.avatar && <Image source={{ uri: item.user.avatar }} style={styles.avatar} />}
                                    <Text style={[styles.postTitle, { color: theme.text }]}>@{item.user.name}</Text>
                                </View>
                                {item.photo && <Image source={{ uri: item.photo }} style={styles.postImage} />}
                                <View style={styles.likeContainer}>
                                    <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.likeButton}>
                                        <Ionicons
                                            name={item.liked_by_user ? "heart" : "heart-outline"}
                                            size={24}
                                            color={item.liked_by_user ? theme.error || "red" : theme.text}
                                        />
                                    </TouchableOpacity>
                                    <Text style={[styles.likeCount, { color: theme.text }]}>{item.likes_count}</Text>
                                </View>
                                <Text style={[styles.postText, { color: theme.text }]}>{item.title}</Text>
                                <Text style={[styles.postDescription, { color: theme.text }]}>{item.description}</Text>
                                <Text style={[styles.postDate, { color: theme.text }]}>
                                    {new Date(item.created_at).toLocaleDateString("pt-BR", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={renderEmptyComponent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.text} />}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                />

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={filterModalVisible}
                    onRequestClose={() => setFilterModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>Filtrar por Grupos</Text>
                            <ScrollView style={styles.modalContent}>
                                {groups.map((group) => (
                                    <TouchableOpacity
                                        key={group.id}
                                        style={styles.groupItem}
                                        onPress={() => toggleGroupSelection(group.id)}
                                    >
                                        <Ionicons
                                            name={selectedGroups.includes(group.id) ? "checkbox" : "square-outline"}
                                            size={24}
                                            color={theme.text}
                                        />
                                        <Text style={[styles.groupText, { color: theme.text }]}>{group.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.modalButton, { backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#003366" }]}
                                    onPress={applyFilter}
                                >
                                    <Text style={styles.modalButtonText}>Aplicar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, { backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#003366" }]}
                                    onPress={clearFilter}
                                >
                                    <Text style={styles.modalButtonText}>Limpar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <TouchableOpacity
                    style={[styles.fab, { backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#003366" }]}
                    onPress={() => navigation.navigate("SelectGroup")}
                >
                    <Ionicons name="add" size={28} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 15,
        paddingBottom: 10,
        paddingHorizontal: 15,
    },
    leftHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    logo: {
        marginLeft: 1,
    },
    hamburgerButton: {
        borderRadius: 100,
    },
    infoButton: {
        borderRadius: 100,
    },
    messageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    post: {
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    postHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#ccc",
        marginRight: 10,
    },
    postTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    postImage: {
        width: "100%",
        height: 330,
        alignSelf: "center",
        resizeMode: "cover",
        borderRadius: 10,
        marginBottom: 10,
    },
    likeContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    likeButton: {
        borderRadius: 100,
        transform: [{ scale: 1 }],
    },
    likeCount: {
        fontSize: 14,
        marginLeft: 5,
        fontWeight: "bold",
    },
    postText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },
    postDescription: {
        fontSize: 14,
        marginBottom: 8,
    },
    postDate: {
        fontSize: 12,
        fontStyle: "italic",
    },
    text: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    errorText: {
        fontSize: 14,
        textAlign: "center",
    },
    loadingContainer: {
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    fab: {
        position: "absolute",
        bottom: 25,
        right: 25,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    actionButton: {
        width: "80%",
        marginTop: 20,
        paddingVertical: 14,
        marginVertical: 10,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
    },
    line: {
        width: "100%",
        borderTopWidth: 1,
        marginVertical: 12,
    },
    icon: {
        marginBottom: 8,
    },
    subtext: {
        fontSize: 14,
        textAlign: "center",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: "80%",
        borderRadius: 10,
        padding: 20,
        maxHeight: "80%",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    modalContent: {
        maxHeight: "70%",
    },
    groupItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
    },
    groupText: {
        fontSize: 16,
        marginLeft: 10,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginHorizontal: 5,
    },
    modalButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
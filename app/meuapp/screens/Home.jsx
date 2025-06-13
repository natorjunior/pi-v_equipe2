import { useEffect, useState, useCallback } from "react";
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
} from "react-native";
import { DrawerActions, useFocusEffect, useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../service/themeService";
import { getUser } from "../service/userService";
import { getFeedByUser } from "../service/checkinService";
import { LinearGradient } from "expo-linear-gradient";
import { GroupRankingCarousel } from "../components/Carrossel";

export default function Home() {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [checkins, setCheckins] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (pageNum = 1, isRefresh = false) => {
        try {
            if (!isRefresh && pageNum === 1) setLoading(true);

            const token = await SecureStore.getItemAsync("token");
            if (!token) {
                navigation.navigate("Login");
                return;
            }

            const checkinsData = await getFeedByUser(pageNum);
            // Handle null or empty array
            const sortedCheckins = Array.isArray(checkinsData) && checkinsData.length > 0
                ? checkinsData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                : [];

            if (isRefresh) {
                setCheckins(sortedCheckins);
            } else {
                setCheckins((prev) => [...prev, ...sortedCheckins]);
            }

            setHasMore(checkinsData !== null && checkinsData.length > 0);
            setError(null);
            await getUser(token);
        } catch (error) {
            const status =
                error?.response?.status ||
                error?.status ||
                (error.message?.includes("401") ? 401 :
                error.message?.includes("404") ? 404 : null);

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

    useFocusEffect(
        useCallback(() => {
            setPage(1);
            setHasMore(true);
            setCheckins([]);
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
        if (!hasMore && !loading && checkins.length > 0) {
            return (
                <View style={styles.messageContainer}>
                    <View style={[styles.line, { borderColor: theme.border }]} />
                    <Ionicons name="sparkles-outline" size={32} color={theme.text} style={styles.icon} />
                    <Text style={[styles.text, { color: theme.text }]}>
                        Você chegou ao fim ✨
                    </Text>
                    <Text style={[styles.subtext, { color: theme.text }]}>
                        Novas publicações aparecerão lá em cima!
                    </Text>
                </View>
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
                    <Text style={[styles.buttonText, { color: theme.text }]}>
                        Criar um grupo
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#fff" }]}
                    onPress={() => navigation.navigate("JoinGroup")}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.buttonText, { color: theme.text }]}>
                        Entrar em um grupo
                    </Text>
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
                colors={[
                    theme.mode === "dark" ? "#0D0058" : "#f0f0f0",
                    theme.mode === "dark" ? "#000000" : "#d0d0d0",
                ]}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                        style={[styles.hamburgerButton, { padding: 5, borderRadius: 100 }]}
                    >
                        <Ionicons name="menu" size={30} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>
                        Feed
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("InfoPage")}
                        style={[styles.infoButton, { padding: 5, borderRadius: 100 }]}
                    >
                        <Ionicons name="information-circle-outline" size={30} color={theme.text} />
                    </TouchableOpacity>
                </View>


                <FlatList
                    style={styles.list}
                    data={checkins}
                    //inverted={true}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ padding: 20 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("PostDetails", { checkin: item })}
                        >
                            <View style={[styles.post, { borderColor: theme.mode === "dark" ? "#fff" : "#000" }]}>
                                <View style={styles.postHeader}>
                                    {item.user.avatar && (
                                        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
                                    )}
                                    <Text style={[styles.postTitle, { color: theme.text }]}>
                                        @{item.user.name}
                                    </Text>
                                </View>
                                {item.photo && (
                                    <Image source={{ uri: item.photo }} style={styles.postImage} />
                                )}
                                <Text style={[styles.postText, { color: theme.text }]}>
                                    {item.title}
                                </Text>
                                <Text style={[styles.postDescription, { color: theme.text }]}>
                                    {item.description}
                                </Text>
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
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={theme.text}
                        />
                    }
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                />
                <TouchableOpacity
                    style={[
                        styles.fab,
                        {
                            backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#003366",
                        },
                    ]}
                    onPress={() =>
                        navigation.navigate("SelectGroup")}
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
        marginTop: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 15,
        paddingBottom: 10,
        position: 'relative',
    },
    hamburgerButton: {
        position: "absolute",
        top: 10,
        left: 15,
        zIndex: 10,
    },
    infoButton: {
        position: "absolute",
        top: 10,
        right: 15,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "700",
        flex: 1,
        textAlign: "center",
        letterSpacing: 1,
    },
    messageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    post: {
        backgroundColor: "rgba(255,255,255,0.02)",
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
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
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#ccc",
        marginRight: 12,
        borderWidth: 1,
        borderColor: "#888",
    },
    postTitle: {
        fontSize: 17,
        fontWeight: "600",
    },
    postText: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 8,
        lineHeight: 24,
    },
    postDescription: {
        fontSize: 15,
        marginBottom: 8,
        lineHeight: 20,
    },
    postDate: {
        fontSize: 13,
        fontStyle: "italic",
        color: "#888",
    },
    postImage: {
        width: "100%",
        aspectRatio: 1,
        alignSelf: "center",
        borderRadius: 15,
        marginBottom: 12,
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
        backgroundColor: "#fff",
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
});

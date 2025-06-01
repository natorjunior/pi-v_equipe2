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
import { getCheckinsByGroup } from "../service/checkinService";
import { LinearGradient } from "expo-linear-gradient";

export default function Home({ route }) {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [checkins, setCheckins] = useState([]);
    const [groupName, setGroupName] = useState(null);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            if (!refreshing) setLoading(true);

            const token = await SecureStore.getItemAsync("token");
            if (!token) {
                navigation.navigate("Login");
                return;
            }

            let storedGroupId = await SecureStore.getItemAsync("selectedGroupId");
            let storedGroupName = await SecureStore.getItemAsync("selectedGroupName");

            if (route?.params?.groupId) {
                storedGroupId = route.params.groupId.toString();
                await SecureStore.setItemAsync("selectedGroupId", storedGroupId);
            }

            if (route?.params?.groupName) {
                storedGroupName = route.params.groupName;
                await SecureStore.setItemAsync("selectedGroupName", storedGroupName);
            }

            setSelectedGroupId(storedGroupId);
            setGroupName(storedGroupName);

            if (storedGroupId) {
                const checkinsData = await getCheckinsByGroup(storedGroupId);
                const sortedCheckins = checkinsData.sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );
                setCheckins(sortedCheckins);
            } else {
                setCheckins([]);
            }

            await getUser(token);
            setError(null);
        } catch (error) {
            const status =
                error?.response?.status ||
                error?.status ||
                (error.message?.includes("401") ? 401 :
                error.message?.includes("404") ? 404 : null);

            if (status === 404 || status === 401) {
                await SecureStore.deleteItemAsync("selectedGroupId");
                await SecureStore.deleteItemAsync("selectedGroupName");
                setSelectedGroupId(null);
                setGroupName(null);
                setCheckins([]);
                setError("Você não faz mais parte deste grupo.");
                return;
            }

            setError(error.message || "Erro ao carregar dados.");
        } finally {
            if (!refreshing) setLoading(false);
        }
    };


    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, [route?.params?.groupId]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [route?.params?.groupId])
    );

    const renderEmptyComponent = () => {
        if (!selectedGroupId) {
            return (
                <View style={styles.messageContainer}>
                    <Text style={[styles.text, { color: theme.text }]}>
                        Selecione um grupo na aba de grupos.{"\n"} Se não tiver nenhum grupo você pode criar ou entrar em um.
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
                </View>
                );
        }

        if (loading) {
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
                    Nenhuma publicação encontrada neste grupo
                </Text>
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

                    {selectedGroupId && (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("GroupDetails", { groupId: selectedGroupId })}
                            style={[styles.groupButton, { padding: 5, borderRadius: 100 }]}
                        >
                            <Text style={[styles.grupname, { color: theme.text }]}>
                                {groupName || `Grupo ${selectedGroupId}`}
                            </Text>
                        </TouchableOpacity>
                    )}


                    {selectedGroupId && (
                        <TouchableOpacity
                            onPress={async () => {
                                await SecureStore.deleteItemAsync("selectedGroupId");
                                setSelectedGroupId(null);
                                navigation.navigate("Home");
                            }}
                            style={[styles.leaveButton, { padding: 5, borderRadius: 100 }]}
                        >
                            <Ionicons name="exit-outline" size={30} color={theme.text} />
                        </TouchableOpacity>
                    )}
                </View>

                <FlatList
                    style={styles.list}
                    data={checkins}
                    //inverted={true}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ padding: 20 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("PostDetails", { checkin: item })
                            }
                        >
                            <View
                                style={[styles.post, {  borderColor: theme.mode === "dark" ? "#fff" : "#000"}]}
                            >
                                <View style={styles.postHeader}>
                                    {item.user.avatar && (
                                        <Image
                                            source={{ uri: item.user.avatar }}
                                            style={styles.avatar}
                                        />
                                    )}
                                    <Text
                                        style={[styles.postTitle, { color: theme.text }]}
                                    >
                                        @{item.user.name}
                                    </Text>
                                </View>

                                {item.photo && (
                                    <Image
                                        source={{ uri: item.photo }}
                                        style={styles.postImage}
                                    />
                                )}

                                <Text style={[styles.postText, { color: theme.text }]}>
                                    {item.title}
                                </Text>
                                <Text style={[styles.postText, { color: theme.text }]}>
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
                    ListEmptyComponent={renderEmptyComponent()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={theme.text}
                        />
                    }
                />
                {selectedGroupId && (
                    <TouchableOpacity
                        style={[
                            styles.fab,
                            {
                                backgroundColor:
                                    theme.mode === "dark" ? "#DFBA69" : "#003366",
                            },
                        ]}
                        onPress={() => navigation.navigate("Publish")}
                    >
                        <Ionicons name="add" size={28} color="#fff" />
                    </TouchableOpacity>
                )}
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 10,
        paddingBottom: 10,
    },
    hamburgerButton: {
        position: "absolute",
        top: 10,
        left: 15,
        zIndex: 10,
    },
    leaveButton: {
        position: "absolute",
        top: 10,
        right: 15,
        zIndex: 10,
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
    },
    postHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: "#ccc",
        marginRight: 10,
    },
    postTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    postText: {
        fontSize: 14,
        marginBottom: 8,
    },
    postDate: {
        fontSize: 12,
        fontStyle: "italic",
    },
    postImage: {
        width: "100%",
        height: 320,
        resizeMode: "cover",
        borderRadius: 10,
        marginBottom: 10,
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
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    icon: {
        right: 1,
        top: 1,
    },
    fab: {
        position: "absolute",
        bottom: 25,
        right: 25,
        width: 55,
        height: 55,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },
    groupButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 7,
    },
    grupname: {
        fontSize: 20,
        fontWeight: "bold",
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
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
    },
});

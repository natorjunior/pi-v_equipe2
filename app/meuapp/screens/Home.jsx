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
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = await SecureStore.getItemAsync("token");
            if (!token) {
                navigation.navigate("Login");
                return;
            }

            let storedGroupId = await SecureStore.getItemAsync("selectedGroupId");
            if (!storedGroupId && route?.params?.groupId) {
                storedGroupId = route.params.groupId.toString();
                await SecureStore.setItemAsync("selectedGroupId", storedGroupId);
            }

            setSelectedGroupId(storedGroupId);

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
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

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
                        Selecione um grupo para ver as publicações
                    </Text>
                    <Ionicons
                        name="arrow-down-outline"
                        size={50}
                        color={theme.text}
                        style={styles.icon}
                    />
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
                    inverted={true}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ padding: 20 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("PostDetails", { checkin: item })
                            }
                        >
                            <View
                                style={[styles.post, { backgroundColor: theme.cardBackground }]}
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
        marginTop: 50,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
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
        marginTop: 300,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    post: {
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        borderColor: "#ccc",
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
        right: 138,
        top: 325,
        
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
});

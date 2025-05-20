import { useState, useCallback, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    SafeAreaView,
    Image,
} from "react-native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import Top from "../components/Top";
import NavBar from "../components/Navbar";
import { useTheme } from "../service/themeService";
import { getUser } from "../service/userService";
import { getCheckinsByGroup } from "../service/checkinService";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/pt-br";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("pt-br");

export default function Home() {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const [loading, setLoading] = useState(true);
    const [checkins, setCheckins] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [error, setError] = useState(null);
    const scrollViewRef = useRef(null);

    useFocusEffect(
        useCallback(() => {
        const fetchData = async () => {
            try {
            setLoading(true);
            const token = await SecureStore.getItemAsync("token");

            if (!token) {
                navigation.navigate("Login");
                return;
            }

            const groupId = route.params?.selectedGroupId;
            setSelectedGroupId(groupId);

            if (groupId) {
                const checkinsData = await getCheckinsByGroup(groupId);
                setCheckins(checkinsData);
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

        fetchData();
        }, [route.params?.selectedGroupId])
    );

    const renderContent = () => {
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

        if (checkins.length === 0) {
        return (
            <View style={styles.messageContainer}>
            <Text style={[styles.text, { color: theme.text }]}>
                Nenhuma publicação encontrada neste grupo
            </Text>
            </View>
        );
        }

        return (
        <ScrollView
            contentContainerStyle={styles.postsContainer}
            ref={scrollViewRef}
            onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd({ animated: false });
            }}
        >
            {checkins.map((checkin) => (
            <View
                key={checkin.id}
                style={[styles.post, { backgroundColor: theme.cardBackground }]}
            >
                <View style={styles.postHeader}>
                {checkin.user.avatar && (
                    <Image
                    source={{ uri: checkin.user.avatar }}
                    style={styles.avatar}
                    />
                )}
                <Text style={[styles.postTitle, { color: theme.text }]}>
                    @{checkin.user.name}
                </Text>
                </View>

                {checkin.photo && (
                <View style={styles.postImageContainer}>
                    {loading ? (
                    <ActivityIndicator
                        size="large"
                        color={theme.text}
                        style={styles.postImageLoading}
                    />
                    ) : (
                    <Image
                        source={{ uri: checkin.photo }}
                        style={styles.postImage}
                        resizeMode="cover"
                    />
                    )}
                </View>
                )}

                <Text style={[styles.postText, { color: theme.text }]}>
                {checkin.title}
                </Text>
                <Text style={[styles.postText, { color: theme.text }]}>
                {checkin.description}
                </Text>
                <Text style={[styles.postDate, { color: theme.text }]}>
                {dayjs(checkin.created_at)
                    .tz("America/Fortaleza")
                    .format("DD [de] MMMM [de] YYYY")}
                </Text>
            </View>
            ))}
        </ScrollView>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
            <Top navigation={navigation} />
            </View>
            {renderContent()}
            <NavBar
            navigation={navigation}
            inGroup={!!selectedGroupId}
            selectedGroupId={selectedGroupId}
            />
        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingTop: 20,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    messageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    postsContainer: {
        paddingTop: 80,
        paddingBottom: 100,
        paddingHorizontal: 15,
    },
    post: {
        borderRadius: 10,
        padding: 15,
        height: "auto",
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
    postImageContainer: {
        height: 200,
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 10,
        marginTop: 5,
    },
    postImage: {
        width: "100%",
        height: "100%",
    },
    postImageLoading: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
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
        marginTop: 20,
    },
});


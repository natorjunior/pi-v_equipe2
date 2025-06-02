import React, { useState } from 'react';
import { 
    View, 
    Text, 
    Image, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity, 
    ScrollView,
    Modal,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from '../service/themeService';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/pt-br";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("pt-br");

export default function OtherProfile({ route, navigation }) {
    const { theme } = useTheme();
    const [avatarLoading, setAvatarLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("genres");
    const { member } = route.params;

    const formatDate = (dateString) => {
        return dayjs(dateString).tz("America/Fortaleza").format("DD [de] MMMM [de] YYYY");
    };

    const renderMotivationIcon = () => {
        switch (member.motivation) {
        case "Encontrar sua turma":
            return <Image source={require("../assets/q2image1.png")} style={styles.motivationIcon} />;
        case "Procurar livros":
            return <Image source={require("../assets/q2image2.png")} style={styles.motivationIcon} />;
        case "Focar nos estudos":
            return <Image source={require("../assets/q2image3.png")} style={styles.motivationIcon} />;
        case "Usufruir do aplicativo":
            return <Image source={require("../assets/q2image4.png")} style={styles.motivationIcon} />;
        default:
            return null;
        }
    };

    return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.mode === "dark" ? "#050024" : "#f0f0f0" }}>
        <LinearGradient
            colors={[
            theme.mode === "dark" ? "#0D0058" : "#f0f0f0",
            theme.mode === "dark" ? "#000000" : "#d0d0d0",
            ]}
            style={styles.gradient}
        >
            <View style={[styles.header, { backgroundColor: "transparent" }]}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={[styles.backButton, { padding: 5, borderRadius: 100 }]}
            >
                <Ionicons name="arrow-back" size={30} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.headerText, { color: theme.text }]}>Perfil</Text>
            <View style={{ width: 30 }} />
            </View>

            <ScrollView
            contentContainerStyle={styles.scrollContent}
            >
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
                    source={{ uri: member?.avatar }}
                    style={styles.fullscreenImage}
                    resizeMode="contain"
                />
                </View>
            </Modal>

            <View style={styles.profileHeader}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                {avatarLoading && (
                    <ActivityIndicator size="large" color={theme.mode === "dark" ? "#fff" : "#000"} style={styles.avatarLoader} />
                )}
                {member?.avatar ? (
                    <Image
                    source={{ uri: member.avatar }}
                    style={[
                        styles.avatar,
                        {
                        borderColor: theme.mode === "dark" ? "#DFBA69" : "#003366",
                        },
                    ]}
                    onLoadStart={() => setAvatarLoading(true)}
                    onLoadEnd={() => setAvatarLoading(false)}
                    />
                ) : (
                    <View style={[styles.defaultAvatar, { backgroundColor: theme.mode === "dark" ? "#1a1a2e" : "#ccc" }]}>
                    <Ionicons name="person" size={60} color={theme.mode === "dark" ? "#fff" : "#000"} />
                    </View>
                )}
                </TouchableOpacity>

                <Text style={[styles.name, { color: theme.text }]}>{member?.name || "Usuário"}</Text>

                <View style={styles.motivationContainer}>
                <View style={styles.motivationIconContainer}>{renderMotivationIcon()}</View>
                <Text style={[styles.motivation, { color: theme.text }]}>{member?.motivation}</Text>
                </View>

                {member?.created_at && (
                <Text style={[styles.createdAt, { color: theme.text }]}>
                    Com a gente desde: {formatDate(member.created_at)}
                </Text>
                )}
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                style={[
                    styles.tabButton,
                    activeTab === "genres" && {
                    borderBottomColor: theme.mode === "dark" ? "#DFBA69" : "#003366",
                    },
                ]}
                onPress={() => setActiveTab("genres")}
                >
                <Text
                    style={[
                    styles.tabText,
                    {
                        color: activeTab === "genres" ? (theme.mode === "dark" ? "#DFBA69" : "#003366") : theme.text,
                    },
                    ]}
                >
                    Gêneros Favoritos
                </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.genresContainer}>
                {member?.genres?.length > 0 ? (
                member.genres.map((genre, index) => (
                    <View
                    key={index}
                    style={[
                        styles.genreTag,
                        {
                        backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#003366",
                        },
                    ]}
                    >
                    <Text style={[styles.genreText, { color: "#fff" }]}>{genre}</Text>
                    </View>
                ))
                ) : (
                <Text style={[styles.noContent, { color: theme.text }]}>Nenhum gênero selecionado</Text>
                )}
            </View>
            </ScrollView>
        </LinearGradient>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    gradient: { flex: 1 },
    scrollContent: { paddingBottom: 30 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        position: "relative",
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        flex: 1,
    },
    backButton: {
        zIndex: 10,
    },
    profileHeader: {
        alignItems: "center",
        paddingTop: 20,
        paddingBottom: 20,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
        borderWidth: 3,
    },
    avatarLoader: {
        position: "absolute",
        top: 45,
        left: 45,
    },
    defaultAvatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 5,
    },
    motivation: {
        fontSize: 16,
        fontStyle: "italic",
        opacity: 0.8,
        textAlign: "center",
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    motivationContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    motivationIcon: {
        width: 30,
        height: 30,
        left: 10,
        top: -7,
    },
    createdAt: {
        fontSize: 14,
        marginTop: 4,
        opacity: 0.7,
    },
    tabContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    tabButton: {
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: "transparent",
    },
    tabText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    genresContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        paddingHorizontal: 15,
    },
    genreTag: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        margin: 5,
    },
    genreText: {
        fontSize: 14,
    },
    noContent: {
        textAlign: "center",
        marginTop: 20,
        fontStyle: "italic",
        width: "100%",
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.9)",
        justifyContent: "center",
        alignItems: "center",
    },
    fullscreenImage: {
        width: "90%",
        height: "70%",
    },
    modalCloseArea: {
        position: "absolute",
        top: 50,
        right: 30,
        zIndex: 2,
        padding: 10,
    },
});
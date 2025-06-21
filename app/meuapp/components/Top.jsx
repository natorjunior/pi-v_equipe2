import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    SafeAreaView,
    Alert,
    Platform,
    Image,
} from "react-native";
import { useTheme } from "../service/themeService";
import { useEffect, useState } from "react";
import { logoutUser } from "../service/authService";
import { getUser } from "../service/userService";

const Hamburger = ({ navigation }) => {
    const { theme } = useTheme();
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUser();
                setUser(userData);
            } catch (error) {
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await logoutUser();
        navigation.reset({
            index: 0,
            routes: [{ name: "Entrada" }],
        });
    };

    const handleNavigate = (screen, params) => {
        if (navigation) {
            navigation.navigate(screen, params);
        }
    };

    const confirmLogout = () => {
        Alert.alert(
            "Confirmar Logout",
            "Você tem certeza que deseja sair?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Confirmar", onPress: handleLogout },
            ]
        );
    };

    const navigateToProfile = () => {
        navigation.reset({
            index: 0,
            routes: [
                {
                name: "Tabs",
                params: { screen: "Profile" },
                },
            ],
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.mode === "dark" ? "#0D0058" : "#fff" }]}>
            <View style={styles.profileHeader}>
                <TouchableOpacity
                    onPress={navigateToProfile}
                    style={styles.profileContainer}
                >
                    {user?.avatar ? (
                        <Image
                            source={{ uri: user.avatar }}
                            style={[styles.avatar, { borderColor: theme.mode === "dark" ? "#fff" : "#000" }]}
                            onLoadStart={() => setAvatarLoading(true)}
                            onLoadEnd={() => setAvatarLoading(false)}
                        />
                    ) : null}
                    <Text style={[styles.username, { color: theme.text }]}>{user?.name}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.menuButtons}>
                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate("CreateGroup")}>
                    <Text style={[styles.menuItemText, { color: theme.text }]}>Criar Grupo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate("JoinGroup")}>
                    <Text style={[styles.menuItemText, { color: theme.text }]}>Entrar em um grupo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate("Config")}>
                    <Text style={[styles.menuItemText, { color: theme.text }]}>Configurações</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate("Feedback")}>
                    <Text style={[styles.menuItemText, { color: theme.text }]}>Ajuda e Feedback</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate("AboutUs")}>
                    <Text style={[styles.menuItemText, { color: theme.text }]}>Sobre nós</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={confirmLogout}>
                    <Text style={[styles.menuItemText, { color: theme.text }]}>Sair</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        paddingHorizontal: 30,
        paddingBottom: 30,
    },
    profileHeader: {
        marginTop: 40,
        marginBottom: 20,
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 40,
        borderWidth: 1,
    },
    avatarLoader: {
        alignSelf: "center",
        marginBottom: 20,
    },
    username: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 10,
    },
    menuButtons: {
        flex: 1,
        justifyContent: "flex-end",
        paddingBottom: Platform.OS === "ios" ? 30 : 0,
        width: "100%",
    },
    menuItem: {
        paddingVertical: 10,
        width: "100%",
    },
    menuItemText: {
        fontSize: 18,
        paddingLeft: Platform.OS === "ios" ? 30 : 0,
    },
});

export default Hamburger;
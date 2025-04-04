import { useState } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Modal,
    Pressable,
} from "react-native";
import { useTheme } from "../service/themeService";
import Bell from "./BellIcon";

const Hamburger = ({ navigation }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { theme } = useTheme();

    const handleNavigate = (screen) => {
        if (navigation) {
            setMenuOpen(false);
            navigation.navigate(screen);
        } else {
            console.error("Erro: navigation está indefinido!");
    }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.mode === "dark" ? "#050024" : "#fff"}]}>
            <TouchableOpacity
            style={styles.hamburgerButton}
            onPress={() => setMenuOpen(true)}
            >
                <Text style={[styles.hamburgerIcon, { color: theme.mode === "dark" ? "#fff" : "#000" }]}>☰</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.notifications} onPress={() => handleNavigate("Notifications")}>
                <Bell style={styles.bell} />
            </TouchableOpacity>

        <Modal transparent visible={menuOpen} animationType="fade" onRequestClose={() => setMenuOpen(false)}>
            <Pressable style={styles.overlay} onPress={() => setMenuOpen(false)}>
            <View style={[styles.menu, { backgroundColor: theme.mode === "dark" ? "#0D0058" : "#f0f0f0" }]}>
                <View style={styles.groupSelection}>
                <Text style={[styles.groupText, { color: theme.text }]}>Seleção de Grupo</Text>
                </View>
                <View style={styles.menuButtons}>
                <TouchableOpacity onPress={() => handleNavigate("CreateGroup")}>
                    <Text style={[styles.menuItem, { color: theme.text }]}>Criar Grupo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigate("JoinGroup")}>
                    <Text style={[styles.menuItem, { color: theme.text }]}>Entrar em um grupo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigate("Config")}>
                    <Text style={[styles.menuItem, { color: theme.text }]}>Configurações</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigate("Feedback")}>
                    <Text style={[styles.menuItem, { color: theme.text }]}>Ajuda e Feedback</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigate("AboutUs")}>
                    <Text style={[styles.menuItem, { color: theme.text }]}>Sobre nós</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigate("Entrada")}>
                    {/* loggout */}
                    <Text style={[styles.menuItem, { color: theme.text }]}>Sair</Text>
                </TouchableOpacity>
                </View>
            </View>
            </Pressable>
        </Modal>
    </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 60,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        zIndex: 1000,
    },
    hamburgerButton: {
        padding: 10,
        borderRadius: 5,
    },
    hamburgerIcon: {
        fontSize: 24,
        textAlign: "center",
    },
    notifications: {
        padding: 10,
        left: 10,
        top: 0,
    },
    image: {
        
        width: 25,
        height: 25,
        resizeMode: "contain",
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    menu: {
        width: "80%",
        height: "100%",
        padding: 15,
        borderRadius: 10,
        marginTop: 0,
        marginLeft: 0,
        elevation: 5,
    },
    groupSelection: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#aaa",
        marginBottom: "auto",
    },
    groupText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    menuButtons: {
        marginBottom: 20,
        marginLeft: 30,
    },
    menuItem: {
        fontSize: 16,
        paddingVertical: 10,
    },
});

export default Hamburger;

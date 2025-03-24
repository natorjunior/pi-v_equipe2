import { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "../service/ThemeContext";
import { Image } from "expo-image";

const Hamburger = ({ navigation }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const theme = useTheme();
    const Imagebell = require("../assets/bell.png");

    return (
        <View style={styles.container}>
            { }
            <TouchableOpacity style={styles.hamburgerButton} onPress={() => setMenuOpen(!menuOpen)}>
                <Text style={styles.hamburgerIcon}>☰</Text>
            </TouchableOpacity>

            { }
            {menuOpen && (
                <View style={styles.menu}>
                    <TouchableOpacity onPress={() => setMenuOpen(false)}>
                        <Text style={styles.closeButton}>Fechar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Criar_Grupo")}>
                        <Text style={styles.menuItem}>Criar Grupo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Entrar_Grupo")}>
                        <Text style={styles.menuItem}>Entrar em um grupo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Config")}>
                        <Text style={styles.menuItem}>Configurações</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("About")}>
                        <Text style={styles.menuItem}>Sobre nós</Text>
                    </TouchableOpacity>
                </View>
            )}

            { }
            <TouchableOpacity style={styles.notifications} onPress={() => navigation.navigate("Notifications")}>
                <Image source={Imagebell} contentFit="contain" style={styles.image} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 30,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        zIndex: 1000,
    },
    hamburgerButton: {
        padding: 10,
        borderRadius: 5,
    },
    hamburgerIcon: {
        fontSize: 24,
        color: "white",
        textAlign: "center",
    },
    menu: {
        position: "absolute",
        top: 50,
        left: 10,
        width: 300,
        height: 250,
        backgroundColor: "#0D0058",
        padding: 10,
        borderRadius: 5,
        zIndex: 1001,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    closeButton: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
        color: "white",
    },
    menuItem: {
        fontSize: 14,
        marginBottom: 10,
        color: "white",
    },
    notifications: {
        padding: 10,
    },
    image: {
        width: 25,
        height: 25,
        resizeMode: "contain",
    },
});

export default Hamburger;
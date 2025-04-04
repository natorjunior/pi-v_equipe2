import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from "../service/themeService";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function Notifications() {
    const { theme } = useTheme();
    const navigation = useNavigation();
    
    const [notifications, setNotifications] = useState([
        "Nova postagem no seu grupo",
        "Alguém curtiu seu comentário",
        "Você foi adicionado a um novo grupo",
        "Novo comentário no seu post",
    ]);

    const clearNotifications = () => {
        setNotifications([]);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.background }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.mode === "dark" ? "#fff" : "#000"} />
                </TouchableOpacity>
                <Text style={[styles.headerText, { color: theme.text }]}>Notificações</Text>
                <TouchableOpacity onPress={clearNotifications} style={styles.clearButton}>
                    <Text style={[styles.clearText, { color: theme.text }]}>Limpar</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {notifications.length === 0 ? (
                    <Text style={[styles.noNotifications, { color: theme.text }]}>
                        Nenhuma notificação
                    </Text>
                ) : (
                    notifications.map((notification, index) => (
                        <View key={index} style={[styles.notification, { backgroundColor: theme.mode === "dark" ? "#333" : "#fff" }]}>
                            <Text style={[styles.notificationText, { color: theme.text }]}>{notification}</Text>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
    },
    backButton: {
        padding: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
    },
    clearButton: {
        padding: 10,
    },
    clearText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    scrollContainer: {
        paddingTop: 20,
        paddingBottom: 80,
        alignItems: "center",
    },
    notification: {
        width: "90%",
        marginBottom: 15,
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    notificationText: {
        fontSize: 16,
    },
    noNotifications: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
    },
});

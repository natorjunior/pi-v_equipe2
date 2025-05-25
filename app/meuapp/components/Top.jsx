import { View, TouchableOpacity, Text, StyleSheet, SafeAreaView, FlatList, Alert, Platform } from "react-native";
import { useTheme } from "../service/themeService";
import { useEffect, useState } from "react";
import { logoutUser } from "../service/authService";

const Hamburger = ({ navigation }) => {
    const { theme } = useTheme();

    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                setGroups([]);
            } catch (error) {
                console.error("Erro ao buscar grupos:", error);
            }
        };
        fetchGroups();
    }, []);

    const handleLogout = async () => {
        await logoutUser();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Entrada' }],
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
                { text: "Confirmar", onPress: handleLogout }
            ]
        );
    };

    const renderGroupItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate("Group", { groupId: item.id })}>
                <Text style={[styles.menuItemText, { color: theme.text }]}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.mode === "dark" ? "#0D0058" : "#fff" }]}>
            <FlatList
                data={groups}
                renderItem={renderGroupItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.groupsList}
                contentContainerStyle={styles.listContent}
            />
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
        width: '100%',
        justifyContent: 'flex-end',
        paddingHorizontal: 30,
        paddingBottom: 30,
    },
    listContent: {
        paddingHorizontal: 0,
    },
    menuButtons: {
        paddingBottom: Platform.OS === 'ios' ? 30 : 0,
        width: '100%',
    },
    groupsList: {
        marginBottom: 10,
        width: '100%',
    },
    menuItem: {
        paddingVertical: 10,
        width: '100%',
    },
    menuItemText: {
        fontSize: 18,
        paddingLeft: Platform.OS === 'ios' ? 30 : 0,
    },
});

export default Hamburger;
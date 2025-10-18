import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    RefreshControl,
    CommonActions
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useTheme } from "../service/themeService";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getGroup } from "../service/groupService";

export default function SelectGroup() {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const token = await SecureStore.getItemAsync("token");
            if (!token) {
                navigation.navigate("Login");
                return;
            }
            const userGroups = await getGroup();
            if (userGroups && Array.isArray(userGroups)) {
                setGroups(userGroups);
                setError(null);
            } else {
                setError("Formato de dados inválido ao carregar grupos");
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.detail === "Not authenticated") {
                await SecureStore.deleteItemAsync("token");
                navigation.navigate("Login");
            } else {
                setError(error.message || "Erro ao carregar grupos.");
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchGroups();
    };

    const handleSelectGroup = (groupId, groupName) => {
        navigation.navigate("Publish", { groupId, groupName });
    };

    const getMemberText = (membersCount) =>
        membersCount === 1 ? "membro" : "membros";

    const renderGroupItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => handleSelectGroup(item.id, item.group_name)}
            style={[
                styles.groupItem,
                {
                    backgroundColor: theme.background,
                    borderColor: theme.text,
                    shadowColor: theme.mode === "dark" ? "#000" : "#ccc",
                    padding: item.description?.length > 100 ? 10 : 15,
                },
            ]}
        >
            <View style={styles.groupContent}>
                <Text style={[styles.groupName, { color: theme.text }]}>
                    {item.group_name || "Grupo sem nome"}
                </Text>
                {item.description && (
                    <Text
                        style={[styles.groupDescription, { color: theme.text }]}
                        numberOfLines={3}
                        ellipsizeMode="tail"
                    >
                        {item.description}
                    </Text>
                )}
                <Text style={[styles.groupMembers, { color: theme.text }]}>
                    {item.members?.length || 0} {getMemberText(item.members?.length)}
                </Text>
                <Text style={[styles.groupCreatedBy, { color: theme.text }]}>
                    Criado por: {item.created_by || "Desconhecido"}
                </Text>
            </View>
            <TouchableOpacity
                onPress={() => handleSelectGroup(item.id, item.group_name)}
                style={styles.arrowButton}
            >
                <Ionicons name="chevron-forward" size={24} color={theme.text} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderEmptyComponent = () => {
        if (loading) {
            return (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={theme.text} />
                </View>
            );
        }
        if (error) {
            return (
                <View style={styles.centered}>
                    <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
                </View>
            );
        }
        return (
            <View style={styles.centered}>
                <Text style={[styles.text, { color: theme.text }]}>
                    Nenhum grupo encontrado.{"\n"}
                    Crie ou junte-se a um grupo!
                </Text>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#fff" }]}
                    onPress={() => navigation.navigate("AppDrawer", { screen: "CreateGroup" })}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.buttonText, { color: theme.text }]}>Criar um grupo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#fff" }]}
                    onPress={() => navigation.navigate("AppDrawer", { screen: "JoinGroup" })}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.buttonText, { color: theme.text }]}>Entrar em um grupo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.mode === "dark" ? "#fff" : "#000" }]}
                    onPress={() => navigation.navigate("AppDrawer", { screen: "SuggestedGroups" })}
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
        <SafeAreaView style={[styles.container, { backgroundColor: theme.mode === "dark" ? "#0D0058" : "#f0f0f0" }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={30} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>
                    Selecionar Grupo
                </Text>
            </View>
            <FlatList
                data={groups}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderGroupItem}
                ListEmptyComponent={renderEmptyComponent}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.text]}
                        tintColor={theme.text}
                    />
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    groupItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
        maxHeight: 200,
    },
    groupContent: {
        flex: 1,
    },
    groupName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    groupDescription: {
        fontSize: 14,
        marginTop: 4,
        flexShrink: 1,
    },
    groupMembers: {
        fontSize: 12,
        marginTop: 8,
        fontStyle: "italic",
    },
    groupCreatedBy: {
        fontSize: 12,
        marginTop: 8,
        fontStyle: "italic",
    },
    arrowButton: {
        padding: 5,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 10,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
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
    actionButton: {
        width: "80%",
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
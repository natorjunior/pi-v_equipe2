import { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    RefreshControl,
} from "react-native";
import { useTheme } from "../service/themeService";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function SeggestedGroups() {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);

    // Dados atualizados com nome e descrição
    const groups = [
        { id: "1", name: "Comunidade SAL", description: "Comunidade #oficial do Stay and Learn! Aqui você pode compartilhar seus estudos...", alias: "sal" },
        { id: "2", name: "Estudos ADS", description: "Grupo de estudos para os alunos de ADS do Senac!", alias: "senac_ads" },
        { id: "3", name: "Estudos", description: "Comunidade pra quem quer dar aquele gás nos estudos e compartilhar seu...", alias: "estudos" },
        { id: "4", name: "Amantes do Terror", description: "Comunidade para aqueles que amam ler livros de terror e/ou suspense!", alias: "terror" },
        { id: "5", name: "Hora de Aventura", description: "Comunidade pra quem curte fantasia, ação e aventura!", alias: "aventura" },
    ];

    const onRefresh = async () => {
        setRefreshing(true);
        setRefreshing(false);
    };

    const renderGroupItem = (item) => (
        <TouchableOpacity
            key={item.id}
            style={[
                styles.groupItem,
                {
                    backgroundColor: theme.background,
                    borderColor: theme.text,
                    shadowColor: theme.mode === "dark" ? "#000" : "#ccc",
                },
            ]}
            onPress={() =>
                navigation.navigate("AppDrawer", {
                    screen: "JoinGroup",
                    params: { prefilledAlias: `${item.alias}` },
                })
            }
        >
            <View style={styles.groupContent}>
                {/* Nome com símbolo de verificado */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={[styles.groupName, { color: theme.text }]}>{item.name}</Text>
                    <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#007AFF"
                        style={{ marginLeft: 5 }}
                    />
                </View>
                {/* Descrição */}
                <Text style={[styles.groupDescription, { color: theme.text }]}>
                    {item.description}
                </Text>
                {/* "Grupo oficial" no lugar de membros */}
                <Text style={[styles.groupOfficial, { color: theme.text }]}>
                    Grupo oficial
                </Text>
            </View>
        </TouchableOpacity>
    );

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
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={30} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerText, { color: theme.text }]}>
                        Grupos Disponíveis
                    </Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[theme.text]}
                            tintColor={theme.text}
                        />
                    }
                >
                    {groups.length > 0 ? (
                        groups.map((item) => renderGroupItem(item))
                    ) : (
                        <View style={styles.messageContainer}>
                            <Text style={[styles.text, { color: theme.text }]}>
                                Nenhum grupo disponível
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 15,
        paddingBottom: 10,
        position: "relative",
    },
    backButton: {
        position: "absolute",
        top: 10,
        left: 15,
        zIndex: 10,
        padding: 5,
        borderRadius: 100,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        flex: 1,
        marginLeft: 48,
    },
    placeholder: {
        width: 40,
    },
    scrollContainer: {
        paddingTop: 10,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    groupItem: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
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
    },
    groupOfficial: {
        fontSize: 12,
        marginTop: 8,
        fontStyle: "italic",
    },
    messageContainer: {
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
});
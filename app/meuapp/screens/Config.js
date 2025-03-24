import React, { useContext } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { ThemeContext } from "../service/ThemeContext";
import Background from "../components/Background";

export default function ConfigScreen() {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <Background>
            <View style={[styles.container, { backgroundColor: theme.background }]}> 
                <Text style={[styles.title, { color: theme.text }]}>Configurações</Text>
                <View style={styles.switchContainer}>
                    <Text style={[styles.label, { color: theme.text }]}>Modo Escuro</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={theme.mode === "dark" ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleTheme}
                        value={theme.mode === "dark"}
                    />
                </View>
            </View>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "80%",
        padding: 10,
    },
    label: {
        fontSize: 18,
    },
});

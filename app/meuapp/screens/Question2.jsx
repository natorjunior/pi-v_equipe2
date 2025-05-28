import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useTheme } from "../service/themeService";
import { Image } from "expo-image";

export default function Question2({ navigation, route }) {
    const { theme } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <Text style={[styles.text, { color: theme.text }]}>O que buscas?</Text>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.mode === "dark" ? "#0D0058" : "#fff" }]}
                    value={route.params?.motivation}
                    onPress={() => navigation.navigate("Question3", { ...route.params, motivation: "Encontrar sua turma" })}
                >
                    <View style={styles.buttonContent}>
                        <Image
                            source={require("../assets/q2image1.png")}
                            contentFit="contain"
                            style={styles.image}
                        />
                        <Text style={[styles.buttonText, { color: theme.mode === "dark" ? "#fff" : "#000" }]}>
                            Encontrar sua turma
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.mode === "dark" ? "#0D0058" : "#fff" }]}
                    value={route.params?.motivation}
                    onPress={() => navigation.navigate("Question3", { ...route.params, motivation: "Procurar livros" })}
                >
                    <View style={styles.buttonContent}>
                        <Image
                            source={require("../assets/q2image2.png")}
                            contentFit="contain"
                            style={styles.image}
                        />
                        <Text style={[styles.buttonText, { color: theme.mode === "dark" ? "#fff" : "#000" }]}>
                            Procurar livros
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.mode === "dark" ? "#0D0058" : "#fff" }]}
                    value={route.params?.motivation}
                    onPress={() => navigation.navigate("Question3", { ...route.params, motivation: "Focar nos estudos" })}
                >
                    <View style={styles.buttonContent}>
                        <Image
                            source={require("../assets/q2image3.png")}
                            contentFit="contain"
                            style={styles.image}
                        />
                        <Text style={[styles.buttonText, { color: theme.mode === "dark" ? "#fff" : "#000" }]}>
                            Focar nos estudos
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.mode === "dark" ? "#0D0058" : "#fff" }]}
                    value={route.params?.motivation}
                    onPress={() => navigation.navigate("Question3", { ...route.params, motivation: "Usufruir do aplicativo" })}
                >
                    <View style={styles.buttonContent}>
                        <Image
                            source={require("../assets/q2image4.png")}
                            contentFit="contain"
                            style={styles.image}
                        />
                        <Text style={[styles.buttonText, { color: theme.mode === "dark" ? "#fff" : "#000" }]}>
                            Usufruir do aplicativo
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20, 
    },
    button: {
        width: "95%",
        height: 110,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        paddingHorizontal: 20,
    },
    image: {
        width: 80,
        height: 80,
        marginRight: 15,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        flex: 1,
        marginLeft: 20,
    },
});
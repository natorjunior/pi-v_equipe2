import React, { useState } from "react";
import { Text, TextInput, StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "../service/themeService";

export default function Question1({ navigation }) {
    const { theme } = useTheme();
    const [name, setName] = useState("");

    const isButtonDisabled = name.trim().length === 0;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.text, { color: theme.text }]}>
                Como podemos te chamar?
            </Text>

            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.border,
                        color: theme.inputText,
                    },
                ]}
                placeholder="Digite seu nome"
                placeholderTextColor={theme.placeholder}
                value={name}
                onChangeText={setName}
                selectionColor={theme.text}
                keyboardAppearance={theme.mode}
            />

            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        backgroundColor: isButtonDisabled
                            ? "#ccc"
                            : theme.mode === "dark" ? "#fff" : "#003366",
                        opacity: isButtonDisabled ? 0.5 : 1,
                    },
                ]}
                onPress={() => navigation.navigate("Question2", { name })}
                disabled={isButtonDisabled}
            >
                <Text style={[
                    styles.buttonText,
                    { color: isButtonDisabled ? "#888" : theme.mode === "dark" ? "#000" : "#fff" }
                ]}>
                    Continuar
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15,
    },
    input: {
        width: "90%",
        height: 45,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    button: {
        width: "60%",
        height: 45,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 50,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
    },
});
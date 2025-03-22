import React, { useState } from "react";
import { Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Background from "../components/Background";
import { useTheme } from "../service/ThemeContext";
import { createUser } from "../service/userService";

export default function Question4({ navigation, route }) {
    const theme = useTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { name } = route.params || {};

    const isButtonDisabled = () => {
        return (
            email.trim().length === 0 ||
            password.trim().length === 0 ||
            confirmPassword.trim().length === 0 ||
            password !== confirmPassword
        );
    };

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem. Por favor, verifique.");
            return;
        }

        try {
            const newUser = { name, email, password, avatar: "" };
            const response = await createUser(newUser);
            console.log(response);

            navigation.navigate("Login");
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível realizar o cadastro. Tente novamente.");
        }
    };

    return (
        <Background style={styles.container}>
            <Text style={[styles.text, { color: theme.text }]}>
                Para salvar suas{"\n"} informações precisamos{"\n"} do seu email e uma senha{"\n"} para sua segurança
            </Text>

            { }
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.border,
                        color: theme.inputText,
                    },
                ]}
                placeholder="Digite seu email"
                placeholderTextColor={theme.placeholder}
                value={email}
                onChangeText={setEmail}
                selectionColor={theme.text}
                keyboardAppearance={theme.mode}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            { }
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.border,
                        color: theme.inputText,
                    },
                ]}
                placeholder="Digite sua senha"
                placeholderTextColor={theme.placeholder}
                value={password}
                onChangeText={setPassword}
                selectionColor={theme.text}
                keyboardAppearance={theme.mode}
                secureTextEntry
            />

            { }
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.border,
                        color: theme.inputText,
                    },
                ]}
                placeholder="Confirme sua senha"
                placeholderTextColor={theme.placeholder}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                selectionColor={theme.text}
                keyboardAppearance={theme.mode}
                secureTextEntry
            />

            { }
            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        backgroundColor: isButtonDisabled()
                            ? "#DFBA69"
                            : theme.mode === "dark" ? "#DFBA69" : "#003366",
                        opacity: isButtonDisabled() ? 0.5 : 1,
                    },
                ]}
                onPress={handleRegister}
                disabled={isButtonDisabled()}
            >
                <Text style={[
                    styles.buttonText,
                    { color: isButtonDisabled() ? "#888" : theme.mode === "dark" ? "#000" : "#fff" }
                ]}>
                    Concluir
                </Text>
            </TouchableOpacity>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "90%",
    },
    text: {
        textAlign: "center",
        fontSize: 24,
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
        marginBottom: 15,
    },
    button: {
        width: "60%",
        height: 45,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
    },
});
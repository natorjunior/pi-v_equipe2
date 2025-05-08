import React, { useState } from "react";
import { Text, TextInput, StyleSheet, TouchableOpacity, Alert, View } from "react-native";
import { useTheme } from "../service/themeService";
import { createUser } from "../service/userService";

export default function Question4({ navigation, route }) {
    const { theme } = useTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const username = route.params?.name || "Usuário";

    const isButtonDisabled = () => {
        return (
            email.trim().length === 0 ||
            password.trim().length === 0 ||
            confirmPassword.trim().length === 0 ||
            password !== confirmPassword
        );
    };

    const handleRegister = async () => {
        try {
            let avatar = "";
            let name = String(username || "Usuário"); 
            let userEmail = String(email).trim();
            let userPassword = String(password).trim();
    
            const newUser = {name: name, email: userEmail, password: userPassword, avatar };
            const response = await createUser(newUser);
            console.log(response);
    
            navigation.navigate("Login");
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível realizar o cadastro. Tente novamente.");
        }
    };
    

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
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
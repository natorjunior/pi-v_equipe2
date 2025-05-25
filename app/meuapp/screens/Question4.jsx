import { useState } from "react";
import {
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    TouchableOpacity,
} from "react-native";
import { useTheme } from "../service/themeService";
import { createUser } from "../service/userService";
import InputField from "../components/InputField";

export default function Question4({ navigation, route }) {
    const { theme } = useTheme();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const name = route.params?.name || "Usuário";
    const motivation = route.params?.motivation || "";
    const selectedGenres = route.params?.selectedGenres || {};

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
            setErrorMessage("");

            const genresArray = Object.keys(selectedGenres).filter(
                (genre) => selectedGenres[genre]
            );

            const userData = {
                name: String(name).trim(),
                email: String(email).trim(),
                password: String(password).trim(),
                motivation: String(motivation).trim(),
                genres: genresArray,
            };

            const response = await createUser(userData);
            console.log("Usuario criado com sucesso:", response);

            navigation.navigate("Login");
        } catch (error) {
            console.log("Erro ao criar usuario:", error);
            setErrorMessage(
                error.response?.data?.message ||
                    error.response?.data?.detail ||
                    error.message
            );
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <Text style={[styles.text, { color: theme.text }]}>
                    Para salvar suas{"\n"} informações precisamos{"\n"} do seu email e uma senha{"\n"} para sua segurança.
                </Text>

                <InputField
                    label="Digite seu email"
                    placeholder="Digite seu email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <InputField
                    label="Digite sua senha"
                    placeholder="Digite sua senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <InputField
                    label="Confirme sua senha"
                    placeholder="Confirme sua senha"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            backgroundColor: isButtonDisabled()
                                ? "#DFBA69"
                                : theme.mode === "dark"
                                    ? "#DFBA69"
                                    : "#003366",
                            opacity: isButtonDisabled() ? 0.5 : 1,
                        },
                    ]}
                    onPress={handleRegister}
                    disabled={isButtonDisabled()}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            {
                                color: isButtonDisabled()
                                    ? "#888"
                                    : theme.mode === "dark"
                                        ? "#000"
                                        : "#fff",
                            },
                        ]}
                    >
                        Concluir
                    </Text>
                </TouchableOpacity>

                {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    text: {
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold",
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
    errorText: {
        marginTop: 15,
        color: "red",
        fontSize: 14,
        textAlign: "center",
    },
});


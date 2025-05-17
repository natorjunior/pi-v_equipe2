import { useState } from "react";
import {
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    View,
    SafeAreaView,
} from "react-native";
import { useTheme } from "../service/themeService";
import { createUser } from "../service/userService";

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
            const apiError =
                error.response?.data?.detail ||
                error.response?.data?.message ||
                error.message;

            console.log("Erro: ", apiError);

            let translatedMessage = "";

            switch (apiError) {
                case "Email already registered":
                    translatedMessage = "Este email já está cadastrado.";
                    break;
                case "Password must be between 5 and 30 characters":
                    translatedMessage = "A senha deve ter entre 5 e 30 caracteres.";
                    break;
                case "Password must contain at least one capital letter":
                    translatedMessage = "A senha deve conter ao menos uma letra maiúscula.";
                    break;
                default:
                    translatedMessage = "Erro ao criar usuário.";
                    break;
            }

            setErrorMessage(translatedMessage);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <Text style={[styles.text, { color: theme.text }]}>
                    Para salvar suas{"\n"} informações precisamos{"\n"} do seu email e uma senha{"\n"} para sua segurança.
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
                    placeholder="Digite seu email"
                    placeholderTextColor={theme.placeholder}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

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
    input: {
        width: "100%",
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
    errorText: {
        marginTop: 15,
        color: "red",
        fontSize: 14,
        textAlign: "center",
    },
});


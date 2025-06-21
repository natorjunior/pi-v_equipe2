import { useState } from "react";
import {
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Linking,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../service/themeService";
import { createUser } from "../service/userService";
import InputField from "../components/InputField";

export default function Question4({ navigation, route }) {
    const { theme } = useTheme();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);

    const name = route.params?.name || "Usuário";
    const motivation = route.params?.motivation || "";
    const selectedGenres = route.params?.selectedGenres || {};

    const isButtonDisabled = () => {
        return (
            email.trim().length === 0 ||
            password.trim().length === 0 ||
            confirmPassword.trim().length === 0 ||
            password !== confirmPassword ||
            !isPrivacyChecked
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

            await createUser(userData);
            navigation.navigate("Login");
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                error.response?.data?.detail ||
                error.message
            );
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <View style={[styles.container, { backgroundColor: theme.background }]}>
                    <Text style={[styles.text, { color: theme.text }]}>
                        Para salvar suas informações precisamos do seu email e uma senha
                        para sua segurança.
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
                        secureTextEntry={!showPassword}
                        icon={
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Feather
                                    name={showPassword ? "eye" : "eye-off"}
                                    size={24}
                                    color={theme.inputText}
                                />
                            </TouchableOpacity>
                        }
                    />

                    <InputField
                        label="Confirme sua senha"
                        placeholder="Confirme sua senha"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        icon={
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <Feather
                                    name={showConfirmPassword ? "eye" : "eye-off"}
                                    size={24}
                                    color={theme.inputText}
                                />
                            </TouchableOpacity>
                        }
                    />

                    <TouchableOpacity
                        style={[
                            styles.privacyContainer,
                            {
                                backgroundColor: isPrivacyChecked
                                    ? theme.mode === "dark"
                                        ? "#1E90FF"
                                        : "#ADD8E6"
                                    : theme.mode === "dark"
                                    ? "#050024"
                                    : "#f0f0f0",
                            },
                        ]}
                        onPress={() => setIsPrivacyChecked(!isPrivacyChecked)}
                    >
                        <View style={styles.buttonContent}>
                            <Ionicons
                                name={isPrivacyChecked ? "checkbox" : "square-outline"}
                                size={24}
                                color={theme.text}
                            />
                            <Text style={[styles.privacyText, { color: theme.mode === "dark" ? "#fff" : "#000" }]}>
                                Eu aceito a{" "}
                                <Text
                                    style={styles.linkText}
                                    onPress={() =>
                                        Linking.openURL(
                                            "https://regis-rafael.github.io/stay-and-learn-privacy-policy.github.io/"
                                        )
                                    }
                                >
                                    Política de Privacidade
                                </Text>
                            </Text>
                        </View>
                    </TouchableOpacity>

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
            </KeyboardAvoidingView>
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
        fontSize: 18,
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
    privacyContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        paddingHorizontal: 10,
        borderRadius: 10,
        width: "90%",
        height: 50,
        justifyContent: "center",
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        paddingHorizontal: 10,
    },
    privacyText: {
        marginLeft: 10,
        fontSize: 14,
        flex: 1,
        flexWrap: "wrap",
    },
    linkText: {
        textDecorationLine: "underline",
    },
});
import { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Feather } from "@expo/vector-icons";
import { loginUser } from "../service/loginService";
import { getUser } from "../service/userService";
import { useTheme } from "../service/themeService";
import InputField from "../components/InputField";
import Logo from "../components/Logo";

export default function Login({ navigation }) {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLoginButton = async () => {
    if (!email || !password) {
      setError("Preencha todos os campos!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await loginUser({ email, password });

      if (typeof response === "string") {
        await AsyncStorage.setItem("token", response);

        const user = await fetchUser(response);
        await SecureStore.setItemAsync("user", JSON.stringify(user));
        await SecureStore.deleteItemAsync("selectedGroupId");
        navigation.navigate("AppDrawer", { selectedGroupId: null });
      } else {
        setError("E-mail ou senha inválidos!");
      }
    } catch (error) {
      console.log("Erro:", error);
      setError("Falha ao fazer login. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async (token) => {
    try {
      const response = await getUser(token);
      return response;
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <Logo />
          <InputField
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
          />
          <InputField
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="Digite sua senha"
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
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#003366" },
            ]}
            onPress={handleLoginButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color={theme.mode === "dark" ? "#000" : "#fff"}
              />
            ) : (
              <Text
                style={[
                  styles.buttonText,
                  { color: theme.mode === "dark" ? "#000" : "#fff" },
                ]}
              >
                Entrar
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={[styles.textLink, { color: theme.text }]}>
              Esqueci minha senha
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Question1")}
            style={styles.registerContainer}
          >
            <Text style={[styles.textLink, { color: theme.text }]}>
              Ainda não tem conta?
            </Text>
            <Text style={[styles.textHighlight, { color: theme.text }]}>
              Clique aqui
            </Text>
          </TouchableOpacity>
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textLink: {
    fontSize: 16,
    marginTop: 15,
  },
  textHighlight: {
    fontSize: 20,
    fontWeight: "bold",
  },
  registerContainer: {
    alignItems: "center",
    marginTop: 10,
  },
});

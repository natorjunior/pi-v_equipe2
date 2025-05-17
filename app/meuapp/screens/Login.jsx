import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { loginUser } from "../service/loginService";
import { getUser } from "../service/userService";
import { useTheme } from "../service/themeService";
import InputField from "../components/InputField";
import Logo from "../components/Logo";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login({ navigation }) {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginButton = async () => {
    if (!email || !password) {
      setError("Preencha todos os campos!");
      return;
    }
  
    try {
      const response = await loginUser({ email, password });
  
      if (typeof response === "string") {
        await AsyncStorage.setItem("authToken", response);
  
        const user = await fetchUser(response);
        await AsyncStorage.setItem("user", JSON.stringify(user));
        navigation.replace("Home");
      } else {
        setError("E-mail ou senha inválidos!");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao fazer login. Verifique sua conexão.",error);
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Logo />
        <View style={styles.formContainer}>
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
          >
            <Text style={[styles.buttonText,{ color: theme.mode === "dark" ? "#000" : "#fff"}]}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
            style={styles.forgotPassword}
          >
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
  formContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 100,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    width: 310,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPassword: {
    marginBottom: 20,
  },
  registerContainer: {
    alignItems: "center",
  },
  textLink: {
    marginTop: 15,
    fontSize: 16,
  },
  textHighlight: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

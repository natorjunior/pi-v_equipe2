//Esperando o backend
//import { recoverPassword } from "../service/authService";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../service/themeService";
import Logo from "../components/Logo";
import InputField from "../components/InputField";
export default function ForgotPassword({ navigation }) {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRecoverPassword = async () => {
    if (!email) {
      setError("Informe seu e-mail!");
      return;
    }

    try {
      const response = await recoverPassword(email);
      if (response?.success) {
        setSuccess("Instruções enviadas para o seu e-mail!");
        setError("");
      } else {
        setError("E-mail não encontrado ou erro na solicitação.");
        setSuccess("");
      }
    } catch (err) {
      console.error("Erro ao recuperar senha:", err);
      Alert.alert("Erro", "Não foi possível enviar o e-mail. Tente novamente.");
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
            icon={<Feather name="mail" size={24} color={theme.inputText} />}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {success ? <Text style={styles.successText}>{success}</Text> : null}

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#003366" },
            ]}
            onPress={handleRecoverPassword}
          >
            <Text style={styles.buttonText}>Recuperar Senha</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.textLink, { color: theme.text }]}>
              Voltar
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
  successText: {
    color: "green",
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
  textLink: {
    marginTop: 15,
    fontSize: 16,
  },
});

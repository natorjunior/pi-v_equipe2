import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { loginUser } from "../service/loginService";
import Background from "../components/Background";
import Logo from "../components/Logo";
import { useTheme } from "../service/ThemeContext";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const theme = useTheme();

  const handleLoginButton = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await loginUser({ email, password });

      if (response) {
        console.log("Login bem-sucedido:", response);
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      } else {
        Alert.alert("Erro", "Não foi possível fazer login. Verifique seus dados.");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao fazer login. Verifique sua conexão e tente novamente.");
      console.error(error);
    }
  };

  return (
    <Background>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <Logo style={styles.logo} />

        <View style={styles.formContainer}>
          <Text style={[styles.label, { color: theme.text }]}>E-mail:</Text>
          <TextInput
            placeholder="Digite seu e-mail"
            placeholderTextColor={theme.placeholder}
            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText, borderColor: theme.border }]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={[styles.label, { color: theme.text }]}>Senha:</Text>
          <TextInput
            placeholder="Digite sua senha"
            placeholderTextColor={theme.placeholder}
            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText, borderColor: theme.border }]}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />

          

          <TouchableOpacity style={[styles.botaoLogin, { backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#003366"  }]} onPress={handleLoginButton}>
            <Text style={[{color: theme.mode === "dark" ? "#000" : "#fff"}]}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Question1")} style={styles.botaoCadastro}>
            <Text style={[styles.textoBotaoCadastro, { color: theme.text }]}>Ainda não tem conta?</Text>
            <Text style={[styles.textoDestaque, { color: theme.text }]}>Clique aqui</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    width: "100%",
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 100,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    width: 300,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  botaoLogin: {
    paddingVertical: 14,
    borderRadius: 8,
    width: 300,
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  botaoCadastro: {
    alignItems: "center",
    justifyContent: "center",
  },
  textoBotao: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  textoBotaoCadastro: {
    marginTop: 40,
    fontSize: 16,
  },
  textoDestaque: {
    fontSize: 25,
    fontWeight: "bold",
  },
});

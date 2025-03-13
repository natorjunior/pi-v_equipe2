//import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Button,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { loginUser } from "../service/loginService";

const imagem = require("../assets/gatinhu.jpg");

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        Alert.alert(
          "Erro",
          "Não foi possível fazer login. Verifique seus dados."
        );
      }
    } catch (error) {
      Alert.alert(
        "Erro",
        "Falha ao fazer login. Verifique sua conexão e tente novamente."
      );
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={imagem} resizeMode="cover" style={styles.image}>
        <View style={styles.overlay}>
          <Text style={styles.titulo}>Telinha de login uhullllllllllllll</Text>

          <Text style={styles.espacamento}></Text>

          <Text style={styles.subTitulo}>E-mail:</Text>
          <Text style={styles.espacamento}></Text>
          <TextInput
            placeholder="Digite seu email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.espacamento}></Text>

          <Text style={styles.subTitulo}>Senha:</Text>
          <Text style={styles.espacamento}></Text>
          <TextInput
            placeholder="Digite sua senha"
            style={styles.input}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.espacamento}></Text>

          <View style={styles.botoesContainer}>
            <TouchableOpacity
              style={styles.botaoLogin}
              onPress={handleLoginButton}
            >
              <Text style={styles.textoBotao}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Cadastro")}
              style={styles.botaoCadastro}
            >
              <Text style={styles.textoBotao}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  overlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  titulo: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
  },

  subTitulo: {
    fontSize: 20,
    color: "#fff",
  },

  espacamento: {
    fontSize: 10,
  },

  input: {
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    width: 300,
    backgroundColor: "#fff",
    paddingLeft: 10,
    borderRadius: 8,
  },

  botoesContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },

  botaoLogin: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  botaoCadastro: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

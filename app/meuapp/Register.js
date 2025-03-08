import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";

const imagem = require("./assets/gatinhu2.jpg");

export default function Register({ navigation }) {
  return (
    <View style={styles.container}>
      <ImageBackground source={imagem} resizeMode="cover" style={styles.image}>
        {/* Camada de opacidade */}
        <View style={styles.overlay}>
          <Text style={styles.titulo}>Tela de Cadastro</Text>

          <TextInput placeholder="Nome" style={styles.input} />
          <TextInput
            placeholder="E-mail"
            style={styles.input}
            keyboardType="email-address"
          />
          <TextInput placeholder="Senha" style={styles.input} secureTextEntry />

          <TouchableOpacity style={styles.botao}>
            <Text style={styles.textoBotao}>Cadastrar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Já tem uma conta? Faça login</Text>
          </TouchableOpacity>
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
  },

  overlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Opacidade de 50%
    justifyContent: "center",
    alignItems: "center",
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },

  input: {
    height: 45,
    width: 300,
    borderColor: "gray",
    borderWidth: 1,
    backgroundColor: "#fff",
    paddingLeft: 10,
    borderRadius: 8,
    marginBottom: 15,
  },

  botao: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  link: {
    marginTop: 15,
    color: "#007bff",
    textDecorationLine: "underline",
  },
});

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useTheme } from "../service/themeService";
import { useNavigation } from "@react-navigation/native";
import Top from "../components/Top";

export default function Feedback() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [feedback, setFeedback] = useState("");

  const handleSendFeedback = () => {
    if (!feedback.trim()) {
      Alert.alert("Aviso", "Por favor, escreva seu feedback antes de enviar.");
      return;
    }

    Alert.alert("Obrigado!", "Seu feedback foi enviado com sucesso!");
    setFeedback(""); // HAHA FOI INUTIL, NINGUUEM VAI VER
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Top navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={[styles.headerText, { color: theme.text }]}>Deixe seu feedback</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText, borderColor: theme.border }]}
          placeholder="Digite aqui seu feedback..."
          placeholderTextColor={theme.placeholder}
          value={feedback}
          onChangeText={setFeedback}
          multiline
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#003366" }]}
          onPress={handleSendFeedback}
        >
          <Text style={[styles.buttonText, { color: theme.mode === "dark" ? "#000" : "#fff" }]}>Enviar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },
  headerText: {
    marginTop: 60,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 150,
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

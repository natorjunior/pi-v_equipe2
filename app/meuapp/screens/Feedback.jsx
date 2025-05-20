//Esperando o backend

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { useTheme } from "../service/themeService";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Feedback() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);

  const handleSendFeedback = () => {
    if (!feedback.trim()) {
      Alert.alert("Aviso", "Por favor, escreva seu feedback antes de enviar.");
      return;
    }

    setSending(true);
    setFeedbacks([...feedbacks, feedback]);
    setFeedback("");
    setSending(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.background }]}>
            <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={theme.mode === "dark" ? "#fff" : "#000"} />
            </TouchableOpacity>
            <Text style={[styles.headerText, { color: theme.text }]}>Feedback</Text>
        </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={[styles.headerText, { color: theme.text }]}>Deixe seu feedback</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText, borderColor: theme.border }]}
          placeholder="Digite aqui seu feedback..."
          placeholderTextColor={theme.placeholder}
          value={feedback}
          onChangeText={setFeedback}
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#003366" }]}
          onPress={handleSendFeedback}
          disabled={sending}
        >
          <Text style={[styles.buttonText, { color: theme.mode === "dark" ? "#000" : "#fff" }]}>
            {sending ? "Enviando..." : "Enviar"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
    </SafeAreaView>
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
      header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 15,
  },
  backButton: {
      padding: 10,
  },
  headerText: {
      fontSize: 20,
      fontWeight: "bold",
      flex: 1,
      textAlign: "center",
      right: 21,
  },
});


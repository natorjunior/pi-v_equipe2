import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../service/themeService";
import InputField from "../components/InputField";

export default function Feedback() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const maxCharacters = 300;

  const handleSendFeedback = () => {
    if (!feedback.trim()) {
      setFeedback("");
      return;
    }

    setSending(true);
    setFeedbacks([...feedbacks, feedback]);
    setFeedback("");
    setSending(false);
  };

  const handleOpenLink = (url) => {
Linking.openURL(
  "mailto:stayandlearn2025@gmail.com?subject=Denúncia de conteúdo&body=Descreva o problema aqui..."
);

  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.mode === "dark" ? "#fff" : "#000"}
          />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: theme.text }]}>
          Deixe seu feedback
        </Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <InputField
          label="Digite aqui seu feedback"
          value={feedback}
          onChangeText={(text) => text.length <= maxCharacters && setFeedback(text)}
          placeholder="Digite aqui seu feedback..."
          placeholderTextColor={theme.placeholder}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        <Text style={[styles.charCount, { color: theme.text }]}>
          {feedback.length}/{maxCharacters}
        </Text>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#003366" },
          ]}
          onPress={handleSendFeedback}
          disabled={sending || feedback.length === 0}
        >
          <Text
            style={[
              styles.buttonText,
              { color: theme.mode === "dark" ? "#000" : "#fff" },
            ]}
          >
            {sending ? "Enviando..." : "Enviar"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.denunbutton,
            { backgroundColor: theme.error },
          ]}
          onPress={handleOpenLink}
        >
          <Text
            style={[
              styles.buttonText,
              { color: theme.mode === "dark" ? "#000" : "#fff" },
            ]}
          >
            Denunciar
          </Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    flex: 1,
    marginRight: 20,
    textAlign: "center",
    fontSize: 23,
    fontWeight: "bold",
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
  },
  button: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  charCount: {
    textAlign: "right",
    marginBottom: 10,
  },
  denunbutton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
});


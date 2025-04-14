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

export default function Publish() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [postText, setPostText] = useState("");
  const [file, setFile] = useState(null);

  const handlePublish = () => {
    if (!postText.trim()) {
      Alert.alert("Aviso", "Por favor, escreva algo antes de publicar.");
      return;
    }

    Alert.alert("Publicado!", "Sua publicação foi enviada com sucesso!");
    setPostText("");
    setFile(null);
  };

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });

      if (result.canceled) return;

      setFile(result.assets[0]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível anexar o arquivo.");
      console.error("Erro ao selecionar arquivo:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Top navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={[styles.headerText, { color: theme.text }]}>Nova Publicação</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText, borderColor: theme.border }]}
          placeholder="Escreva algo..."
          placeholderTextColor={theme.placeholder}
          value={postText}
          onChangeText={(text) => text.length <= 500 && setPostText(text)}
          multiline
        />
        <Text style={[styles.charCount, { color: theme.text }]}>
          {postText.length} / 500
        </Text>

        <TouchableOpacity style={styles.fileButton} onPress={handleFilePick}>
          <Text style={[styles.fileButtonText,{ color: theme.mode === "dark" ? "#fff" : "#000"}]}>
            {file ? `📎 ${file.name}` : "📎 Anexar Arquivo"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#003366" }]}
          onPress={handlePublish}
        >
          <Text style={[styles.buttonText, { color: theme.mode === "dark" ? "#000" : "#fff" }]}>Publicar</Text>
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
    marginTop: 60,
    padding: 20,
    alignItems: "center",
  },
  headerText: {
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
  charCount: {
    alignSelf: "flex-end",
    marginTop: 5,
    fontSize: 14,
  },
  fileButton: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  fileButtonText: {
    fontSize: 16,
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

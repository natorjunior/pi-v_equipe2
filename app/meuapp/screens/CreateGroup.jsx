import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { useTheme } from "../service/themeService";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import InputField from "../components/InputField";
import { createGroup, joinGroup, getGroup } from "../service/groupService";

export default function CreateGroup() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [groupName, setGroupName] = useState("");
  const [groupAlias, setGroupAlias] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

const handleCreateGroup = async () => {
  if (!groupName || !groupAlias) {
    setError("Por favor, informe todos os campos obrigatórios.");
    return;
  }

  try {
    setLoading(true);
    setError(null);

    const newGroup = {
      name: groupName.trim(),
      alias: groupAlias.replace("@", "").trim(),
      description: description.trim(),
    };

    const response = await createGroup(newGroup);

    if (response) {
      navigation.navigate("Groups");
    } else {
      throw new Error("ID do grupo não encontrado na resposta.");
    }
  } catch (error) {
    console.error("Erro ao criar ou entrar no grupo", error);
    setError("Erro ao criar ou entrar no grupo. Tente novamente.");
  } finally {
    setLoading(false);
  }
};



  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.background }]}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.mode === "dark" ? "#fff" : "#000"} />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: theme.text }]}>Criar um Grupo</Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.inner}
        >
          <InputField
            label="Nome do Grupo"
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Digite o nome do grupo"
          />
          <InputField
            label="Alias do Grupo"
            value={groupAlias}
            onChangeText={setGroupAlias}
            placeholder="Digite o alias do grupo"
          />
          <InputField
            label="Descrição"
            value={description}
            onChangeText={setDescription}
            placeholder="Digite uma descrição (opcional)"
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            disabled={loading}
            style={[
              styles.button,
              {
                backgroundColor: loading
                  ? "gray"
                  : theme.mode === "dark"
                  ? "#DFBA69"
                  : "#003366",
              },
            ]}
            onPress={handleCreateGroup}
          >
            <Text
              style={[
                styles.buttonText,
                { color: theme.mode === "dark" ? "#000" : "#fff" },
              ]}
            >
              {loading ? "Criando..." : "Criar Grupo"}
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inner: {
    width: "100%",
    top: 80,
    alignItems: "center",
    marginTop: 50,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
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
  error: {
    color: "red",
    marginBottom: 16,
    marginTop: 8,
    textAlign: "center",
  },
});

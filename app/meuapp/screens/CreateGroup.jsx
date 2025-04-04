import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useTheme } from "../service/themeService";
import { useNavigation } from "@react-navigation/native";
import Top from "../components/Top";
import InputField from "../components/InputField";

export default function CreateGroup() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [groupName, setGroupName] = useState("");
  const [groupAlias, setGroupAlias] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <Top navigation={navigation} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inner}>
        <InputField label="Nome do Grupo" value={groupName} onChangeText={setGroupName} placeholder="Digite o nome do grupo" />
        <InputField label="Alias do Grupo" value={groupAlias} onChangeText={setGroupAlias} placeholder="Digite o alias do grupo" />
        <InputField label="Descrição" value={description} onChangeText={setDescription} placeholder="Digite uma descrição (opcional)" />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity disabled={loading} style={[styles.button, { backgroundColor: loading ? "gray" : theme.mode === "dark" ? "#DFBA69" : "#003366" }]} onPress={handleCreateGroup}>
          <Text style={[styles.buttonText, { color: theme.mode === "dark" ? "#000" : "#fff" }]}>
            {loading ? "Criando..." : "Criar Grupo"}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  inner: {
    width: "100%",
    alignItems: "center",
    marginTop: 50,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
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
});

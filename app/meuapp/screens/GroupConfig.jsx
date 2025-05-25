//inoperante ainda

import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../service/themeService";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getGroup, deleteGroup, leaveGroup } from "../service/groupService";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default function GroupConfig() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { groupId } = route.params;

  const [groupName, setGroupName] = useState("");
  const [groupAlias, setGroupAlias] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const groups = await getGroup();
        const selectedGroup = groups.find((group) => group.id === groupId);
        if (!selectedGroup) {
          setError("Grupo não encontrado.");
          return;
        }

        setGroupName(selectedGroup.group_name);
        setGroupAlias(selectedGroup.group_alias);
        setDescription(selectedGroup.description || "");
        if (selectedGroup.users) {
          setMembers(selectedGroup.users);
        }
      } catch (err) {
        console.error("Erro ao carregar grupo:", err);
        setError("Erro ao carregar informações do grupo.");
      }
    };

    fetchGroup();
  }, [groupId]);

  const handleSaveChanges = async () => {
    if (!groupName || !groupAlias) {
      setError("Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const updatedGroup = {
        group_name: groupName.trim(),
        group_alias: groupAlias.replace("@", "").trim(),
        description: description.trim(),
      };

      const token = await SecureStore.getItemAsync("token");

      const response = await axios.put(
        `https://api.homolog.sal.acilab.com.br/group/${groupId}`,
        updatedGroup,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Grupo atualizado:", response.data);
      Alert.alert("Sucesso", "Informações do grupo atualizadas com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.error("Erro ao atualizar grupo", err);
      setError("Erro ao atualizar grupo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    Alert.alert("Confirmar exclusão", "Deseja realmente excluir este grupo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteGroup(groupId);
            Alert.alert("Sucesso", "Grupo excluído com sucesso!", [
              { text: "OK", onPress: () => navigation.navigate("Groups") },
            ]);
          } catch (err) {
            console.error("Erro ao excluir grupo", err);
            Alert.alert("Erro", "Não foi possível excluir o grupo.");
          }
        },
      },
    ]);
  };

  const handleLeaveGroup = () => {
    Alert.alert("Sair do grupo", "Deseja realmente sair deste grupo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await leaveGroup(groupId);
            Alert.alert("Você saiu do grupo.");
            navigation.navigate("Groups");
          } catch (err) {
            console.error("Erro ao sair do grupo", err);
            Alert.alert("Erro", "Não foi possível sair do grupo.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.background }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.mode === "dark" ? "#fff" : "#000"} />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: theme.text }]}>Configurações do Grupo</Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.inner}
        >

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={{ width: "100%", marginTop: 30 }}>
            <Text style={[styles.headerText, { color: theme.text, marginBottom: 10 }]}>
              Membros do Grupo
            </Text>
            {members.length === 0 ? (
              <Text style={{ color: theme.text }}>Nenhum membro encontrado.</Text>
            ) : (
              members.map((user) => (
                <View key={user.id} style={{ paddingVertical: 4 }}>
                  <Text style={{ color: theme.text }}>{user.name || user.email}</Text>
                </View>
              ))
            )}
          </View>

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
            onPress={handleSaveChanges}
          >
            <Text style={[styles.buttonText, { color: theme.mode === "dark" ? "#000" : "#fff" }]}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#666" }]}
            onPress={handleLeaveGroup}
          >
            <Text style={[styles.buttonText, { color: "#fff" }]}>Sair do Grupo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#cc0000" }]}
            onPress={handleDeleteGroup}
          >
            <Text style={[styles.buttonText, { color: "#fff" }]}>Excluir Grupo</Text>
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

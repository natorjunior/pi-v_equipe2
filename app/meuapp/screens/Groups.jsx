import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useTheme } from "../service/themeService";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getGroup, deleteGroup } from "../service/groupService";

export default function Groups() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      const userGroups = await getGroup();
      if (userGroups && Array.isArray(userGroups)) {
        setGroups(userGroups);
      } else {
        setError("Formato de dados inválido ao carregar grupos");
      }
    } catch (error) {
      console.error("Erro ao carregar grupos:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchGroups();
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleSelectGroup = async (groupId) => {
    await SecureStore.setItemAsync("selectedGroupId", groupId.toString());
    navigation.navigate("Home", { selectedGroupId: groupId });
  };

  const confirmDeleteGroup = (groupId) => {
    Alert.alert(
      "Excluir grupo",
      "Tem certeza de que deseja excluir este grupo?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              await deleteGroup(groupId);
              fetchGroups();
            } catch (err) {
              Alert.alert("Erro", err.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const ErrorMessage = ({ error }) =>
    error && (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: theme.error || "red" }]}>{error}</Text>
      </View>
    );

  const getMemberText = (membersCount) =>
    membersCount === 1 ? "membro" : "membros";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        <View style={[styles.header, { backgroundColor: theme.background }]}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: theme.text }]}>Grupos</Text>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scrollContainer, { borderColor: theme.text }]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.text]}
              tintColor={theme.text}
            />
          }
        >
          {loading && !refreshing ? (
            <ActivityIndicator size="large" color={theme.text} />
          ) : groups.length > 0 ? (
            groups.map((group) => (
              <View
                key={group.id}
                style={[
                  styles.groupItem,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.text,
                    borderWidth: 1,
                    shadowColor: theme.mode === "dark" ? "#000" : "#ccc",
                  },
                ]}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => handleSelectGroup(group.id)}
                >
                  <Text style={[styles.groupName, { color: theme.text }]}>
                    {group.group_name || "Grupo sem nome"}
                  </Text>
                  {group.description && (
                    <Text style={[styles.groupDescription, { color: theme.text }]}>
                      {group.description}
                    </Text>
                  )}
                  <Text style={[styles.groupMembers, { color: theme.text }]}>
                    {group.members?.length || 0} {getMemberText(group.members?.length)}
                  </Text>
                  <Text style={[styles.groupCreatedBy, { color: theme.text }]}>
                    Criado por: {group.created_by || "desconhecido"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => confirmDeleteGroup(group.id)}
                  style={styles.trashButton}
                >
                  <Ionicons name="trash" size={20} color={theme.error || "red"} />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={[styles.noGroupsText, { color: theme.text }]}>
              Nenhum grupo encontrado
            </Text>
          )}
          <ErrorMessage error={error} />
        </ScrollView>
      </View>
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
    justifyContent: "space-between",
    padding: 15,
  },
  backButton: {
    right: 21,
    padding: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    right: 21,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  groupItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  groupDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  groupMembers: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: "italic",
  },
  groupCreatedBy: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: "italic",
  },
  trashButton: {
    paddingLeft: 12,
  },
  noGroupsText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  errorContainer: {
    marginTop: 10,
    padding: 10,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
  },
});


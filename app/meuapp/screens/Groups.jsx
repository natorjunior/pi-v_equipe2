import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useTheme } from "../service/themeService";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getGroup } from "../service/groupService";
import { LinearGradient } from "expo-linear-gradient";

export default function Groups({ route }) {
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

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchGroups();
    });

    return unsubscribe;
  }, [navigation]);

const handleSelectGroup = async (groupId, groupName) => {
  await SecureStore.setItemAsync("selectedGroupId", groupId.toString());
  navigation.navigate("Home", {
    groupId,
    groupName,
    refresh: true,
  });
};

  const ErrorMessage = ({ error }) =>
    error && (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: theme.error || "red" }]}>
          {error}
        </Text>
      </View>
    );

  const getMemberText = (membersCount) =>
    membersCount === 1 ? "membro" : "membros";

  return (
    <LinearGradient
      colors={[
        theme.mode === "dark" ? "#0D0058" : "#f0f0f0",
        theme.mode === "dark" ? "#000000" : "#d0d0d0",
      ]}
      style={{ flex: 1 }}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={[
            styles.hamburgerButton,
            { padding: 5, borderRadius: 100 },
          ]}
        >
          <Ionicons name="menu" size={30} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: theme.text }]}>Grupos</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { borderColor: theme.text, paddingHorizontal: 20, paddingBottom: 20 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchGroups}
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
                  shadowColor: theme.mode === "dark" ? "#000" : "#ccc",
                },
              ]}
            >
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => handleSelectGroup(group.id, group.group_name)}
>

                <Text style={[styles.groupName, { color: theme.text }]}>
                  {group.group_name || "Grupo sem nome"}
                </Text>
                {group.description && (
                  <Text
                    style={[styles.groupDescription, { color: theme.text }]}>
                    {group.description}
                  </Text>
                )}
                <Text style={[styles.groupMembers, { color: theme.text }]}>
                  {group.members?.length || 0}{" "}
                  {getMemberText(group.members?.length)}
                </Text>
                <Text style={[styles.groupCreatedBy, { color: theme.text }]}>
                  Criado por: {group.created_by || "desconhecido"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("GroupDetails", { groupId: group.id })}
                style={styles.DetailsButton}
              >
                <Ionicons name="information-circle" size={24} color={theme.text} />
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    position: "relative",
  },
  hamburgerButton: {
    position: "absolute",
    top: 10,
    left: 15,
    zIndex: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollContainer: {
    paddingTop: 10,
  },
  groupItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
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
  DetailsButton: {
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


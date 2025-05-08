import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTheme } from "../service/themeService";
import { useNavigation } from "@react-navigation/native";
import Top from "../components/Top";

export default function Groups() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Top navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} />
        ) : groups.length > 0 ? (
          groups.map((group, index) => (
            <TouchableOpacity
              key={group.id || index}
              style={[styles.groupItem, { backgroundColor: theme.card }]}
              onPress={() => handleJoinGroup(group.id)}
            >
              <Text style={[styles.groupText, { color: theme.text }]}>
                {group.name || "Grupo Sem Nome"}
              </Text>
              {group.description ? (
                <Text
                  style={[styles.groupDescription, { color: theme.text }]}
                  numberOfLines={2}
                >
                  {group.description}
                </Text>
              ) : (
                <Text style={[styles.noDescriptionText, { color: theme.text }]}>Sem descrição</Text>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <Text style={[styles.noGroupsText, { color: theme.text }]}>Nenhum grupo encontrado</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    marginTop: 100,
    paddingTop: 20,
    paddingBottom: 80,
    alignItems: "center",
  },
  groupItem: {
    width: "90%",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  groupText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  noDescriptionText: {
    fontSize: 14,
    fontStyle: "italic",
    opacity: 0.5,
  },
  noGroupsText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
  },
});
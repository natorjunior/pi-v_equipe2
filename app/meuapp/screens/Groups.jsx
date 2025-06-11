import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useTheme } from "../service/themeService";
import { useNavigation, DrawerActions, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getGroup } from "../service/groupService";
import { getGroupRanking } from "../service/checkinService";
import { getUser } from "../service/userService";
import { LinearGradient } from "expo-linear-gradient";

export default function Groups({ route }) {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [groups, setGroups] = useState([]);
  const [rankings, setRankings] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [rankingLoading, setRankingLoading] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const user = await getUser();
      setCurrentUser(user);
    } catch {
      setCurrentUser(null);
    }
  };

  const fetchGroupsAndRankings = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      const userGroups = await getGroup();
      if (userGroups && Array.isArray(userGroups)) {
        setGroups(userGroups);

        const initialLoadingState = userGroups.reduce(
          (acc, group) => ({ ...acc, [group.id]: true }),
          {}
        );
        setRankingLoading(initialLoadingState);

        const rankingPromises = userGroups.map(async (group) => {
          try {
            const rankingData = await getGroupRanking(group.id);
            if (!rankingData || !Array.isArray(rankingData)) {
              return { groupId: group.id, ranking: [] };
            }

            const mapRanking = {};
            rankingData.forEach((u) => (mapRanking[u.user.email] = u));

            const fullRanking = (group.members || []).map((member) => ({
              ...member,
              checkinsCount: mapRanking[member.email]?.checkin_count || 0,
            }));

            fullRanking.sort((a, b) => b.checkinsCount - a.checkinsCount);
            return { groupId: group.id, ranking: fullRanking.slice(0, 3) };
          } catch (err) {
            return { groupId: group.id, ranking: [] };
          } finally {
            setRankingLoading((prev) => ({ ...prev, [group.id]: false }));
          }
        });

        const rankingsData = await Promise.all(rankingPromises);
        const rankingsMap = rankingsData.reduce(
          (acc, { groupId, ranking }) => ({
            ...acc,
            [groupId]: ranking,
          }),
          {}
        );
        setRankings(rankingsMap);
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
    fetchCurrentUser();
    fetchGroupsAndRankings();

    const unsubscribe = navigation.addListener("focus", () => {
      fetchGroupsAndRankings();
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

  const handleProfilePress = (member) => {
    if (currentUser && member.email === currentUser.email) {
      navigation.navigate("AppDrawer", {
        screen: "Tabs",
        params: { screen: "Profile" },
      });
    } else {
      navigation.navigate("OtherProfile", { member });
    }
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
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.hamburgerButton}
        >
          <Ionicons name="menu" size={30} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: theme.text }]}>Grupos</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchGroupsAndRankings}
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
                style={styles.groupContent}
                onPress={() => handleSelectGroup(group.id, group.group_name)}
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
                  Criado por: {group.created_by || "Desconhecido"}
                </Text>
              </TouchableOpacity>
              <View style={styles.podium}>
                {rankingLoading[group.id] ? (
                  <ActivityIndicator size="small" color={theme.text} />
                ) : rankings[group.id]?.length > 0 ? (
                  rankings[group.id].map((rank, index) => (
                    <View key={index} style={styles.podiumItem}>
                      <Text style={[styles.podiumPosition, { color: theme.text }]}>
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleProfilePress(rank)}
                        style={styles.nameWrapper}
                      >
                        <Text
                          style={[styles.podiumText, { color: theme.text }]}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {rank.name || rank.email}
                        </Text>
                        {rank.email === group.created_by && (
                          <Ionicons
                            name="md-crown"
                            size={20}
                            color={theme.text}
                            style={{ marginLeft: 5 }}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text style={[styles.podiumText, { color: theme.text }]}>
                    Ainda não há publicações
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("GroupDetails", { groupId: group.id })
                }
                style={styles.detailsButton}
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
  container: {
    flex: 1,
  },
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
    padding: 5,
    borderRadius: 100,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollContainer: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  groupContent: {
    flex: 1,
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
  detailsButton: {
    padding: 5,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
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
  podium: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingLeft: 10,
    width: 120,
  },
  podiumItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  podiumPosition: {
    fontSize: 12,
    width: 24,
    textAlign: "left",
  },
  nameWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  podiumText: {
    fontSize: 12,
    fontWeight: "normal",
  },
});
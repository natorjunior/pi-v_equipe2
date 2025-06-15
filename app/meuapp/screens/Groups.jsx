import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
  SafeAreaView,
  Dimensions,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useTheme } from "../service/themeService";
import { useNavigation, DrawerActions, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getGroup } from "../service/groupService";
import { getGroupRanking, getCheckinsByGroup, postLikeById, deleteLikeById } from "../service/checkinService";
import { getUser } from "../service/userService";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const isLargeScreen = width > 768;

export default function Groups() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [groups, setGroups] = useState([]);
  const [rankings, setRankings] = useState({});
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [rankingLoading, setRankingLoading] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedGroupName, setSelectedGroupName] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const user = await getUser();
      setCurrentUser(user);
    } catch {
      setCurrentUser(null);
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
            if (!getGroupRanking) {
              return { groupId: group.id, ranking: [] };
            }
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
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchData = async () => {
    try {
      if (!refreshing) setLoading(true);

      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        navigation.navigate("Login");
        return;
      }

      let storedGroupId = await SecureStore.getItemAsync("selectedGroupId");
      let storedGroupName = await SecureStore.getItemAsync("selectedGroupName");

      setSelectedGroupId(storedGroupId);
      setSelectedGroupName(storedGroupName);

      if (storedGroupId) {
        const checkinsData = await getCheckinsByGroup(storedGroupId);
        const sortedCheckins = checkinsData.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setCheckins(sortedCheckins);
      } else {
        setCheckins([]);
      }

      await getUser(token);
      setError(null);
    } catch (error) {
      const status =
        error?.response?.status ||
        error?.status ||
        (error.message?.includes("401")
          ? 401
          : error.message?.includes("404")
          ? 404
          : null);

      if (status === 404 || status === 401) {
        await SecureStore.deleteItemAsync("selectedGroupId");
        await SecureStore.deleteItemAsync("selectedGroupName");
        setSelectedGroupId(null);
        setSelectedGroupName(null);
        setCheckins([]);
        setError("Você não faz mais parte deste grupo.");
        return;
      }

      setError(error.message || "Erro ao carregar dados.");
    } finally {
      if (!refreshing) setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (selectedGroupId) {
      await fetchData();
    } else {
      await fetchGroupsAndRankings();
    }
    setRefreshing(false);
  }, [selectedGroupId]);

  useEffect(() => {
    fetchCurrentUser();
    fetchGroupsAndRankings();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (selectedGroupId) {
        fetchData();
      }
    }, [selectedGroupId])
  );

  useFocusEffect(
    useCallback(() => {
      fetchGroupsAndRankings();
    }, [])
  );

  const handleSelectGroup = async (groupId, groupName) => {
    await SecureStore.setItemAsync("selectedGroupId", groupId.toString());
    await SecureStore.setItemAsync("selectedGroupName", groupName);
    setSelectedGroupId(groupId);
    setSelectedGroupName(groupName);
    fetchData();
  };

  const handleBackToGroups = async () => {
    await SecureStore.deleteItemAsync("selectedGroupId");
    await SecureStore.deleteItemAsync("selectedGroupName");
    setSelectedGroupId(null);
    setSelectedGroupName(null);
    setCheckins([]);
    setError(null);
    fetchGroupsAndRankings();
  };

const handleLike = async (checkinId) => {
  try {
    const checkin = checkins.find((item) => item.id === checkinId);
    if (!checkin) return;

    const updatedCheckins = checkins.map((item) => {
      if (item.id === checkinId) {
        return {
          ...item,
          liked_by_user: !item.liked_by_user,
          likes_count: item.liked_by_user ? item.likes_count - 1 : item.likes_count + 1,
        };
      }
      return item;
    });
    setCheckins(updatedCheckins);

    if (checkin.liked_by_user) {
      await deleteLikeById(checkinId);
    } else {
      await postLikeById(checkinId);
    }
  } catch (error) {
    setError(error.message || "Erro ao curtir/descurtir a publicação.");
    await fetchData();
  }
};

  const renderEmptyComponent = () => {
    if (!selectedGroupId) {
      return (
        <View style={styles.messageContainer}>
          <Text style={[styles.text, { color: theme.text }]}>
            Aqui aparecerá seus grupos caso você entre ou crie um
          </Text>
        </View>
      );
    }

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.text} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.messageContainer}>
          <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
        </View>
      );
    }

    return (
      <View style={styles.messageContainer}>
        <Text style={[styles.text, { color: theme.text }]}>
          Nenhuma publicação encontrada neste grupo
        </Text>
      </View>
    );
  };

  const renderGroupList = () => (
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
          <TouchableOpacity
            onPress={() => handleSelectGroup(group.id, group.group_name)}
            key={group.id}
            style={[
              styles.groupItem,
              {
                backgroundColor: theme.background,
                borderColor: theme.text,
                shadowColor: theme.mode === "dark" ? "#000" : "#ccc",
                padding: group.description?.length > 100 ? 10 : 15,
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
                <Text
                  style={[styles.groupDescription, { color: theme.text }]}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
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
                    <View style={styles.nameWrapper}>
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
                    </View>
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
          </TouchableOpacity>
        ))
      ) : (
        renderEmptyComponent()
      )}
      <ErrorMessage error={error} />
    </ScrollView>
  );

  const renderPostList = () => (
    <FlatList
      style={styles.list}
      data={checkins}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ padding: 20 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate("PostDetails", { checkin: item })}
        >
          <View
            style={[
              styles.post,
              { backgroundColor: theme.background, borderColor: theme.text },
            ]}
          >
            <View style={styles.postHeader}>
              {item.user.avatar && (
                <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
              )}
              <Text style={[styles.postTitle, { color: theme.text }]}>
                @{item.user.name}
              </Text>
            </View>
            {item.photo && (
              <Image source={{ uri: item.photo }} style={styles.postImage} />
            )}
            <View style={styles.likeContainer}>
              <TouchableOpacity
                onPress={() => handleLike(item.id)}
                style={styles.likeButton}
              >
                <Ionicons
                  name={item.liked_by_user ? "heart" : "heart-outline"}
                  size={24}
                  color={item.liked_by_user ? theme.error || "red" : theme.text}
                />
              </TouchableOpacity>
              <Text style={[styles.likeCount, { color: theme.text }]}>
                {item.likes_count}
              </Text>
            </View>
            <Text style={[styles.postText, { color: theme.text }]}>{item.title}</Text>
            <Text style={[styles.postDescription, { color: theme.text }]}>
              {item.description}
            </Text>
            <Text style={[styles.postDate, { color: theme.text }]}>
              {new Date(item.created_at).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={renderEmptyComponent()}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.text}
        />
      }
    />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
            style={styles.hamburgerButton}
          >
            <Ionicons name="menu" size={30} color={theme.text} />
          </TouchableOpacity>
          {selectedGroupId ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("GroupDetails", { groupId: selectedGroupId })
              }
              style={styles.groupButton}
            >
              <Text style={[styles.grupname, { color: theme.text }]}>
                {selectedGroupName || `Grupo ${selectedGroupId}`}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.grupname, { color: theme.text }]}>Grupos</Text>
          )}
          <TouchableOpacity
            onPress={async () => {
              if (selectedGroupId) {
                await handleBackToGroups();
              } else {
                navigation.navigate("SuggestedGroups");
              }
            }}
            style={styles.leaveButton}
          >
            <Ionicons
              name={selectedGroupId ? "exit-outline" : "checkmark-circle-outline"}
              size={30}
              color={theme.text}
            />
          </TouchableOpacity>
        </View>
        {isLargeScreen ? (
          <View style={styles.container}>
            <View style={styles.groupListContainer}>{renderGroupList()}</View>
            <View style={styles.postListContainer}>{renderPostList()}</View>
          </View>
        ) : (
          <View style={styles.container}>
            {selectedGroupId ? renderPostList() : renderGroupList()}
          </View>
        )}
        {selectedGroupId && (
          <TouchableOpacity
            style={[
              styles.fab,
              { backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#003366" },
            ]}
            onPress={() => navigation.navigate("Publish")}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: isLargeScreen ? "row" : "column",
  },
  groupListContainer: {
    flex: isLargeScreen ? 0.4 : 1,
    borderRightWidth: isLargeScreen ? 1 : 0,
    borderColor: "#ccc",
  },
  postListContainer: {
    
    flex: isLargeScreen ? 0.6 : 1,
  },
  list: {
    marginTop: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 15,
    paddingBottom: 10,
    position: "relative",
  },
  grupname: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 50,
  },
  hamburgerButton: {
    position: "absolute",
    top: 10,
    left: 15,
    zIndex: 10,
    padding: 5,
    borderRadius: 100,
  },
  leaveButton: {
    position: "absolute",
    top: 10,
    right: 15,
    zIndex: 10,
    padding: 5,
    borderRadius: 100,
  },
  groupButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },
  scrollContainer: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  groupItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
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
    fontWeight: "600",
  },
  groupDescription: {
    fontSize: 14,
    marginTop: 6,
    flexShrink: 1,
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
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 1.5,
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
  post: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  postImage: {
    width: 330,
    height: 330,
    alignSelf: "center",
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 10,
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeButton: {
    borderRadius: 100,
    transform: [{ scale: 1 }],
    activeOpacity: 0.7,
  },
  likeCount: {
    fontSize: 14,
    marginLeft: 5,
    fontWeight: "bold",
  },
  postText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  postDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  postDate: {
    fontSize: 12,
    fontStyle: "italic",
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  actionButton: {
    width: "80%",
    marginTop: 20,
    paddingVertical: 14,
    marginVertical: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
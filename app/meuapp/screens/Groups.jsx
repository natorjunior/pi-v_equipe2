import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Animated,
  BackHandler,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useTheme } from "../service/themeService";
import { useNavigation, DrawerActions, useFocusEffect, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getGroup } from "../service/groupService";
import { getGroupRanking, getCheckinsByGroup, postLikeById, deleteLikeById } from "../service/checkinService";
import { getUser } from "../service/userService";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const isLargeScreen = width > 768;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function Groups() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
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
  const flatListRef = useRef(null);
  const isFetchingRef = useRef(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = 0;
  const hasInitialized = useRef(false);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

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
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
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
      isFetchingRef.current = false;
    }
  };

  const fetchData = async (groupId, groupName) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      if (!refreshing) setLoading(true);

      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        navigation.navigate("Login");
        return;
      }

      if (groupId) {
        setSelectedGroupId(groupId);
        setSelectedGroupName(groupName);
        await SecureStore.setItemAsync("selectedGroupId", groupId.toString());
        await SecureStore.setItemAsync("selectedGroupName", groupName);
        const checkinsData = await getCheckinsByGroup(groupId);
        const sortedCheckins = checkinsData.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setCheckins(sortedCheckins);
      } else {
        setSelectedGroupId(null);
        setSelectedGroupName(null);
        setCheckins([]);
        await SecureStore.deleteItemAsync("selectedGroupId");
        await SecureStore.deleteItemAsync("selectedGroupName");
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
      isFetchingRef.current = false;
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (selectedGroupId) {
      await fetchData(selectedGroupId, selectedGroupName);
    } else {
      await fetchGroupsAndRankings();
    }
    setRefreshing(false);
  }, [selectedGroupId, selectedGroupName]);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    fetchCurrentUser();
    const { selectedGroupId, selectedGroupName, clearGroup } = route.params || {};
    if (clearGroup) {
      handleBackToGroups();
      return;
    }

    const initialize = async () => {
      if (selectedGroupId) {
        await fetchData(selectedGroupId, selectedGroupName);
      } else {
        const storedGroupId = await SecureStore.getItemAsync("selectedGroupId");
        const storedGroupName = await SecureStore.getItemAsync("selectedGroupName");
        if (storedGroupId && storedGroupName) {
          await fetchData(storedGroupId, storedGroupName);
        } else {
          await fetchGroupsAndRankings();
        }
      }
    };

    initialize();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const { selectedGroupId, selectedGroupName, refreshPosts, clearGroup, refresh } = route.params || {};

      if (clearGroup) {
        handleBackToGroups();
      } else if (selectedGroupId && refreshPosts) {
        fetchData(selectedGroupId, selectedGroupName);
      } else if (refresh) {
        fetchGroupsAndRankings();
      }

      return () => {
        navigation.setParams({
          selectedGroupId: undefined,
          selectedGroupName: undefined,
          refreshPosts: undefined,
          clearGroup: undefined,
          refresh: undefined,
        });
      };
    }, [route.params])
  );

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        if (selectedGroupId) {
          handleBackToGroups();
          return true;
        }
        return false;
      };

      const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => backHandler.remove();
    }, [selectedGroupId])
  );

  const handleSelectGroup = async (groupId, groupName) => {
    await fetchData(groupId, groupName);
  };

  const handleBackToGroups = async () => {
    if (isFetchingRef.current) return;
    await SecureStore.deleteItemAsync("selectedGroupId");
    await SecureStore.deleteItemAsync("selectedGroupName");
    setSelectedGroupId(null);
    setSelectedGroupName(null);
    setCheckins([]);
    setError(null);
    await fetchGroupsAndRankings();
  };

  const handleLike = async (checkinId) => {
    try {
      const checkin = checkins.find((item) => String(item.id) === String(checkinId));
      if (!checkin) return;

      const updatedCheckins = checkins.map((item) => {
        if (String(item.id) === String(checkinId)) {
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
      await fetchData(selectedGroupId, selectedGroupName);
    }
  };

  const truncateUsername = (username) => {
    if (username.length > 20) {
      return username.slice(0, 20) + "...";
    }
    return username;
  };

  const renderEmptyComponent = () => {
    if (!selectedGroupId) {
      return (
        <View style={styles.messageContainer}>
          <Text style={[styles.text, { color: theme.text }]}>
            Aqui aparecerá seus grupos caso você entre ou crie um
          </Text>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#fff" }]}
            onPress={() => navigation.navigate("CreateGroup")}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>Criar um grupo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#fff" }]}
            onPress={() => navigation.navigate("JoinGroup")}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>Entrar em um grupo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.mode === "dark" ? "#fff" : "#000" }]}
            onPress={() => navigation.navigate("SuggestedGroups")}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, { color: theme.mode === "dark" ? "#000" : "#fff" }]}>
              Grupos oficiais
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (loading && !refreshing) {
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
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#fff" }]}
          onPress={() => navigation.navigate("Publish", { groupId: selectedGroupId, groupName: selectedGroupName })}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, { color: theme.text }]}>Criar uma publicação</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFooter = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.text} />
        </View>
      );
    }
    if (!loading && checkins.length > 0) {
      return (
        <TouchableOpacity 
          style={styles.messageContainer}
          onPress={async () => {
            setRefreshing(true);
            try {
              await fetchData(selectedGroupId, selectedGroupName);
              await new Promise(resolve => setTimeout(resolve, 100));
              flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
            } finally {
              setRefreshing(false);
            }
          }}
        >
          <View style={[styles.line, { borderColor: theme.border }]} />
          <Ionicons name="sparkles-outline" size={32} color={theme.text} style={styles.icon} />
          <Text style={[styles.text, { color: theme.text }]}>Você chegou ao fim ✨</Text>
          <Text style={[styles.subtext, { color: theme.text }]}>
            Toque aqui para retornar lá em cima!
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
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
    <AnimatedFlatList
      style={styles.list}
      data={checkins}
      ref={flatListRef}
      keyExtractor={(item) => String(item.id).replace(/\.\$/g, '')}
      contentContainerStyle={{
        paddingTop: headerHeight + 20,
        paddingHorizontal: 20,
        paddingBottom: 20,
      }}
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
              <View style={styles.headerTextContainer}>
                <View style={styles.headerNameRow}>
                  <Text style={[styles.postTitle, { color: theme.text }]}>
                    @{truncateUsername(item.user.name)}
                  </Text>
                  <View style={[styles.separatorDot, { backgroundColor: theme.text }]} />
                  <Text style={[styles.postTimestamp, { color: theme.text }]}>
                    {new Date(item.created_at).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              </View>
            </View>
            {item.photo && (
              <Image source={{ uri: item.photo }} style={styles.postImage} />
            )}
            <Text style={[styles.postText, { color: theme.text }]}>{item.title}</Text>
            {item.description && (
              <Text style={[styles.postDescription, { color: theme.text }]}>
                {item.description}
              </Text>
            )}
            <View style={styles.likeContainer}>
              <TouchableOpacity
                onPress={() => handleLike(item.id)}
                style={styles.likeButton}
              >
                <Ionicons
                  name={item.liked_by_user ? "heart" : "heart-outline"}
                  size={25}
                  color={item.liked_by_user ? theme.error || "red" : theme.text}
                />
              </TouchableOpacity>
              <Text style={[styles.likeCount, { color: theme.text }]}>
                {item.likes_count}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={renderEmptyComponent()}
      ListFooterComponent={renderFooter()}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.text}
        />
      }
      onScroll={handleScroll}
      scrollEventThrottle={16}
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
            onPress={() => navigation.navigate("Publish", { groupId: selectedGroupId, groupName: selectedGroupName })}
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
    fontSize: 14,
    fontWeight: "600",
  },
  post: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ccc",
    marginRight: 8,
  },
  postTitle: {
    fontSize: 15,
    fontWeight: "600",
    maxWidth: "60%",
  },
  postImage: {
    width: "100%",
    height: 330,
    alignSelf: "center",
    resizeMode: "cover",
    borderRadius: 8,
    marginBottom: 8,
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  likeButton: {
    padding: 4,
  },
  likeCount: {
    fontSize: 13,
    marginLeft: 4,
    fontWeight: "500",
  },
  postText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  postDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  headerTextContainer: {
    flexDirection: "column",
    flex: 1,
  },
  headerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
  },
  separatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 6,
    opacity: 0.6,
  },
  postTimestamp: {
    fontSize: 12,
    opacity: 0.6,
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
  line: {
    width: "100%",
    borderTopWidth: 1,
    marginVertical: 15,
  },
  icon: {
    marginBottom: 10,
  },
  subtext: {
    fontSize: 14,
    textAlign: "center",
  },
});
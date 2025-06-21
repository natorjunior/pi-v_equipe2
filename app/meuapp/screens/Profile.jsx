import { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  SafeAreaView,
  Modal,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../service/themeService";
import { useNavigation, useFocusEffect, DrawerActions } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { getUser } from "../service/userService";
import { getGroup } from "../service/groupService";
import { getCheckinsByUser, postLikeById, deleteLikeById } from "../service/checkinService";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/pt-br";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("pt-br");

export default function Profile() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [checkins, setUserCheckins] = useState([]);
  const [groups, setGroups] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const scrollViewRef = useRef(null);
  const hasInitialized = useRef(false);

  const fetchUser = async () => {
    try {
      setRefreshing(true);
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        const userData = await getUser(token);
        setUser(userData);
        const checkinsData = await getCheckinsByUser(token);
        setUserCheckins(checkinsData);
        const groupsData = await getGroup();
        const allGroups = groupsData
          .map((group) => ({
            id: group.id,
            name: group.group_name || `Group ${group.id}`,
          }))
          .filter((group) => group.name);
        setGroups(allGroups.sort((a, b) => a.name.localeCompare(b.name)));
      } else {
        console.warn("Token de autenticação não encontrado.");
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Erro no profile ao buscar usuário ou grupos:", error.message);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

useFocusEffect(
    useCallback(() => {
      if (scrollViewRef.current) {
        setTimeout(() => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
            console.log("Scrolled to top of Profile screen");
          }
        }, 100);
      }
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;
      setLoading(true);
      fetchUser();
    }, [])
  );

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
      setUserCheckins(updatedCheckins);

      if (checkin.liked_by_user) {
        await deleteLikeById(checkinId);
      } else {
        await postLikeById(checkinId);
      }
    } catch (error) {
      console.error("Erro ao curtir/descurtir:", error);
      await fetchUser();
    }
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).tz("America/Fortaleza").format("D [de] MMMM [de] YYYY");
  };

  const renderMotivationIcon = () => {
    switch (user?.motivation) {
      case "Encontrar sua turma":
        return <Image source={require("../assets/q2image1.png")} style={styles.motivationIcon} />;
      case "Procurar livros":
        return <Image source={require("../assets/q2image2.png")} style={styles.motivationIcon} />;
      case "Focar nos estudos":
        return <Image source={require("../assets/q2image3.png")} style={styles.motivationIcon} />;
      case "Usufruir do aplicativo":
        return <Image source={require("../assets/q2image4.png")} style={styles.motivationIcon} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.mode === "dark" ? "#050024" : "#f0f0f0" }}>
      <LinearGradient
        colors={[
          theme.mode === "dark" ? "#0D0058" : "#f0f0f0",
          theme.mode === "dark" ? "#000000" : "#d0d0d0",
        ]}
        style={styles.gradient}
      >
        <View style={[styles.header, { backgroundColor: "transparent" }]}>
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={[styles.hamburgerButton, { padding: 5, borderRadius: 100 }]}
          >
            <Ionicons name="menu" size={30} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: theme.text }]}>Perfil</Text>
          <TouchableOpacity onPress={() => navigation.navigate("EditProfile")} style={styles.editButton}>
            <Ionicons name="pencil" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={theme.mode === "dark" ? "#fff" : "#000"} style={styles.loader} />
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={fetchUser}
                colors={[theme.text]}
                tintColor={theme.text}
              />
            }
            ref={scrollViewRef}
          >
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalBackground}>
                <TouchableOpacity style={styles.modalCloseArea} onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={30} color="#fff" />
                </TouchableOpacity>
                <Image
                  source={{ uri: user?.avatar }}
                  style={styles.fullscreenImage}
                  resizeMode="cover"
                />
              </View>
            </Modal>

            <View style={styles.profileHeader}>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                {avatarLoading && (
                  <ActivityIndicator size="large" color={theme.mode === "dark" ? "#fff" : "#000"} style={styles.avatarLoader} />
                )}
                {user?.avatar ? (
                  <Image
                    source={{ uri: user.avatar }}
                    style={[
                      styles.avatar,
                      {
                        borderColor:
                          theme.mode === "dark" ? "#DFBA69" : "#003366",
                      },
                    ]}
                    onLoadStart={() => setAvatarLoading(true)}
                    onLoadEnd={() => setAvatarLoading(false)}
                  />
                ) : (
                  <View style={[styles.defaultAvatar, { backgroundColor: theme.mode === "dark" ? "#1a1a2e" : "#ccc" }]}>
                    <Ionicons name="person" size={60} color={theme.mode === "dark" ? "#fff" : "#000"} />
                  </View>
                )}
              </TouchableOpacity>

              <Text style={[styles.name, { color: theme.text }]}>{user?.name || "Usuário"}</Text>

              <View style={styles.motivationContainer}>
                <View style={styles.motivationIconContainer}>{renderMotivationIcon()}</View>
                <Text style={[styles.motivation, { color: theme.text }]}>{user?.motivation}</Text>
              </View>

              {user?.created_at && (
                <Text style={[styles.createdAt, { color: theme.text }]}>
                  Com a gente desde: {formatDate(user.created_at)}
                </Text>
              )}
            </View>

            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === "posts" && {
                    borderBottomColor: theme.mode === "dark" ? "#DFBA69" : "#003366",
                  },
                ]}
                onPress={() => setActiveTab("posts")}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: activeTab === "posts" ? (theme.mode === "dark" ? "#DFBA69" : "#003366") : theme.text,
                    },
                  ]}
                >
                  Publicações
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[ 
                  styles.tabButton,
                  activeTab === "genres" && {
                    borderBottomColor: theme.mode === "dark" ? "#DFBA69" : "#003366",
                  },
                ]}
                onPress={() => setActiveTab("genres")}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: activeTab === "genres" ? (theme.mode === "dark" ? "#DFBA69" : "#003366") : theme.text,
                    },
                  ]}
                >
                  Gêneros Favoritos
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === "posts" ? (
              <View style={styles.postsContainer}>
                {[...checkins].reverse().map((checkin) => {
                  const group = groups.find((g) => String(g.id) === String(checkin.group_id));
                  return (
                    <TouchableOpacity
                      key={`${String(checkin.id)}-${String(checkin.group_id || 'no-group')}`}
                      style={[styles.post, { backgroundColor: theme.background, borderColor: theme.text }]}
                      onPress={() => navigation.navigate("PostDetails", { checkin })}
                    >
                      <View style={styles.postHeader}>
                        {checkin.user.avatar && (
                          <Image
                            source={{ uri: checkin.user.avatar }}
                            style={styles.avatarpost}
                          />
                        )}
                        <View style={styles.headerTextContainer}>
                          <View style={styles.headerNameRow}>
                            <Text style={[styles.postTitle, { color: theme.text }]}>@{checkin.user.name}</Text>
                            <View style={[styles.separatorDot, { backgroundColor: theme.text }]} />
                            <Text style={[styles.postTimestamp, { color: theme.text }]}>
                              {dayjs(checkin.created_at).tz("America/Fortaleza").format("DD/MM/YYYY HH:mm")}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {checkin.photo && (
                        <Image
                          source={{ uri: checkin.photo }}
                          style={styles.postImage}
                          resizeMode="cover"
                        />
                      )}

                      <Text style={[styles.postText, { color: theme.text }]}>{checkin.title}</Text>
                      {checkin.description && (
                        <Text style={[styles.postDescription, { color: theme.text }]}>
                          {checkin.description}
                        </Text>
                      )}
                      {checkin.group_id && (
                        <Text style={[styles.postGroup, { color: theme.text }]}>
                          Postado no grupo {group ? group.name : "Grupo não encontrado"}
                        </Text>
                      )}
                      <View style={styles.likeContainer}>
                        <TouchableOpacity
                          onPress={() => handleLike(checkin.id)}
                          style={styles.likeButton}
                        >
                          <Ionicons
                            name={checkin.liked_by_user ? "heart" : "heart-outline"}
                            size={25}
                            color={checkin.liked_by_user ? theme.error || "red" : theme.text}
                          />
                        </TouchableOpacity>
                        <Text style={[styles.likeCount, { color: theme.text }]}>{checkin.likes_count}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
                {checkins.length === 0 && (
                  <View style={styles.noPostsContainer}>
                    <Text style={[styles.noPostsText, { color: theme.text }]}>Nenhuma publicação ainda</Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.genresContainer}>
                {user?.genres?.length > 0 ? (
                  user.genres.map((genre, index) => (
                    <View
                      key={index}
                      style={[
                        styles.genreTag,
                        {
                          backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#003366",
                        },
                      ]}
                    >
                      <Text style={[styles.genreText, { color: "#fff" }]}>{genre}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={[styles.noContent, { color: theme.text }]}>Nenhum gênero selecionado</Text>
                )}
              </View>
            )}
          </ScrollView>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  scrollContent: { paddingBottom: 30 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    position: "relative",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  hamburgerButton: {
    position: "absolute",
    top: 10,
    left: 15,
    zIndex: 10,
  },
  editButton: {
    flexDirection: "row",
    position: "absolute",
    alignItems: "flex-end",
    top: 15,
    right: 15,
    zIndex: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileHeader: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
  },
  avatarLoader: {
    position: "absolute",
    top: 45,
    left: 45,
  },
  defaultAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  motivation: {
    fontSize: 16,
    fontStyle: "italic",
    opacity: 0.8,
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  motivationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  motivationIcon: {
    width: 30,
    height: 30,
    left: 10,
    top: -7,
  },
  createdAt: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.7,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tabButton: {
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  postsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  noPostsContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  noPostsText: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
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
  headerTextContainer: {
    flexDirection: "column",
    flex: 1,
  },
  headerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
  },
  avatarpost: {
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
  postImage: {
    width: "100%",
    height: 330,
    alignSelf: "center",
    resizeMode: "cover",
    borderRadius: 8,
    marginBottom: 8,
  },
  postText: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  postDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  postGroup: {
    fontSize: 13,
    marginBottom: 4,
    opacity: 0.6,
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
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  genreTag: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 5,
  },
  genreText: {
    fontSize: 14,
  },
  noContent: {
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
    width: "100%",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "90%",
    aspectRatio: 1,
    resizeMode: "cover",
  },
  modalCloseArea: {
    position: "absolute",
    top: 50,
    right: 30,
    zIndex: 2,
    padding: 10,
  },
});
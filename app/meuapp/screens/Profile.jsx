import React, { useState, useRef, useCallback } from "react";
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../service/themeService";
import { useNavigation, useFocusEffect, DrawerActions } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { getUser } from "../service/userService";
import { getCheckinsByUser } from "../service/checkinService";
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
  const [avatarLoading, setAvatarLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [checkins, setUserCheckins] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const scrollViewRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const token = await SecureStore.getItemAsync("token");
          if (token) {
            const userData = await getUser(token);
            setUser(userData);
            const checkinsData = await getCheckinsByUser(token);
            setUserCheckins(checkinsData);
          } else {
            console.warn("Token de autenticação não encontrado.");
            navigation.navigate("Login");
          }
        } catch (error) {
          console.error("Erro no profile ao buscar usuário:", error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }, [])
  );

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
          <ScrollView contentContainerStyle={styles.scrollContent}>
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
                  resizeMode="contain"
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
                    style={styles.avatar}
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
              <ScrollView
                contentContainerStyle={styles.postsContainer}
                onContentSizeChange={() => {
                  scrollViewRef.current?.scrollToEnd({ animated: false });
                }}
              >
                {[...checkins].reverse().map((checkin) => (
                  <TouchableOpacity
                    key={checkin.id}
                    style={[styles.post, { backgroundColor: theme.cardBackground }]}
                    onPress={() => navigation.navigate("PostDetails", { checkin })}
                  >
                    <View style={styles.postHeader}>
                      {checkin.user.avatar && (
                        <Image
                          source={{ uri: checkin.user.avatar }}
                          style={styles.avatarpost}
                        />
                      )}
                      <Text style={[styles.postTitle, { color: theme.text }]}>
                        @{checkin.user.name}
                      </Text>
                    </View>

                    {checkin.photo && (
                      <View style={styles.postImageContainer}>
                        {loading ? (
                          <ActivityIndicator
                            size="large"
                            color={theme.text}
                            style={styles.postImageLoading}
                          />
                        ) : (
                          <Image
                            source={{ uri: checkin.photo }}
                            style={styles.postImage}
                            resizeMode="cover"
                          />
                        )}
                      </View>
                    )}

                    <Text style={[styles.postText, { color: theme.text }]}>
                      {checkin.title}
                    </Text>
                    <Text style={[styles.postText, { color: theme.text }]}>
                      {checkin.description}
                    </Text>
                    <Text style={[styles.postDate, { color: theme.text }]}>
                      {dayjs(checkin.created_at).tz("America/Fortaleza").format("DD [de] MMMM [de] YYYY")}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
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
    borderColor: "#ccc",
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
    paddingBottom: 100,
    paddingHorizontal: 15,
  },
  post: {
    borderRadius: 10,
    padding: 15,
    height: "auto",
    marginBottom: 15,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarpost: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  postText: {
    fontSize: 14,
    marginBottom: 8,
  },
  postDate: {
    fontSize: 12,
    fontStyle: "italic",
  },
  postImageContainer: {
    height: "auto",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
    marginTop: 5,
  },
  postImage: {
    width: "100%",
    height: 320,
  },
  postImageLoading: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
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
    height: "70%",
  },
  modalCloseArea: {
    position: "absolute",
    top: 50,
    right: 30,
    zIndex: 2,
    padding: 10,
  },
});

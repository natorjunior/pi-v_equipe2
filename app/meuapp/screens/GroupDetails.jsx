import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  RefreshControl,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "../service/themeService";
import { getUser } from "../service/userService";
import { getGroup, deleteGroup, leaveGroup } from "../service/groupService";
import { getGroupRanking } from "../service/checkinService";

export default function GroupDetails() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { groupId } = route.params;

  const [groupName, setGroupName] = useState("");
  const [groupAlias, setGroupAlias] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [groupCreatedBy, setGroupCreatedBy] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState("");

  const fetchCurrentUser = async () => {
    try {
      const user = await getUser();
      setCurrentUser(user);
    } catch {
      setCurrentUser(null);
    }
  };

  const fetchGroupAndRanking = async () => {
    setLoading(true);
    setError("");
    try {
      const groups = await getGroup();
      const selectedGroup = groups.find(
        (g) => g.id.toString() === groupId.toString()
      );
      if (!selectedGroup) {
        setError("Grupo não encontrado.");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      setGroupName(selectedGroup.group_name);
      setGroupAlias(selectedGroup.group_alias);
      setDescription(selectedGroup.description || "");
      setMembers(selectedGroup.members || []);
      setGroupCreatedBy(selectedGroup.created_by);

    let rankingData = [];
    try {
      rankingData = await getGroupRanking(groupId);
    } catch (e) {
      console.warn("Erro ao buscar ranking, fallback para membros com 0 pts");
    }

    const mapRanking = {};
    rankingData.forEach((u) => (mapRanking[u.user.email] = u));

    const fullRanking = (selectedGroup.members || []).map((member) => ({
      ...member,
      checkinsCount: mapRanking[member.email]?.checkin_count || 0,
    }));

    fullRanking.sort((a, b) => b.checkinsCount - a.checkinsCount);
    setRanking(fullRanking);

    } catch (err) {
      console.log("Erro ao carregar grupo:", err);
      setError("Erro ao carregar informações do grupo.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchGroupAndRanking();
  }, [groupId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCurrentUser();
    fetchGroupAndRanking();
  };

  const handleAvatarPress = (uri) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const handleDeleteGroup = () => {
    Alert.alert("Confirmar exclusão", "Deseja realmente excluir este grupo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await deleteGroup(groupId);
            await SecureStore.deleteItemAsync("selectedGroupId");
            Alert.alert("Sucesso", "Grupo excluído com sucesso!", [
              {
                text: "OK",
                onPress: () =>
                  navigation.navigate("AppDrawer", { refresh: true }),
              },
            ]);
          } catch (err) {
            console.log("Error deleting group:", err);
            Alert.alert("Erro", "Não foi possível excluir o grupo.");
          } finally {
            setLoading(false);
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
            setLoading(true);
            await leaveGroup(groupAlias);
            await SecureStore.deleteItemAsync("selectedGroupId");
            Alert.alert("Você saiu do grupo.");
            navigation.navigate("AppDrawer", {
              refresh: true,
              selectedGroupId: null,
            });
          } catch (err) {
            console.log("Error leaving group:", err);
            Alert.alert("Erro", "Não foi possível sair do grupo.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  if (loading || !currentUser) {
    return (
      <SafeAreaView style={styles.loaderContainer(theme)}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container(theme)}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: theme.text }]}>
          Configurações do Grupo
        </Text>
      </View>

      <FlatList
        data={ranking}
        keyExtractor={(item, idx) => item.email + idx}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View style={styles.headerContent}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Nome do Grupo
            </Text>
            <Text style={{ color: theme.text }}>{groupName}</Text>

            <Text
              style={[
                styles.sectionTitle,
                { color: theme.text, marginTop: 20 },
              ]}
            >
              Código de acesso
            </Text>
            <Text style={{ color: theme.text }}>@{groupAlias}</Text>

            {description ? (
              <>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.text, marginTop: 20 },
                  ]}
                >
                  Descrição
                </Text>
                <Text style={{ color: theme.text }}>{description}</Text>
              </>
            ) : null}

            <Text
              style={[
                styles.sectionTitle,
                { color: theme.text, marginTop: 30 },
              ]}
            >
              Ranking do Grupo
            </Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const isAdmin = item.name === groupCreatedBy;
          const medal =
            index === 0
              ? "🥇"
              : index === 1
              ? "🥈"
              : index === 2
              ? "🥉"
              : null;

          return (
            <View style={styles.memberRow}>
              <Text style={{ color: theme.text, width: 24 }}>
                {index + 1}º
              </Text>

              <TouchableOpacity onPress={() => handleAvatarPress(item.avatar)}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (currentUser && item.email === currentUser.email) {
                    navigation.navigate("AppDrawer", {
                      screen: "Tabs",
                      params: { screen: "Profile" },
                    });
                  } else {
                    navigation.navigate("OtherProfile", { member: item });
                  }
                }}
              >
                <View style={styles.nameWrapper}>
                  <Text
                    style={[
                      { color: theme.text, fontWeight: isAdmin ? "bold" : "normal" },
                    ]}
                  >
                    {item.name || item.email} {medal}
                  </Text>
                  {isAdmin && <Text style={styles.adminBadge}>ADM</Text>}
                </View>
              </TouchableOpacity>
              <Text
                style={[styles.points, { color: theme.text, fontWeight: "bold" }]}
              >
                {item.checkinsCount} pts
              </Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={{ color: theme.text }}>Nenhum membro encontrado.</Text>
        }
        contentContainerStyle={{ paddingBottom: 140 }}
      />

      <View style={styles.footer(theme)}>
        <TouchableOpacity
          style={styles.actionButton(theme)}
          onPress={handleLeaveGroup}
        >
          <Text style={styles.actionText(theme.error)}>Deixar o Grupo</Text>
        </TouchableOpacity>

        {currentUser.name === groupCreatedBy && (
          <TouchableOpacity
            style={styles.actionButton(theme.error)}
            onPress={handleDeleteGroup}
          >
            <Text style={styles.actionText("#fff")}>Excluir Grupo</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity
            style={styles.modalCloseArea}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullscreenImage}
            resizeMode="cover"
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: (theme) => ({
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.background,
  }),
  container: (theme) => ({
    flex: 1,
    backgroundColor: theme.background,
  }),
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  headerContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
    flex: 1,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 12,
    backgroundColor: "#ccc",
  },
  nameWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  adminBadge: {
    backgroundColor: "#ffd700",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
    fontSize: 10,
    fontWeight: "bold",
  },
  footer: (theme) => ({
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 16,
    backgroundColor: theme.background,
  }),
  actionButton: (bgColor) => ({
    backgroundColor: bgColor,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  }),
  actionText: (color) => ({
    color,
    fontSize: 16,
    fontWeight: "bold",
  }),
  errorText: {
    color: "red",
    alignSelf: "center",
    marginTop: 12,
  },
  points: {
    flex: 1,
    textAlign: "right",
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
  },
  modalCloseArea: {
    position: "absolute",
    top: 50,
    right: 30,
    zIndex: 2,
    padding: 10,
  },
});
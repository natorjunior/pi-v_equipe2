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
  Image,
  RefreshControl,
  Modal,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../service/themeService";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getGroup, deleteGroup, leaveGroup } from "../service/groupService";
import { getUser } from "../service/userService";

export default function GroupDetails() {
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
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [groupCreatedBy, setGroupCreatedBy] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const user = await getUser();
      setCurrentUser(user);
    } catch (err) {
      console.log("Erro ao carregar usuário atual:", err);
      setCurrentUser(null);
    }
  };

  const fetchGroup = async () => {
    setLoading(true);
    setError("");
    try {
      const groups = await getGroup();
      const selectedGroup = groups.find(
        (group) => group.id.toString() === groupId.toString()
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
    fetchGroup();
  }, [groupId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCurrentUser();
    fetchGroup();
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
            Alert.alert("Sucesso", "Grupo excluído com sucesso!", [
              { text: "OK", onPress: () => navigation.navigate("AppDrawer", { refresh: true })},
            ]);
          } catch (err) {
            console.log("Erro ao excluir grupo", err);
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
            Alert.alert("Você saiu do grupo.");
            navigation.navigate("AppDrawer", { refresh: true, selectedGroupId: null });
          } catch (err) {
            console.log("Erro ao sair do grupo", err);
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
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: theme.text }]}>Configurações do Grupo</Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <FlatList
            data={members}
            keyExtractor={(item, index) => item.id?.toString() || item.email || index.toString()}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={[styles.inner, { paddingBottom: 140 }]}
            ListHeaderComponent={
              <>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Text style={[styles.sectionTitle, { color: theme.text }]}>Nome do Grupo</Text>
                <Text style={{ color: theme.text }}>{groupName}</Text>

                <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 20 }]}>
                  Código de acesso
                </Text>
                <Text style={{ color: theme.text }}>{"@" + groupAlias}</Text>

                {description ? (
                  <>
                    <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 20 }]}>
                      Descrição
                    </Text>
                    <Text style={{ color: theme.text }}>{description}</Text>
                  </>
                ) : null}

                <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 30 }]}>
                  Membros do Grupo
                </Text>
              </>
            }
            ListEmptyComponent={<Text style={{ color: theme.text }}>Nenhum membro encontrado.</Text>}
            renderItem={({ item }) => {
              const isAdmin = item.name === groupCreatedBy;

            return (
              <View style={styles.memberRow}>
                <TouchableOpacity onPress={() => handleAvatarPress(item.avatar)}>
                  <Image source={{ uri: item.avatar }} style={styles.memberAvatar} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (currentUser && item.email === currentUser.email) {
                        navigation.navigate("AppDrawer", { 
                            screen: "Tabs", 
                            params: { screen: "Profile" } 
                        });
                    } else {
                      navigation.navigate("OtherProfile", { member: item });
                    }
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={[
                        {
                          color: theme.text,
                          fontWeight: isAdmin ? "bold" : "normal",
                        },
                      ]}
                    >
                      {item.name || item.email}
                    </Text>
                    {isAdmin && (
                      <View style={styles.adminBadge}>
                        <Text style={styles.adminBadgeText}>ADM</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            );

            }}
          />
        </KeyboardAvoidingView>

        <View style={[styles.footerFixed, { backgroundColor: theme.background }]}>
          <TouchableOpacity style={[styles.button]} onPress={handleLeaveGroup} disabled={loading}>
            <Text style={[styles.buttonText, { color: theme.error }]}>Deixar o Grupo</Text>
          </TouchableOpacity>

          {currentUser && groupCreatedBy === currentUser.name && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.error }]}
              onPress={handleDeleteGroup}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Excluir Grupo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.modalCloseArea} onPress={() => setModalVisible(false)}>
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inner: {
    alignItems: "flex-start",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
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
    color: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
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
    marginRight: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
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
  footerFixed: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  adminBadge: {
  backgroundColor: "#FFD700",
  marginLeft: 8,
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 4,
},
adminBadgeText: {
  color: "#000",
  fontWeight: "bold",
  fontSize: 12,
},

});

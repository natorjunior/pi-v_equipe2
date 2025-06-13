import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import ImagePicker from "react-native-image-crop-picker";
import * as SecureStore from "expo-secure-store";
import { useTheme } from "../service/themeService";
import InputField from "../components/InputField";
import { getUser, updateUser, uploadAvatar } from "../service/userService";
import { AndroidPermissions } from "../util/AndroidPermissions";

export default function EditProfile() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const userData = await getUser(token);

        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          avatar: userData.avatar || "",
        });
        setAvatarPreview(userData.avatar);
      } catch (error) {
        Alert.alert("Erro", "Falha ao carregar dados do usuário");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImage = async (type) => {
    try {
      const hasAllPermissions = await AndroidPermissions();
      if (!hasAllPermissions) {
        Alert.alert(
          "Permissões Negadas",
          "O aplicativo precisa de permissões para acessar a câmera e a galeria."
        );
        return;
      }

      let selectedImage;
      if (type === "camera") {
        selectedImage = await ImagePicker.openCamera({
          width: 1024,
          height: 1024,
          cropping: true,
          compressImageQuality: 0.8,
          mediaType: "photo",
          forceJpg: true,
        });
      } else {
        selectedImage = await ImagePicker.openPicker({
          width: 1024,
          height: 1024,
          cropping: true,
          compressImageQuality: 0.8,
          mediaType: "photo",
          forceJpg: true,
        });
      }

      const imageData = {
        uri: selectedImage.path,
        width: selectedImage.width,
        height: selectedImage.height,
        fileName: selectedImage.filename || `avatar_${Date.now()}.jpg`,
        type: selectedImage.mime || "image/jpeg",
      };

      setAvatarPreview(imageData.uri);
      setFormData((prev) => ({
        ...prev,
        avatar: imageData.uri,
      }));
    } catch (error) {
      if (error.message?.includes("cancel")) {
        console.log("Usuário cancelou a seleção");
      } else {
        console.error("Erro ao selecionar ou recortar imagem:", error);
        Alert.alert("Erro", "Ocorreu um erro ao processar a imagem");
      }
    }
  };

  const handleResetAvatar = () => {
    setAvatarPreview(null);
    setFormData((prev) => ({
      ...prev,
      avatar: "",
    }));
  };

  const handleUpdate = async () => {
    try {
      setUploading(true);
      const token = await SecureStore.getItemAsync("token");

      const payload = {
        name: formData.name,
        email: formData.email,
      };

      if (avatarPreview && avatarPreview.startsWith("file://")) {
        const uploadedUrl = await uploadAvatar(avatarPreview, token);
        payload.avatar = uploadedUrl;
      } else if (!avatarPreview) {
        payload.avatar = ""; // Reset to default avatar
      }

      await updateUser(payload);
      await SecureStore.setItemAsync("user", JSON.stringify(payload));
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      navigation.navigate("AppDrawer", { refresh: true });
    } catch (error) {
      Alert.alert("Erro", error.message || "Falha ao atualizar perfil");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>
            Editar Perfil
          </Text>
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {avatarPreview ? (
              <Image
                source={{ uri: avatarPreview }}
                style={[
                  styles.avatar,
                  {
                    borderColor:
                      theme.mode === "dark" ? "#DFBA69" : "#003366",
                  },
                ]}
              />
            ) : (
              <View
                style={[
                  styles.defaultAvatar,
                  { backgroundColor: theme.inputBackground },
                ]}
              >
                <Ionicons name="person" size={40} color={theme.text} />
              </View>
            )}
            {uploading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={theme.text} />
              </View>
            )}
          </View>

          <View style={styles.avatarButtons}>
            <TouchableOpacity
              style={[styles.imageButton, { borderColor: theme.border }]}
              onPress={() => handleImage("camera")}
              disabled={uploading}
            >
              <Ionicons name="camera" size={20} color={theme.text} />
              <Text style={[styles.buttonText, { color: theme.text }]}>
                Câmera
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.imageButton, { borderColor: theme.border }]}
              onPress={() => handleImage("library")}
              disabled={uploading}
            >
              <Ionicons name="image" size={20} color={theme.text} />
              <Text style={[styles.buttonText, { color: theme.text }]}>
                Galeria
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.imageButton, { borderColor: theme.border }]}
              onPress={handleResetAvatar}
              disabled={uploading || !avatarPreview}
            >
              <Ionicons name="refresh" size={20} color={theme.text} />
              <Text style={[styles.buttonText, { color: theme.text }]}>
                Remover Avatar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <InputField
          label="Nome"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Digite seu nome"
          theme={theme}
        />

        <InputField
          label="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="Digite seu email"
          keyboardType="email-address"
          theme={theme}
        />

        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.border }]}
          onPress={() => navigation.navigate("ChangeMotivation")}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
            Alterar Motivação
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.border }]}
          onPress={() => navigation.navigate("ChangeGenres")}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
            Alterar Gêneros
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            {
              backgroundColor:
                theme.mode === "dark" ? "#DFBA69" : "#003366",
            },
          ]}
          onPress={handleUpdate}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color={theme.text} />
          ) : (
            <Text
              style={[
                styles.primaryButtonText,
                { color: theme.mode === "dark" ? "#000" : "#fff" },
              ]}
            >
              Salvar Alterações
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
  },
  defaultAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarButtons: {
    flexDirection: "row",
    gap: 10,
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  primaryButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10,
    gap: 10,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    flex: 1,
  },
});
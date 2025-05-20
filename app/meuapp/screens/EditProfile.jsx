//Falta ajeitar o mudar senha juntamente com o recuperar senha, espera o backend

import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../service/themeService";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { getUser, updateUser, uploadAvatar } from "../service/userService";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export default function EditProfile() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
    motivation: "",
    genres: [],
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (!token) {
          Alert.alert("Erro", "Sessão expirada. Faça login novamente.");
          navigation.navigate("Login");
          return;
        }

        const userData = await getUser(token);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          password: "",
          avatar: userData.avatar || "",
          motivation: userData.motivation || "",
          genres: userData.genres || [],
        });
        setAvatarPreview(userData.avatar);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados do perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || libraryStatus !== "granted") {
      Alert.alert("Permissão necessária", "Precisamos acessar sua câmera e galeria para alterar a foto.");
    }
  };

  const pickImage = async (source) => {
    try {
      let result;
      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        saveToPhotos: false // Don't save images to the gallery
      };

      result = source === "camera"
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets?.[0]?.uri) {
        await handleImageUpload(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      Alert.alert("Erro", "Não foi possível selecionar a imagem");
    }
  };

  const handleImageUpload = async (uri) => {
    try {
      setUploading(true);
      const token = await SecureStore.getItemAsync("token");
      if (!token) throw new Error("Token de autenticação não encontrado");

      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) throw new Error("Arquivo não encontrado");

      const newAvatarUrl = await uploadAvatar(uri, token);
      setAvatarPreview(newAvatarUrl);
      setFormData((prev) => ({ ...prev, avatar: newAvatarUrl }));
      Alert.alert("Sucesso", "Foto de perfil atualizada com sucesso!");
    } catch (error) {
      console.error("Erro no upload:", error);
      Alert.alert("Erro", error.message || "Falha ao atualizar a foto de perfil");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        Alert.alert("Erro", "Sessão expirada. Faça login novamente.");
        navigation.navigate("Login");
        return;
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        ...(formData.password && { password: formData.password }),
        motivation: formData.motivation,
        genres: formData.genres,
      };

      await updateUser(payload, token);
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      Alert.alert("Erro", error.response?.data?.message || "Não foi possível atualizar o perfil");
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={[
          theme.mode === "dark" ? "#0D0058" : "#f0f0f0",
          theme.mode === "dark" ? "#000000" : "#d0d0d0",
        ]}
        style={[styles.container, { justifyContent: "center" }]}
      >
        <ActivityIndicator
          size="large"
          color={theme.mode === "dark" ? "#fff" : "#000"}
        />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[
        theme.mode === "dark" ? "#0D0058" : "#f0f0f0",
        theme.mode === "dark" ? "#000000" : "#d0d0d0",
      ]}
      style={styles.container}
    >
      <View style={[styles.header, { backgroundColor: "transparent" }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: theme.text }]}>
          Editar Perfil
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.avatarContainer}>
          {avatarPreview &&
          typeof avatarPreview === "string" &&
          avatarPreview.startsWith("http") ? (
            <Image
              source={{ uri: avatarPreview }}
              style={styles.avatar}
              onError={() => {
                console.warn("Erro ao carregar imagem:", avatarPreview);
                setAvatarPreview(null);
              }}
            />
          ) : (
            <View
              style={[
                styles.defaultAvatar,
                { backgroundColor: theme.mode === "dark" ? "#333" : "#999" },
              ]}
            >
              <Ionicons name="person" size={60} color="#fff" />
            </View>
          )}

          {uploading && (
            <View style={styles.uploadOverlay}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
        </View>

        <View style={styles.avatarButtons}>
          <TouchableOpacity
            style={[
              styles.avatarButton,
              { backgroundColor: theme.text === "dark" ? "#000" : "black" },
            ]}
            onPress={() => pickImage("gallery")}
            disabled={uploading}
          >
            <Ionicons name="image" size={20} color="#fff" />
            <Text style={styles.avatarButtonText}>Galeria</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.avatarButton,
              { backgroundColor: theme.text === "dark" ? "#000" : "black" },
            ]}
            onPress={() => pickImage("camera")}
            disabled={uploading}
          >
            <Ionicons name="camera" size={20} color="#fff" />
            <Text style={styles.avatarButtonText}>Câmera</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={[
            styles.input,
            {
              color: theme.mode,
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
            },
          ]}
          placeholder="Nome"
          placeholderTextColor={theme.placeholder}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />

        <TextInput
          style={[
            styles.input,
            {
              color: theme.mode,
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
            },
          ]}
          placeholder="Email"
          placeholderTextColor={theme.placeholder}
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={[
            styles.input,
            {
              color: theme.mode,
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
            },
          ]}
          placeholder="Nova Senha (opcional)"
          placeholderTextColor={theme.placeholder}
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button]}
          onPress={() => navigation.navigate("ChangeMotivation")}
        >
          <Text style={[styles.buttonText, { color: theme.text }]}>
            Alterar Motivação e Gêneros
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, { color: theme.mode }]}
          onPress={handleUpdate}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator />
          ) : (
            <Text style={[styles.buttonText, { color: theme.text }]}>
              Salvar Alterações
            </Text>
          )}
        </TouchableOpacity>
      </View>
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
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  form: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#ccc",
  },
  defaultAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadOverlay: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  avatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    gap: 5,
  },
  avatarButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  input: {
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  saveButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});


import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import ImagePicker from "react-native-image-crop-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../service/themeService";
import { createCheckin } from "../service/checkinService";
import InputField from "../components/InputField";
import { AndroidPermissions } from "../util/AndroidPermissions";

export default function Publish() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedGroupName, setSelectedGroupName] = useState(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const { groupId, groupName } = route.params || {};
    if (groupId && groupName) {
      setSelectedGroupId(groupId);
      setSelectedGroupName(groupName);
      SecureStore.setItemAsync("selectedGroupId", groupId.toString());
      SecureStore.setItemAsync("selectedGroupName", groupName);
    } else {
      SecureStore.getItemAsync("selectedGroupId").then((id) =>
        setSelectedGroupId(id)
      );
      SecureStore.getItemAsync("selectedGroupName").then((name) =>
        setSelectedGroupName(name)
      );
    }
  }, [route.params]);

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

      setImage({
        uri: selectedImage.path,
        width: selectedImage.width,
        height: selectedImage.height,
        fileName: selectedImage.filename || `image_${Date.now()}.jpg`,
        type: selectedImage.mime || "image/jpeg",
      });

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      if (error.message?.includes("cancel")) {
        console.log("Usuário cancelou a seleção");
      }
    }
  };

  const handlePublish = async () => {
    if (!selectedGroupId) {
      Alert.alert("Atenção", "Por favor, selecione um grupo antes de publicar.");
      navigation.navigate("SelectGroup");
      return;
    }

    if (!title.trim()) {
      Alert.alert("Atenção", "Por favor, informe um título antes de publicar.");
      return;
    }

    try {
      setLoading(true);
      await createCheckin(selectedGroupId, title, description, image ? image.uri : null);
      
      navigation.navigate("AppDrawer", {
        screen: "Tabs",
        params: {
          screen: "Home",
          params: {
            selectedGroupId,
            selectedGroupName,
            refreshPosts: true,
          },
        },
      });

      setTitle("");
      setDescription("");
      setImage(null);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail === "Not authenticated") {
        await SecureStore.deleteItemAsync("token");
        Alert.alert("Sessão Expirada", "Faça login novamente.");
        navigation.navigate("Login");
      } else {
        Alert.alert("Erro", error.message || "Erro ao publicar.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.text === "#000" ? "dark-content" : "light-content"} />
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.header, { backgroundColor: theme.background }]}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              disabled={loading}
            >
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.headerText, { color: theme.text }]}>
              Nova Publicação {selectedGroupName ? `em ${selectedGroupName}` : ""}
            </Text>
          </View>

          <View style={styles.imageButtons}>
            <TouchableOpacity
              style={[styles.imageButton, { borderColor: theme.border }]}
              onPress={() => handleImage("camera")}
              disabled={loading}
            >
              <Ionicons name="camera" size={24} color={theme.text} />
              <Text style={[styles.imageButtonText, { color: theme.text }]}>
                Tirar Foto com a Câmera
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.imageButton, { borderColor: theme.border }]}
              onPress={() => handleImage("library")}
              disabled={loading}
            >
              <Ionicons name="image" size={24} color={theme.text} />
              <Text style={[styles.imageButtonText, { color: theme.text }]}>
                Selecionar Imagem da Biblioteca
              </Text>
            </TouchableOpacity>
          </View>

          {image && (
            <Image
              source={{ uri: image.uri }}
              style={styles.image}
              resizeMode="cover"
            />
          )}

          <InputField
            style={[
              styles.input,
              {
                backgroundColor: theme.inputBackground,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            label={"Título"}
            placeholder="Título"
            placeholderTextColor={theme.placeholder}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            editable={!loading}
          />

          <InputField
            style={[
              styles.input,
              styles.descriptionInput,
              {
                backgroundColor: theme.inputBackground,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            label={"Descrição"}
            placeholder="Descrição (opcional)"
            placeholderTextColor={theme.placeholder}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            editable={!loading}
          />

          <TouchableOpacity
            style={[
              styles.publishButton,
              {
                backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#003366",
                opacity: loading ? 0.6 : 1,
              },
            ]}
            onPress={handlePublish}
            disabled={loading || !selectedGroupId}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color={theme.mode === "dark" ? "#000" : "#fff"} />
            ) : (
              <Text style={[styles.publishButtonText, { color: theme.mode === "dark" ? "#000" : "#fff" }]}>
                Publicar no Grupo
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    zIndex: 1,
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 30,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  descriptionInput: {
    height: 120,
    paddingTop: 15,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  image: {
    width: 350,
    height: 350,
    borderRadius: 8,
    marginBottom: 15,
    alignSelf: "center",
  },
  imageButtons: {
    width: "100%",
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageButtonText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 5,
    flexShrink: 1,
  },
  publishButton: {
    width: "100%",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    elevation: 5,
  },
  publishButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useTheme } from "../service/themeService";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { createCheckin } from "../service/checkinService";
import * as SecureStore from "expo-secure-store";
import InputField from "../components/InputField";

export default function Publish() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  useEffect(() => {
    (async () => {
      const groupId = await SecureStore.getItemAsync("selectedGroupId");
      if (!groupId) {
        navigation.navigate("Groups", {
          isSelectingGroup: true,
          onSelectGroup: (groupId) => setSelectedGroupId(groupId),
        });
        return;
      }
      setSelectedGroupId(groupId);
    })();
  }, []);

  const handlePublish = async () => {
    if (!selectedGroupId) {
      navigation.navigate("Groups", {
        isSelectingGroup: true,
        onSelectGroup: (groupId) => setSelectedGroupId(groupId),
      });
      return;
    }

    if (!title.trim()) {
      navigation.navigate("Publish", {
        titleError: "Por favor, informe um título antes de publicar.",
      });
      return;
    }

    if (!image) {
      navigation.navigate("Publish", {
        imageError: "Por favor, selecione uma imagem antes de publicar.",
      });
      return;
    }

    try {
      setLoading(true);
      await createCheckin(selectedGroupId, title, description, image.uri);
      navigation.navigate("AppDrawer", {
        refresh: true,
        selectedGroupId: selectedGroupId,
      });
      setTitle("");
      setDescription("");
      setImage(null);
    } catch (error) {
      navigation.navigate("Publish", {
        error: error.message || "Não foi possível publicar o check-in.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImage = async (type) => {
    try {
      const { status } =
        type === "camera"
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        navigation.navigate("Publish", {
          permissionError: "Precisamos acessar sua câmera para tirar uma foto.",
        });
        return;
      }

      const result =
        type === "camera"
          ? await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

      if (!result.canceled) {
        setImage({
          uri: result.assets[0].uri,
          name: result.assets[0].uri.split("/").pop(),
          type: "image/jpeg",
        });
      }
    } catch {
      navigation.navigate("Publish", {
        error: "Não foi possível selecionar/tirar uma foto.",
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContainer, { paddingBottom: 40 }]}
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
                Nova Publicação
              </Text>
            </View>

            <View
              style={[
                styles.imageButtons,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
              ]}
            >
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
              <Image source={{ uri: image.uri }} style={styles.image} resizeMode="cover" />
            )}

            <InputField
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBackground,
                  color: theme.mode,
                  borderColor: theme.border,
                },
              ]}
              label={"Titulo"}
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
                  color: theme.mode,
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
                  backgroundColor: "#DFBA69",
                  opacity: loading ? 0.6 : 1,
                },
              ]}
              onPress={handlePublish}
              disabled={loading || !selectedGroupId}
            >
              {loading ? (
                <ActivityIndicator color={theme.buttonText} />
              ) : (
                <Text style={[styles.publishButtonText, { color: theme.text }]}>
                  Publicar no Grupo
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    right: "5%",
    fontSize: 20,
    fontWeight: "bold",
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
  },
  image: {
    width: "100%",
    height: 280,
    borderRadius: 8,
    marginBottom: 15,
  },
  imageButtons: {
    width: "100%",
    marginBottom: 15,
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
  },
  publishButton: {
    width: "100%",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  publishButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

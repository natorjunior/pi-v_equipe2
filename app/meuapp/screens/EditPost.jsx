import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import ImagePicker from "react-native-image-crop-picker";
import { useTheme } from "../service/themeService";
import { updateCheckin, deleteCheckin } from "../service/checkinService";
import InputField from "../components/InputField";
import { AndroidPermissions } from "../util/AndroidPermissions";

export default function EditPost() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { checkin } = route.params;
  const scrollViewRef = useRef(null);

  const [title, setTitle] = useState(checkin.title || "");
  const [description, setDescription] = useState(checkin.description || "");
  const [image, setImage] = useState(checkin.photo ? { uri: checkin.photo } : null);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleImage = async (type) => {
    try {
      const hasAllPermissions = await AndroidPermissions();
      if (!hasAllPermissions) {
        Alert.alert(
          "Permissões negadas",
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
      } else {
        console.error("Erro ao selecionar ou recortar imagem:", error);
        Alert.alert("Erro", "Ocorreu um erro ao processar a imagem");
      }
    }
  };

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert("Erro", "Por favor, informe um título antes de salvar.");
      return;
    }

    try {
      setLoading(true);
      await updateCheckin(checkin.id, title, description, image?.uri);
      navigation.goBack();
      navigation.navigate("AppDrawer", { refresh: true });
    } catch (error) {
      console.error("Update error:", error);
      if (error.response?.status === 401 && error.response?.data?.message === "propriedade de outro usuario") {
        Alert.alert("Erro", "Você não tem permissão para editar essa publicação.");
      } else {
        Alert.alert("Erro", error.message || "Não foi possível atualizar a publicação.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta publicação?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteCheckin(checkin.id);
              navigation.goBack();
              navigation.navigate("AppDrawer", { refresh: true });
            } catch (error) {
              console.error("Delete error:", error);
              Alert.alert("Erro", error.message || "Não foi possível excluir a publicação.");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
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
              disabled={loading || isDeleting}
            >
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.headerText, { color: theme.text }]}>
              Editar Publicação
            </Text>
          </View>

          <View style={styles.imageButtons}>
            <TouchableOpacity
              style={[styles.imageButton, { borderColor: theme.border }]}
              onPress={() => handleImage("camera")}
              disabled={loading || isDeleting}
            >
              <Ionicons name="camera" size={24} color={theme.text} />
              <Text style={[styles.imageButtonText, { color: theme.text }]}>
                Tirar Foto com a Câmera
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.imageButton, { borderColor: theme.border }]}
              onPress={() => handleImage("library")}
              disabled={loading || isDeleting}
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
            editable={!loading && !isDeleting}
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
            editable={!loading && !isDeleting}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.saveButton,
                {
                  backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#003366",
                  opacity: loading || isDeleting ? 0.6 : 1,
                },
              ]}
              onPress={handleUpdate}
              disabled={loading || isDeleting}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator color={theme.mode === "dark" ? "#000" : "#fff"} />
              ) : (
                <Text style={[styles.buttonText, { color: theme.mode === "dark" ? "#000" : "#fff" }]}>
                  Salvar Alterações
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.deleteButton,
                {
                  backgroundColor: theme.danger || "#FF0000",
                  opacity: loading || isDeleting ? 0.6 : 1,
                },
              ]}
              onPress={handleDelete}
              disabled={loading || isDeleting}
              activeOpacity={0.7}
            >
              {isDeleting ? (
                <ActivityIndicator color={theme.mode === "dark" ? "#000" : "#fff"} />
              ) : (
                <Text style={[styles.buttonText, { color: theme.mode === "dark" ? "#000" : "#fff" }]}>
                  Excluir Publicação
                </Text>
              )}
            </TouchableOpacity>
          </View>
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
    flexWrap: "wrap",
  },
  imageButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 140,
  },
  imageButtonText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 5,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 30,
  },
  saveButton: {
    flex: 1,
    marginRight: 10,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  deleteButton: {
    flex: 1,
    marginLeft: 10,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
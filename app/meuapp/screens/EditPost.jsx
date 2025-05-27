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
    SafeAreaView,
    Alert,
    PermissionsAndroid
} from "react-native";
import { useTheme } from "../service/themeService";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { updateCheckin, deleteCheckin } from "../service/checkinService";
import InputField from "../components/InputField";

    export default function EditPost() {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const { checkin } = route.params;
    
    const [title, setTitle] = useState(checkin.title || "");
    const [description, setDescription] = useState(checkin.description || "");
    const [image, setImage] = useState(checkin.photo ? { uri: checkin.photo } : null);
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                title: "Permissão da Câmera",
                message: "O app precisa de acesso à sua câmera",
                buttonNeutral: "Perguntar depois",
                buttonNegative: "Cancelar",
                buttonPositive: "OK",
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
            console.warn(err);
            return false;
            }
    };

    const requestStoragePermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                title: "Permissão de Armazenamento",
                message: "O app precisa acessar seus arquivos",
                buttonNeutral: "Perguntar depois",
                buttonNegative: "Cancelar",
                buttonPositive: "OK",
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
        console.warn(err);
        return false;
    }
    };

    const handleImage = async (type) => {
        try {
        setLoading(true);
        
        // Verificar permissões
        if (type === "camera") {
            const hasPermission = await requestCameraPermission();
            if (!hasPermission) {
            Alert.alert("Permissão negada", "Não é possível acessar a câmera sem permissão");
            return;
            }
        } else {
            const hasPermission = await requestStoragePermission();
            if (!hasPermission) {
            Alert.alert("Permissão negada", "Não é possível acessar a galeria sem permissão");
            return;
            }
        }

        const options = {
            mediaType: "photo",
            quality: 0.8,
            maxWidth: 1024,
            maxHeight: 1024,
            includeBase64: false,
        };

        let result;
        if (type === "camera") {
            result = await launchCamera(options);
        } else {
            result = await launchImageLibrary(options);
        }

        if (result.didCancel) {
            console.log("Usuário cancelou a seleção");
        } else if (result.errorCode) {
            console.log("ImagePicker Error: ", result.errorMessage);
            Alert.alert("Erro", "Não foi possível acessar a imagem");
        } else if (result.assets && result.assets.length > 0) {
            const selectedImage = result.assets[0];
            
            setImage({
            uri: selectedImage.uri,
            width: selectedImage.width,
            height: selectedImage.height,
            fileName: selectedImage.fileName || `image_${Date.now()}.jpg`,
            type: selectedImage.type || "image/jpeg",
            });
        }
        } catch (error) {
        console.error("Erro ao selecionar imagem:", error);
        Alert.alert("Erro", "Ocorreu um erro ao processar a imagem");
        } finally {
        setLoading(false);
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
                    backgroundColor: "#DFBA69",
                    opacity: loading || isDeleting ? 0.6 : 1,
                  },
                ]}
                onPress={handleUpdate}
                disabled={loading || isDeleting}
              >
                {loading ? (
                  <ActivityIndicator color={theme.buttonText} />
                ) : (
                  <Text style={[styles.buttonText, { color: theme.text }]}>
                    Salvar Alterações
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.deleteButton,
                  {
                    backgroundColor: theme.danger,
                    opacity: loading || isDeleting ? 0.6 : 1,
                  },
                ]}
                onPress={handleDelete}
                disabled={loading || isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator color={theme.buttonText} />
                ) : (
                  <Text style={[styles.buttonText, { color: theme.text }]}>
                    Excluir Publicação
                  </Text>
                )}
              </TouchableOpacity>
            </View>
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
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    marginRight: 10,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    flex: 1,
    marginLeft: 10,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
});
import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator
} from "react-native";
import { useTheme } from "../service/themeService";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { createCheckin } from "../service/checkinService";
import * as SecureStore from "expo-secure-store";

export default function Publish() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const fetchGroupId = useCallback(async () => {
    const groupId = await SecureStore.getItemAsync("selectedGroupId");
    if (groupId) {
      setSelectedGroupId(groupId);
    }
  }, []);

  useEffect(() => {
    fetchGroupId();
  }, [fetchGroupId]);

  const handlePublish = async () => {
    if (!selectedGroupId) {
      Alert.alert("Aviso", "Selecione um grupo para publicar", [
        { 
          text: "OK", 
          onPress: () => navigation.navigate("Groups", { 
            isSelectingGroup: true,
            onSelectGroup: (groupId) => setSelectedGroupId(groupId) 
          }) 
        }
      ]);
      return;
    }

    if (!title.trim()) {
      Alert.alert("Aviso", "Por favor, informe um título antes de publicar.");
      return;
    }

    if (!image) {
      Alert.alert("Aviso", "Por favor, selecione uma imagem antes de publicar.");
      return;
    }

    try {
      setLoading(true);
      
      await createCheckin(selectedGroupId, title, description, image.uri);
      
      Alert.alert("Sucesso!", "publicado com sucesso!", [
        { 
          text: "OK", 
          onPress: () => navigation.navigate("Home", { 
            refresh: true,
            selectedGroupId: selectedGroupId 
          }) 
        }
      ]);
      
      setTitle("");
      setDescription("");
      setImage(null);
    } catch (error) {
      console.error("Erro ao publicar:", error);
      Alert.alert("Erro", error.message || "Não foi possível publicar o check-in.");
    } finally {
      setLoading(false);
    }
  };

  const handleImage = async (type) => {
    try {
      const { status } = type === "camera" ?
        await ImagePicker.requestCameraPermissionsAsync() :
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert("Permissão necessária", "Precisamos acessar sua câmera para tirar uma foto.");
        return;
      }

      const result = type === "camera" ?
        await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        }) :
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });

      if (!result.canceled) {
        setImage({
          uri: result.assets[0].uri,
          name: result.assets[0].uri.split('/').pop(),
          type: 'image/jpeg'
        });
      }
    } catch (error) {
      console.error("Erro ao selecionar/tirar foto:", error);
      Alert.alert("Erro", "Não foi possível selecionar/tirar uma foto.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.background }]}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
            disabled={loading}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: theme.text }]}>Nova Publicação</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>

          <View style={[styles.imageButtons, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>
            <TouchableOpacity 
              style={[styles.imageButton, { borderColor: theme.mode === "dark" ? "#000" : "#fff" }]}
              onPress={() => handleImage("camera")}
              disabled={loading}
            >
              <Ionicons name="camera" size={24} color={theme.text} />
              <Text style={[styles.imageButtonText, { color: theme.text }]}>
                Tirar Foto com a Câmera
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.imageButton, { borderColor: theme.primary }]}
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

          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.inputBackground, 
              color: theme.mode === "dark" ? "#000" : "#fff",
              borderColor: theme.border 
            }]}
            placeholder="Título (obrigatório)"
            placeholderTextColor={theme.placeholder}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            editable={!loading}
          />

          <TextInput
            style={[styles.input, styles.descriptionInput, { 
              backgroundColor: theme.inputBackground, 
              color: theme.mode === "dark" ? "#000" : "#fff",
              borderColor: theme.border 
            }]}
            placeholder="Descrição (opcional)"
            placeholderTextColor={theme.placeholder}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            editable={!loading}
          />
          {/* se o usuario não estiver em um grupo, a publicação vai para o ultimo grupo da lista */}
          <TouchableOpacity
            style={[styles.publishButton, { 
              backgroundColor: "#DFBA69", // douradinho
              opacity: loading ? 0.6 : 1
            }]}
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  scrollContainer: {
    padding: 20,
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
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  imageButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageButton: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageButtonText: {
    fontSize: 16,
    fontWeight: "500",
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


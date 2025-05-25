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
    } from "react-native";
    import { useTheme } from "../service/themeService";
    import { useNavigation, useRoute } from "@react-navigation/native";
    import { Ionicons } from "@expo/vector-icons";
    import * as ImagePicker from "expo-image-picker";
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

    useEffect(() => {
        const fetchUserData = async () => {
        try {
            const userData = await getUser(checkin.userId);
            setFormData({
            name: userData.name || "",
            email: userData.email || "",
            avatar: userData.avatar || "",
            motivation: userData.motivation || "",
            genres: userData.genres || [],
            });
            setAvatarPreview(userData.avatar);
        } catch (error) {
            Alert.alert("Erro", "Falha ao carregar dados do usuário");
        } finally {
            setLoading(false);
        }
        };

        fetchUserData();
        requestPermissions();
    }, []);

    const requestPermissions = async () => {
        await ImagePicker.requestCameraPermissionsAsync();
        await ImagePicker.requestMediaLibraryPermissionsAsync();
    };

    const handleImage = async (type) => {
        try {
        const { status } =
            type === "camera"
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Permissão necessária", "Precisamos acessar sua câmera para tirar uma foto.");
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
        Alert.alert("Erro", "Não foi possível selecionar/tirar uma foto.");
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
        Alert.alert("Erro", error.message || "Não foi possível atualizar a publicação.");
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
                    Tirar Nova Foto
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.imageButton, { borderColor: theme.border }]}
                    onPress={() => handleImage("library")}
                    disabled={loading || isDeleting}
                >
                    <Ionicons name="image" size={24} color={theme.text} />
                    <Text style={[styles.imageButtonText, { color: theme.text }]}>
                    Selecionar Nova Imagem
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
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 15,
    },
    });

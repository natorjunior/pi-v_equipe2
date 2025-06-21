import { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
import { useTheme } from "../service/themeService";
import { Ionicons } from "@expo/vector-icons";
import { getUser, updateUser } from "../service/userService";
import { useNavigation } from "@react-navigation/native";

export default function ChangeGenres() {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [motivation, setMotivation] = useState("");
    const [selectedGenres, setSelectedGenres] = useState({});

    useEffect(() => {
        const fetchMotivation = async () => {
            try {
                const user = await getUser();
                setMotivation(user.motivation || "");
                if (Array.isArray(user.genres)) {
                    const initialGenres = {};
                    user.genres.forEach((g) => {
                        initialGenres[g] = true;
                    });
                    setSelectedGenres(initialGenres);
                }
            } catch (error) {
            }
        };
        fetchMotivation();
    }, []);

    const toggleGenre = (genre) => {
        setSelectedGenres((prev) => ({
            ...prev,
            [genre]: !prev[genre],
        }));
    };

    const handleUpdate = async () => {
        try {
            const selectedArray = Object.entries(selectedGenres)
                .filter(([_, isSelected]) => isSelected)
                .map(([genre]) => genre);

            await updateUser({ genres: selectedArray });
            navigation.navigate("AppDrawer", { refresh: true });
        } catch (error) {
        }
    };

    const literaryGenres = [
        "Fantasia",
        "Ficção científica",
        "Romance",
        "Horror",
        "Comédia",
        "Drama",
        "Suspense",
        "Documentário",
        "Infantil",
        "Biografia",
        "Literatura",
        "Poesia",
        "Autobiografia",
        "Aventura",
        "Distopia",
        "Mistério",
        "Chick-lit",
        "Gótico",
        "Histórico",
        "Realismo mágico",
        "Contos"
    ];

    const academicGenres = [
        "Matematica",
        "História",
        "Geografia",
        "Biologia",
        "Fisica",
        "Química",
        "Filosofia",
        "Sociologia",
        "Psicologia",
        "Economia",
        "Medicina",
        "Engenharia",
        "Arquitetura",
        "Computação",
        "Tecnologia",
        "Direito",
        "Política"
    ];

    let genresToShow = [];
    if (motivation === "Procurar livros") {
        genresToShow = literaryGenres;
    } else if (motivation === "Focar nos estudos") {
        genresToShow = academicGenres;
    } else {
        genresToShow = [...literaryGenres, ...academicGenres];
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={theme.mode === "dark" ? "#fff" : "#000"}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.headerText, { color: theme.text }]}>
                        Alterar Gêneros
                    </Text>
                </View>
                <ScrollView
                    contentContainerStyle={[styles.scrollContainer, { alignItems: "center" }]}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={[styles.text, { color: theme.text }]}>
                        Selecione seus gêneros literários ou acadêmicos favoritos{"\n"}
                        (essa opção aparecerá no seu perfil):
                    </Text>
                    {genresToShow.map((genre, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.button,
                                {
                                    backgroundColor: selectedGenres[genre]
                                        ? (theme.mode === "dark" ? "#1E90FF" : "#ADD8E6")
                                        : (theme.mode === "dark" ? "#0D0058" : "#fff"),
                                },
                            ]}
                            onPress={() => toggleGenre(genre)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.buttonContent}>
                                <Ionicons
                                    name={selectedGenres[genre] ? "checkbox" : "square-outline"}
                                    size={24}
                                    color={theme.text}
                                />
                                <Text
                                    style={[
                                        styles.buttonText,
                                        { color: theme.mode === "dark" ? "#fff" : "#000" },
                                    ]}
                                >
                                    {genre}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <TouchableOpacity
                    style={[styles.nextButton, { backgroundColor: theme.mode === "dark" ? "#fff" : "#0D0058" }]}
                    onPress={handleUpdate}
                    activeOpacity={0.7}
                >
                    <Text
                        style={[
                            styles.nextButtonText,
                            { color: theme.mode === "dark" ? "#000" : "#fff" },
                        ]}
                    >
                        Continuar
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        width: "100%",
    },
    backButton: {
        padding: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
        right: 21,
    },
    text: {
        marginTop: 50,
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    scrollContainer: {
        paddingTop: 1,
        paddingBottom: 1,
    },
    button: {
        width: 360,
        height: 110,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        marginHorizontal: 10,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        paddingHorizontal: 20,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        flex: 1,
        marginLeft: 20,
    },
    nextButton: {
        width: "90%",
        marginBottom: 20,
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        marginHorizontal: 10,
    },
    nextButtonText: {
        fontSize: 18,
        fontWeight: "bold",
    },
});
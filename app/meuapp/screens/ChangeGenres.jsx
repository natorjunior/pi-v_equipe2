import { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Alert,
} from "react-native";
import { useTheme } from "../service/themeService";
import { Checkbox } from "expo-checkbox";
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
                Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
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
            Alert.alert("Sucesso", "Gêneros atualizados!");
            navigation.navigate("AppDrawer", { refresh: true });
        } catch (error) {
            Alert.alert("Erro", error.message || "Não foi possível atualizar os gêneros");
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
        "Teatro",
        "Ensaio",
        "Autobiografia"
    ];

    const academicGenres = [
        "Matematica",
        "História",
        "Geografia",
        "Biológia",
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
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={[styles.text, { color: theme.text }]}>
                        Selecione seus gêneros favoritos:
                    </Text>
                    {genresToShow.map((genre, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.button,
                                { backgroundColor: theme.mode === "dark" ? "#0D0058" : "#fff" },
                            ]}
                            onPress={() => toggleGenre(genre)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.buttonContent}>
                                <Checkbox
                                    value={selectedGenres[genre] || false}
                                    onValueChange={() => toggleGenre(genre)}
                                    color={theme.mode === "dark" ? "#fff" : "#000"}
                                />
                                <Text style={[styles.buttonText, { color: theme.mode === "dark" ? "#fff" : "#000" }]}>
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
                    <Text style={[styles.nextButtonText, { color: theme.mode === "dark" ? "#000" : "#fff" }]}>
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

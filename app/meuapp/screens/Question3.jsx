import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { useTheme } from "../service/themeService";
import { Ionicons } from "@expo/vector-icons";

export default function Question3({ navigation, route }) {
    const { theme } = useTheme();
    const [selectedGenres, setSelectedGenres] = useState({});
    const { motivation } = route.params;

    const toggleGenre = (genre) => {
        setSelectedGenres((prev) => ({
            ...prev,
            [genre]: !prev[genre],
        }));
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
                <ScrollView
                    contentContainerStyle={[styles.scrollContainer, { alignItems: "center" }]}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={[styles.text, { color: theme.text }]}>Selecione seus gêneros literários ou acadêmicos favoritos{"\n"} (essa opção aparecerá no seu perfil):</Text>
                    {genresToShow.map((genre, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.button,
                                { backgroundColor: selectedGenres[genre] ? (theme.mode === "dark" ? "#1E90FF" : "#ADD8E6") : (theme.mode === "dark" ? "#0D0058" : "#fff") }
                            ]}
                            onPress={() => toggleGenre(genre)}
                        >
                            <View style={styles.buttonContent}>
                                <Ionicons
                                    name={selectedGenres[genre] ? "checkbox" : "square-outline"}
                                    size={24}
                                    color={theme.text}
                                />
                                <Text style={[styles.buttonText, { color: theme.mode === "dark" ? "#fff" : "#000" }]}>{genre}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <TouchableOpacity
                    style={[styles.nextButton, { backgroundColor: theme.mode === "dark" ? "#fff" : "#0D0058" }]}
                    onPress={() => navigation.navigate("Question4", { ...route.params, selectedGenres: selectedGenres })}
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


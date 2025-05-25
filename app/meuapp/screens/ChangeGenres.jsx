//Buga

import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { useTheme } from "../service/themeService";
import { Checkbox } from "expo-checkbox";


export default function ChangeGenres({ navigation, route }) {
    const { theme } = useTheme();
    const [selectedGenres, setSelectedGenres] = useState({});

    const toggleGenre = (genre) => {
        setSelectedGenres((prev) => ({
            ...prev,
            [genre]: !prev[genre],
        }));
    };

    const genres = [
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
        "Autobiografia",
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
        "Política",
    ];

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={[styles.text, { color: theme.text }]}>Selecione seus gêneros favoritos:</Text>
                    <View style={styles.genresContainer}>
                        {genres.map((genre, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.button,
                                    { backgroundColor: theme.mode === "dark" ? "#0D0058" : "#fff" },
                                ]}
                                onPress={() => toggleGenre(genre)}
                            >
                                <View style={styles.buttonContent}>
                                    <Checkbox
                                        value={selectedGenres[genre] || false}
                                        onValueChange={() => toggleGenre(genre)}
                                        color={theme === "dark" ? "#fff" : "#0D0058"}
                                    />
                                    <Text style={[styles.buttonText, { color: theme.mode === "dark" ? "#fff" : "#000" }]}>
                                        {genre}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                <TouchableOpacity
                    style={[styles.nextButton, { backgroundColor: theme.mode === "dark" ? "#fff" : "#0D0058" }]}
                    onPress={() => {
                    const selectedGenresArray = Object.keys(selectedGenres).filter(genre => selectedGenres[genre]);
                    navigation.navigate("EditProfile", { 
                        genres: selectedGenresArray,
                        motivation: route.params.motivation 
                    });
                    }}
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
    genresContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    button: {
        width: 160,
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

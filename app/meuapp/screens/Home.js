import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import Background from "../components/Background";
import { useTheme } from "../service/ThemeContext";
import Hamburger from "../components/Top";
import NavBar from "../components/Navbar";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
    const theme = useTheme();
    const navigation = useNavigation();

    return (
        <Background>
            <Hamburger style={styles.Hamburger} />
            <ScrollView style={styles.timeline}>
                {[...Array(10)].map((_, index) => (
                    <View key={index} style={styles.post}>
                        <Image source={{ uri: "https://via.placeholder.com/300" }} style={styles.image} />
                        <Text style={[styles.text, { color: theme.text }]}>Postagem de demonstração {index + 1}</Text>
                    </View>
                ))}
            </ScrollView>
            <NavBar />
        </Background>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    Hamburger: {
        position: "absolute",
        top: 20,
        left: 10,
        zIndex: 1000,
    },
    timeline: {
        marginTop: 90,
        flex: 1,
        width: "100%",
    },
    post: {
        marginTop: 25,
        backgroundColor: "#fff",
        margin: 10,
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: 300,
        height: 150,
        borderRadius: 10,
    },
    text: {
        marginTop: 10,
        fontSize: 16,
    },
});
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Linking, SafeAreaView } from "react-native";
import { useTheme } from "../service/themeService";
import { Ionicons } from "@expo/vector-icons";

const team = [
    {
        name: "Ana Valéria Rodrigues",
        role: "Desenvolvedora Full-Stack",
        image: require("../assets/fotovaleria.jpg"),
        github: "https://github.com/BomDiaSol",
    },
    {
        name: "Carlos Eduardo Cardoso",
        role: "Gerente do Produto",
        image: require("../assets/fotocadu.jpg"),
        github: "https://github.com/EduCode98",
    },
    {
        name: "Jorge Lucas Rodrigues Martins",
        role: "Desenvolvedor Back-end",
        image: require("../assets/fotojorge.jpg"),
        github: "https://github.com/jorgelucas-rm",
    },
    {
        name: "Rafael Regis Cavalcante Ramos Costa",
        role: "Desenvolvedor Front-end",
        image: require("../assets/fotoregis.jpg"),
        github: "https://github.com/Regis-Rafael",
    },
];

export default function AboutUs({ navigation }) {
    const { theme } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.container, { backgroundColor: theme.background }]}> 
            <View style={[styles.header, { backgroundColor: theme.background }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.mode === "dark" ? "#fff" : "#000"} />
                </TouchableOpacity>
                <Text style={[styles.headerText, { color: theme.text }]}>Desenvolvedores</Text>
            </View>
            <FlatList
                ListHeaderComponent={() => (
                    <>
                        <Text style={[styles.title, { color: theme.text }]}>Sobre Nós</Text>
                        <Text style={[styles.subtitle, { color: theme.text }]}>A SAL é um software de estudos e agrupamento, desenvolvido em um trabalho universitário.
                            O software tem como objetivo ajudar estudantes e amantes de aprendizado a se conectar, compartilhar suas experiências e construir amizades.
                        </Text>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Conheça nossa equipe</Text>
                    </>
                )}
                data={team}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.card, { backgroundColor: theme.mode === "dark" ? "#0D0058" : "#fff" }]}> 
                        <Image source={item.image} style={styles.image} />
                        <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
                        <Text style={[styles.role, { color: theme.text === "#fff" ? "#fff" : "#000" }]}>{item.role}</Text>
                        <TouchableOpacity style={[styles.button, { backgroundColor: theme.mode === "dark" ? "#0D0058" : "#fff" }]}
                            onPress={() => Linking.openURL(item.github)}>
                            <Text style={[styles.buttonText,{ color: theme.mode === "dark" ? "#fff" : "#000"}]}>Acessar GitHub</Text>
                        </TouchableOpacity>
                    </View>
                )}
                contentContainerStyle={styles.teamContainer}
            />
        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 26,
        textAlign: "center",
        fontWeight: "bold",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        marginHorizontal: 20,
        marginBottom: 20,
        lineHeight: 22,
    },
    sectionTitle: {
        textAlign: "center",
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
    },
    teamContainer: {
        alignItems: "center",
        paddingBottom: 40,
    },
    card: {
        width: 350,
        alignItems: "center",
        padding: 20,
        marginVertical: 10,
        borderRadius: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    role: {
        fontSize: 14,
        marginBottom: 10,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
    footerText: {
        fontSize: 14,
        textAlign: "center",
        marginTop: 20,
        marginHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
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
    
});


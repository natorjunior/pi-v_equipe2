import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { useTheme } from "../service/themeService";
import { Ionicons } from "@expo/vector-icons";

export default function InfoPage({ navigation }) {
    const { theme } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.headerText, { color: theme.text }]}>Boas-Vindas</Text>
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer}>
            <Text style={[styles.title, { color: theme.text }]}>
                👋 Bem-vindo ao Stay and Learn!
            </Text>

            <Text style={[styles.subtitle, { color: theme.text }]}>
                Aqui você poderá se conectar com outros estudantes, registrar seus avanços e colaborar com grupos de estudo de maneira simples e prática.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>📚 O que é o Stay and Learn?</Text>
            <Text style={[styles.paragraph, { color: theme.text }]}>
                Stay and Learn é uma plataforma desenvolvida como parte de um projeto universitário. Nosso objetivo é criar um espaço para motivação, compartilhamento e progresso no aprendizado em grupo.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>🚀 Recursos principais</Text>
            <Text style={[styles.paragraph, { color: theme.text }]}>
                ✅ Criação e entrada em grupos{'\n'}
                ✅ Publicações sobre o assunto{'\n'}
                ✅ Ranking por grupo{'\n'}
                ✅ Perfil com gêneros literarios e motivações{'\n'}
                ✅ Interface adaptada para tema claro e escuro
            </Text>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#003366"}]}
                onPress={() => navigation.navigate("AppDrawer")}
            >
                <Text style={styles.buttonText}>Começar agora</Text>
            </TouchableOpacity>

            <Text style={[styles.footerText, { color: theme.text }]}>
                Estamos felizes em ter você conosco. Vamos aprender juntos!
            </Text>
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
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginRight: 24,
  },
  contentContainer: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  paragraph: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    marginTop: 30,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 30,
    marginHorizontal: 20,
    lineHeight: 20,
  },
});

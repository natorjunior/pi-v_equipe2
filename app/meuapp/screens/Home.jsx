import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useTheme } from "../service/themeService";
import { useNavigation } from "@react-navigation/native";
import Hamburger from "../components/Top";
import NavBar from "../components/Navbar";

export default function Home() {
    const { theme } = useTheme();
    const navigation = useNavigation();

    return (
        <View style={[styles.container, { backgroundColor: theme.mode === "dark" ? "#050024" : "#fff" }]}>
            <View style={styles.header}>
                <Hamburger navigation={navigation} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {[...Array(10)].map((_, index) => (
                    <View
                        key={index}
                        style={[styles.post, { backgroundColor: theme.mode === "dark" ? "#333" : "#fff" }]}
                    >
                        <Image source={{ uri: "https://via.placeholder.com/300" }} style={styles.image} />
                    </View>
                ))}
            </ScrollView>

            <NavBar navigation={navigation} />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingTop: 20,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    scrollContainer: {
        paddingTop: 80,
        paddingBottom: 80,
        alignItems: "center",
    },
    post: {
        width: "90%",
        marginBottom: 20,
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
        width: "100%",
        height: 180,
        borderRadius: 10,
    },
    text: {
        marginTop: 10,
        fontSize: 16,
        textAlign: "center",
    },
});

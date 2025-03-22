import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "../service/ThemeContext";
import { Image } from "expo-image";

const NavBar = ({ navigation }) => {
    const theme = useTheme();
    const image1 = require("../assets/gmail_groups.png");
    const image2 = require("../assets/add_circle.png");
    const image3 = require("../assets/Tabs.png");

    return (
        <View style={[styles.navbar, { backgroundColor: theme.mode === "dark" ? "#0D0058" : "#fff" }]}>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Tela1")}>
                <Image source={image1} contentFit="contain" style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Tela2")}>
                <Image source={image2} contentFit="contain" style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Tela3")}>
                <Image source={image3} contentFit="contain" style={styles.image} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    navButton: {
        padding: 20,
    },
    image: {
        width: 25,
        height: 25,
    },
});

export default NavBar;

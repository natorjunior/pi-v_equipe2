import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "../service/themeService";
import { Image } from "expo-image";
import Group from "./GroupIcon";
import Avatar from "./DefaultAvatar";

const NavBar = ({ navigation }) => {
    const { theme } = useTheme();
    const image2 = require("../assets/add_circle.png");

    return (
        <View style={[styles.navbar, { 
            backgroundColor: theme.mode === "dark" ? "#0D0058" : "#f0f0f0",
            borderColor: theme.mode === "dark" ? "#000" : "#ccc" }]}>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Groups")}>
                <Group />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Publish")}>
                <Image source={image2} contentFit="contain" style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Profile")}>
                <Avatar />
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
        borderWidth: 1,
    },
    navButton: {
        padding: 20,
    },
    image: {
        width: 30,
        height: 35,
    },
});

export default NavBar;

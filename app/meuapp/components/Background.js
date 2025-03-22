import { View, StyleSheet } from "react-native";
import React from "react";
import { useTheme } from "../service/ThemeContext";

export default function Background({ children }) {
    const theme = useTheme();

    return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
        {children}
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    },
});
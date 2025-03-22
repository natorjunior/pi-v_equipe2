import Checkbox from "expo-checkbox";
import React, { createContext, useContext } from "react";
import { useColorScheme } from "react-native";

// Definição dos temas
const lightTheme = {
    mode: "light",
    background: "#f0f0f0",
    text: "#000",
    inputText: "#000",
    inputBackground: "#gray",
    border: "#ccc",
    placeholder: "#888",
    checkbox: "#fff",
};

    const darkTheme = {
        mode: "dark",
        background: "#050024",
        text: "#fff",
        inputText: "#000",
        inputBackground: "#fff",
        border: "#666",
        placeholder: "#bbb",
        checkbox: "#fff",
    };
    

const ThemeContext = createContext(lightTheme);

export function ThemeProvider({ children }) {
    const colorScheme = "dark"; //useColorScheme();
    const theme = colorScheme === "dark" ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}

import React from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { useTheme } from "../service/ThemeContext";

const logolight = require("../assets/logolight.png");
const logodark = require("../assets/logodark.png");

export default function Logo() {
  const theme = useTheme();

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Image
        source={theme.mode === "dark" ? logodark : logolight}
        style={{ width: 400, height: 150, resizeMode: "contain" }}
      />
    </View>
  );
}

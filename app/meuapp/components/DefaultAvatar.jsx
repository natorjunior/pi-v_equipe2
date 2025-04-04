import React from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { useTheme } from "../service/themeService";

const Light = require("../assets/user_light.png");
const Dark = require("../assets/user_dark.png");

export default function Avatar() {
  const { theme } = useTheme();

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Image
        source={theme.mode === "dark" ? Dark : Light}
        style={{ width: 30, height: 30, resizeMode: "contain" }}
      />
    </View>
  );
}

import React from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { useTheme } from "../service/themeService";

const Dark = require("../assets/groups_dark.png");
const Light = require("../assets/groups_light.png");

export default function Group() {
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

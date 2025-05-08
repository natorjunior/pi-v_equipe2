import React from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { useTheme } from "../service/themeService";

const Light = require("../assets/notification_light.png");
const Dark = require("../assets/notification_dark.png");

export default function Bell() {
  const { theme } = useTheme();

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Image
        source={theme.mode === "dark" ? Dark : Light}
        style={{ width: 40, height: 50, resizeMode: "contain" }}
      />
    </View>
  );
}

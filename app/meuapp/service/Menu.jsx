import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useTheme } from "./themeService";

export default function Menu({ navigation }) {
  const { theme } = useTheme();
  return (
      <View style={[styles.container, { backgroundColor: theme.background , color: theme.text === "dark" ? "#fff" : "#000"}]}>
        <Text style={styles.title}>Telas</Text>
        <Button title="Login" onPress={() => navigation.navigate("Login")} />
        <Button title="Home" onPress={() => navigation.navigate("Home")} />
        <Button title="Entrada" onPress={() => navigation.navigate("Entrada")} />
        <Button title="Question1" onPress={() => navigation.navigate("Question1")} />
        <Button title="Question2" onPress={() => navigation.navigate("Question2")} />
        <Button title="Question3" onPress={() => navigation.navigate("Question3")} />
        <Button title="Question4" onPress={() => navigation.navigate("Question4")} />
        <Button title="Config" onPress={() => navigation.navigate("Config")} />
        <Button title="Notifications" onPress={() => navigation.navigate("Notifications")} />
        <Button title="Groups" onPress={() => navigation.navigate("Groups")} />
        <Button title="CreateGroup" onPress={() => navigation.navigate("CreateGroup")} />
        <Button title="JoinGroup" onPress={() => navigation.navigate("JoinGroup")} />
        <Button title="Publish" onPress={() => navigation.navigate("Publish")} />
        <Button title="AboutUs" onPress={() => navigation.navigate("AboutUs")} />
        <Button title="Feedback" onPress={() => navigation.navigate("Feedback")} />
        <Button title="Profile" onPress={() => navigation.navigate("Profile")} />
        <Button title="EditProfile" onPress={() => navigation.navigate("EditProfile")} />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

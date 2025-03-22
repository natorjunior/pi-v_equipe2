import React from "react";
import Background from "../components/Background";
import { View, Text, Button, StyleSheet } from "react-native";

export default function Menu({ navigation }) {
  return (
    <View style={styles.container}>
      <Background>
        <Text style={styles.title}>Telas</Text>
        <Button title="Login" onPress={() => navigation.navigate("Login")} />
        <Button title="Home" onPress={() => navigation.navigate("Home")} />
        <Button title="Entrada" onPress={() => navigation.navigate("Entrada")} />
        <Button title="Question1" onPress={() => navigation.navigate("Question1")} />
        <Button title="Question2" onPress={() => navigation.navigate("Question2")} />
        <Button title="Question3" onPress={() => navigation.navigate("Question3")} />
        <Button title="Question4" onPress={() => navigation.navigate("Question4")} />
      </Background>
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

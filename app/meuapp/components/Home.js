//import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Button,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { fetchDataWithToken } from "../service/loginService";

const imagem = require("../assets/gatinhu.jpg");

export default function Home({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginButtom = async () => {
    const loginData = { email, password };
    try {
      const response = await fetchDataWithToken(loginData);
      console.log(response);

      navigation.navigate("Home");
    } catch (error) {
      console.log(error);
    }
  };

  return <View></View>;
}

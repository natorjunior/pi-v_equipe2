import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = "http://10.18.0.186:8080/authentication/login";

export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(API_URL, loginData);

    //if (response.data && response.data) {

    if (response.status === 200 && response.data) {
      await SecureStore.setItemAsync("token", response.data);
      console.log("Login bem-sucedido, token armazenado:", response.data);
      return response.data;
    } else {
      throw new Error("Login falhou, sem token recebido.");
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};

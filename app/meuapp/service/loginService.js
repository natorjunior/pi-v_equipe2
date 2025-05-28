import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = "https://api.homolog.sal.acilab.com.br/authentication/login";

export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(API_URL, loginData);

    if (response.status === 200 && response.data) {
      await SecureStore.setItemAsync("token", response.data);
      return response.data;
    } else {
      throw new Error("Login falhou, sem token recebido.");
    }
  } catch (error) {
    console.log("Erro ao fazer login:", error);
    throw error;
  }
};

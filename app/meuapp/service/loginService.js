import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@env";

const api = axios.create({
  baseURL: API_URL,
});

export const loginUser = async (loginData) => {
  try {
    const response = await api.post("/authentication/login", loginData);

    if (response.status === 200 && response.data) {
      await SecureStore.setItemAsync("token", response.data);
      return response.data;
    } else {
      throw new Error("Login falhou, sem token recebido.");
    }
  } catch (error) {
    console.log("Erro ao fazer login:", error.response?.data || error.message);
    throw error;
  }
};

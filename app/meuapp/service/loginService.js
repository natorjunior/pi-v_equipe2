import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@env";

const api = axios.create({
  baseURL: API_URL,
});

export const setupAxiosInterceptors = (navigation) => {
  api.interceptors.response.use(
    (response) => response, 
    async (error) => {
      if (
        error.response &&
        error.response.status === 403 &&
        error.response.data?.detail === "Not authenticated"
      ) {
        // Limpar o token
        await SecureStore.deleteItemAsync("token");
        console.log("Token expirado ou inválido. Redirecionando para Login...");

        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }
      return Promise.reject(error);
    }
  );
};

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
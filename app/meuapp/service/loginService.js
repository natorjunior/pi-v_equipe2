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
        await SecureStore.deleteItemAsync("token");

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
    throw error;
  }
};
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@env";

const api = axios.create({
  baseURL: API_URL,
});

let globalNavigation = null;

export const setGlobalNavigation = (navigation) => {
  globalNavigation = navigation;
};

export const setupAxiosInterceptors = () => {
  api.interceptors.request.use(
    async (config) => {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403) &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("selectedGroupId");
        await SecureStore.deleteItemAsync("selectedGroupName");


        if (globalNavigation) {
          globalNavigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        }

        return Promise.reject(new Error("Sessão expirada. Faça login novamente."));
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

export default api;
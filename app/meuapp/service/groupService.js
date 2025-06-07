import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@env";

if (!API_URL) {
  throw new Error("API_URL não definida no .env");
}

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar token automaticamente a cada requisição
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Criar novo grupo
export const createGroup = async (newGroup) => {
  try {
    const payload = {
      group_name: newGroup.name,
      group_alias: newGroup.alias,
      description: newGroup.description,
    };

    const response = await api.post("/group", payload);
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Erro ao criar o grupo";
    throw new Error(message);
  }
};

// Buscar grupos do usuário
export const getGroup = async () => {
  try {
    const response = await api.get("/group");
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Erro ao buscar grupos";
    throw new Error(message);
  }
};

// Entrar em um grupo por alias
export const joinGroup = async (group_alias) => {
  try {
    const response = await api.get(`/group/join/${group_alias}`);
    console.log("Resposta do joinGroup:", response.data);
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Erro ao entrar no grupo";
    throw new Error(message);
  }
};

// Sair de um grupo por alias
export const leaveGroup = async (group_alias) => {
  try {
    const response = await api.get(`/group/leave/${group_alias}`);
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Erro ao sair do grupo";
    throw new Error(message);
  }
};

// Deletar grupo pelo ID
export const deleteGroup = async (group_id) => {
  try {
    const response = await api.delete(`/group/${group_id}`);
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Erro ao deletar grupo";
    throw new Error(message);
  }
};

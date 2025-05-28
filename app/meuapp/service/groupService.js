import axios from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL = "https://api.homolog.sal.acilab.com.br";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync("token");
    if (!token) {
      throw new Error("Sessão expirada. Faça login novamente.");
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  } catch (error) {
    throw error;
  }
});

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

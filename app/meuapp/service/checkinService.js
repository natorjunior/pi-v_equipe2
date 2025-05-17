import axios from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL = "https://api.homolog.sal.acilab.com.br";

const api = axios.create({
  baseURL: BASE_URL,
});

// Interceptor para inserir token JWT nas requisições
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

// Obter check-ins do usuário autenticado
export const getCheckinsByUser = async () => {
  try {
    const response = await api.get("/check-in/user");
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Erro ao buscar check-ins do usuário";
    throw new Error(message);
  }
};

// Obter check-ins por grupo
export const getCheckinsByGroup = async (groupId) => {
  try {
    const response = await api.get(`/check-in/group/${groupId}`);
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Erro ao buscar check-ins do grupo";
    throw new Error(message);
  }
};

// Criar novo check-in
export const createCheckin = async (groupId, title, description, photo) => {
  try {
    const formData = new FormData();
    formData.append("group_id", groupId);
    formData.append("title", title);
    formData.append("description", description);

    if (photo) {
      formData.append("photo", {
        uri: photo,
        name: "checkin-photo.jpg",
        type: "image/jpeg",
      });
    }

    const response = await api.post("/check-in", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Erro ao criar check-in";
    throw new Error(message);
  }
};

// Atualizar check-in existente
export const updateCheckin = async (checkinId, title, description, photo) => {
  try {
    const formData = new FormData();
    formData.append("checkin_id", checkinId);
    formData.append("title", title);
    formData.append("description", description);

    if (photo) {
      formData.append("checkin_photo", {
        uri: photo,
        name: "checkin-photo-update.jpg",
        type: "image/jpeg",
      });
    }

    const response = await api.put("/check-in", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Erro ao atualizar check-in";
    throw new Error(message);
  }
};

// Excluir check-in
export const deleteCheckin = async (checkinId) => {
  try {
    const response = await api.delete(`/check-in/${checkinId}`);
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Erro ao excluir check-in";
    throw new Error(message);
  }
};

// Obter ranking do grupo
export const getGroupRanking = async (groupId) => {
  try {
    const response = await api.get(`/check-in/group/${groupId}/ranking`);
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Erro ao buscar ranking do grupo";
    throw new Error(message);
  }
};

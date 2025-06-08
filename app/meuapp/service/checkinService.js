import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@env";

if (!API_URL) {
  throw new Error("API_URL não definida no .env");
}

// Instância do Axios com URL base
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar token automaticamente
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

// Obter check-ins do usuário autenticado
export const getCheckinsByUser = async () => {
  try {
    const response = await api.get("/check-in/user");
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Erro ao buscar seus check-ins"
    );
  }
};

// Obter check-ins por grupo
export const getCheckinsByGroup = async (groupId) => {
  try {
    const response = await api.get(`/check-in/group/${groupId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Erro ao buscar check-ins do grupo"
    );
  }
};

// Criar novo check-in com imagem
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
    throw new Error(
      error?.response?.data?.message || "Erro ao criar check-in"
    );
  }
};

// Atualizar check-in
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
    throw new Error(
      error?.response?.data?.message || "Erro ao atualizar check-in"
    );
  }
};

// Deletar check-in
export const deleteCheckin = async (checkinId) => {
  try {
    const response = await api.delete(`/check-in/${checkinId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Erro ao excluir check-in"
    );
  }
};

// Obter ranking de um grupo
export const getGroupRanking = async (groupId) => {
  try {
    const response = await api.get(`/check-in/group/${groupId}/ranking`);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Erro ao buscar ranking do grupo"
    );
  }
};

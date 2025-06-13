import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@env";

if (!API_URL) {
  throw new Error("API_URL não definida no .env");
}

const api = axios.create({
  baseURL: API_URL,
});

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

export const getFeedByUser = async (Page) => {
  try {
    const response = await api.get(`/check-in/feed/${Page}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Erro ao buscar Feed"
    );
  }
};

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

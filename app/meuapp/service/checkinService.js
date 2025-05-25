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

export const getCheckinsByUser = async () => {
  try {
    const response = await api.get("/check-in/user");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCheckinsByGroup = async (groupId) => {
  try {
    const response = await api.get(`/check-in/group/${groupId}`);
    return response.data;
  } catch (error) {
    throw error;
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
    throw error;
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
    throw error;
  }
};

export const deleteCheckin = async (checkinId) => {
  try {
    const response = await api.delete(`/check-in/${checkinId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGroupRanking = async (groupId) => {
  try {
    const response = await api.get(`/check-in/group/${groupId}/ranking`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


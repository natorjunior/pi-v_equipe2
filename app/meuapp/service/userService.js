import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = "https://api.homolog.sal.acilab.com.br/user";

export const createUser = async (newUser) => {
  try {
    const response = await axios.post(API_URL, newUser);
    console.log("Usuário criado com sucesso:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar usuário", error);
    throw error;
  }
};

export const getUser = async () => {
  try {
    const token = await SecureStore.getItemAsync("token");
    if (!token) throw new Error("Token de autenticação não fornecido.");

    const response = await axios.get(`${API_URL}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao obter dados do usuário:", error.response?.data || error.message);
    throw error;
  }
};

export const updateUser = async (userData) => {
  try {
    const token = await SecureStore.getItemAsync("token");
    const response = await axios.put(API_URL, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteUser = async () => {
  try {
    const token = await SecureStore.getItemAsync("token");
    if (!token) throw new Error("Token de autenticação não fornecido.");

    const response = await axios.delete(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    console.log("Usuário excluído com sucesso:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao excluir usuário:", error.response?.data || error.message);
    throw error;
  }
};

export const uploadAvatar = async (imageUri) => {
  try {
    const token = await SecureStore.getItemAsync("token");
    const filename = imageUri.split('/').pop();
    const type = `image/${filename.split('.').pop()}`;

    const formData = new FormData();
    formData.append('avatar', {
      uri: imageUri,
      name: filename,
      type: type
    });

    const response = await axios.put(`${API_URL}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
      transformRequest: () => formData,
    });

    return response.data;
  } catch (error) {
    console.error("Erro no upload:", error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || "Falha no upload do avatar");
  }
};


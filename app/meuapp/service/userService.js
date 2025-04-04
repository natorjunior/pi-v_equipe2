import axios from "axios";

const API_URL = "http://192.168.88.56:8080/user";

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

export const getUser = async (token) => {
  try {
    if (!token) throw new Error("Token de autenticação não fornecido.");

    const response = await axios.get(`${API_URL}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    console.log("Dados do usuário recebidos:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter dados do usuário:", error.response?.data || error.message);
    throw error;
  }
};


export const updateUser = async (userData, token) => {
  try {
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

export const deleteUser = async (token) => {
  try {
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

import axios from "axios";

const API_URL = "http://10.18.0.186:8080/user/";

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

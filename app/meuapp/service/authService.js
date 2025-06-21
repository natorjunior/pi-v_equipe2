import * as SecureStore from "expo-secure-store";

export const checkAuth = async () => {
    try {
        const token = await SecureStore.getItemAsync("token");
        return !!token;
    } catch (error) {
        return false;
    }
};

export const logoutUser = async () => {
    try {
        await SecureStore.deleteItemAsync("token");
        return true;
    } catch (error) {
        return false;
    }
};

export const getAuthToken = async () => {
    return await SecureStore.getItemAsync("token");
};

export const setAuthToken = async (token) => {
    await SecureStore.setItemAsync("token", token);
};


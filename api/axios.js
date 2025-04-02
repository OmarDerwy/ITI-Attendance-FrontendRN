import axios from "axios";
import * as storage from "expo-secure-store"
const axiosBackendInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
});

axiosBackendInstance.interceptors.request.use((config) => {
    const token = storage.getItem("token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosBackendInstance;
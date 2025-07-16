import axios from "axios"
import { getToken } from "./auth"

// const API_URL_PRODUCTION = "https://web-production-e51c4.up.railway.app"
const API_URL_PRODUCTION = "http://127.0.0.1:8000"

const axiosInstance = axios.create({
    baseURL: API_URL_PRODUCTION,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear()
            console.error("No autorizado o sesión expirada.");
            window.location.href = "/get-started"
        }
        return Promise.reject(error)
    }
)

export default axiosInstance;
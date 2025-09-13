import axios from "axios"
import { getToken, removeToken, setToken } from "./auth"

const API_URL = "https://football-core-backend-production.up.railway.app/"
// const API_URL = "http://127.0.0.1:8000"

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})

/* -------------------------------
   Manejo de cola para refresh
-------------------------------- */
let isRefreshing = false
let refreshSubscribers = []

const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback)
}

const onRefreshed = (newToken) => {
    refreshSubscribers.forEach((callback) => callback(newToken))
    refreshSubscribers = []
}

/* -------------------------------
   Interceptor Request
-------------------------------- */
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

/* -------------------------------
   Interceptor Response
-------------------------------- */
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Si el error es 401 y no es login/register/refresh
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("login") &&
            !originalRequest.url.includes("register") &&
            !originalRequest.url.includes("refresh")
        ) {
            originalRequest._retry = true

            // Si ya hay un refresh en curso → esperamos
            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh((newToken) => {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`
                        resolve(axiosInstance(originalRequest))
                    })
                })
            }

            // Sino → pedimos refresh
            isRefreshing = true
            try {
                const { data } = await axios.post(
                    `${API_URL}refresh`,
                    {},
                    { withCredentials: true }
                )

                const newToken = data.access_token
                setToken(newToken)
                axiosInstance.defaults.headers.Authorization = `Bearer ${newToken}`
                isRefreshing = false
                onRefreshed(newToken)

                originalRequest.headers.Authorization = `Bearer ${newToken}`
                return axiosInstance(originalRequest)
            } catch (err) {
                isRefreshing = false
                removeToken()
                localStorage.clear()
                console.error("No autorizado o sesión expirada.")
                window.location.href = "/get-started"
                return Promise.reject(err)
            }
        }

        return Promise.reject(error)
    }
)

export default axiosInstance
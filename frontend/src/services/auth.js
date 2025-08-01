import { decryptData } from "./encryptionService"

export const setToken = (token) => {
    localStorage.setItem("accessToken", token)
}

export const getToken = () => {
    return localStorage.getItem("accessToken") || null
}

export const removeToken = () => {
    localStorage.removeItem("accessToken")
}

export const getStoredUser = () => {
    try {
        const encrypted = localStorage.getItem("user")
        if (!encrypted) return null

        const user = decryptData(encrypted)
        return user
    } catch (e) {
        console.warn("Error al obtener usuario desencriptado:", e)
        return null
    } 
}
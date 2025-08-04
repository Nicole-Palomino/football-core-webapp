import axiosInstance from '../axiosConfig'
import { setToken, getToken } from '../auth'

// -------------------------------------- usuarios --------------------------------------

// iniciar sesión
export const loginUser = async ( data ) => {
    try {
        const params = new URLSearchParams()
        params.append('username', data.email)
        params.append('password', data.password)

        const response = await axiosInstance.post('/token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })

        const { access_token } = response.data

        if (!access_token) {
            throw new Error("El servidor no devolvió un token de acceso")
        }

        setToken(access_token)

        return response.data
    } catch (error) {
        throw new Error(error.response?.data?.detail || "Error al iniciar sesión")
    }
}

// datos del usuario
export const getCurrentUser = async () => {
    const token = getToken()

    if (!token) {
        throw new Error("No hay token disponible")
    }

    try {
        const response = await axiosInstance.get('/users/me/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        return response.data
    } catch (error) {
        console.error("Error al obtener el usuario:", error)
        throw new Error("No se pudo obtener el usuario")
    }
}

// registro de usuario
export const registerUser = async ( userData ) => {
    try {
        const response = await axiosInstance.post('/register', userData, {
            headers: {
                "Content-Type": "application/json",
            },
        })

        return response.data
    } catch (error) {
        console.error("Error en registerUser:", error);

        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.");
        }

        throw new Error("Error al conectar con el servidor.");
    }
}

export const forgotUser = async ( userData ) => {
    try {
        const response = await axiosInstance.post('/request-password-reset', userData, {
            headers: {
                "Content-Type": "application/json",
            },
        })

        return response.data
    } catch (error) {
        console.error("Error en forgotUser:", error);

        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.");
        }

        throw new Error("Error al conectar con el servidor.");
    }
}

export const resetUser = async ( userData ) => {
    try {
        const response = await axiosInstance.post('/reset-password', userData, {
            headers: {
                "Content-Type": "application/json",
            },
        })

        return response.data
    } catch (error) {
        console.error("Error en registerUser:", error);

        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.");
        }

        throw new Error("Error al conectar con el servidor.");
    }
}
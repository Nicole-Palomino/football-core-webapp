import axiosInstance from '../axiosConfig'
import { setToken, getToken } from '../auth'

// -------------------------------------- usuarios --------------------------------------
// iniciar sesión
export const loginUser = async ({ username, password }) => {
    try {
        const formData = new URLSearchParams()
        formData.append("username", username)
        formData.append("password", password)

        const { data } = await axiosInstance.post("login", formData, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })

        return data
    } catch (error) {
        console.log("CATCH LOGIN USER:", error)

        if (error.response) {
            const message =
                error.response.data?.detail ||
                error.response.data?.message ||
                "Credenciales inválidas"
            throw new Error(message)
        }

        throw new Error("Error de conexión con el servidor")
    }
}

// datos del usuario
export const getCurrentUser = async () => {
    const token = getToken()

    if (!token) {
        throw new Error("No hay token disponible")
    }

    try {
        const response = await axiosInstance.get('users/me/', {
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
export const registerUser = async (userData) => {
    try {
        const response = await axiosInstance.post('register', userData, {
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

// recuperar contraseña
export const forgotUser = async (userData) => {
    try {
        const response = await axiosInstance.post('request-password-reset', userData, {
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

// verificar contraseña
export const verifyUser = async (userData) => {
    try {
        const response = await axiosInstance.post('verify-password-code', userData, {
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

// resetear contraseña
export const resetUser = async (userData) => {
    try {
        const response = await axiosInstance.post('reset-password', userData, {
            headers: { "Content-Type": "application/json" },
        })

        // Si status está entre 200 y 299, devolver data directamente
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }

        throw new Error(response.data?.detail || "Error desconocido.")
    } catch (error) {
        console.error("Error en registerUser:", error);

        // Axios trae el status aquí cuando es 4xx o 5xx
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.");
        }

        throw new Error("Error al conectar con el servidor.");
    }
}

// actualizar datos del usuario
export const updateUser = async (userId, userData) => {
    try {
        const response = await axiosInstance.put(`users/${userId}`, userData, {
            headers: {
                "Content-Type": "application/json",
            },
        })

        return response.data
    } catch (error) {
        console.error("Error en updateUser:", error);

        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.");
        }

        throw new Error("Error al conectar con el servidor.");
    }
}
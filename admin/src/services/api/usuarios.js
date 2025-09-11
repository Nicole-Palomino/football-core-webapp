import axiosInstance from "../axiosConfig"

export const getCountUser = async () => {
    try {
        const response = await axiosInstance.get('/users/stats/total')
        return response.data
    } catch (error) {
        console.error("Error al obtener usuarios:", error)
        throw error.response?.data || new Error("No se pudo obtener usuarios")
    }
}

export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get('/users/')
        return response.data
    } catch (error) {
        console.error("Error al obtener usuarios:", error)
        throw error.response?.data || new Error("No se pudo obtener usuarios")
    }
}

export const registerUser = async ( userData ) => {
    try {
        const response = await axiosInstance.post('/register-admin', userData, {
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

export const updateUser = async (userId, userData) => {
    try {
        const response = await axiosInstance.put(`/users/admin/${userId}`, userData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        return response.data
    } catch (error) {
        console.error("Error en updateUser:", error)
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.")
        }
        throw new Error("Error al conectar con el servidor.")
    }
}

export const deleteUser = async (userId) => {
    try {
        const response = await axiosInstance.delete(`/users/${userId}`)
        return response.data
    } catch (error) {
        console.error("Error en deleteUser:", error)
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.")
        }
        throw new Error("Error al conectar con el servidor.")
    }
}

export const getUsersByDate = async () => {
    try {
        const response = await axiosInstance.get("/users/stats/usuarios-por-dia")
        return response.data
    } catch (error) {
        console.error("Error al obtener usuarios:", error)
        throw error.response?.data || new Error("No se pudo obtener usuarios")
    }
}
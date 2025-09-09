import axiosInstance from "../axiosConfig"

export const getAllStates = async () => {
    try {
        const response = await axiosInstance.get('/estados/')
        return response.data
    } catch (error) {
        console.error("Error al obtener usuarios:", error)
        throw error.response?.data || new Error("No se pudo obtener usuarios")
    }
}

export const registerState = async ( stateData ) => {
    try {
        const response = await axiosInstance.post('/estados/', stateData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        return response.data
    } catch (error) {
        console.error("Error en registerState:", error);
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.");
        }
        throw new Error("Error al conectar con el servidor.");
    }
}

export const updateState = async (stateId, stateData) => {
    try {
        const response = await axiosInstance.put(`/estados/${stateId}`, stateData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        return response.data
    } catch (error) {
        console.error("Error en updateState:", error)
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.")
        }
        throw new Error("Error al conectar con el servidor.")
    }
}

export const deleteState = async (stateId) => {
    try {
        const response = await axiosInstance.delete(`/estados/${stateId}`)
        return response.data
    } catch (error) {
        console.error("Error en deleteState:", error)
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.")
        }
        throw new Error("Error al conectar con el servidor.")
    }
}
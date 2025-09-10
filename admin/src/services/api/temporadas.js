import axiosInstance from "../axiosConfig"

export const getAllSeasons = async () => {
    try {
        const response = await axiosInstance.get('/temporadas/')
        return response.data
    } catch (error) {
        console.error("Error al obtener temporadas:", error)
        throw error.response?.data || new Error("No se pudo obtener temporadas")
    }
}

export const registerSeason = async ( seasonData ) => {
    try {
        const response = await axiosInstance.post('/temporadas/', seasonData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        return response.data
    } catch (error) {
        console.error("Error en registerSeason:", error);
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.");
        }
        throw new Error("Error al conectar con el servidor.");
    }
}

export const updateSeason = async (seasonId, seasonData) => {
    try {
        const response = await axiosInstance.put(`/temporadas/${seasonId}`, seasonData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        return response.data
    } catch (error) {
        console.error("Error en updateSeason:", error)
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.")
        }
        throw new Error("Error al conectar con el servidor.")
    }
}

export const deleteSeason = async (seasonId) => {
    try {
        const response = await axiosInstance.delete(`/temporadas/${seasonId}`)
        return response.data
    } catch (error) {
        console.error("Error en deleteSeason:", error)
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.")
        }
        throw new Error("Error al conectar con el servidor.")
    }
}
import axiosInstance from "../axiosConfig"

export const getCountLeagues = async () => {
    try {
        const response = await axiosInstance.get('ligas/stats/total')
        return response.data
    } catch (error) {
        console.error("Error al obtener ligas:", error)
        throw error.response?.data || new Error("No se pudo obtener ligas")
    }
}

export const getAllLeagues = async () => {
    try {
        const response = await axiosInstance.get('ligas/')
        return response.data
    } catch (error) {
        console.error("Error al obtener ligas:", error)
        throw error.response?.data || new Error("No se pudo obtener ligas")
    }
}

export const registerLeague = async ( leagueData ) => {
    try {
        const response = await axiosInstance.post('ligas/', leagueData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        return response.data
    } catch (error) {
        console.error("Error en registerLeague:", error);
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.");
        }
        throw new Error("Error al conectar con el servidor.");
    }
}

export const updateLeague = async (leagueId, leagueData) => {
    try {
        const response = await axiosInstance.put(`ligas/${leagueId}`, leagueData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        return response.data
    } catch (error) {
        console.error("Error en updateLeague:", error)
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.")
        }
        throw new Error("Error al conectar con el servidor.")
    }
}

export const deleteLeague = async (leagueId) => {
    try {
        const response = await axiosInstance.delete(`ligas/${leagueId}`)
        return response.data
    } catch (error) {
        console.error("Error en deleteLeague:", error)
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.")
        }
        throw new Error("Error al conectar con el servidor.")
    }
}
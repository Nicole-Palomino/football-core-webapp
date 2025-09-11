import axiosInstance from "../axiosConfig"

export const getCountTeams = async () => {
    try {
        const response = await axiosInstance.get('/equipos/stats/total')
        return response.data
    } catch (error) {
        console.error("Error al obtener equipos:", error)
        throw error.response?.data || new Error("No se pudo obtener equipos")
    }
}

export const getActiveTeams = async () => {
    try {
        const response = await axiosInstance.get('/equipos/activos')
        return response.data
    } catch (error) {
        console.error("Error al obtener equipos:", error)
        throw error.response?.data || new Error("No se pudo obtener equipos")
    }
}

export const getAllTeams = async () => {
    try {
        const response = await axiosInstance.get('/equipos/')
        return response.data
    } catch (error) {
        console.error("Error al obtener equipos:", error)
        throw error.response?.data || new Error("No se pudo obtener equipos")
    }
}

export const registerTeam = async ( teamData ) => {
    try {
        const response = await axiosInstance.post('/equipos/', teamData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        return response.data
    } catch (error) {
        console.error("Error en registerTeam:", error);
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.");
        }
        throw new Error("Error al conectar con el servidor.");
    }
}

export const updateTeam = async (teamId, teamData) => {
    try {
        const response = await axiosInstance.put(`/equipos/${teamId}`, teamData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        return response.data
    } catch (error) {
        console.error("Error en updateTeam:", error)
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.")
        }
        throw new Error("Error al conectar con el servidor.")
    }
}

export const deleteTeam = async (teamId) => {
    try {
        const response = await axiosInstance.delete(`/equipos/${teamId}`)
        return response.data
    } catch (error) {
        console.error("Error en deleteSeason:", error)
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.")
        }
        throw new Error("Error al conectar con el servidor.")
    }
}
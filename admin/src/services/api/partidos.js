import axiosInstance from "../axiosConfig"

export const getCountMatches = async () => {
    try {
        const response = await axiosInstance.get('partidos/stats/total')
        return response.data
    } catch (error) {
        console.error("Error al obtener partidos:", error)
        throw error.response?.data || new Error("No se pudo obtener partidos")
    }
}

export const getAllMatches = async () => {
    try {
        const response = await axiosInstance.get('partidos/season/12')
        return response.data
    } catch (error) {
        console.error("Error al obtener partidos:", error)
        throw error.response?.data || new Error("No se pudo obtener partidos")
    }
}

export const registerMatch = async ( matchData ) => {
    try {
        const response = await axiosInstance.post('partidos/', matchData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        return response.data
    } catch (error) {
        console.error("Error en registerMatch:", error);
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.");
        }
        throw new Error("Error al conectar con el servidor.");
    }
}

export const updateMatch = async (matchId, matchData) => {
    try {
        const response = await axiosInstance.put(`partidos/${matchId}`, matchData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        return response.data
    } catch (error) {
        console.error("Error en updateMatch:", error)
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.")
        }
        throw new Error("Error al conectar con el servidor.")
    }
}

export const deleteMatch = async (matchId) => {
    try {
        const response = await axiosInstance.delete(`partidos/${matchId}`)
        return response.data
    } catch (error) {
        console.error("Error en deleteMatch:", error)
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.")
        }
        throw new Error("Error al conectar con el servidor.")
    }
}

export const registerStat = async ( statData ) => {
    try {
        const response = await axiosInstance.post('estadisticas/', statData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        return response.data
    } catch (error) {
        console.error("Error en registerStat:", error);
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.");
        }
        throw new Error("Error al conectar con el servidor.");
    }
}

export const updateStat = async (matchId, statData) => {
    try {
        const response = await axiosInstance.put(`estadisticas/by-partido/${matchId}`, statData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        return response.data
    } catch (error) {
        console.error("Error en updateStat:", error)
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.")
        }
        throw new Error("Error al conectar con el servidor.")
    }
}
import axiosInstance from '../services/axiosConfig'
// -------------------------------------- functions --------------------------------------

export const getLigues = async () => {
    try {
        const response = await axiosInstance.get("/analysis/ligas")
        return response.data
    } catch (err) {
        console.error("Error getting favorites:", err.response ? err.response.data : err.message)
        throw err
    }
}

export const getTeams = async (liga) => {
    try {
        const response = await axiosInstance.get(`/analysis/equipos/${encodeURIComponent(liga)}`)
        return response.data
    } catch (err) {
        console.error("Error getting favorites:", err.response ? err.response.data : err.message)
        throw err
    }
}

export const getCompleteAnalysis = async (liga, equipo1, equipo2) => {
    try {
        const response = await axiosInstance.get(`/analysis/analisis-completo/${encodeURIComponent(liga)}`, {
            params: {
                equipo1,
                equipo2
            }
        })
        return response.data
    } catch (err) {
        console.error("Error getting favorites:", err.response ? err.response.data : err.message)
        throw err
    }
}
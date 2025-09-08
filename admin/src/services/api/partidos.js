import axiosInstance from "../axiosConfig"

export const getCountMatches = async () => {
    try {
        const response = await axiosInstance.get('/partidos/stats/total')
        return response.data
    } catch (error) {
        console.error("Error al obtener partidos:", error)
        throw error.response?.data || new Error("No se pudo obtener partidos")
    }
}
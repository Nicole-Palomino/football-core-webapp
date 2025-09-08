import axiosInstance from "../axiosConfig"

export const getCountLeagues = async () => {
    try {
        const response = await axiosInstance.get('/ligas/stats/total')
        return response.data
    } catch (error) {
        console.error("Error al obtener ligas:", error)
        throw error.response?.data || new Error("No se pudo obtener ligas")
    }
}
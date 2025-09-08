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
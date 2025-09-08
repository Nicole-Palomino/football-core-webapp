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
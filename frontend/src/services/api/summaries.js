import axiosInstance from '../axiosConfig'

// -------------------------------------- summaries --------------------------------------

export const getResumenesByPartido = async (partidoId) => {
    try {
        console.log(partidoId)
        const response = await axiosInstance.get(`/resumenes/partido/${partidoId}`)
        return response.data
    } catch (err) {
        throw err
    }
}
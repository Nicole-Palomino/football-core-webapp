import axiosInstance from '../../services/axiosConfig'
// -------------------------------------- favorite --------------------------------------

// add a favorite match
export const addFavorite = async (partidoId, usuarioId) => {
    try {
        const response = await axiosInstance.post(`favoritos/`, {
            id_partido: partidoId,
            id_usuario: usuarioId,
        })
        return response.data
    } catch (err) {
        console.error("Error al agregar favorito:", err)
        throw err
    }
}

export const deleteFavorite = async (partidoId, usuarioId) => {
    try {
        const response = await axiosInstance.delete(`favoritos/${encodeURIComponent(partidoId)}/${encodeURIComponent(usuarioId)}`)
        return response.data
    } catch (err) {
        console.error("Error deleting favorite:", err.response ? err.response.data : err.message)
        throw err
    }
}

export const getFavorites = async (usuarioId) => {
    try {
        const response = await axiosInstance.get("favoritos/", {
            params: { id_usuario: usuarioId },
        })
        return response.data
    } catch (err) {
        console.error("Error getting favorites:", err.response ? err.response.data : err.message)
        throw err
    }
}
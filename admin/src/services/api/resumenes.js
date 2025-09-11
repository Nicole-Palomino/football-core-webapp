import axiosInstance from "../axiosConfig"

export const getAllSummaries = async () => {
    try {
        const response = await axiosInstance.get('/resumenes/')
        return response.data
    } catch (error) {
        console.error("Error al obtener resúmenes:", error)
        throw error.response?.data || new Error("No se pudo obtener resúmenes")
    }
}

export const registerSummary = async (summaryData) => {
    try {
        const response = await axiosInstance.post('/resumenes/', summaryData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        return response.data
    } catch (error) {
        console.error("Error en registerSummary:", error);
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.");
        }
        throw new Error("Error al conectar con el servidor.");
    }
}

export const updateSummary = async (summaryId, summaryData) => {
    try {
        const { id_resumen: _, ...rest } = summaryData

        const payload = {
            ...rest,
            id_partido: rest.id_partido ? Number(rest.id_partido) : undefined
        }

        const response = await axiosInstance.put(`/resumenes/${summaryId}`, payload)
        return response.data
    } catch (error) {
        console.error("Error en updateSummary:", error)
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.")
        }
        throw new Error("Error al conectar con el servidor.")
    }
}

export const deleteSummary = async (summaryId) => {
    try {
        const response = await axiosInstance.delete(`/resumenes/${summaryId}`)
        return response.data
    } catch (error) {
        console.error("Error en deleteSummary:", error)
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.")
        }
        throw new Error("Error al conectar con el servidor.")
    }
}
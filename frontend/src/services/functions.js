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

export const getPoisson = async (liga, equipo1, equipo2) => {
    try {
        const response = await axiosInstance.get(`/poisson/probabilidades/${encodeURIComponent(liga)}`, {
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

export const getAnalyticsCluster = async (liga, equipo1, equipo2) => {
    try {
        const response = await axiosInstance.get(`/clusters/analizar/${encodeURIComponent(liga)}`, {
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

export const getPredictionCluster = async (liga, equipo1, equipo2) => {
    try {
        const response = await axiosInstance.get(`/clusters/predecir/${encodeURIComponent(liga)}`, {
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

// extrae y empalma la descripción del clúster predicho
export const obtenerDescripcionCluster = (analisisCompleto, prediccion) => {
    const clusterId = String(prediccion.cluster_predicho)
    if (
        !analisisCompleto ||
        !analisisCompleto.descripcion_clusters ||
        !(clusterId in analisisCompleto.descripcion_clusters)
    ) {
        return "Descripción del clúster no disponible."
    }
    return analisisCompleto.descripcion_clusters[clusterId]
}

export const combinarAnalisisYPrediccion = (analisisCompleto, prediccion) => {
    const descripcion_cluster_predicho = obtenerDescripcionCluster(
        analisisCompleto,
        prediccion
    )
    return {
        analisisCompleto,
        prediccion,
        descripcion_cluster_predicho,
    }
}

export const getPredictionRandom = async (liga, equipo1, equipo2) => {
    try {
        const response = await axiosInstance.get(`/predictions/predecir/${encodeURIComponent(liga)}`, {
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
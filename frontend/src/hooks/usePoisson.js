import { useQuery } from "@tanstack/react-query"
import { combinarAnalisisYPrediccion, getAnalyticsCluster, getPoisson, getPredictionCluster } from "../services/functions"

export const usePoisson = (equipo_local, equipo_visita, nombre_liga) => {
    const {
        data: matchPoisson,
        isLoading: isLoadingPoisson,
        isError: isErrorPoisson,
        error: errorPoisson
    } = useQuery({
        queryKey: ["matchPoisson", equipo_local, equipo_visita],
        queryFn: () => getPoisson(nombre_liga, equipo_local, equipo_visita),
        enabled: Boolean(equipo_local && equipo_visita && nombre_liga),
        staleTime: 1000 * 60 * 30,
        cacheTime: 5 * 60 * 1000
    })

    const fetchClusterData = async (nombre_liga, equipo_local, equipo_visita) => {
        const clusterAnalysis = await getAnalyticsCluster(nombre_liga, equipo_local, equipo_visita)
        const clusterPrediction = await getPredictionCluster(nombre_liga, equipo_local, equipo_visita)
        return combinarAnalisisYPrediccion(clusterAnalysis, clusterPrediction) || []
    }

    const {
        data: clusterData,
        isLoading: isLoadingCluster,
        isError: isErrorCluster,
        error: errorCluster
    } = useQuery({
        queryKey: ["clusterData", equipo_local, equipo_visita],
        queryFn: () => fetchClusterData(nombre_liga, equipo_local, equipo_visita),
        enabled: Boolean(nombre_liga, equipo_local, equipo_visita),
        staleTime: 1000 * 60 * 30,
        cacheTime: 5 * 60 * 1000
    })

    return {
        matchPoisson,
        clusterData,
        isLoading: isLoadingPoisson || isLoadingCluster,
        isError: isErrorPoisson || isErrorCluster,
        error: errorPoisson || errorCluster,
    }
}
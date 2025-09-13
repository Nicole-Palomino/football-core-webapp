import { useQuery } from "@tanstack/react-query"
import { getCompleteAnalysis } from "../services/functions"

export const useMatchStats = (equipo_local, equipo_visita, nombre_liga) => {
    const {
        data: matchesStats,
        isLoading: isLoadingStats,
        isError: isErrorStats,
        error: errorStats
    } = useQuery({
        queryKey: ["matchesStats", equipo_local, equipo_visita],
        queryFn: () => getCompleteAnalysis(nombre_liga, equipo_local, equipo_visita),
        enabled: Boolean(equipo_local && equipo_visita && nombre_liga),
        staleTime: 1000 * 60 * 30,
        cacheTime: 5 * 60 * 1000
    })

    return {
        matchesStats,
        isLoading: isLoadingStats,
        isError: isErrorStats,
        error: errorStats,
    }
}
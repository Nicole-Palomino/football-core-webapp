import { useQuery } from "@tanstack/react-query"
import { getPredictionRandom } from "../services/functions"

export const usePredictions = (equipo_local, equipo_visita, nombre_liga) => {
    const {
        data: matchesPrediction,
        isLoading: isLoadingPrediction,
        isError: isErrorPrediction,
        error: errorPrediction
    } = useQuery({
        queryKey: ["matchesPrediction", equipo_local, equipo_visita],
        queryFn: () => getPredictionRandom(nombre_liga, equipo_local, equipo_visita),
        enabled: Boolean(equipo_local && equipo_visita && nombre_liga),
        staleTime: 1000 * 60 * 30,
        cacheTime: 5 * 60 * 1000
    })

    return {
        matchesPrediction,
        isLoading: isLoadingPrediction,
        isError: isErrorPrediction,
        error: errorPrediction
    }
}
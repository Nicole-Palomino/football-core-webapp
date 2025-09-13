import { useQuery } from "@tanstack/react-query"
import { getMatcheByID } from "../services/api/matches"

export const useMatches = (id_partido) => {

    const {
        data: matchData,
        isLoading: isLoadingMatch,
        isError: isErrorMatch,
        error: errorMatch
    } = useQuery({
        queryKey: ["matchById", id_partido],
        queryFn: () => getMatcheByID({ id_partido }),
        staleTime: 1000 * 60 * 30,
        cacheTime: 5 * 60 * 1000,
        enabled: !!id_partido,
    })
    
    return {
        matchData,
        isLoading: isLoadingMatch,
        isError: isErrorMatch,
        error: errorMatch
    }
}
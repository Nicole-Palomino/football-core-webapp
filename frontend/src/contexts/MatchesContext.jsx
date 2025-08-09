import { createContext, useContext, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getMatchAll } from "../services/api/matches"

const MatchesContext = createContext()

export const MatchesProvider = ({ seasonId = 12, children }) => {
    const { data = [], error, isLoading, isError } = useQuery({
        queryKey: ["match", seasonId],
        queryFn: () => getMatchAll(seasonId),
        staleTime: 1000 * 60 * 15,
        cacheTime: 5 * 60 * 1000,
    })

    const partidosPorJugar = useMemo(
        () => data.filter((p) => p.estado.id_estado === 5),
        [data]
    )

    const partidosFinalizados = useMemo(
        () => data.filter((p) => p.estado.id_estado === 8),
        [data]
    )

    return (
        <MatchesContext.Provider
            value={{
                partidosPorJugar,
                partidosFinalizados,
                isLoading,
                isError,
                error,
            }}
        >
            {children}
        </MatchesContext.Provider>
    )
}

export const useMatches = () => useContext(MatchesContext)
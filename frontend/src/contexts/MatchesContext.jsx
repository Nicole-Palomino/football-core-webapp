import { createContext, useContext, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getMatchAll } from "../services/api/matches"

const PartidosPorJugarContext = createContext()
const PartidosFinalizadosContext = createContext()
const EstadoContext = createContext()

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

    const estado = useMemo(
        () => ({ isLoading, isError, error }),
        [isLoading, isError, error]
    )

    return (
        <PartidosPorJugarContext.Provider value={partidosPorJugar}>
            <PartidosFinalizadosContext.Provider value={partidosFinalizados}>
                <EstadoContext.Provider value={estado}>
                    {children}
                </EstadoContext.Provider>
            </PartidosFinalizadosContext.Provider>
        </PartidosPorJugarContext.Provider>
    )
}

export const usePartidosPorJugar = () => useContext(PartidosPorJugarContext)
export const usePartidosFinalizados = () => useContext(PartidosFinalizadosContext)
export const useEstadoMatches = () => useContext(EstadoContext)
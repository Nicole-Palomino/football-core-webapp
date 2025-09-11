import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteMatch, getAllMatches, registerMatch, registerStat, updateMatch, updateStat } from "../services/api/partidos"

export const useMatches = () => {
    const queryClient = useQueryClient()

    const {
        data: allmatches,
        isLoading: isLoadingMatches,
        isError: isErrorMatches
    } = useQuery({
        queryKey: ['allMatches'],
        queryFn: getAllMatches,
        staleTime: Infinity,
        cacheTime: 5 * 60 * 1000
    })

    const createMatch = useMutation({
        mutationFn: registerMatch,
        onSuccess: () => {
            queryClient.invalidateQueries(["allMatches"])
        }
    })

    const createStat = useMutation({
        mutationFn: registerStat,
        onSuccess: () => {
            queryClient.invalidateQueries(["allMatches"])
        }
    })

    const updatedMatch = useMutation({
        mutationFn: async ({ id_partido, data }) => {
            return await updateMatch(id_partido, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allMatches"])
        }
    })

    const updatedStat = useMutation({
        mutationFn: async ({ id_partido, data }) => {
            return await updateStat(id_partido, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allMatches"])
        }
    })

    const deletedMatch = useMutation({
        mutationFn: async (id_partido) => {
            return await deleteMatch(id_partido)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allMatches"])
        }
    })

    return {
        allmatches,
        isLoading: isLoadingMatches,
        isError: isErrorMatches,
        createMatch,
        updatedMatch,
        deletedMatch,
        createStat,
        updatedStat
    }
}
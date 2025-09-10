import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteSeason, getAllSeasons, registerSeason, updateSeason } from "../services/api/temporadas"

export const useSeason = () => {
    const queryClient = useQueryClient()

    const {
        data: allseason,
        isLoading: isLoadingSeasons,
        isError: isErrorSeasons
    } = useQuery({
        queryKey: ['allSeasons'],
        queryFn: getAllSeasons,
        staleTime: Infinity,
        cacheTime: 5 * 60 * 1000
    })

    const createSeason = useMutation({
        mutationFn: registerSeason,
        onSuccess: () => {
            queryClient.invalidateQueries(["allSeasons"])
        }
    })

    const updatedSeason = useMutation({
        mutationFn: async ({ id_temporada, data }) => {
            return await updateSeason(id_temporada, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allSeasons"])
        }
    })

    const deletedSeason = useMutation({
        mutationFn: async (id_temporada) => {
            return await deleteSeason(id_temporada)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allSeasons"])
        }
    })

    return {
        allseason,
        isLoading: isLoadingSeasons,
        isError: isErrorSeasons,
        createSeason,
        updatedSeason,
        deletedSeason
    }
}
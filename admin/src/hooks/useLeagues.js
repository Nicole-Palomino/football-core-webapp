import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteLeague, getAllLeagues, registerLeague, updateLeague } from "../services/api/ligas"

export const useLeagues = () => {
    const queryClient = useQueryClient()
    
    const {
        data: allleagues,
        isLoading: isLoadingLeagues,
        isError: isErrorLeagues
    } = useQuery({
        queryKey: ['allLeagues'],
        queryFn: getAllLeagues,
        staleTime: Infinity,
        cacheTime: 5 * 60 * 1000
    })

    const createLeague = useMutation({
        mutationFn: registerLeague,
        onSuccess: () => {
            queryClient.invalidateQueries(["allLeagues"])
        }
    })

    const updatedLeague = useMutation({
        mutationFn: async ({ id_liga, data }) => {
            return await updateLeague(id_liga, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allLeagues"])
        }
    })

    const deletedLeague = useMutation({
        mutationFn: async (id_liga) => {
            return await deleteLeague(id_liga)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allLeagues"])
        }
    })

    return {
        allleagues,
        isLoading: isLoadingLeagues,
        isError: isErrorLeagues,
        createLeague,
        updatedLeague,
        deletedLeague
    }
}
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteSummary, getAllSummaries, registerSummary, updateSummary } from "../services/api/resumenes"

export const useSummaries = () => {
    const queryClient = useQueryClient()

    const {
        data: allsummary,
        isLoading: isLoadingSummaries,
        isError: isErrorSummaries
    } = useQuery({
        queryKey: ['allSummaries'],
        queryFn: getAllSummaries,
        staleTime: Infinity,
        cacheTime: 5 * 60 * 1000
    })

    const createSummary = useMutation({
        mutationFn: registerSummary,
        onSuccess: () => {
            queryClient.invalidateQueries(["allSummaries"])
        }
    })

    const updatedSummary = useMutation({
        mutationFn: async ({ id_resumen, data }) => {
            return await updateSummary(id_resumen, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allSummaries"])
        }
    })

    const deletedSummary = useMutation({
        mutationFn: async (id_resumen) => {
            return await deleteSummary(id_resumen)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allSummaries"])
        }
    })

    return {
        allsummary,
        isLoading: isLoadingSummaries,
        isError: isErrorSummaries,
        createSummary,
        updatedSummary,
        deletedSummary
    }
}
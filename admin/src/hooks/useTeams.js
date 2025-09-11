import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteTeam, getAllTeams, registerTeam, updateTeam } from "../services/api/equipos"

export const useTeams = () => {
    const queryClient = useQueryClient()

    const {
        data: allteams,
        isLoading: isLoadingTeams,
        isError: isErrorTeams
    } = useQuery({
        queryKey: ['allTeams'],
        queryFn: getAllTeams,
        staleTime: Infinity,
        cacheTime: 5 * 60 * 1000
    })

    const createTeam = useMutation({
        mutationFn: registerTeam,
        onSuccess: () => {
            queryClient.invalidateQueries(["allTeams"])
        }
    })

    const updatedTeam = useMutation({
        mutationFn: async ({ id_equipo, data }) => {
            return await updateTeam(id_equipo, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allTeams"])
        }
    })

    const deletedTeam = useMutation({
        mutationFn: async (id_equipo) => {
            return await deleteTeam(id_equipo)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allTeams"])
        }
    })

    return {
        allteams,
        isLoading: isLoadingTeams,
        isError: isErrorTeams,
        createTeam,
        updatedTeam,
        deletedTeam
    }
}
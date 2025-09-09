import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteState, registerState, updateState } from '../services/api/estados'

export const useStates = () => {
    const queryClient = useQueryClient()

    const createState = useMutation({
        mutationFn: registerState,
        onSuccess: () => {
            queryClient.invalidateQueries(["allStates"])
        }
    })

    const updatedState = useMutation({
        mutationFn: async ({ id_estado, data }) => {
            return await updateState(id_estado, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allStates"])
        }
    })

    const deletedState = useMutation({
        mutationFn: async (id_estado) => {
            return await deleteState(id_estado)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allStates"])
        }
    })

    return {
        createState,
        updatedState,
        deletedState
    }
}
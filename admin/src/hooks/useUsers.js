import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteUser, getAllUsers, registerUser, updateUser } from "../services/api/usuarios"

export const useUsers = () => {
    const queryClient = useQueryClient()

    const {
        data: allusers,
        isLoading: isLoadingUsers,
        isError: isErrorUsers
    } = useQuery({
        queryKey: ['allUsers'],
        queryFn: getAllUsers,
        staleTime: Infinity,
        cacheTime: 5 * 60 * 1000
    })

    const createUser = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            queryClient.invalidateQueries(["allUsers"])
        }
    })

    const updatedUser = useMutation({
        mutationFn: async ({ id_usuario, data }) => {
            return await updateUser(id_usuario, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allUsers"])
        }
    })

    const deletedUser = useMutation({
        mutationFn: async (id_usuario) => {
            return await deleteUser(id_usuario)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allUsers"])
        }
    })

    return {
        allusers,
        isLoading: isLoadingUsers,
        isError: isErrorUsers,
        createUser,
        updatedUser,
        deletedUser
    }
}
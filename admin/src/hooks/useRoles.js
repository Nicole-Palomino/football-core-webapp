import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteRole, registerRole, updateRole } from '../services/api/roles'

export const useRoles = () => {
    const queryClient = useQueryClient()

    const createRole = useMutation({
        mutationFn: registerRole,
        onSuccess: () => {
            queryClient.invalidateQueries(["allRoles"])
        }
    })

    const updatedRole = useMutation({
        mutationFn: async ({ id_rol, data }) => {
            return await updateRole(id_rol, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allRoles"])
        }
    })

    const deletedRole = useMutation({
        mutationFn: async (id_rol) => {
            return await deleteRole(id_rol)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allRoles"])
        }
    })

    return {
        createRole,
        updatedRole,
        deletedRole
    }
}
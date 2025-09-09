import { useQuery } from '@tanstack/react-query'
import { getAllRoles } from '../services/api/roles'
import { getAllStates } from '../services/api/estados'

export const useFunctions = () => {
    const {
        data: allroles,
        isLoading: isLoadingRoles,
        isError: isErrorRoles
    } = useQuery({
        queryKey: ['allRoles'],
        queryFn: getAllRoles,
        staleTime: Infinity,
        cacheTime: 5 * 60 * 1000
    })

    const {
        data: allstates,
        isLoading: isLoadingStates,
        isError: isErrorStates
    } = useQuery({
        queryKey: ['allStates'],
        queryFn: getAllStates,
        staleTime: Infinity,
        cacheTime: 5 * 60 * 1000
    })

    return {
        allroles,
        allstates,
        isLoading: isLoadingRoles|| isLoadingStates,
        isError: isErrorRoles || isErrorStates
    }
}
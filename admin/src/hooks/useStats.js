import { useQuery } from '@tanstack/react-query'
import { getCountUser, getUsersByDate } from '../services/api/usuarios'
import { getCountTeams } from '../services/api/equipos'
import { getCountLeagues } from '../services/api/ligas'
import { getCountMatches } from '../services/api/partidos'

export const useStats = () => {
    const {
        data: users,
        isLoading: isLoadingUsers,
        isError: isErrorUsers
    } = useQuery({
        queryKey: ['countUsers'],
        queryFn: getCountUser,
        staleTime: Infinity,
        cacheTime: 5 * 60 * 1000
    })

    const {
        data: teams,
        isLoading: isLoadingTeams,
        isError: isErrorTeams
    } = useQuery({
        queryKey: ['countTeams'],
        queryFn: getCountTeams,
        staleTime: Infinity,
        cacheTime: 5 * 60 * 1000
    })

    const {
        data: leagues,
        isLoading: isLoadingLeagues,
        isError: isErrorLeagues
    } = useQuery({
        queryKey: ['countLeagues'],
        queryFn: getCountLeagues,
        staleTime: Infinity,
        cacheTime: 5 * 60 * 1000
    })

    const {
        data: matches,
        isLoading: isLoadingMatches,
        isError: isErrorMatches
    } = useQuery({
        queryKey: ['countMatches'],
        queryFn: getCountMatches,
        staleTime: Infinity,
        cacheTime: 5 * 60 * 1000
    })

    const {
        data: userStats,
        isLoading: isLoadingUserStats,
        isError: isErrorUserStats
    } = useQuery({
        queryKey: ['countUserStats'],
        queryFn: getUsersByDate,
        staleTime: Infinity,
        cacheTime: 5 * 60 * 1000
    })

    return {
        users,
        teams,
        leagues,
        matches,
        userStats,
        isLoading: isLoadingUsers || isLoadingTeams || isLoadingLeagues || isLoadingMatches || isLoadingUserStats,
        isError: isErrorUsers || isErrorTeams || isErrorLeagues || isErrorMatches || isErrorUserStats
    }
}

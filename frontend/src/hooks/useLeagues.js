import { useQuery } from "@tanstack/react-query"
import { getLigues } from "../services/functions"

export const useLeagues = () => {

    function parseLigas(raw) {
        return Object.entries(raw).map(([key, value]) => ({
            id: key,
            nombre: key,
            logo: value.logo,
            color: value.color,
        }));
    }

    const { data: ligas,  isLoading: isLoadingLigas, isError: isErrorLigas } = useQuery({
        queryKey: ['ligas'],
        queryFn: async () => {
            const response = await getLigues()
            return parseLigas(response.ligas)
        },
        staleTime: 1000 * 60 * 30,
        cacheTime: 5 * 60 * 1000
    })

    return {
        ligas,
        isLoading: isLoadingLigas,
        isError: isErrorLigas,
    }
}
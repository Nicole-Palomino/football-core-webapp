import { useQuery } from "@tanstack/react-query"
import { getResumenesByPartido } from "../services/api/summaries"

export const useImages = (id_partido) => {

    const {
        data: matchImage,
        isLoading: isLoadingImage,
        isError: isErrorImage,
        error: errorImage
    } = useQuery({
        queryKey: ["matchImage", id_partido],
        queryFn: () => getResumenesByPartido(id_partido),
        staleTime: 1000 * 60 * 30,
        cacheTime: 5 * 60 * 1000
    })

    return {
        matchImage,
        isLoading: isLoadingImage,
        isError: isErrorImage,
        error: errorImage
    }
}
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

/**
 * Hook personalizado para consumir tu API con axiosInstance + react-query
 */

export const useApi = () => {
    const queryClient = useQueryClient()

    // ---- GET (lectura)
    const get = (key, url, options = {}) => {
        return useQuery({
            queryKey: Array.isArray(key) ? key : [key],
            queryFn: async () => {
                const { data } = await axiosInstance.get(url)
                return data
            },
            staleTime: 1000 * 60 * 5, // cache por 5 min
            refetchOnWindowFocus: false,
            retry: false,
            ...options,
        })
    }

    // ---- POST / PUT / PATCH / DELETE (mutaciones)
    const mutate = (method, url, options = {}) => {
        return useMutation({
            mutationFn: async (payload) => {
                const { data } = await axiosInstance[method](url, payload)
                return data
            },
            onSuccess: (data, variables, context) => {
                // invalida queries relacionadas (opcional)
                if (options.invalidateKeys) {
                    options.invalidateKeys.forEach((key) => {
                        queryClient.invalidateQueries({ queryKey: Array.isArray(key) ? key : [key] })
                    })
                }
                if (options.onSuccess) {
                    options.onSuccess(data, variables, context)
                }
            },
            ...options,
        })
    }

    return {
        get,
        post: (url, options) => mutate("post", url, options),
        put: (url, options) => mutate("put", url, options),
        patch: (url, options) => mutate("patch", url, options),
        del: (url, options) => mutate("delete", url, options),
    }
}
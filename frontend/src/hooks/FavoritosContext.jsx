import { createContext, useContext, useCallback, useMemo } from 'react'
import { getFavorites, addFavorite as apiAddFavorite, deleteFavorite as apiDeleteFavorite } from '../services/api/favorites'
import { getStoredUser } from '../services/auth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const FavoritosContext = createContext()

export const FavoritosProvider = ({ children }) => {
    const queryClient = useQueryClient()
    const user = getStoredUser()
    const id_usuario = user?.id_usuario

    const {
        data: favoritos = [],
        isLoading: loadingFavoritos,
        isError,
        error
    } = useQuery({
        queryKey: ['favorites', id_usuario],
        queryFn: async () => {
            const favoritosData = await getFavorites(id_usuario)
            return favoritosData || []
        },
        enabled: !!id_usuario,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

    const addFavoriteMutation = useMutation({
        mutationFn: ({ partidoId, id_usuario }) => apiAddFavorite(partidoId, id_usuario),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites', id_usuario] })
        },
    })

    const deleteFavoriteMutation = useMutation({
        mutationFn: ({ partidoId, id_usuario }) => apiDeleteFavorite(partidoId, id_usuario),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites', id_usuario] })
        },
    })

    const toggleFavorite = useCallback(async (partidoId) => {
        if (!id_usuario) {
            console.warn("No hay usuario logueado para añadir/eliminar favoritos.")
            return
        }
        if (favoritos.some(fav => fav.id_partido === partidoId)) {
            deleteFavoriteMutation.mutate({ partidoId, id_usuario })
        } else {
            addFavoriteMutation.mutate({ partidoId, id_usuario })
        }
    }, [favoritos, id_usuario, addFavoriteMutation, deleteFavoriteMutation])

    const value = useMemo(() => ({
        favoritos,
        loadingFavoritos,
        isError,
        error,
        toggleFavorite,
        addFavoriteMutation,
        deleteFavoriteMutation
    }), [favoritos, loadingFavoritos, isError, error, toggleFavorite, addFavoriteMutation, deleteFavoriteMutation])

    return (
        <FavoritosContext.Provider value={value}>
            {children}
        </FavoritosContext.Provider>
    )
}

export const useFavoritos = () => {
    const context = useContext(FavoritosContext);
    if (context === undefined) {
        throw new Error('useFavoritos debe usarse dentro de un FavoritosProvider')
    }
    return context
}
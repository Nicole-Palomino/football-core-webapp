// src/contexts/FavoritosContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getFavorites, addFavorite as apiAddFavorite, deleteFavorite as apiDeleteFavorite } from '../services/favorites';
import { getStoredUser } from '../services/auth';

const FavoritosContext = createContext();

export const FavoritosProvider = ({ children }) => {
    const [favoritosIds, setFavoritosIds] = useState([]);
    const [loadingFavoritos, setLoadingFavoritos] = useState(true);
    const user = getStoredUser();
    const id_usuario = user?.id_usuario;

    const fetchFavoritos = useCallback(async () => {
        if (!id_usuario) {
            setLoadingFavoritos(false);
            return;
        }
        setLoadingFavoritos(true);
        try {
            const favoritos = await getFavorites(id_usuario);
            const ids = favoritos.map(f => f.id_partido);
            setFavoritosIds(ids);
        } catch (error) {
            console.error("Error al cargar favoritos desde el contexto:", error);
            setFavoritosIds([]); // En caso de error, limpiar favoritos
        } finally {
            setLoadingFavoritos(false);
        }
    }, [id_usuario]);

    useEffect(() => {
        fetchFavoritos();
    }, [fetchFavoritos]); // Se ejecutará cuando fetchFavoritos cambie (id_usuario cambia)

    const toggleFavorite = useCallback(async (partidoId) => {
        if (!id_usuario) {
            console.warn("No hay usuario logueado para añadir/eliminar favoritos.");
            return false;
        }
        try {
            if (favoritosIds.includes(partidoId)) {
                await apiDeleteFavorite(partidoId, id_usuario);
                setFavoritosIds(prev => prev.filter(id => id !== partidoId));
                return 'removed';
            } else {
                await apiAddFavorite(partidoId, id_usuario);
                setFavoritosIds(prev => [...prev, partidoId]);
                return 'added';
            }
        } catch (error) {
            console.error("Error al alternar favorito:", error);
            // Si hay un error, el estado local no cambia para reflejar el fallo del backend
            return 'error';
        }
    }, [favoritosIds, id_usuario]);

    return (
        <FavoritosContext.Provider value={{ favoritosIds, loadingFavoritos, toggleFavorite, fetchFavoritos }}>
            {children}
        </FavoritosContext.Provider>
    );
};

export const useFavoritos = () => {
    const context = useContext(FavoritosContext);
    if (context === undefined) {
        throw new Error('useFavoritos debe usarse dentro de un FavoritosProvider');
    }
    return context;
};
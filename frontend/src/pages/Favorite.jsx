import { useState } from 'react'
import { deleteFavorite } from '../services/api/favorites'
import { formatFecha } from '../utils/helpers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useFavoritos } from '../hooks/FavoritosContext'
import { useNavigate } from 'react-router-dom'
import LoadingFavorite from '../components/Loading/LoadingFavorite'
import Header from '../components/Forms/controls/Header'
import {
    HeartIcon,
    InformationCircleIcon,
    DocumentTextIcon,
    ClockIcon
} from '@heroicons/react/24/solid'
import {
    HeartIcon as HeartOutlineIcon
} from '@heroicons/react/24/outline'
import { useThemeMode } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContexts'

const Favorite = () => {
    const { user } = useAuth()
    const id_usuario = user?.id_usuario
    const queryClient = useQueryClient()
    const [hoveredItem, setHoveredItem] = useState(null)
    const [loadingDelete, setLoadingDelete] = useState(null)
    const navigate = useNavigate()
    const { currentTheme } = useThemeMode()

    const { favoritos: favoriteMatches, loadingFavoritos: isLoading, isError, error } = useFavoritos()

    const deleteFavoriteMutation = useMutation({
        mutationFn: (matchId) => deleteFavorite(matchId, id_usuario),
        onMutate: async (matchId) => {
            setLoadingDelete(matchId)
            await queryClient.cancelQueries(['favorites', id_usuario])
            const previousFavorites = queryClient.getQueryData(['favorites', id_usuario])
            queryClient.setQueryData(['favorites', id_usuario], old => old?.filter(m => m.id_partido !== matchId))
            return { previousFavorites }
        },
        onSuccess: () => {
            setLoadingDelete(null)
            queryClient.invalidateQueries({ queryKey: ['favorites', id_usuario] })
        },
        onError: (err, variables, context) => {
            setLoadingDelete(null)
            queryClient.setQueryData(['favorites', id_usuario], context.previousFavorites)
            console.error("Error al eliminar favorito. Revertiendo:", err)
        },
    })

    const handleInfoClick = (team1_id, team2_id, partido_id) => {
        navigate(`/dashboard/${partido_id}`, {
            state: {
                equipo_local: team1_id,
                equipo_visita: team2_id
            }
        })
    }

    const handleRemoveFavorite = (matchId) => {
        deleteFavoriteMutation.mutate(matchId)
    }

    const getStatusConfig = (status) => {
        switch (status) {
            case 'Finalizado':
            case 'Histórico':
                return {
                    color: 'bg-green-500',
                    textColor: 'text-green-500',
                    bgColor: 'bg-green-500/10',
                    label: 'FINALIZADO',
                    icon: DocumentTextIcon,
                    actionLabel: 'Resumen'
                }
            case 'Programado':
                return {
                    color: 'bg-blue-500',
                    textColor: 'text-blue-500',
                    bgColor: 'bg-blue-500/10',
                    label: 'PRÓXIMO',
                    icon: InformationCircleIcon,
                    actionLabel: 'Análisis'
                }
            default:
                return {
                    color: 'bg-gray-500',
                    textColor: 'text-gray-500',
                    bgColor: 'bg-gray-500/10',
                    label: 'PROGRAMADO',
                    icon: ClockIcon,
                    actionLabel: 'Info'
                }
        }
    }

    if (isLoading) {
        return (
            <LoadingFavorite />
        )
    }

    if (isError) {
        return (
            <div className={`min-h-screen ${currentTheme.background} flex items-center justify-center p-4`}>
                <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-8 text-center max-w-md w-full`}>
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className={`${currentTheme.text} text-2xl font-bold mb-2`}>Error al cargar favoritos</h2>
                    <p className={`${currentTheme.textSecondary} text-sm`}>{error.message}</p>
                </div>
            </div>
        )
    }

    return (
        <div className={`min-h-screen ${currentTheme.background}`}>
            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Header */}
                <Header
                    title='Mis Favoritos'
                    subtitle={`${favoriteMatches.length} ${favoriteMatches.length === 1 ? 'partido favorito' : 'partidos favoritos'}`}
                />

                {/* Matches List */}
                {favoriteMatches.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-12 text-center`}
                    >
                        <div className="relative">
                            <HeartOutlineIcon className="w-24 h-24 mx-auto mb-6 text-gray-400 opacity-50" />
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur-xl"></div>
                        </div>
                        <h3 className={`${currentTheme.text} text-3xl font-bold mb-4`}>
                            No tienes favoritos aún
                        </h3>
                        <p className={`${currentTheme.textSecondary} text-lg max-w-md mx-auto`}>
                            Agrega partidos a tus favoritos desde la lista principal para verlos aquí
                        </p>
                    </motion.div>
                ) : (
                    <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl overflow-hidden`}>
                        <div className="divide-y divide-gray-800">
                            {favoriteMatches.map((match, index) => {
                                const partido = match.partido
                                const status = partido.estado.nombre_estado
                                const statusConfig = getStatusConfig(status)
                                const StatusIcon = statusConfig.icon
                                const isHovered = hoveredItem === partido.id_partido
                                const isDeleting = loadingDelete === partido.id_partido

                                return (
                                    <motion.div
                                        key={partido.id_partido}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        onMouseEnter={() => setHoveredItem(partido.id_partido)}
                                        onMouseLeave={() => setHoveredItem(null)}
                                        className={`p-4 transition-all duration-300 relative overflow-hidden group ${isHovered ? 'transform translate-x-2' : ''
                                            }`}
                                    >
                                        {/* Background gradient on hover */}
                                        <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''
                                            }`}></div>

                                        <div className="relative z-10 flex items-center justify-between">
                                            {/* Left Section: Status Badge */}
                                            <div className="flex-shrink-0">
                                                <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusConfig.color} text-white`}>
                                                    {statusConfig.label}
                                                </div>
                                            </div>

                                            {/* Center Section: Teams */}
                                            <div className="flex-1 mx-6 min-w-0">
                                                <div className="space-y-3">
                                                    {/* Home Team */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                                                <img
                                                                    src={partido.equipo_local.logo}
                                                                    alt={partido.equipo_local.nombre_equipo}
                                                                    className="w-full h-full object-contain"
                                                                />
                                                            </div>
                                                            <span className={`${currentTheme.text} font-medium text-sm truncate`}>
                                                                {partido.equipo_local.nombre_equipo}
                                                            </span>
                                                        </div>
                                                        <div className={`${currentTheme.text} font-bold text-lg min-w-[32px] text-center`}>
                                                            {partido.estadisticas?.FTHG ?? '-'}
                                                        </div>
                                                    </div>

                                                    {/* Away Team */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                                                <img
                                                                    src={partido.equipo_visita.logo}
                                                                    alt={partido.equipo_visita.nombre_equipo}
                                                                    className="w-full h-full object-contain"
                                                                />
                                                            </div>
                                                            <span className={`${currentTheme.text} font-medium text-sm truncate`}>
                                                                {partido.equipo_visita.nombre_equipo}
                                                            </span>
                                                        </div>
                                                        <div className={`${currentTheme.text} font-bold text-lg min-w-[32px] text-center`}>
                                                            {partido.estadisticas?.FTAG ?? '-'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Section: League & Date */}
                                            <div className="flex flex-col items-center text-center mr-6">
                                                <div className="text-blue-400 text-xs font-bold mb-1">
                                                    {partido.liga.nombre_liga}
                                                </div>
                                                <div className={`${currentTheme.textSecondary} text-xs`}>
                                                    {formatFecha(partido.dia)}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2">
                                                {/* Info Button */}
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleInfoClick(
                                                        partido.equipo_local.nombre_equipo,
                                                        partido.equipo_visita.nombre_equipo,
                                                        partido.id_partido
                                                    )}
                                                    className={`p-2.5 rounded-lg ${statusConfig.bgColor} ${currentTheme.hover} transition-colors duration-200 group/btn`}
                                                    title={statusConfig.actionLabel}
                                                >
                                                    <StatusIcon className={`w-4 h-4 ${statusConfig.textColor}`} />
                                                </motion.button>

                                                {/* Remove Favorite Button */}
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleRemoveFavorite(partido.id_partido)}
                                                    disabled={isDeleting}
                                                    className="p-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors duration-200 group/btn"
                                                    title="Quitar de favoritos"
                                                >
                                                    {isDeleting ? (
                                                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <HeartIcon className="w-4 h-4 text-red-500" />
                                                    )}
                                                </motion.button>
                                            </div>
                                        </div>

                                        {/* Match Status Indicator */}
                                        {status === "Finalizado" && (
                                            <div className="absolute top-3 right-3">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            </div>
                                        )}
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Favorite
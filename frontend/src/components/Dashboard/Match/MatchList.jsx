import { useThemeMode } from '../../../contexts/ThemeContext'
import FavoriteStar from '../Favorites/FavoriteStar'
import { useFavoritos } from '../../../hooks/FavoritosContext'
import { formatFecha } from '../../../utils/helpers'
import { useNavigate } from 'react-router-dom'
import LoadingFavorite from "../../Loading/LoadingFavorite"
import {
    InformationCircleIcon,
    LightBulbIcon,
    DocumentTextIcon,
    PhotoIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import React from "react"
import { formatOnlyTime } from "../../../utils/utils"

const MatchList = React.memo(({ partidos, type }) => {
    const { loadingFavoritos } = useFavoritos()
    const navigate = useNavigate()
    const { currentTheme } = useThemeMode()

    const onInfoClick = (team1_id, team2_id, partido_id) => {
        navigate(`/dashboard/${partido_id}`, {
            state: {
                equipo_local: team1_id,
                equipo_visita: team2_id
            }
        })
    }

    const onPrediccionClick = (team1_id, team2_id, partido_id) => {
        navigate(`/dashboard/predicciones/${partido_id}`, {
            state: {
                equipo_local: team1_id,
                equipo_visita: team2_id
            }
        })
    }

    const onResumenClick = (team1_id, team2_id, partido_id) => {
        navigate(`/dashboard/summary/${partido_id}`, {
            state: {
                equipo_local: team1_id,
                equipo_visita: team2_id
            }
        })
    }

    const onImagenesClick = (partido_id) => {
        navigate(`/dashboard/imagenes/${partido_id}`)
    }

    if (loadingFavoritos) {
        <LoadingFavorite />
    }

    return (
        <div className="space-y-1">
            {partidos.map((partido, index) => (
                <motion.div
                    key={partido.id_partido}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-4 
                           hover:shadow-lg transition-all duration-300 group relative overflow-hidden`}
                >
                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10 flex items-center justify-between">
                        {/* Left section: Favorite + Teams */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            {/* Favorite Star */}
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-shrink-0"
                            >
                                <FavoriteStar partidoId={partido.id_partido} />
                            </motion.div>

                            {/* Teams Container */}
                            <div className="flex-1 min-w-0 space-y-2">
                                {/* Home Team */}
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
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
                                    <div className={`${currentTheme.text} font-bold text-lg min-w-[28px] text-center`}>
                                        {partido.estadisticas?.FTHG ?? ""}
                                    </div>
                                </div>

                                {/* Away Team */}
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
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
                                    <div className={`${currentTheme.text} font-bold text-lg min-w-[28px] text-center`}>
                                        {partido.estadisticas?.FTAG ?? ""}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right section: Date + Actions */}
                        <div className="flex flex-col items-end gap-2 ml-4">
                            {/* Date & Time */}
                            <div className="text-right">
                                <div className={`${currentTheme.textSecondary} text-xs font-medium`}>
                                    {formatFecha(partido.dia)}
                                </div>
                                <div className={`${currentTheme.textSecondary} text-xs`}>
                                    {formatOnlyTime(partido.hora)}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1">
                            {type === "por-jugar" ? (
                                    <>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => onInfoClick(
                                                partido.equipo_local.nombre_equipo,
                                                partido.equipo_visita.nombre_equipo,
                                                partido.id_partido
                                            )}
                                            className={`p-2 rounded-lg ${currentTheme.hover} transition-colors duration-200 group/btn`}
                                            title="Análisis"
                                        >
                                            <InformationCircleIcon className={`w-4 h-4 ${currentTheme.textSecondary} group-hover/btn:text-blue-500 transition-colors`} />
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => onPrediccionClick(
                                                partido.equipo_local.nombre_equipo,
                                                partido.equipo_visita.nombre_equipo,
                                                partido.id_partido
                                            )}
                                            className={`p-2 rounded-lg ${currentTheme.hover} transition-colors duration-200 group/btn`}
                                            title="Predicciones"
                                        >
                                            <LightBulbIcon className={`w-4 h-4 ${currentTheme.textSecondary} group-hover/btn:text-yellow-500 transition-colors`} />
                                        </motion.button>
                                    </>
                                ) : (
                                    <>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => onResumenClick(
                                                partido.equipo_local.nombre_equipo,
                                                partido.equipo_visita.nombre_equipo,
                                                partido.id_partido
                                            )}
                                            className={`p-2 rounded-lg ${currentTheme.hover} transition-colors duration-200 group/btn`}
                                            title="Resumen"
                                        >
                                            <DocumentTextIcon className={`w-4 h-4 ${currentTheme.textSecondary} group-hover/btn:text-green-500 transition-colors`} />
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => onImagenesClick(partido.id_partido)}
                                            className={`p-2 rounded-lg ${currentTheme.hover} transition-colors duration-200 group/btn`}
                                            title="Imágenes"
                                        >
                                            <PhotoIcon className={`w-4 h-4 ${currentTheme.textSecondary} group-hover/btn:text-purple-500 transition-colors`} />
                                        </motion.button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Match Status Indicator */}
                    {type === "finalizados" && (
                        <div className="absolute top-2 right-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    )
})

export default MatchList
import { useNavigate, useParams } from 'react-router-dom'
import LoadingSpinner from '../../Loading/LoadingSpinner'
import { motion } from 'framer-motion'
import { formatFecha } from '../../../utils/helpers'
import CustomImage from '../Details/CustomImage'
import { ArrowLeftIcon, CalendarDaysIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline'
import { useThemeMode } from '../../../contexts/ThemeContext'
import { useMatches } from '../../../hooks/useMatch'

const MatchImage = () => {

    const { currentTheme } = useThemeMode()
    const { id_partido } = useParams()
    const navigate = useNavigate()

    const { matchData, isLoading, isError, error } = useMatches(id_partido)
    
    if (isLoading) return <LoadingSpinner />

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-6 max-w-md w-full text-center`}>
                    <h2 className={`${currentTheme.text} text-xl font-bold mb-4`}>Error al cargar datos</h2>
                    {isError && <p className={`${currentTheme.textSecondary} text-sm`}>Match by ID: {error.message}</p>}
                </div>
            </div>
        )
    }

    const finalMatchDataAsArray = matchData
        ? (Array.isArray(matchData) ? matchData : [matchData])
        : []

    const handleGoBack = () => navigate(-1)

    return (
        <div className={`min-h-screen ${currentTheme.background}`}>
            {/* Header con botón de regreso */}
            <div className={`sticky top-0 z-50 backdrop-blur-xl ${currentTheme.card} border-b ${currentTheme.border}`}>
                <div className="max-w-6xl mx-auto px-4 py-3">
                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleGoBack}
                            className={`p-3 rounded-xl ${currentTheme.hover} ${currentTheme.border} border transition-all duration-200 group`}
                            title="Regresar"
                        >
                            <ArrowLeftIcon className={`w-5 h-5 ${currentTheme.text} group-hover:text-blue-500 transition-colors`} />
                        </motion.button>
                        <h1 className={`${currentTheme.text} text-xl md:text-2xl font-bold flex-1`}>
                            Detalles del Partido
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-4 md:py-8">
                {finalMatchDataAsArray.map((partidoID, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl overflow-hidden shadow-2xl`}>
                            {/* Header - Liga */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-4 px-6">
                                <h2 className="text-white text-xl md:text-2xl font-bold text-center">
                                    {partidoID.liga?.nombre_liga}
                                </h2>
                            </div>

                            {/* Información del partido */}
                            <div className="p-4 md:p-8">
                                {/* Estadio y fecha */}
                                <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className={`flex items-center gap-2 ${currentTheme.card} ${currentTheme.border} border rounded-xl px-4 py-2 shadow-lg`}
                                    >
                                        <BuildingOffice2Icon className="w-5 h-5 text-blue-500" />
                                        <span className={`${currentTheme.text} font-medium`}>
                                            {partidoID.equipo_local?.estadio}
                                        </span>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className={`flex items-center gap-2 ${currentTheme.card} ${currentTheme.border} border rounded-xl px-4 py-2 shadow-lg`}
                                    >
                                        <CalendarDaysIcon className="w-5 h-5 text-blue-500" />
                                        <span className={`${currentTheme.text} font-medium`}>
                                            {formatFecha(partidoID.dia)}
                                        </span>
                                    </motion.div>
                                </div>

                                {/* Equipos y marcador */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-8">
                                    {/* Equipo Local */}
                                    <div className="flex justify-center md:justify-start">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.2 }}
                                            className={`${currentTheme.card} ${currentTheme.border} border-2 rounded-2xl p-4 md:p-6 text-center min-w-[120px] md:min-w-[160px]`}
                                        >
                                            <div className="w-12 h-12 md:w-20 md:h-20 mx-auto mb-3 rounded-full overflow-hidden bg-gray-100">
                                                <img
                                                    src={partidoID.equipo_local?.logo}
                                                    alt={partidoID.equipo_local?.nombre_equipo}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <h3 className={`${currentTheme.text} font-bold text-sm md:text-lg break-words`}>
                                                {partidoID.equipo_local?.nombre_equipo}
                                            </h3>
                                        </motion.div>
                                    </div>

                                    {/* Marcador */}
                                    <div className="flex justify-center order-first md:order-none">
                                        <div className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-4 md:p-6 text-center min-w-[140px] md:min-w-[200px]`}>
                                            <div className="text-xs md:text-sm font-bold text-blue-500 mb-2 uppercase tracking-wide">
                                                Resultado
                                            </div>
                                            <div className="flex items-center justify-center gap-2">
                                                <span className={`${currentTheme.text} text-2xl md:text-5xl font-bold`}>
                                                    {partidoID.estadisticas?.FTHG ?? ""}
                                                </span>
                                                <div className="w-4 h-0.5 bg-blue-500 mx-1"></div>
                                                <span className={`${currentTheme.text} text-2xl md:text-5xl font-bold`}>
                                                    {partidoID.estadisticas?.FTAG ?? ""}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Equipo Visitante */}
                                    <div className="flex justify-center md:justify-end">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.2 }}
                                            className={`${currentTheme.card} ${currentTheme.border} border-2 rounded-2xl p-4 md:p-6 text-center min-w-[120px] md:min-w-[160px]`}
                                        >
                                            <div className="w-12 h-12 md:w-20 md:h-20 mx-auto mb-3 rounded-full overflow-hidden bg-gray-100">
                                                <img
                                                    src={partidoID.equipo_visita?.logo}
                                                    alt={partidoID.equipo_visita?.nombre_equipo}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <h3 className={`${currentTheme.text} font-bold text-sm md:text-lg break-words`}>
                                                {partidoID.equipo_visita?.nombre_equipo}
                                            </h3>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Custom Image Component */}
                                <div className="w-full">
                                    <div className={`border-t ${currentTheme.border} pt-6`}>
                                        <CustomImage id_partido={id_partido} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default MatchImage
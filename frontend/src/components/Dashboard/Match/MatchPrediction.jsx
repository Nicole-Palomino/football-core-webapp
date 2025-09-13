import { useLocation, useNavigate, useParams } from 'react-router-dom'
import LoadingSpinner from '../../Loading/LoadingSpinner'
import { motion } from 'framer-motion'
import { formatFecha } from '../../../utils/helpers'
import CustomPrediction from '../Details/CustomPrediction'
import {
    ArrowLeftIcon,
    MapPinIcon,
    CalendarDaysIcon,
    DocumentArrowDownIcon
} from '@heroicons/react/24/outline'
import { useThemeMode } from '../../../contexts/ThemeContext'
import { useMatches } from '../../../hooks/useMatch'
import { useDownloadStats } from '../../../hooks/useDownloadStats'

const MatchPrediction = () => {

    const { currentTheme } = useThemeMode()
    const { id_partido } = useParams()
    const location = useLocation()
    const navigate = useNavigate()

    const equipo_local = location.state?.equipo_local
    const equipo_visita = location.state?.equipo_visita

    const { matchData, isLoading, isError, error } = useMatches(id_partido)
    const { statsRef, downloadAsPNG, downloadAsPDF } = useDownloadStats()
    const nombre_liga = matchData?.liga?.nombre_liga

    if (isLoading) return <LoadingSpinner />

    if (isError) {
        return (
            <div className={`${currentTheme.background} min-h-screen flex items-center justify-center`}>
                <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-6`}>
                    <h2 className={`${currentTheme.text} text-xl font-bold mb-2`}>Error al cargar datos</h2>
                    {isError && <p className={`${currentTheme.textSecondary}`}>Match by ID: {error.message}</p>}
                </div>
            </div>
        )
    }

    const finalMatchDataAsArray = matchData
        ? (Array.isArray(matchData) ? matchData : [matchData])
        : []

    const handleGoBack = () => navigate(-1)

    return (
        <div className={`${currentTheme.background} min-h-screen`}>
            {/* Header with back button */}
            <div className={`sticky top-0 z-50 ${currentTheme.card} backdrop-blur-xl border-b ${currentTheme.border}`}>
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleGoBack}
                                className={`p-2 rounded-xl ${currentTheme.hover} transition-colors duration-200`}
                            >
                                <ArrowLeftIcon className={`w-5 h-5 ${currentTheme.text}`} />
                            </motion.button>
                            <h1 className={`${currentTheme.text} text-xl font-bold`}>
                                Predicciones del Partido
                            </h1>
                        </div>

                        {/* Download buttons */}
                        <div className="flex items-center gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => downloadAsPNG('predicciones', equipo_local, equipo_visita)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                            >
                                <DocumentArrowDownIcon className="w-4 h-4" />
                                <span className="hidden sm:inline">PNG</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => downloadAsPDF('predicciones', equipo_local, equipo_visita)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                            >
                                <DocumentArrowDownIcon className="w-4 h-4" />
                                <span className="hidden sm:inline">PDF</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6" ref={statsRef}>
                {finalMatchDataAsArray.map((partidoID, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl overflow-hidden shadow-xl`}
                    >
                        {/* League Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-4">
                            <div className="text-center">
                                <h2 className="text-white text-2xl font-bold">
                                    {partidoID.liga?.nombre_liga}
                                </h2>
                            </div>
                        </div>

                        {/* Match Info */}
                        <div className="p-6">
                            {/* Stadium and Date */}
                            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${currentTheme.hover} ${currentTheme.border} border`}>
                                    <MapPinIcon className="w-5 h-5 text-blue-500" />
                                    <span className={`${currentTheme.text} font-medium`}>
                                        {partidoID.equipo_local?.estadio}
                                    </span>
                                </div>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${currentTheme.hover} ${currentTheme.border} border`}>
                                    <CalendarDaysIcon className="w-5 h-5 text-blue-500" />
                                    <span className={`${currentTheme.text} font-medium`}>
                                        {formatFecha(partidoID.dia)}
                                    </span>
                                </div>
                            </div>

                            {/* Teams and Score */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-8">
                                {/* Home Team */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className={`flex flex-col items-center p-6 rounded-xl ${currentTheme.hover} ${currentTheme.border} border-2`}
                                >
                                    <div className="w-20 h-20 mb-4 rounded-full overflow-hidden bg-gray-100">
                                        <img
                                            src={partidoID.equipo_local?.logo}
                                            alt={partidoID.equipo_local?.nombre_equipo}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <h3 className={`${currentTheme.text} text-lg font-bold text-center`}>
                                        {partidoID.equipo_local?.nombre_equipo}
                                    </h3>
                                </motion.div>

                                {/* Score */}
                                <div className="flex flex-col items-center py-8">
                                    <span className={`${currentTheme.textSecondary} text-sm font-medium mb-2`}>
                                        RESULTADO
                                    </span>
                                    <div className="flex items-center gap-4">
                                        <span className={`${currentTheme.text} text-4xl font-bold`}>
                                            {partidoID.estadisticas?.FTHG ?? " "}
                                        </span>
                                        <span className="text-blue-500 text-3xl">-</span>
                                        <span className={`${currentTheme.text} text-4xl font-bold`}>
                                            {partidoID.estadisticas?.FTAG ?? " "}
                                        </span>
                                    </div>
                                </div>

                                {/* Away Team */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className={`flex flex-col items-center p-6 rounded-xl ${currentTheme.hover} ${currentTheme.border} border-2`}
                                >
                                    <div className="w-20 h-20 mb-4 rounded-full overflow-hidden bg-gray-100">
                                        <img
                                            src={partidoID.equipo_visita?.logo}
                                            alt={partidoID.equipo_visita?.nombre_equipo}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <h3 className={`${currentTheme.text} text-lg font-bold text-center`}>
                                        {partidoID.equipo_visita?.nombre_equipo}
                                    </h3>
                                </motion.div>
                            </div>

                            {/* Predictions Section */}
                            <div className={`border-t ${currentTheme.border} pt-6`}>
                                <CustomPrediction
                                    equipo_local={equipo_local}
                                    equipo_visita={equipo_visita}
                                    nombre_liga={nombre_liga}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default MatchPrediction
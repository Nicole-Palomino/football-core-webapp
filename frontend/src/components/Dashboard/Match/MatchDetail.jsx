import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatFecha } from '../../../utils/helpers'
import LoadingSpinner from '../../Loading/LoadingSpinner'
import CustomStats from '../Details/CustomStats'
import CustomAnalysis from '../Details/CustomAnalysis'
import { useThemeMode } from '../../../contexts/ThemeContext'
import {
    ArrowLeftIcon,
    CalendarDaysIcon,
    BuildingOfficeIcon,
    ChartBarIcon,
    DocumentTextIcon,
} from '@heroicons/react/24/outline'
import { useMatches } from '../../../hooks/useMatch'

const MatchDetail = () => {
    const { currentTheme } = useThemeMode()
    const { id_partido } = useParams()
    const location = useLocation()
    const [activeTab, setActiveTab] = useState(0)
    const navigate = useNavigate()

    const equipo_local = location.state?.equipo_local
    const equipo_visita = location.state?.equipo_visita

    const { matchData, isLoading, isError, error } = useMatches(id_partido)
    const nombre_liga = matchData?.liga?.nombre_liga

    if (isLoading) return <LoadingSpinner />

    if (isError) {
        return (
            <div className={`min-h-screen ${currentTheme.background} flex items-center justify-center`}>
                <div className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-8 text-center`}>
                    <h2 className={`text-2xl font-bold ${currentTheme.text} mb-4`}>Error al cargar datos</h2>
                    <p className={`${currentTheme.textSecondary}`}>Match by ID: {error.message}</p>
                </div>
            </div>
        )
    }

    const finalMatchDataAsArray = matchData
        ? (Array.isArray(matchData) ? matchData : [matchData])
        : []
    
    const handleGoBack = () => navigate(-1)

    const tabs = [
        {
            id: 0,
            label: "Estadísticas",
            icon: <ChartBarIcon className="w-5 h-5" />,
            component: <CustomStats 
                equipo_local={equipo_local}
                equipo_visita={equipo_visita}
                nombre_liga={nombre_liga}
            />
        },
        {
            id: 1,
            label: "Análisis",
            icon: <DocumentTextIcon className="w-5 h-5" />,
            component: <CustomAnalysis 
                equipo_local={equipo_local}
                equipo_visita={equipo_visita}
                nombre_liga={nombre_liga}
            />
        }
    ]

    return (
        <div className={`min-h-screen ${currentTheme.background}`}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`sticky top-0 z-50 ${currentTheme.card} ${currentTheme.border} border-b backdrop-blur-xl bg-opacity-80`}
            >
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05, x: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleGoBack}
                            className={`flex items-center justify-center w-12 h-12 ${currentTheme.hover} ${currentTheme.border} border rounded-xl transition-all duration-300 group`}
                        >
                            <ArrowLeftIcon className={`w-5 h-5 ${currentTheme.text} group-hover:text-blue-500`} />
                        </motion.button>
                        <h1 className={`text-2xl font-bold ${currentTheme.text}`}>
                            Detalles del Partido
                        </h1>
                    </div>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 py-8">
                {finalMatchDataAsArray.map((partidoID, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8"
                    >
                        {/* Liga Header */}
                        <div className={`${currentTheme.card} ${currentTheme.border} border rounded-3xl overflow-hidden shadow-xl`}>
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-6">
                                <h2 className="text-white text-2xl font-bold text-center">
                                    {partidoID.liga?.nombre_liga}
                                </h2>
                            </div>

                            {/* Match Info */}
                            <div className="p-8">
                                {/* Stadium and Date */}
                                <div className="flex justify-center items-center gap-6 mb-8 flex-wrap">
                                    <div className={`flex items-center gap-2 ${currentTheme.card} ${currentTheme.border} border rounded-xl px-4 py-2 shadow-md`}>
                                        <BuildingOfficeIcon className="w-5 h-5 text-blue-500" />
                                        <span className={`${currentTheme.text} font-medium`}>
                                            {partidoID.equipo_local?.estadio}
                                        </span>
                                    </div>
                                    <div className={`flex items-center gap-2 ${currentTheme.card} ${currentTheme.border} border rounded-xl px-4 py-2 shadow-md`}>
                                        <CalendarDaysIcon className="w-5 h-5 text-blue-500" />
                                        <span className={`${currentTheme.text} font-medium`}>
                                            {formatFecha(partidoID.dia)}
                                        </span>
                                    </div>
                                </div>

                                {/* Teams and Score */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-8">
                                    {/* Home Team */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className={`${currentTheme.card} ${currentTheme.border} border-2 rounded-2xl p-6 text-center group hover:shadow-lg transition-all duration-300`}
                                    >
                                        <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                                            <img 
                                                src={partidoID.equipo_local?.logo}
                                                alt={partidoID.equipo_local?.nombre_equipo}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <h3 className={`${currentTheme.text} font-bold text-lg break-words`}>
                                            {partidoID.equipo_local?.nombre_equipo}
                                        </h3>
                                    </motion.div>

                                    {/* Score */}
                                    <div className="text-center">
                                        <div className={`${currentTheme.text} text-xs font-medium mb-2 text-blue-500`}>
                                            RESULTADO
                                        </div>
                                        <div className="flex items-center justify-center gap-4">
                                            <span className={`${currentTheme.text} text-4xl md:text-6xl font-bold`}>
                                                {partidoID.estadisticas?.FTHG ?? " "}
                                            </span>
                                            <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                                            <span className={`${currentTheme.text} text-4xl md:text-6xl font-bold`}>
                                                {partidoID.estadisticas?.FTAG ?? " "}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Away Team */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className={`${currentTheme.card} ${currentTheme.border} border-2 rounded-2xl p-6 text-center group hover:shadow-lg transition-all duration-300`}
                                    >
                                        <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                                            <img 
                                                src={partidoID.equipo_visita?.logo}
                                                alt={partidoID.equipo_visita?.nombre_equipo}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <h3 className={`${currentTheme.text} font-bold text-lg break-words`}>
                                            {partidoID.equipo_visita?.nombre_equipo}
                                        </h3>
                                    </motion.div>
                                </div>

                                {/* Tabs Navigation */}
                                <div className={`${currentTheme.border} border-b mb-6`}>
                                    <div className="flex justify-center">
                                        {tabs.map((tab) => (
                                            <motion.button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 transition-all duration-300 relative ${
                                                    activeTab === tab.id
                                                        ? `${currentTheme.text} border-b-2 border-blue-500`
                                                        : `${currentTheme.textSecondary} hover:${currentTheme.text}`
                                                }`}
                                            >
                                                <div className={`${activeTab === tab.id ? 'text-blue-500' : currentTheme.textSecondary}`}>
                                                    {tab.icon}
                                                </div>
                                                <span className={`font-semibold ${activeTab === tab.id ? 'text-blue-500' : currentTheme.text}`}>
                                                    {tab.label}
                                                </span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Tab Content */}
                                <div className="min-h-[600px] flex justify-center items-start">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="w-full max-w-[1200px]"
                                    >
                                        {tabs[activeTab]?.component}
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default MatchDetail
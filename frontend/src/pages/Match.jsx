import { useState } from 'react'
import { useAuth } from '../contexts/AuthContexts'
import { useThemeMode } from '../contexts/ThemeContext'
import MatchTabs from '../components/Dashboard/Match/MatchTabs'
import LoadingSpinner from '../components/Loading/LoadingSpinner'
import EmptyMessage from '../utils/empty'
import { useEstadoMatches, usePartidosFinalizados, usePartidosPorJugar } from '../contexts/MatchesContext'
import { motion } from 'framer-motion'
import {
    CalendarDaysIcon,
    ClockIcon,
    TrophyIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline'

const Match = () => {

    const [value, setValue] = useState(0)
    const { isAuthenticated } = useAuth()
    const { currentTheme } = useThemeMode()
    const partidosPorJugar = usePartidosPorJugar()
    const partidosFinalizados = usePartidosFinalizados()
    const { isLoading, isError, error } = useEstadoMatches()

    if (isLoading) return <LoadingSpinner />
    if (isError) return <div>Error: {error.message}</div>

    if (!isAuthenticated) {
        return <EmptyMessage text="Inicia sesión para ver partidos" />
    }

    const handleChange = (event, newValue) => { setValue(newValue) }

    const stats = [
        {
            label: "Próximos",
            count: partidosPorJugar.length,
            icon: <ClockIcon className="w-5 h-5" />,
            color: "from-blue-500 to-blue-600"
        },
        {
            label: "Finalizados",
            count: partidosFinalizados.length,
            icon: <TrophyIcon className="w-5 h-5" />,
            color: "from-green-500 to-green-600"
        },
        {
            label: "Total",
            count: partidosPorJugar.length + partidosFinalizados.length,
            icon: <ChartBarIcon className="w-5 h-5" />,
            color: "from-purple-500 to-purple-600"
        }
    ]

    return (
        <div className={`min-h-screen ${currentTheme.background}`}>
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden"
            >
                {/* Background decorative elements */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-10 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-20 right-1/3 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
                </div>

                <div className="container mx-auto px-4 pt-8 pb-6">
                    {/* Title Section */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4"
                        >
                            <CalendarDaysIcon className="w-8 h-8 text-white" />
                        </motion.div>

                        <h1 className={`text-4xl md:text-5xl font-bold ${currentTheme.text} mb-4 tracking-tight`}>
                            Centro de Partidos
                        </h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className={`text-lg ${currentTheme.textSecondary} max-w-2xl mx-auto leading-relaxed`}
                        >
                            Mantente al día con todos los partidos, desde los próximos encuentros hasta los resultados finalizados.
                        </motion.p>

                        {/* Decorative line */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 mx-auto mt-6 rounded-full relative"
                        >
                            <motion.div
                                animate={{ x: [-20, 108, -20] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-0.5 left-0 w-2 h-2 bg-white rounded-full shadow-lg"
                            />
                        </motion.div>
                    </div>

                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                                className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6 text-center group hover:shadow-lg transition-all duration-300 relative overflow-hidden`}
                            >
                                {/* Background gradient on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                                <div className="relative z-10">
                                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl mb-4 text-white group-hover:scale-110 transition-transform duration-300`}>
                                        {stat.icon}
                                    </div>
                                    <div className={`text-3xl font-bold ${currentTheme.text} mb-2`}>
                                        {stat.count}
                                    </div>
                                    <div className={`text-sm font-medium ${currentTheme.textSecondary}`}>
                                        {stat.label}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className={`${currentTheme.card} ${currentTheme.border} border rounded-3xl shadow-xl overflow-hidden`}
                >
                    {/* Tab Navigation */}
                    <div className={`border-b ${currentTheme.border} bg-gradient-to-r from-gray-50/50 to-blue-50/50 dark:from-gray-800/50 dark:to-blue-900/50`}>
                        <div className="flex relative">
                            {[
                                { label: "Próximos Partidos", icon: <ClockIcon className="w-5 h-5" />, count: partidosPorJugar.length },
                                { label: "Partidos Finalizados", icon: <TrophyIcon className="w-5 h-5" />, count: partidosFinalizados.length }
                            ].map((tab, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => handleChange(null, index)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex-1 p-6 transition-all duration-300 relative group ${value === index
                                            ? `${currentTheme.text}`
                                            : `${currentTheme.textSecondary} hover:${currentTheme.text}`
                                        }`}
                                >
                                    {/* Active background */}
                                    {value === index && (
                                        <motion.div
                                            layoutId="activeTabBackground"
                                            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}

                                    <div className="relative z-10 flex items-center justify-center gap-3">
                                        <div className={`transition-colors duration-300 ${value === index ? 'text-blue-600' : currentTheme.textSecondary
                                            }`}>
                                            {tab.icon}
                                        </div>

                                        <div className="text-left">
                                            <div className={`font-semibold transition-colors duration-300 ${value === index ? 'text-blue-600' : currentTheme.text
                                                }`}>
                                                {tab.label}
                                            </div>
                                            <div className={`text-sm ${currentTheme.textSecondary}`}>
                                                {tab.count} {tab.count === 1 ? 'partido' : 'partidos'}
                                            </div>
                                        </div>

                                        {/* Badge */}
                                        <div className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${value === index
                                                ? 'bg-blue-600 text-white'
                                                : `${currentTheme.card} ${currentTheme.textSecondary}`
                                            }`}>
                                            {tab.count}
                                        </div>
                                    </div>

                                    {/* Bottom indicator */}
                                    {value === index && (
                                        <motion.div
                                            layoutId="tabIndicator"
                                            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[600px]">
                        {value === 0 ? (
                            partidosPorJugar.length > 0 ? (
                                <MatchTabs type="por-jugar" />
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="flex flex-col items-center justify-center py-20"
                                >
                                    <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                                        <ClockIcon className="w-12 h-12 text-blue-500" />
                                    </div>
                                    <EmptyMessage text="No hay partidos próximos programados" />
                                </motion.div>
                            )
                        ) : partidosFinalizados.length > 0 ? (
                            <MatchTabs type="finalizados" />
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                className="flex flex-col items-center justify-center py-20"
                            >
                                <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
                                    <TrophyIcon className="w-12 h-12 text-green-500" />
                                </div>
                                <EmptyMessage text="No hay partidos finalizados aún" />
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Match
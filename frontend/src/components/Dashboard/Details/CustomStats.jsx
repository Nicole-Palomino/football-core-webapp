import React, { useRef, useState } from 'react'
import TotalMatch from '../Match/graphics/TotalMatch'
import PieChartsOne from '../Match/graphics/PieChartsOne'
import CardChart from '../Match/graphics/CardChart'
import CarruselSugerencias from '../Match/graphics/CarruselSugerencias'
import TablaConPaginacion from '../Match/graphics/TablaConPaginacion'
import { getCompleteAnalysis } from '../../../services/functions'
import LoadingSpinner from '../../Loading/LoadingSpinner'
import { useQuery } from '@tanstack/react-query'
import TableConColor from '../Match/graphics/TableConColor'
import CustomAlertas from './CustomAlertas'
import { useThemeMode } from '../../../contexts/ThemeContext'
import { motion } from 'framer-motion'
import {
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material'
import {
    ChartBarIcon,
    ClockIcon,
    BuildingOffice2Icon,
    TrophyIcon,
    ListBulletIcon,
    UserGroupIcon,
    HandThumbUpIcon,
    ArrowDownTrayIcon,
    LightBulbIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline'
import jsPDF from 'jspdf'
import domtoimage from 'dom-to-image-more'

const CustomStats = ({ equipo_local, equipo_visita, nombre_liga }) => {

    const { currentTheme } = useThemeMode()
    const statsRef = useRef(null)
    const [expandedMetrics, setExpandedMetrics] = useState(false)

    // 1. Consulta para Match Stats
    const {
        data: matchesStats,
        isLoading: isLoadingStats,
        isError: isErrorStats,
        error: errorStats
    } = useQuery({
        queryKey: ["matchesStats", equipo_local, equipo_visita],
        queryFn: () => getCompleteAnalysis(nombre_liga, equipo_local, equipo_visita),
        enabled: Boolean(equipo_local && equipo_visita && nombre_liga),
        staleTime: 1000 * 60 * 15,
        cacheTime: 5 * 60 * 1000
    })

    const isLoading = isLoadingStats
    const isError = isErrorStats

    const downloadAsPNG = async () => {
        if (!statsRef.current) return

        try {
            const dataUrl = await domtoimage.toPng(statsRef.current, {
                quality: 1,
                bgcolor: currentTheme.background // mantiene el fondo de tu theme
            })

            const link = document.createElement('a')
            link.download = `estadisticas-${equipo_local}-vs-${equipo_visita}.png`
            link.href = dataUrl
            link.click()
        } catch (error) {
            console.error('Error downloading PNG:', error)
        }
    }

    const downloadAsPDF = async () => {
        if (!statsRef.current) return

        try {
            const dataUrl = await domtoimage.toPng(statsRef.current, {
                quality: 1,
                bgcolor: currentTheme.background // aquí respeta el tema
            })

            const pdf = new jsPDF('p', 'mm', 'a4')
            const imgProps = pdf.getImageProperties(dataUrl)
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight)
            pdf.save(`estadisticas-${equipo_local}-vs-${equipo_visita}.pdf`)
        } catch (error) {
            console.error('Error downloading PDF:', error)
        }
    }

    if (isLoading) return <LoadingSpinner />

    if (isError) {
        return (
            <div className={`min-h-[400px] ${currentTheme.background} flex items-center justify-center`}>
                <div className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-8 text-center`}>
                    <h2 className={`text-2xl font-bold ${currentTheme.text} mb-4`}>Error al cargar datos</h2>
                    {isErrorStats && <p className={`${currentTheme.textSecondary}`}>Match Stats: {errorStats.message}</p>}
                </div>
            </div>
        )
    }

    const finalMatchesStats = matchesStats || []

    return (
        <div className="flex justify-center items-center w-full">
            {finalMatchesStats ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full mx-auto max-w-[1200px]"
                >
                    {/* Download Actions */}
                    <div className="flex justify-end gap-2 mb-6">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={downloadAsPNG}
                            className={`flex items-center gap-2 ${currentTheme.card} ${currentTheme.border} border rounded-lg px-4 py-2 ${currentTheme.hover} transition-all duration-200`}
                        >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            <span className={`text-sm font-medium ${currentTheme.text}`}>PNG</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={downloadAsPDF}
                            className={`flex items-center gap-2 ${currentTheme.card} ${currentTheme.border} border rounded-lg px-4 py-2 ${currentTheme.hover} transition-all duration-200`}
                        >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            <span className={`text-sm font-medium ${currentTheme.text}`}>PDF</span>
                        </motion.button>
                    </div>

                    <div ref={statsRef} className={`${currentTheme.background} p-6 rounded-2xl`}>
                        <div className="space-y-8">
                            {/* Header Alert */}
                            <CustomAlertas
                                title='📊 Esta sección muestra estadísticas basadas en el historial de enfrentamientos y rendimiento de los equipos, considerando también temporadas anteriores.'
                            />

                            {/* Historial de Enfrentamientos */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300`}
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl"></div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <ListBulletIcon className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <h3 className={`text-xl font-bold ${currentTheme.text}`}>Historial de Enfrentamientos</h3>
                                </div>
                                <TotalMatch totalMatches={finalMatchesStats.resumen?.total_enfrentamientos} />
                            </motion.div>

                            {/* Results Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Resultados por equipo */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6 relative overflow-hidden group transition-all duration-300`}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-teal-400 rounded-t-2xl"></div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-green-500/20 rounded-lg">
                                            <UserGroupIcon className="w-6 h-6 text-green-500" />
                                        </div>
                                        <h3 className={`text-lg font-bold ${currentTheme.text}`}>Resultados por Equipo</h3>
                                    </div>
                                    <PieChartsOne
                                        Data={[
                                            { id: 0, label: equipo_local, value: finalMatchesStats.resumen.victorias_por_equipo.local },
                                            { id: 1, label: equipo_visita, value: finalMatchesStats.resumen.victorias_por_equipo.visitante },
                                            { id: 2, label: 'Empates', value: finalMatchesStats.resumen.victorias_por_equipo.empates }
                                        ]}
                                    />
                                </motion.div>

                                {/* Resultados por Localía */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6 relative overflow-hidden group transition-all duration-300`}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-400 rounded-t-2xl"></div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-orange-500/20 rounded-lg">
                                            <BuildingOffice2Icon className="w-6 h-6 text-orange-500" />
                                        </div>
                                        <h3 className={`text-lg font-bold ${currentTheme.text}`}>Resultados por Localía</h3>
                                    </div>
                                    <PieChartsOne
                                        Data={[
                                            { label: 'Como Local', value: finalMatchesStats.resumen.victorias_por_localia.local },
                                            { label: 'Como Visitante', value: finalMatchesStats.resumen.victorias_por_localia.visitante },
                                            { label: 'Empates', value: finalMatchesStats.resumen.victorias_por_localia.empates }
                                        ]}
                                    />
                                </motion.div>
                            </div>

                            {/* Metrics Explanation */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl overflow-hidden`}
                            >
                                <motion.button
                                    onClick={() => setExpandedMetrics(!expandedMetrics)}
                                    className={`w-full flex items-center justify-between p-4 ${currentTheme.hover} transition-all duration-300`}
                                    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/20 rounded-lg">
                                            <LightBulbIcon className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <h3 className={`text-lg font-bold ${currentTheme.text}`}>
                                            ¿Qué significan estas métricas?
                                        </h3>
                                    </div>
                                    <motion.div
                                        animate={{ rotate: expandedMetrics ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChartBarIcon className={`w-5 h-5 ${currentTheme.textSecondary}`} />
                                    </motion.div>
                                </motion.button>

                                <motion.div
                                    initial={false}
                                    animate={{ height: expandedMetrics ? 'auto' : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                                        <p className={`mb-4 ${currentTheme.text}`}>
                                            Estas métricas se utilizan para analizar y comparar el rendimiento y estilo de juego de los equipos:
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <div className={`flex items-start p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg ${currentTheme.text}`}>
                                                    <TrendingUpIcon className="w-5 h-5 mr-2 flex-shrink-0 text-blue-500 mt-0.5" />
                                                    <div>
                                                        <strong>Posesión Ofensiva:</strong> (Tiros + Tiros al arco + Corners) / Partidos.
                                                        Indica el nivel de participación ofensiva del equipo.
                                                    </div>
                                                </div>

                                                <div className={`flex items-start p-3 bg-green-500/10 border border-green-500/30 rounded-lg ${currentTheme.text}`}>
                                                    <ChartBarIcon className="w-5 h-5 mr-2 flex-shrink-0 text-green-500 mt-0.5" />
                                                    <div>
                                                        <strong>Eficiencia Ofensiva:</strong> Goles / Tiros al arco.
                                                        Mide la capacidad de convertir oportunidades en goles.
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className={`flex items-start p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg ${currentTheme.text}`}>
                                                    <BuildingOffice2Icon className="w-5 h-5 mr-2 flex-shrink-0 text-orange-500 mt-0.5" />
                                                    <div>
                                                        <strong>Goles Local/Visita:</strong> Producción goleadora según la localía.
                                                        Evalúa el rendimiento en casa vs fuera de casa.
                                                    </div>
                                                </div>

                                                <div className={`flex items-start p-3 bg-red-500/10 border border-red-500/30 rounded-lg ${currentTheme.text}`}>
                                                    <ExclamationTriangleIcon className="w-5 h-5 mr-2 flex-shrink-0 text-red-500 mt-0.5" />
                                                    <div>
                                                        <strong>Indisciplina:</strong> (Amarillas + Rojas) / Partidos.
                                                        Nivel promedio de sanciones por partido.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Advanced Metrics */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6 relative overflow-hidden`}
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-400 rounded-t-2xl"></div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                                        <ChartBarIcon className="w-6 h-6 text-yellow-500" />
                                    </div>
                                    <h3 className={`text-xl font-bold ${currentTheme.text}`}>Métricas por Equipo</h3>
                                </div>
                                <div className="space-y-4">
                                    {finalMatchesStats.estadisticas_avanzadas?.map((stats, index) => (
                                        <CardChart key={index} stats={stats} />
                                    ))}
                                </div>
                            </motion.div>

                            {/* Team Streaks */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6 relative overflow-hidden`}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-t-2xl"></div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-blue-500/20 rounded-lg">
                                            <TrendingUpIcon className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <h3 className={`text-lg font-bold ${currentTheme.text}`}>Racha del Equipo Local</h3>
                                    </div>
                                    <CarruselSugerencias datos={finalMatchesStats.racha_equipo_1} />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6 relative overflow-hidden`}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400 rounded-t-2xl"></div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-green-500/20 rounded-lg">
                                            <TrendingUpIcon className="w-6 h-6 text-green-500" />
                                        </div>
                                        <h3 className={`text-lg font-bold ${currentTheme.text}`}>Racha del Equipo Visitante</h3>
                                    </div>
                                    <CarruselSugerencias datos={finalMatchesStats.racha_equipo_2} />
                                </motion.div>
                            </div>

                            {/* Direct Confrontations */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6 relative overflow-hidden`}
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-400 rounded-t-2xl"></div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-purple-500/20 rounded-lg">
                                        <HandThumbUpIcon className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <h3 className={`text-lg font-bold ${currentTheme.text}`}>Enfrentamientos directos</h3>
                                </div>
                                <CarruselSugerencias datos={finalMatchesStats.enfrentamientos_directos_sugerencias} />
                            </motion.div>

                            {/* Last 5 Matches */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.9 }}
                                    className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6 relative overflow-hidden`}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-400 rounded-t-2xl"></div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-blue-500/20 rounded-lg">
                                            <TrophyIcon className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <h3 className={`text-lg font-bold ${currentTheme.text}`}>Últimos 5 partidos de {equipo_local}</h3>
                                    </div>
                                    <TableConColor
                                        finalMatchesStats={finalMatchesStats}
                                        equipo={equipo_local}
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.0 }}
                                    className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6 relative overflow-hidden`}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-pink-400 rounded-t-2xl"></div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-red-500/20 rounded-lg">
                                            <TrophyIcon className="w-6 h-6 text-red-500" />
                                        </div>
                                        <h3 className={`text-lg font-bold ${currentTheme.text}`}>Últimos 5 partidos de {equipo_visita}</h3>
                                    </div>
                                    <TableConColor
                                        finalMatchesStats={finalMatchesStats}
                                        equipo={equipo_visita}
                                    />
                                </motion.div>
                            </div>

                            {/* First Half Analysis */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.1 }}
                                    className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6 relative overflow-hidden`}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-400 rounded-t-2xl"></div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                                            <ClockIcon className="w-6 h-6 text-yellow-500" />
                                        </div>
                                        <h3 className={`text-lg font-bold ${currentTheme.text}`}>Goles en el Primer Tiempo</h3>
                                    </div>
                                    <PieChartsOne
                                        Data={[
                                            { id: 0, label: equipo_local, value: finalMatchesStats.primer_tiempo.goles_primer_tiempo.local },
                                            { id: 1, label: equipo_visita, value: finalMatchesStats.primer_tiempo.goles_primer_tiempo.visitante },
                                        ]}
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.2 }}
                                    className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6 relative overflow-hidden`}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-teal-400 rounded-t-2xl"></div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-green-500/20 rounded-lg">
                                            <ClockIcon className="w-6 h-6 text-green-500" />
                                        </div>
                                        <h3 className={`text-lg font-bold ${currentTheme.text}`}>Ventaja Primer Tiempo</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className={`flex items-center gap-2 ${currentTheme.text}`}>
                                            <span className="text-2xl">🏠</span>
                                            <p className="text-sm md:text-base">
                                                <strong>{equipo_local}</strong>: se fue al descanso ganando en <strong>{finalMatchesStats.primer_tiempo.ventaja_primer_tiempo.local}</strong> de <strong>{finalMatchesStats.primer_tiempo.ventaja_primer_tiempo.total_ht}</strong> partidos.
                                            </p>
                                        </div>

                                        <div className={`flex items-center gap-2 ${currentTheme.text}`}>
                                            <span className="text-2xl">🟡</span>
                                            <p className="text-sm md:text-base">
                                                Ambos equipos empataron al descanso en <strong>{finalMatchesStats.primer_tiempo.ventaja_primer_tiempo.empate_ht}</strong> de <strong>{finalMatchesStats.primer_tiempo.ventaja_primer_tiempo.total_ht}</strong> partidos.
                                            </p>
                                        </div>

                                        <div className={`flex items-center gap-2 ${currentTheme.text}`}>
                                            <span className="text-2xl">✈️</span>
                                            <p className="text-sm md:text-base">
                                                <strong>{equipo_visita}</strong>: se fue al descanso ganando en <strong>{finalMatchesStats.primer_tiempo.ventaja_primer_tiempo.visitante}</strong> de <strong>{finalMatchesStats.primer_tiempo.ventaja_primer_tiempo.total_ht}</strong> partidos.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* All Matches Table */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.3 }}
                                className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6 relative overflow-hidden`}
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-400 rounded-t-2xl"></div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                                        <ListBulletIcon className="w-6 h-6 text-indigo-500" />
                                    </div>
                                    <h3 className={`text-xl font-bold ${currentTheme.text}`}>Todos los enfrentamientos entre los equipos</h3>
                                </div>
                                <TablaConPaginacion matches={finalMatchesStats} />
                            </motion.div>

                            {/* Footer Alert */}
                            <CustomAlertas
                                title='📊 Esta sección muestra estadísticas basadas en el historial de enfrentamientos y rendimiento de los equipos, considerando también temporadas anteriores.'
                            />
                        </div>
                    </div>
                </motion.div>
            ) : (
                <div className={`text-center py-12 ${currentTheme.card} ${currentTheme.border} border rounded-2xl`}>
                    <InformationCircleIcon className={`w-16 h-16 mx-auto mb-4 ${currentTheme.textSecondary}`} />
                    <h3 className={`text-xl font-semibold ${currentTheme.text} mb-2`}>
                        No hay estadísticas disponibles
                    </h3>
                    <p className={`${currentTheme.textSecondary}`}>
                        Los datos estadísticos no están disponibles para este partido
                    </p>
                </div>
            )}
        </div>
    )
}

export default CustomStats
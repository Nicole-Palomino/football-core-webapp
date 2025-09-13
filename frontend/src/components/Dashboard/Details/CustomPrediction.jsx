import LoadingSpinner from '../../Loading/LoadingSpinner'
import CustomAlertas from './CustomAlertas'
import MatchStatisticsBarChart from '../Match/graphics/MatchStatisticsBarChart'
import PieChartsOne from '../Match/graphics/PieChartsOne'
import {
    TrophyIcon,
    FireIcon,
    ChartBarIcon,
    FlagIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useThemeMode } from '../../../contexts/ThemeContext'
import { useRef, useState } from 'react'
import { usePredictions } from '../../../hooks/usePredictions'

const CustomPrediction = ({ equipo_local, equipo_visita, nombre_liga }) => {

    const { currentTheme } = useThemeMode()
    const [activeSection, setActiveSection] = useState('overview')
    const chartRefs = {
        stats: useRef(null),
        goals: useRef(null),
        shots: useRef(null),
        corners: useRef(null),
        cards: useRef(null),
        redCards: useRef(null)
    }

    const { matchesPrediction, isLoading, isError, error } = usePredictions(equipo_local, equipo_visita, nombre_liga)

    if (isLoading) return <LoadingSpinner />

    if (isError) {
        return (
            <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-6`}>
                <h2 className={`${currentTheme.text} text-xl font-bold mb-2`}>Error al cargar datos</h2>
                {isError && <p className={`${currentTheme.textSecondary}`}>Match Prediction: {error.message}</p>}
            </div>
        )
    }

    const finalMatchesPrediction = matchesPrediction || []

    const sections = [
        { id: 'overview', name: 'Resumen', icon: ChartBarIcon },
        { id: 'statistics', name: 'Estadísticas', icon: TrophyIcon },
        { id: 'charts', name: 'Gráficos', icon: ChartBarIcon }
    ]

    const PredictionCard = ({ title, children, gradient, icon: Icon, chartRef, filename }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`${currentTheme.card} ${currentTheme.border} border rounded-xl overflow-hidden shadow-lg`}
            ref={chartRef}
        >
            <div className={`h-1 ${gradient}`}></div>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${currentTheme.hover}`}>
                            <Icon className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className={`${currentTheme.text} text-lg font-bold`}>{title}</h3>
                    </div>
                </div>
                {children}
            </div>
        </motion.div>
    )

    if (!finalMatchesPrediction || !finalMatchesPrediction.predicciones) {
        return (
            <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-8 text-center`}>
                <ExclamationTriangleIcon className={`w-12 h-12 ${currentTheme.textSecondary} mx-auto mb-4`} />
                <h3 className={`${currentTheme.text} text-lg font-medium mb-2`}>
                    No hay predicciones disponibles
                </h3>
                <p className={`${currentTheme.textSecondary}`}>
                    No se encontraron datos de predicción para este partido
                </p>
            </div>
        )
    }

    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* AI Info Alert */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <CustomAlertas
                    title='🤖 Esta sección utiliza un modelo de aprendizaje automático de Random Forest para predecir resultados. Se entrena con el historial de partidos, estadísticas de los equipos y datos de temporadas pasadas para ofrecer predicciones de regresión (resultados numéricos) y clasificación (categorías como "ganador" o "perdedor").'
                />
            </motion.div>

            {/* Navigation Tabs */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeSection === section.id
                                ? 'bg-blue-600 text-white shadow-lg'
                                : `${currentTheme.hover} ${currentTheme.text}`
                                }`}
                        >
                            <section.icon className="w-4 h-4" />
                            {section.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Section */}
            {activeSection === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <PredictionCard
                        title="Resultado Final"
                        gradient="bg-gradient-to-r from-blue-500 to-purple-500"
                        icon={TrophyIcon}
                    >
                        <div className="space-y-4">
                            <div className={`p-4 rounded-lg ${currentTheme.hover}`}>
                                <p className={`${currentTheme.text} text-xl font-bold`}>
                                    {finalMatchesPrediction?.predicciones?.resultado_final?.descripcion || 'No disponible'}
                                </p>
                            </div>
                        </div>
                    </PredictionCard>

                    <PredictionCard
                        title="Resultado Medio Tiempo"
                        gradient="bg-gradient-to-r from-orange-500 to-red-500"
                        icon={FireIcon}
                    >
                        <div className="space-y-4">
                            <div className={`p-4 rounded-lg ${currentTheme.hover}`}>
                                <p className={`${currentTheme.text} text-xl font-bold`}>
                                    {finalMatchesPrediction?.predicciones?.resultado_medio_tiempo?.descripcion || 'No disponible'}
                                </p>
                            </div>
                        </div>
                    </PredictionCard>

                    <PredictionCard
                        title="¿Ambos marcan FT?"
                        gradient="bg-gradient-to-r from-green-500 to-teal-500"
                        icon={CheckCircleIcon}
                    >
                        <div className="space-y-4">
                            <div className={`p-4 rounded-lg ${currentTheme.hover}`}>
                                <p className={`${currentTheme.text} text-xl font-bold mb-2`}>
                                    Probabilidad: {finalMatchesPrediction?.predicciones?.ambos_marcan?.probabilidad || 0}%
                                </p>
                                <div className="flex items-center gap-2">
                                    {finalMatchesPrediction?.predicciones?.ambos_marcan?.alta_probabilidad ? (
                                        <>
                                            <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                            <span className="text-green-500 font-medium">Alta probabilidad</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircleIcon className="w-5 h-5 text-red-500" />
                                            <span className="text-red-500 font-medium">Baja probabilidad</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </PredictionCard>

                    <PredictionCard
                        title="¿Ambos marcan HT?"
                        gradient="bg-gradient-to-r from-purple-500 to-pink-500"
                        icon={FlagIcon}
                    >
                        <div className="space-y-4">
                            <div className={`p-4 rounded-lg ${currentTheme.hover}`}>
                                <p className={`${currentTheme.text} text-xl font-bold mb-2`}>
                                    Probabilidad: {finalMatchesPrediction?.predicciones?.ambos_marcan_ht?.probabilidad || 0}%
                                </p>
                                <div className="flex items-center gap-2">
                                    {finalMatchesPrediction?.predicciones?.ambos_marcan_ht?.alta_probabilidad ? (
                                        <>
                                            <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                            <span className="text-green-500 font-medium">Alta probabilidad</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircleIcon className="w-5 h-5 text-red-500" />
                                            <span className="text-red-500 font-medium">Baja probabilidad</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </PredictionCard>
                </div>
            )}

            {/* Statistics Section */}
            {activeSection === 'statistics' && (
                <div className="space-y-6">
                    <PredictionCard
                        title="Estadísticas para el Partido"
                        gradient="bg-gradient-to-r from-indigo-500 to-blue-500"
                        icon={ChartBarIcon}
                        chartRef={chartRefs.stats}
                        filename="estadisticas-partido"
                    >
                        <MatchStatisticsBarChart
                            estadisticas_esperadas={finalMatchesPrediction?.predicciones?.estadisticas_esperadas}
                        />
                    </PredictionCard>
                </div>
            )}

            {/* Charts Section */}
            {activeSection === 'charts' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PredictionCard
                        title="Goles Esperados"
                        gradient="bg-gradient-to-r from-green-500 to-emerald-500"
                        icon={ChartBarIcon}
                        chartRef={chartRefs.goals}
                        filename="goles-esperados"
                    >
                        <PieChartsOne
                            Data={[
                                {
                                    id: 0,
                                    label: equipo_local,
                                    value: finalMatchesPrediction?.predicciones?.estadisticas_esperadas?.goles_local || 0
                                },
                                {
                                    id: 1,
                                    label: equipo_visita,
                                    value: finalMatchesPrediction?.predicciones?.estadisticas_esperadas?.goles_visitante || 0
                                },
                            ]}
                        />
                    </PredictionCard>

                    <PredictionCard
                        title="Tiros al Arco"
                        gradient="bg-gradient-to-r from-yellow-500 to-orange-500"
                        icon={FireIcon}
                        chartRef={chartRefs.shots}
                        filename="tiros-al-arco"
                    >
                        <PieChartsOne
                            Data={[
                                {
                                    id: 0,
                                    label: equipo_local,
                                    value: finalMatchesPrediction?.predicciones?.estadisticas_esperadas?.tiros_arco_local || 0
                                },
                                {
                                    id: 1,
                                    label: equipo_visita,
                                    value: finalMatchesPrediction?.predicciones?.estadisticas_esperadas?.tiros_arco_visitante || 0
                                },
                            ]}
                        />
                    </PredictionCard>

                    <PredictionCard
                        title="Tiros de Esquinas"
                        gradient="bg-gradient-to-r from-teal-500 to-cyan-500"
                        icon={FlagIcon}
                        chartRef={chartRefs.corners}
                        filename="tiros-esquinas"
                    >
                        <PieChartsOne
                            Data={[
                                {
                                    id: 0,
                                    label: equipo_local,
                                    value: finalMatchesPrediction?.predicciones?.estadisticas_esperadas?.corners_local || 0
                                },
                                {
                                    id: 1,
                                    label: equipo_visita,
                                    value: finalMatchesPrediction?.predicciones?.estadisticas_esperadas?.corners_visitante || 0
                                },
                            ]}
                        />
                    </PredictionCard>

                    <PredictionCard
                        title="Tarjetas Amarillas"
                        gradient="bg-gradient-to-r from-yellow-400 to-yellow-600"
                        icon={ExclamationTriangleIcon}
                        chartRef={chartRefs.cards}
                        filename="tarjetas-amarillas"
                    >
                        <PieChartsOne
                            Data={[
                                {
                                    id: 0,
                                    label: equipo_local,
                                    value: finalMatchesPrediction?.predicciones?.estadisticas_esperadas?.amarillas_local || 0
                                },
                                {
                                    id: 1,
                                    label: equipo_visita,
                                    value: finalMatchesPrediction?.predicciones?.estadisticas_esperadas?.amarillas_visitante || 0
                                },
                            ]}
                        />
                    </PredictionCard>

                    <div className="md:col-span-2">
                        <PredictionCard
                            title="Tarjetas Rojas"
                            gradient="bg-gradient-to-r from-red-500 to-red-700"
                            icon={XCircleIcon}
                            chartRef={chartRefs.redCards}
                            filename="tarjetas-rojas"
                        >
                            <PieChartsOne
                                Data={[
                                    {
                                        id: 0,
                                        label: equipo_local,
                                        value: finalMatchesPrediction?.predicciones?.estadisticas_esperadas?.rojas_local || 0
                                    },
                                    {
                                        id: 1,
                                        label: equipo_visita,
                                        value: finalMatchesPrediction?.predicciones?.estadisticas_esperadas?.rojas_visitante || 0
                                    },
                                ]}
                            />
                        </PredictionCard>
                    </div>
                </div>
            )}

            {/* Bottom AI Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
            >
                <CustomAlertas
                    title='🤖 Esta sección utiliza un modelo de aprendizaje automático de Random Forest para predecir resultados. Se entrena con el historial de partidos, estadísticas de los equipos y datos de temporadas pasadas para ofrecer predicciones de regresión (resultados numéricos) y clasificación (categorías como "ganador" o "perdedor").'
                />
            </motion.div>
        </div>
    )
}

export default CustomPrediction
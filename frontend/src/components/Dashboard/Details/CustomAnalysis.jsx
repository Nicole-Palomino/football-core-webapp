import { combinarAnalisisYPrediccion, getAnalyticsCluster, getPoisson, getPredictionCluster } from '../../../services/functions'
import LoadingSpinner from '../../Loading/LoadingSpinner'
import { useQuery } from '@tanstack/react-query'
import CustomAlertas from './CustomAlertas'
import EntreEquipos from './EntreEquipos'
import {
    ChartBarIcon,
    DocumentChartBarIcon,
    TableCellsIcon,
    ArrowDownTrayIcon,
    InformationCircleIcon,
    TrophyIcon,
    FireIcon,
    RectangleStackIcon
} from '@heroicons/react/24/outline'
import jsPDF from 'jspdf'
import { motion } from 'framer-motion'
import { useThemeMode } from '../../../contexts/ThemeContext'
import { useRef } from 'react'
import domtoimage from 'dom-to-image-more'
import { useMatchStats } from '../../../hooks/useMatchStats'

const CustomAnalysis = ({ equipo_local, equipo_visita, nombre_liga }) => {

    const { currentTheme } = useThemeMode()
    const analysisRef = useRef(null)

    const { matchPoisson, isLoadingPoisson, isErrorPoisson, errorPoisson } = useMatchStats(equipo_local, equipo_visita, nombre_liga)

    // 2. Consulta para K-means
    const fetchClusterData = async (liga, equipo1, equipo2) => {
        const clusterAnalysis = await getAnalyticsCluster(liga, equipo1, equipo2)
        const clusterPrediction = await getPredictionCluster(liga, equipo1, equipo2)
        return combinarAnalisisYPrediccion(clusterAnalysis, clusterPrediction) || []
    }

    const {
        data: clusterData,
        isLoading: isLoadingCluster,
        isError: isErrorCluster,
        error: errorCluster
    } = useQuery({
        queryKey: ["clusterData", equipo_local, equipo_visita],
        queryFn: () => fetchClusterData(nombre_liga, equipo_local, equipo_visita),
        enabled: Boolean(nombre_liga, equipo_local, equipo_visita),
        staleTime: 1000 * 60 * 15,
        cacheTime: 5 * 60 * 1000
    })

    const isLoading = isLoadingPoisson || isLoadingCluster
    const isError = isErrorPoisson || isErrorCluster

    const downloadAsPNG = async () => {
        if (!analysisRef.current) return

        try {
            const dataUrl = await domtoimage.toPng(analysisRef.current, {
                quality: 1,
                bgcolor: '#ffffff' // fondo blanco opcional
            })
            const link = document.createElement('a')
            link.download = `analisis-${equipo_local}-vs-${equipo_visita}.png`
            link.href = dataUrl
            link.click()
        } catch (error) {
            console.error('Error downloading PNG:', error)
        }
    }

    const downloadAsPDF = async () => {
        if (!analysisRef.current) return

        try {
            const dataUrl = await domtoimage.toPng(analysisRef.current, {
                quality: 1,
                bgcolor: '#ffffff'
            })

            const pdf = new jsPDF('p', 'mm', 'a4')
            const imgProps = pdf.getImageProperties(dataUrl)
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight)
            pdf.save(`analisis-${equipo_local}-vs-${equipo_visita}.pdf`)
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
                    {isErrorPoisson && <p className={`${currentTheme.textSecondary} mb-2`}>Match Poisson: {errorPoisson.message}</p>}
                    {isErrorCluster && <p className={`${currentTheme.textSecondary}`}>Match Cluster: {errorCluster.message}</p>}
                </div>
            </div>
        )
    }

    const finalMatchPoisson = matchPoisson || []
    const finalMatchCluster = clusterData || []

    return (
        <div className="flex justify-center items-center w-full">
            {finalMatchPoisson ? (
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

                    <div ref={analysisRef} className={`${currentTheme.background} p-6 rounded-2xl`}>
                        {/* Poisson Analysis Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="space-y-6"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                                    Análisis Probabilístico (Modelo de Poisson)
                                </h2>
                                <CustomAlertas
                                    title='📈 Este análisis ha sido desarrollado utilizando el modelo estadístico Poisson, basado en datos históricos y rendimiento de los equipos.'
                                />
                            </div>

                            {/* Expected Goals & Probabilities */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Goles esperados */}
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6 relative overflow-hidden group transition-all duration-300`}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-t-2xl"></div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-blue-500/20 rounded-lg">
                                            <ChartBarIcon className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <h3 className={`text-lg font-bold ${currentTheme.text}`}>Goles Esperados</h3>
                                    </div>
                                    <EntreEquipos
                                        equipo_local={equipo_local}
                                        equipo_visita={equipo_visita}
                                        item_local={finalMatchPoisson?.goles_esperados?.local}
                                        item_visita={finalMatchPoisson?.goles_esperados?.visitante}
                                    />
                                </motion.div>

                                {/* Probabilidades 1X2 */}
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6 relative overflow-hidden group transition-all duration-300`}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-pink-400 rounded-t-2xl"></div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-orange-500/20 rounded-lg">
                                            <TrophyIcon className="w-6 h-6 text-orange-500" />
                                        </div>
                                        <h3 className={`text-lg font-bold ${currentTheme.text}`}>Probabilidades 1X2</h3>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div className="space-y-2">
                                            <div className="text-2xl md:text-3xl font-bold text-blue-500">
                                                {finalMatchPoisson?.probabilidades_1x2?.local}%
                                            </div>
                                            <div className={`text-sm ${currentTheme.textSecondary} truncate`}>
                                                {equipo_local}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-2xl md:text-3xl font-bold text-orange-500">
                                                {finalMatchPoisson?.probabilidades_1x2?.empate}%
                                            </div>
                                            <div className={`text-sm ${currentTheme.textSecondary}`}>
                                                Empate
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-2xl md:text-3xl font-bold text-red-500">
                                                {finalMatchPoisson?.probabilidades_1x2?.visita}%
                                            </div>
                                            <div className={`text-sm ${currentTheme.textSecondary} truncate`}>
                                                {equipo_visita}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Matriz de Resultados */}
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6 relative overflow-hidden`}
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-teal-400 rounded-t-2xl"></div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-green-500/20 rounded-lg">
                                        <TableCellsIcon className="w-6 h-6 text-green-500" />
                                    </div>
                                    <h3 className={`text-lg font-bold ${currentTheme.text}`}>Matriz de Resultados Exactos</h3>
                                </div>
                                {finalMatchPoisson?.matriz_scores_exactos && (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr>
                                                    <th className={`${currentTheme.text} p-2 text-center text-sm font-semibold`}>Local \ Visita</th>
                                                    {Object.keys(finalMatchPoisson.matriz_scores_exactos[0]).map((col) => (
                                                        <th key={col} className={`${currentTheme.text} p-2 text-center text-sm font-semibold`}>
                                                            {col}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(finalMatchPoisson.matriz_scores_exactos).map(([golesLocal, row]) => (
                                                    <tr key={golesLocal} className={`${currentTheme.hover} hover:bg-opacity-50`}>
                                                        <td className={`text-blue-500 p-2 text-center font-semibold text-sm`}>{golesLocal}</td>
                                                        {Object.entries(row).map(([golesVisita, prob]) => (
                                                            <td key={golesVisita} className={`${currentTheme.textSecondary} p-2 text-center text-sm`}>
                                                                {prob.toFixed(1)}%
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>

                        {/* K-Means Analysis Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="space-y-6 mt-12"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent mb-4">
                                    Predicción basada en Clustering K-Means
                                </h2>
                                <CustomAlertas
                                    title='🤖 Este análisis utiliza K-Means, un algoritmo de machine learning no supervisado, para agrupar equipos según su rendimiento histórico.'
                                />
                            </div>

                            {/* Match Summary */}
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6 relative overflow-hidden`}
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-400 rounded-t-2xl"></div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-purple-500/20 rounded-lg">
                                        <DocumentChartBarIcon className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <h3 className={`text-lg font-bold ${currentTheme.text}`}>Resumen del Partido</h3>
                                </div>
                                {/* {finalMatchCluster?.descripcion_cluster_predicho && (
                                    <p className={`${currentTheme.text} text-sm leading-relaxed whitespace-pre-line`}>
                                        {finalMatchCluster.descripcion_cluster_predicho}
                                    </p>
                                )} */}
                            </motion.div>

                            {/* Predictions Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Goles Esperados FT */}
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6 relative overflow-hidden group transition-all duration-300`}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-green-400 rounded-t-2xl"></div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-blue-500/20 rounded-lg">
                                            <TrophyIcon className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <h3 className={`text-lg font-bold ${currentTheme.text}`}>Goles Esperados FT</h3>
                                    </div>
                                    <EntreEquipos
                                        equipo_local={equipo_local}
                                        equipo_visita={equipo_visita}
                                        item_local={finalMatchCluster?.prediccion?.predicciones?.goles_esperados_local}
                                        item_visita={finalMatchCluster?.prediccion?.predicciones?.goles_esperados_visitante}
                                    />
                                </motion.div>

                                {/* Goles Esperados HT */}
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6 relative overflow-hidden group transition-all duration-300`}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-t-2xl"></div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-orange-500/20 rounded-lg">
                                            <TrophyIcon className="w-6 h-6 text-orange-500" />
                                        </div>
                                        <h3 className={`text-lg font-bold ${currentTheme.text}`}>Goles Esperados HT</h3>
                                    </div>
                                    <EntreEquipos
                                        equipo_local={equipo_local}
                                        equipo_visita={equipo_visita}
                                        item_local={finalMatchCluster?.prediccion?.predicciones?.goles_ht_local}
                                        item_visita={finalMatchCluster?.prediccion?.predicciones?.goles_ht_visitante}
                                    />
                                </motion.div>

                                {/* Ambos marcan */}
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6 relative overflow-hidden group transition-all duration-300`}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-400 rounded-t-2xl"></div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-pink-500/20 rounded-lg">
                                            <FireIcon className="w-6 h-6 text-pink-500" />
                                        </div>
                                        <h3 className={`text-lg font-bold ${currentTheme.text}`}>Ambos marcan</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                                                <div
                                                    className="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                                                    style={{ width: `${Math.round((finalMatchCluster?.prediccion?.predicciones?.ambos_marcan || 0) * 100)}%` }}
                                                >
                                                    <span className="text-white text-xs font-bold">
                                                        {Math.round((finalMatchCluster?.prediccion?.predicciones?.ambos_marcan || 0) * 100)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className={`text-center text-sm ${currentTheme.textSecondary}`}>
                                            Probabilidad de ambos marcan: {Math.round((finalMatchCluster?.prediccion?.predicciones?.ambos_marcan || 0) * 100)}%
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Tiros al Arco */}
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6 relative overflow-hidden group transition-all duration-300`}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-400 rounded-t-2xl"></div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                                            <FireIcon className="w-6 h-6 text-cyan-500" />
                                        </div>
                                        <h3 className={`text-lg font-bold ${currentTheme.text}`}>Tiros al Arco</h3>
                                    </div>
                                    <EntreEquipos
                                        equipo_local={equipo_local}
                                        equipo_visita={equipo_visita}
                                        item_local={finalMatchCluster?.prediccion?.predicciones?.tiros_arco_local}
                                        item_visita={finalMatchCluster?.prediccion?.predicciones?.tiros_arco_visitante}
                                    />
                                </motion.div>
                            </div>

                            {/* Disciplinary Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6 relative overflow-hidden group transition-all duration-300`}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-400 rounded-t-2xl"></div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                                            <RectangleStackIcon className="w-6 h-6 text-yellow-500" />
                                        </div>
                                        <h3 className={`text-lg font-bold ${currentTheme.text}`}>Disciplinas Local</h3>
                                    </div>
                                    <EntreEquipos
                                        equipo_local='Amarillas'
                                        equipo_visita='Rojas'
                                        item_local={finalMatchCluster?.prediccion?.predicciones?.amarillas_local}
                                        item_visita={finalMatchCluster?.prediccion?.predicciones?.rojas_local}
                                    />
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6 relative overflow-hidden group transition-all duration-300`}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-pink-400 rounded-t-2xl"></div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-red-500/20 rounded-lg">
                                            <RectangleStackIcon className="w-6 h-6 text-red-500" />
                                        </div>
                                        <h3 className={`text-lg font-bold ${currentTheme.text}`}>Disciplinas Visitante</h3>
                                    </div>
                                    <EntreEquipos
                                        equipo_local='Amarillas'
                                        equipo_visita='Rojas'
                                        item_local={finalMatchCluster?.prediccion?.predicciones?.amarillas_visitante}
                                        item_visita={finalMatchCluster?.prediccion?.predicciones?.rojas_visitante}
                                    />
                                </motion.div>
                            </div>

                            <div className="mt-8">
                                <CustomAlertas
                                    title='🤖 Este análisis utiliza K-Means, un algoritmo de machine learning no supervisado, para agrupar equipos según su rendimiento histórico.'
                                />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            ) : (
                <div className={`text-center py-12 ${currentTheme.card} ${currentTheme.border} border rounded-2xl`}>
                    <InformationCircleIcon className={`w-16 h-16 mx-auto mb-4 ${currentTheme.textSecondary}`} />
                    <h3 className={`text-xl font-semibold ${currentTheme.text} mb-2`}>
                        No hay análisis disponible
                    </h3>
                    <p className={`${currentTheme.textSecondary}`}>
                        Los datos de análisis no están disponibles para este partido
                    </p>
                </div>
            )}
        </div>
    )
}

export default CustomAnalysis
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getMatcheByID } from '../../../services/api/matches'
import LoadingSpinner from '../../Loading/LoadingSpinner'
import { motion } from 'framer-motion'
import { formatFecha } from '../../../utils/helpers'
import BarComparativa from './graphics/BarComparativa'
import {
    ArrowLeftIcon,
    MapPinIcon,
    CalendarDaysIcon,
    ChartBarIcon,
    DocumentArrowDownIcon
} from '@heroicons/react/24/outline'
import { useThemeMode } from '../../../contexts/ThemeContext'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useRef } from 'react'

const MatchSummary = () => {

    const { currentTheme } = useThemeMode()
    const { id_partido } = useParams()
    const navigate = useNavigate()
    const contentRef = useRef(null)

    // 1. Consulta para Match by ID
    const {
        data: matchData,
        isLoading: isLoadingMatch,
        isError: isErrorMatch,
        error: errorMatch
    } = useQuery({
        queryKey: ["matchById", id_partido],
        queryFn: () => getMatcheByID({ id_partido }),
        staleTime: 1000 * 60 * 15,
        cacheTime: 5 * 60 * 1000
    })

    // Manejo de estados de carga combinados
    const isLoading = isLoadingMatch
    const isError = isErrorMatch

    const downloadAsPNG = async () => {
        if (contentRef.current) {
            const canvas = await html2canvas(contentRef.current, {
                backgroundColor: currentTheme.background === 'bg-gray-900' ? '#111827' : '#ffffff',
                scale: 2
            })
            const link = document.createElement('a')
            link.download = `resumen-partido-${id_partido}.png`
            link.href = canvas.toDataURL()
            link.click()
        }
    }

    const downloadAsPDF = async () => {
        if (contentRef.current) {
            const canvas = await html2canvas(contentRef.current, {
                backgroundColor: currentTheme.background === 'bg-gray-900' ? '#111827' : '#ffffff',
                scale: 2
            })
            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF('p', 'mm', 'a4')
            const imgWidth = 210
            const pageHeight = 295
            const imgHeight = (canvas.height * imgWidth) / canvas.width
            let heightLeft = imgHeight

            let position = 0
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
            heightLeft -= pageHeight

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight
                pdf.addPage()
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
                heightLeft -= pageHeight
            }

            pdf.save(`resumen-partido-${id_partido}.pdf`)
        }
    }

    if (isLoading) return <LoadingSpinner />

    if (isError) {
        return (
            <div className={`${currentTheme.background} min-h-screen flex items-center justify-center`}>
                <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-6`}>
                    <h2 className={`${currentTheme.text} text-xl font-bold mb-2`}>Error al cargar datos</h2>
                    {isErrorMatch && <p className={`${currentTheme.textSecondary}`}>Summary by ID: {errorMatch.message}</p>}
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
                                Resumen del Partido
                            </h1>
                        </div>

                        {/* Download buttons */}
                        <div className="flex items-center gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={downloadAsPNG}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                            >
                                <DocumentArrowDownIcon className="w-4 h-4" />
                                <span className="hidden sm:inline">PNG</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={downloadAsPDF}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                            >
                                <DocumentArrowDownIcon className="w-4 h-4" />
                                <span className="hidden sm:inline">PDF</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6" ref={contentRef}>
                {finalMatchDataAsArray.map((partidoID, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl overflow-hidden shadow-xl`}
                    >
                        {/* League Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-6">
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
                                        RESULTADO FINAL
                                    </span>
                                    <div className="flex items-center gap-4">
                                        <span className={`${currentTheme.text} text-4xl font-bold`}>
                                            {partidoID.estadisticas?.FTHG ?? "0"}
                                        </span>
                                        <span className="text-blue-500 text-3xl">-</span>
                                        <span className={`${currentTheme.text} text-4xl font-bold`}>
                                            {partidoID.estadisticas?.FTAG ?? "0"}
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

                            {/* Match Statistics */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className={`${currentTheme.card} ${currentTheme.border} border rounded-xl overflow-hidden shadow-lg`}
                            >
                                <div className="h-1 bg-gradient-to-r from-orange-500 to-yellow-500"></div>
                                <div className="p-6">
                                    {/* Header with icon */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={`p-2 rounded-lg ${currentTheme.hover}`}>
                                            <ChartBarIcon className="w-6 h-6 text-orange-500" />
                                        </div>
                                        <h3 className={`${currentTheme.text} text-xl font-bold`}>
                                            Estadísticas del Partido
                                        </h3>
                                    </div>

                                    {/* Statistics Grid */}
                                    <div className={`p-6 rounded-xl ${currentTheme.hover} space-y-4`}>
                                        <BarComparativa
                                            home={partidoID?.estadisticas?.HTHG || 0}
                                            away={partidoID?.estadisticas?.HTAG || 0}
                                            title='Goles HT'
                                            homeTeam={partidoID.equipo_local?.nombre_equipo}
                                            awayTeam={partidoID.equipo_visita?.nombre_equipo}
                                        />
                                        <BarComparativa
                                            home={partidoID?.estadisticas?.HS || 0}
                                            away={partidoID?.estadisticas?.AS_ || 0}
                                            title='Disparos'
                                            homeTeam={partidoID.equipo_local?.nombre_equipo}
                                            awayTeam={partidoID.equipo_visita?.nombre_equipo}
                                        />
                                        <BarComparativa
                                            home={partidoID?.estadisticas?.HST || 0}
                                            away={partidoID?.estadisticas?.AST || 0}
                                            title='Disparos al arco'
                                            homeTeam={partidoID.equipo_local?.nombre_equipo}
                                            awayTeam={partidoID.equipo_visita?.nombre_equipo}
                                        />
                                        <BarComparativa
                                            home={partidoID?.estadisticas?.HF || 0}
                                            away={partidoID?.estadisticas?.AF || 0}
                                            title='Faltas'
                                            homeTeam={partidoID.equipo_local?.nombre_equipo}
                                            awayTeam={partidoID.equipo_visita?.nombre_equipo}
                                        />
                                        <BarComparativa
                                            home={partidoID?.estadisticas?.HC || 0}
                                            away={partidoID?.estadisticas?.AC || 0}
                                            title='Tiros de esquina'
                                            homeTeam={partidoID.equipo_local?.nombre_equipo}
                                            awayTeam={partidoID.equipo_visita?.nombre_equipo}
                                        />
                                        <BarComparativa
                                            home={partidoID?.estadisticas?.HY || 0}
                                            away={partidoID?.estadisticas?.AY || 0}
                                            title='Tarjetas amarillas'
                                            homeTeam={partidoID.equipo_local?.nombre_equipo}
                                            awayTeam={partidoID.equipo_visita?.nombre_equipo}
                                        />
                                        <BarComparativa
                                            home={partidoID?.estadisticas?.HR || 0}
                                            away={partidoID?.estadisticas?.AR || 0}
                                            title='Tarjetas rojas'
                                            homeTeam={partidoID.equipo_local?.nombre_equipo}
                                            awayTeam={partidoID.equipo_visita?.nombre_equipo}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default MatchSummary
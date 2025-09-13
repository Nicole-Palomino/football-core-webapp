import { useThemeMode } from '../../../contexts/ThemeContext';
import { ChevronUpIcon } from '@heroicons/react/24/outline'
import MatchList from "./MatchList"
import { useMemo, useState } from "react"
import { motion, AnimatePresence } from 'framer-motion'

const MatchAccordion = ({ data, type }) => {

    const { currentTheme } = useThemeMode()
    const [expandedLeagues, setExpandedLeagues] = useState(new Set())

    const partidosPorLiga = useMemo(() => {
        const grouped = data.reduce((acc, partido) => {
            const key = partido.liga.id_liga
            if (!acc[key]) {
                acc[key] = {
                    nombre_liga: partido.liga.nombre_liga,
                    logo_liga: partido.liga.imagen_pais,
                    partidos: [],
                }
            }
            acc[key].partidos.push(partido)
            return acc
        }, {})
        return grouped
    }, [data])

    const ligas = useMemo(() => Object.entries(partidosPorLiga), [partidosPorLiga])

    const toggleLeague = (ligaId) => {
        const newExpanded = new Set(expandedLeagues)
        if (newExpanded.has(ligaId)) {
            newExpanded.delete(ligaId)
        } else {
            newExpanded.add(ligaId)
        }
        setExpandedLeagues(newExpanded)
    }

    return (
        <div className="space-y-3">
            {ligas.map(([ligaId, { nombre_liga, logo_liga, partidos }], index) => {
                const isExpanded = expandedLeagues.has(ligaId)

                return (
                    <motion.div
                        key={ligaId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300`}
                    >
                        {/* League Header */}
                        <motion.button
                            onClick={() => toggleLeague(ligaId)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`w-full p-4 flex items-center justify-between transition-all duration-300 group relative overflow-hidden`}
                        >
                            {/* Background gradient on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <div className="relative z-10 flex items-center gap-3">
                                {/* League Logo */}
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shadow-sm">
                                    <img
                                        src={logo_liga}
                                        alt={nombre_liga}
                                        className="w-8 h-8 object-contain"
                                    />
                                </div>

                                {/* League Info */}
                                <div className="text-left">
                                    <h3 className={`${currentTheme.text} font-bold text-lg group-hover:text-blue-600 transition-colors duration-300`}>
                                        {nombre_liga}
                                    </h3>
                                    <p className={`${currentTheme.textSecondary} text-sm`}>
                                        {partidos.length} {partidos.length === 1 ? 'partido' : 'partidos'}
                                    </p>
                                </div>
                            </div>

                            {/* Chevron Icon */}
                            <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="relative z-10"
                            >
                                <div className={`p-2 rounded-lg ${currentTheme.hover} group-hover:bg-blue-50 transition-colors duration-300`}>
                                    <ChevronUpIcon className={`w-5 h-5 ${currentTheme.textSecondary} group-hover:text-blue-600 transition-colors duration-300`} />
                                </div>
                            </motion.div>

                            {/* Match count badge */}
                            <div className="absolute top-2 right-12">
                                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                        {partidos.length}
                                    </span>
                                </div>
                            </div>
                        </motion.button>

                        {/* League Content */}
                        <AnimatePresence initial={false}>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className={`px-4 pb-4 border-t ${currentTheme.border}`}>
                                        {/* Decorative line */}
                                        <div className="relative mb-4">
                                            <div className={`absolute inset-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent`}></div>
                                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent transform translate-y-1"></div>
                                        </div>

                                        <MatchList partidos={partidos} type={type} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Progress indicator for collapsed state */}
                        {!isExpanded && (
                            <div className="px-4 pb-4">
                                <div className="flex items-center gap-2">
                                    <div className={`flex-1 h-1 ${currentTheme.border} rounded-full overflow-hidden`}>
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000"
                                            style={{ width: `${Math.min(100, (partidos.length / 10) * 100)}%` }}
                                        ></div>
                                    </div>
                                    <span className={`${currentTheme.textSecondary} text-xs font-medium`}>
                                        Click para expandir
                                    </span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )
            })}
        </div>
    )
}

export default MatchAccordion
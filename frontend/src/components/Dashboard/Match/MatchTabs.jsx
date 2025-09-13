import React, { useCallback, useMemo, useState } from 'react'
import { useThemeMode } from '../../../contexts/ThemeContext'
import MatchAccordion from './MatchAccordion'
import { formatFecha } from '../../../utils/helpers'
import { usePartidosFinalizados, usePartidosPorJugar } from '../../../contexts/MatchesContext'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const MatchTabs = ({ type }) => {
    const matches = type === "por-jugar" ? usePartidosPorJugar() : usePartidosFinalizados()
    const { currentTheme } = useThemeMode()
    const [value, setValue] = useState(0)
    const [scrollPosition, setScrollPosition] = useState(0)

    const handleChange = useCallback((_, newValue) => setValue(newValue), [])

    const fechasUnicas = useMemo(() => [...new Set(matches.map((p) => formatFecha(p.dia)))], [matches])

    const partidosPorFecha = useMemo(() => {
        const grouped = {};
        matches.forEach((p) => {
            const fecha = formatFecha(p.dia)
            if (!grouped[fecha]) grouped[fecha] = []
            grouped[fecha].push(p)
        })
        return grouped
    }, [matches])

    const scrollTabs = (direction) => {
        const tabsContainer = document.getElementById('tabs-container')
        const scrollAmount = 200
        const newPosition = direction === 'left' 
            ? Math.max(0, scrollPosition - scrollAmount)
            : Math.min(tabsContainer.scrollWidth - tabsContainer.clientWidth, scrollPosition + scrollAmount)
        
        tabsContainer.scrollTo({ left: newPosition, behavior: 'smooth' })
        setScrollPosition(newPosition)
    }

    return (
        <div className="w-full mb-16">
            {/* Date Tabs Header */}
            <div className={`${currentTheme.card} ${currentTheme.border} border-b sticky top-0 z-10 backdrop-blur-sm bg-opacity-95`}>
                <div className="relative">
                    {/* Header with icon */}
                    <div className="flex items-center gap-2 p-4 border-b border-gray-200/50">
                        <CalendarDaysIcon className={`w-5 h-5 ${currentTheme.textSecondary}`} />
                        <span className={`${currentTheme.text} font-semibold text-sm`}>
                            Seleccionar Fecha
                        </span>
                        <div className="flex-1"></div>
                        <div className={`${currentTheme.textSecondary} text-xs`}>
                            {fechasUnicas.length} {fechasUnicas.length === 1 ? 'fecha' : 'fechas'}
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    {fechasUnicas.length > 4 && (
                        <>
                            <button
                                onClick={() => scrollTabs('left')}
                                className={`absolute left-0 top-14 bottom-0 z-10 w-8 ${currentTheme.card} ${currentTheme.border} border-r flex items-center justify-center hover:bg-blue-50 transition-colors duration-200`}
                            >
                                <ChevronLeftIcon className={`w-4 h-4 ${currentTheme.textSecondary}`} />
                            </button>
                            
                            <button
                                onClick={() => scrollTabs('right')}
                                className={`absolute right-0 top-14 bottom-0 z-10 w-8 ${currentTheme.card} ${currentTheme.border} border-l flex items-center justify-center hover:bg-blue-50 transition-colors duration-200`}
                            >
                                <ChevronRightIcon className={`w-4 h-4 ${currentTheme.textSecondary}`} />
                            </button>
                        </>
                    )}

                    {/* Tabs Container */}
                    <div 
                        id="tabs-container"
                        className="overflow-x-auto scrollbar-hide"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <div className="flex min-w-max">
                            {fechasUnicas.map((dia, index) => {
                                const isActive = value === index
                                const partidosCount = partidosPorFecha[dia]?.length || 0
                                
                                return (
                                    <motion.button
                                        key={dia}
                                        onClick={() => handleChange(null, index)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`relative px-6 py-4 transition-all duration-300 flex-shrink-0 min-w-[120px] group ${
                                            isActive 
                                                ? `${currentTheme.text} bg-gradient-to-r from-blue-50 to-purple-50` 
                                                : `${currentTheme.textSecondary} hover:${currentTheme.text} ${currentTheme.hover}`
                                        }`}
                                    >
                                        {/* Background effect */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-t-lg"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        
                                        <div className="relative z-10 text-center p-2">
                                            <div className={`font-semibold text-sm transition-colors duration-300 ${
                                                isActive ? 'text-blue-600' : currentTheme.text
                                            }`}>
                                                {dia}
                                            </div>
                                            <div className={`text-xs mt-1 transition-colors duration-300 ${
                                                isActive ? 'text-purple-600' : currentTheme.textSecondary
                                            }`}>
                                                {partidosCount} {partidosCount === 1 ? 'partido' : 'partidos'}
                                            </div>
                                        </div>

                                        {/* Active indicator */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="indicator"
                                                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}

                                        {/* Hover effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg"></div>
                                    </motion.button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-4">
                <AnimatePresence mode="wait">
                    {fechasUnicas[value] && (
                        <motion.div
                            key={fechasUnicas[value]}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Date Header */}
                            <div className="mb-6 text-center">
                                <div className={`inline-flex items-center gap-2 ${currentTheme.card} ${currentTheme.border} border rounded-xl px-4 py-2 shadow-sm`}>
                                    <CalendarDaysIcon className="w-4 h-4 text-blue-500" />
                                    <span className={`${currentTheme.text} font-semibold`}>
                                        {fechasUnicas[value]}
                                    </span>
                                    <div className="w-px h-4 bg-gray-300"></div>
                                    <span className={`${currentTheme.textSecondary} text-sm`}>
                                        {partidosPorFecha[fechasUnicas[value]]?.length || 0} partidos
                                    </span>
                                </div>
                            </div>

                            {/* Matches */}
                            <MatchAccordion 
                                data={partidosPorFecha[fechasUnicas[value]]} 
                                type={type} 
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default React.memo(MatchTabs)
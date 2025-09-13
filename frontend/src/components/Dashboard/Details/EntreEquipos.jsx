import { useThemeMode } from '../../../contexts/ThemeContext'
import React from 'react'
import { motion } from 'framer-motion'

const EntreEquipos = ({ equipo_local, equipo_visita, item_local, item_visita }) => {
    const { currentTheme } = useThemeMode()
    const formatValue = (value) => {
        if (value === null || value === undefined) return '-'
        if (typeof value === 'number') {
            return value % 1 === 0 ? value.toString() : value.toFixed(2)
        }
        return value.toString()
    }

    return (
        <div className="space-y-4">
            {/* Values Display */}
            <div className="flex items-center justify-between">
                {/* Local Team */}
                <motion.div
                    className="flex-1 text-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="text-2xl md:text-3xl font-bold text-blue-500 mb-2">
                        {formatValue(item_local)}
                    </div>
                    <div className={`text-xs md:text-sm ${currentTheme.textSecondary} font-medium truncate px-2`}>
                        {equipo_local}
                    </div>
                </motion.div>

                {/* VS Separator */}
                <motion.div
                    className="mx-4 flex-shrink-0"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <div className={`w-12 h-12 rounded-full ${currentTheme.card} ${currentTheme.border} border-2 flex items-center justify-center`}>
                        <span className={`text-xs font-bold ${currentTheme.textSecondary}`}>VS</span>
                    </div>
                </motion.div>

                {/* Visiting Team */}
                <motion.div
                    className="flex-1 text-center"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="text-2xl md:text-3xl font-bold text-red-500 mb-2">
                        {formatValue(item_visita)}
                    </div>
                    <div className={`text-xs md:text-sm ${currentTheme.textSecondary} font-medium truncate px-2`}>
                        {equipo_visita}
                    </div>
                </motion.div>
            </div>

            {/* Comparison Bar (if both values are numbers) */}
            {typeof item_local === 'number' && typeof item_visita === 'number' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="space-y-2"
                >
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full relative overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: item_local > 0 ? '100%' : '0%' }}
                                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                className="h-full bg-blue-500 rounded-full"
                            />
                        </div>
                        <div className="w-8 h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div className="flex-1 h-2 bg-gradient-to-l from-red-500 to-red-400 rounded-full relative overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: item_visita > 0 ? '100%' : '0%' }}
                                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                className="h-full bg-red-500 rounded-full ml-auto"
                                style={{ direction: 'rtl' }}
                            />
                        </div>
                    </div>

                    {/* Percentage indicators */}
                    {item_local + item_visita > 0 && (
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>{Math.round((item_local / (item_local + item_visita)) * 100)}%</span>
                            <span>{Math.round((item_visita / (item_local + item_visita)) * 100)}%</span>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    )
}

export default EntreEquipos
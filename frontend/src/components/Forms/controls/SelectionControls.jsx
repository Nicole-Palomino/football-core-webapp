import {
    ChartBarIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline'
import { useThemeMode } from '../../../contexts/ThemeContext'
import { motion } from 'framer-motion'

const SelectionControls = ({ selectedLiga, handleLigaChange, selectedEquipo1, handleEquipo1Change, selectedEquipo2, handleEquipo2Change, handleShowAnalysis, ligas, equipos, loading }) => {
    const { currentTheme } = useThemeMode()

    const CustomSelect = ({ value, onChange, options, placeholder, filterOut = null }) => (
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                className={`w-full h-14 px-4 pr-10 rounded-xl border ${currentTheme.border} ${currentTheme.background} ${currentTheme.text} 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none
                           ${currentTheme.hover}`}
            >
                <option value="" disabled>{placeholder}</option>
                {options
                    .filter(option => filterOut ? option !== filterOut : true)
                    .map((option, index) => (
                        <option
                            key={typeof option === 'object' ? option.id : option}
                            value={typeof option === 'object' ? option.id : option}
                            className={`${currentTheme.background} ${currentTheme.text}`}
                        >
                            {typeof option === 'object' ? `${option.logo} ${option.nombre}` : option}
                        </option>
                    ))
                }
            </select>
            <ChevronDownIcon className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${currentTheme.textSecondary} pointer-events-none`} />
        </div>
    )

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6 mb-6 shadow-xl backdrop-blur-sm relative overflow-hidden`}
        >
            {/* Gradient border top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-700"></div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* League Selection */}
                <div className="space-y-2">
                    <label className={`block text-sm font-bold ${currentTheme.text} uppercase tracking-wide`}>
                        LIGA
                    </label>
                    <CustomSelect
                        value={selectedLiga}
                        onChange={handleLigaChange}
                        options={ligas}
                        placeholder="Seleccionar Liga"
                    />
                </div>

                {/* Home Team Selection */}
                <div className="space-y-2">
                    <label className={`block text-sm font-bold ${currentTheme.text} uppercase tracking-wide`}>
                        EQUIPO LOCAL
                    </label>
                    <CustomSelect
                        value={selectedEquipo1}
                        onChange={handleEquipo1Change}
                        options={equipos.length === 0 ? ['No hay equipos disponibles'] : equipos}
                        placeholder="Equipo Local"
                    />
                </div>

                {/* Away Team Selection */}
                <div className="space-y-2">
                    <label className={`block text-sm font-bold ${currentTheme.text} uppercase tracking-wide`}>
                        EQUIPO VISITANTE
                    </label>
                    <CustomSelect
                        value={selectedEquipo2}
                        onChange={handleEquipo2Change}
                        options={equipos}
                        placeholder="Equipo Visitante"
                        filterOut={selectedEquipo1}
                    />
                </div>

                {/* Analysis Button */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold opacity-0">ACCIÓN</label>
                    <motion.button
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        onClick={handleShowAnalysis}
                        disabled={!selectedLiga || !selectedEquipo1 || !selectedEquipo2 || loading}
                        className={`w-full h-14 rounded-xl font-bold text-white transition-all duration-200 flex items-center justify-center gap-2
                                   ${(!selectedLiga || !selectedEquipo1 || !selectedEquipo2 || loading)
                                ? 'bg-gray-500 cursor-not-allowed opacity-50'
                                : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                            }`}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Analizando...</span>
                            </div>
                        ) : (
                            <>
                                <ChartBarIcon className="w-5 h-5" />
                                <span>Analizar</span>
                            </>
                        )}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}

export default SelectionControls
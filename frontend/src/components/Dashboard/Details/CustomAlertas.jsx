import { useThemeMode } from '../../../contexts/ThemeContext'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const CustomAlertas = ({ title }) => {
    const { currentTheme } = useThemeMode()

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`
                mb-6 p-4 rounded-xl flex items-start gap-3 shadow-sm transition-all duration-300
                ${currentTheme.card} 
                ${currentTheme.border} border
                hover:shadow-md
                relative overflow-hidden group
            `}
        >
            {/* Subtle gradient line at top */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60"></div>

            {/* Icon with subtle animation */}
            <motion.div
                className="flex-shrink-0 mt-0.5"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
            >
                <div className="p-2 bg-blue-500/10 rounded-lg">
                    <InformationCircleIcon className="h-5 w-5 text-blue-500" />
                </div>
            </motion.div>

            {/* Content */}
            <div className="flex-1">
                <p className={`text-sm md:text-base leading-relaxed ${currentTheme.text}`}>
                    {title}
                </p>
            </div>
        </motion.div>
    )
}

export default CustomAlertas
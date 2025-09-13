import { useThemeMode } from '../../../contexts/ThemeContext'
import { motion } from 'framer-motion'

const TitleText = ({ icon: Icon, iconColor, title }) => {
    const { currentTheme } = useThemeMode()

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 mb-4"
        >
            <motion.div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${iconColor}20` }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
            >
                <Icon
                    className="w-6 h-6"
                    style={{ color: iconColor }}
                />
            </motion.div>
            <h3 className={`text-lg md:text-xl font-bold ${currentTheme.text}`}>
                {title}
            </h3>
        </motion.div>
    )
}

export default TitleText
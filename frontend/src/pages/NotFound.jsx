import { motion } from 'framer-motion'
import {
    HomeIcon,
    ArrowLeftIcon,
    ExclamationTriangleIcon,
    MagnifyingGlassIcon,
    ClockIcon
} from '@heroicons/react/24/outline'
import { useThemeMode } from '../contexts/ThemeContext'

const NotFound = () => {
    const { currentTheme } = useThemeMode()

    const goHome = () => {
        navigate("/")
    }

    const goBack = () => {
        navigate(-1)
    }

    const searchMatches = () => {
        navigate("/get-started")
    }

    return (
        <div className={`min-h-screen ${currentTheme.background} flex items-center justify-center p-4`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-green-400/10 to-blue-400/10 blur-3xl"></div>
            </div>

            <div className="relative z-10 text-center max-w-md w-full">
                {/* Main 404 Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`${currentTheme.card} ${currentTheme.border} border rounded-3xl p-8 shadow-2xl backdrop-blur-sm`}
                >
                    {/* Animated 404 Number */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mb-6"
                    >
                        <div className="relative">
                            <h1 className={`text-8xl font-black ${currentTheme.text} relative z-10 tracking-tight`}>
                                404
                            </h1>
                            {/* Gradient backdrop for 404 */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent opacity-20">
                                404
                            </div>
                        </div>
                    </motion.div>

                    {/* Error Icon */}
                    <motion.div
                        initial={{ rotate: -10, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mb-6"
                    >
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <ExclamationTriangleIcon className="w-8 h-8 text-white" />
                        </div>
                    </motion.div>

                    {/* Error Message */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="mb-8"
                    >
                        <h2 className={`text-2xl font-bold ${currentTheme.text} mb-2`}>
                            Página no encontrada
                        </h2>
                        <p className={`${currentTheme.textSecondary} text-base leading-relaxed`}>
                            Lo sentimos, la página que buscas no existe o ha sido movida.
                            Regresa al inicio para encontrar los partidos.
                        </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="space-y-4"
                    >
                        {/* Primary Action - Go Home */}
                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={goHome}
                            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <HomeIcon className="w-5 h-5" />
                            Ir al inicio
                        </motion.button>

                        {/* Secondary Actions */}
                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={goBack}
                                className={`flex-1 flex items-center justify-center gap-2 ${currentTheme.card} ${currentTheme.border} border-2 hover:border-blue-300 dark:hover:border-blue-600 ${currentTheme.text} font-medium py-3 px-4 rounded-xl hover:shadow-md transition-all duration-300`}
                            >
                                <ArrowLeftIcon className="w-4 h-4" />
                                Volver
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={searchMatches}
                                className={`flex-1 flex items-center justify-center gap-2 ${currentTheme.card} ${currentTheme.border} border-2 hover:border-green-300 dark:hover:border-green-600 ${currentTheme.text} font-medium py-3 px-4 rounded-xl hover:shadow-md transition-all duration-300`}
                            >
                                <MagnifyingGlassIcon className="w-4 h-4" />
                                Buscar
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Additional Help Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                    className={`mt-8 p-4 ${currentTheme.card} ${currentTheme.border} border rounded-2xl shadow-lg backdrop-blur-sm`}
                >
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <ClockIcon className={`w-5 h-5 ${currentTheme.textSecondary}`} />
                        <h3 className={`font-semibold ${currentTheme.text}`}>¿Necesitas ayuda?</h3>
                    </div>
                    <p className={`${currentTheme.textSecondary} text-sm`}>
                        Visita nuestra página principal para ver todos los partidos disponibles
                    </p>
                </motion.div>

                {/* Fun Football Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="mt-6"
                >
                    <motion.div
                        animate={{
                            rotate: [0, 360],
                            y: [0, -10, 0]
                        }}
                        transition={{
                            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                            y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="mx-auto w-12 h-12 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center shadow-lg"
                    >
                        <div className="w-8 h-8 border-2 border-white rounded-full relative">
                            <div className="absolute inset-0 border-2 border-white rounded-full transform rotate-45"></div>
                            <div className="absolute inset-0 border-2 border-white rounded-full transform -rotate-45"></div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

export default NotFound
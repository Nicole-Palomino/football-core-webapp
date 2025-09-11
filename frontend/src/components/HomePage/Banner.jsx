import { motion } from "framer-motion"
import { TbDeviceAnalytics, TbSoccerField } from 'react-icons/tb'
import { PiSoccerBallFill } from 'react-icons/pi'
import { FadeUp } from '../../utils/transitions'
import BannerPng from '../../assets/data-football.png'
import { useMediaQuery } from "@mui/material"
import { useThemeMode } from "../../contexts/ThemeContext"

const Banner = () => {
    const { currentTheme } = useThemeMode()

    const features = [
        { 
            icon: <TbSoccerField className="text-2xl lg:text-3xl" />, 
            text: "17,000+ Partidos",
            description: "Base de datos completa"
        },
        { 
            icon: <TbDeviceAnalytics className="text-2xl lg:text-3xl" />, 
            text: "Estadísticas detalladas",
            description: "Análisis profundo"
        },
        { 
            icon: <PiSoccerBallFill className="text-2xl lg:text-3xl" />, 
            text: "Pronósticos",
            description: "Predicciones precisas"
        }
    ]

    return (
        <section className={`w-full overflow-hidden ${currentTheme.background} transition-colors duration-300`}>
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Imagen del banner */}
                    <div className="flex justify-center items-center order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="relative"
                        >
                            {/* Background decoration */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl blur-2xl scale-110"></div>
                            
                            <img
                                src={BannerPng}
                                alt="Estadísticas de fútbol"
                                className={`relative z-10 w-full max-w-md lg:max-w-lg xl:max-w-xl ${currentTheme.shadow} rounded-2xl transition-all duration-300 hover:scale-105`}
                            />
                            
                            {/* Floating stats */}
                            <motion.div
                                initial={{ scale: 0, rotate: -10 }}
                                whileInView={{ scale: 1, rotate: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                viewport={{ once: true }}
                                className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg"
                            >
                                📈 +95% Precisión
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Texto y tarjetas */}
                    <div className="flex flex-col justify-center order-1 lg:order-2">
                        <div className="text-center lg:text-left space-y-8">
                            {/* Main heading */}
                            <motion.h1
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight ${currentTheme.text}`}
                            >
                                Descubre las{' '}
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    estadísticas
                                </span>{' '}
                                y predicciones de tus equipos favoritos.
                            </motion.h1>
                            
                            {/* Subtitle */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className={`text-lg sm:text-xl ${currentTheme.textSecondary} leading-relaxed`}
                            >
                                ¡Haz que tus decisiones sean ganadoras con datos precisos y análisis profesional!
                            </motion.p>

                            {/* Features grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-4">
                                {features.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        variants={FadeUp(0.2 * (i + 1))}
                                        initial="initial"
                                        whileInView="animate"
                                        viewport={{ once: true }}
                                        className={`group ${currentTheme.card} rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${currentTheme.shadow} ${currentTheme.border} border ${currentTheme.hover} cursor-pointer relative overflow-hidden`}
                                    >
                                        {/* Background gradient on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        
                                        <div className="relative z-10 flex flex-col sm:flex-row xl:flex-col items-center gap-3 text-center sm:text-left xl:text-center">
                                            {/* Icon */}
                                            <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300">
                                                <div className="text-blue-600 group-hover:text-purple-600 transition-colors duration-300">
                                                    {item.icon}
                                                </div>
                                            </div>
                                            
                                            {/* Content */}
                                            <div className="flex-1">
                                                <h3 className={`text-base lg:text-lg font-semibold ${currentTheme.text} group-hover:text-blue-600 transition-colors duration-300 mb-1`}>
                                                    {item.text}
                                                </h3>
                                                <p className={`text-sm ${currentTheme.textSecondary}`}>
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Accent dot */}
                                        <div className="absolute top-3 right-3 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-40 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Call to action */}
                            {/* <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
                            >
                                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                    Explorar Datos
                                </button>
                                
                                <button className={`px-8 py-4 rounded-xl font-semibold border-2 ${currentTheme.text} ${currentTheme.border} ${currentTheme.hover} hover:border-blue-500 hover:text-blue-600 transition-all duration-300`}>
                                    Ver Estadísticas
                                </button>
                            </motion.div> */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Banner
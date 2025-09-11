import { motion } from 'framer-motion'
import { IoIosArrowRoundForward } from 'react-icons/io'
import { Link } from 'react-router-dom'
import { FadeUp } from '../../utils/transitions'
import HeroPng from '../../assets/hero.png'
import { useThemeMode } from '../../contexts/ThemeContext'

const Hero = () => {
    const { currentTheme } = useThemeMode()

    return (
        <section className={`overflow-hidden relative ${currentTheme.background} transition-colors duration-300 mt-6`}>
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 min-h-[650px] gap-10 items-center py-12 lg:py-0">
                {/* TEXT */}
                <div className="flex flex-col justify-center relative">
                    <div className="text-center lg:text-left space-y-8 lg:max-w-[600px]">
                        <motion.h1
                            variants={FadeUp(0.6)}
                            initial="initial"
                            animate="animate"
                            className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight ${currentTheme.text} transition-colors duration-300`}
                        >
                            Convierte tu pasión por el{' '}
                            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent font-extrabold">
                                fútbol
                            </span>{' '}
                            en conocimiento con{' '}
                            <span className="bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 bg-clip-text text-transparent font-extrabold">
                                análisis
                            </span>{' '} 
                            visuales, datos y estadísticas impactantes.
                        </motion.h1>

                        <motion.p
                            variants={FadeUp(0.7)}
                            initial="initial"
                            animate="animate"
                            className={`text-lg sm:text-xl ${currentTheme.textSecondary} max-w-2xl mx-auto lg:mx-0 leading-relaxed`}
                        >
                            Descubre insights profundos, visualiza tendencias y toma decisiones informadas con nuestra plataforma de análisis deportivo.
                        </motion.p>

                        <motion.div
                            variants={FadeUp(0.8)}
                            initial="initial"
                            animate="animate"
                            className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
                        >
                            <Link
                                to="/get-started"
                                className={`group relative overflow-hidden px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${currentTheme.shadow} flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white hover:from-blue-700 hover:via-blue-600 hover:to-indigo-700`}
                            >
                                <span className="relative z-10">Comenzar Análisis</span>
                                <IoIosArrowRoundForward className="text-2xl transition-transform duration-300 group-hover:translate-x-2 group-hover:-rotate-12 relative z-10" />
                                
                                {/* Hover effect overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Link>

                            {/* <button className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border-2 ${currentTheme.text} ${currentTheme.border} ${currentTheme.hover} hover:border-blue-500 hover:text-blue-600 flex items-center justify-center gap-2`}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                                Ver Demo
                            </button> */}
                        </motion.div>

                        <motion.div
                            variants={FadeUp(0.9)}
                            initial="initial"
                            animate="animate"
                            className="grid grid-cols-3 gap-6 pt-8"
                        >
                            <div className="text-center lg:text-left">
                                <div className={`text-2xl sm:text-3xl font-bold ${currentTheme.text} mb-1`}>1000+</div>
                                <div className={`text-sm ${currentTheme.textSecondary}`}>Partidos Analizados</div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className={`text-2xl sm:text-3xl font-bold ${currentTheme.text} mb-1`}>50+</div>
                                <div className={`text-sm ${currentTheme.textSecondary}`}>Métricas Avanzadas</div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className={`text-2xl sm:text-3xl font-bold ${currentTheme.text} mb-1`}>24/7</div>
                                <div className={`text-sm ${currentTheme.textSecondary}`}>Datos Actualizados</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
                
                {/* IMAGE */}
                <div className="flex justify-center items-center relative">
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl scale-150"></div>
                    
                    <motion.div
                        initial={{ x: 50, opacity: 0, scale: 0.8 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
                        className="relative z-10"
                    >
                        <img
                            src={HeroPng}
                            alt="Ilustración de análisis de fútbol"
                            className={`w-full max-w-md xl:max-w-xl 2xl:max-w-2xl relative ${currentTheme.shadow} rounded-2xl transition-all duration-300 hover:scale-105`}
                        />
                        
                        {/* Floating elements */}
                        <motion.div
                            initial={{ y: 0 }}
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg"
                        >
                            📊 Análisis de Datos
                        </motion.div>
                        
                        <motion.div
                            initial={{ y: 0 }}
                            animate={{ y: [10, -10, 10] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg"
                        >
                            ⚽ Pronósticos
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }}></div>
            </div>
        </section>
    )
}

export default Hero
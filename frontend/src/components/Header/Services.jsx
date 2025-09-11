import { motion } from 'framer-motion'
import { SparklesIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import NavbarClient from '../Navbar/NavbarClient'
import { services } from '../../utils/navbarUtils'
import { Link } from 'react-router-dom'
import { letterAnimation } from '../../utils/transitions'
import { useThemeMode } from '../../contexts/ThemeContext'

const Services = () => {

    const { currentTheme } = useThemeMode()
    const title = "Nuestros Servicios"

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    }

    return (
        <section className={`relative w-full overflow-x-hidden ${currentTheme.background} transition-colors duration-300`}>
            <NavbarClient />

            <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8 h-full overflow-y-auto">
                {/* Header */}
                <div className="text-center mb-16 mt-10">
                    <motion.h2
                        className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-6 ${currentTheme.text}`}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {title.split('').map((char, i) => (
                            <motion.span
                                key={i}
                                custom={i}
                                variants={letterAnimation(0.05)}
                                className="inline-block"
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </motion.span>
                        ))}
                    </motion.h2>

                    <motion.p
                        className={`text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed ${currentTheme.textSecondary}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Potencia tu análisis futbolístico con inteligencia artificial, algoritmos avanzados
                        y herramientas profesionales.
                    </motion.p>

                    {/* Decorative line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        viewport={{ once: true }}
                        className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-8 rounded-full"
                    ></motion.div>
                </div>

                {/* Services Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 items-stretch"
                >
                    {services.map((service) => (
                        <motion.div
                            key={service.id}
                            variants={itemVariants}
                            whileHover={{
                                scale: 1.02,
                                transition: { duration: 0.3 }
                            }}
                            className="group relative h-full flex"
                        >
                            {/* Card */}
                            <div className={`relative ${currentTheme.card} rounded-2xl p-6 lg:p-8 h-full flex flex-col overflow-hidden transition-all duration-500 ${currentTheme.shadow} ${currentTheme.border} border group-hover:scale-105 group-hover:shadow-2xl`}>

                                {/* Background gradient on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                                {/* Premium badge */}
                                {service.isPremium && (
                                    <div className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
                                        <CurrencyDollarIcon className="w-3 h-3" />
                                        PREMIUM
                                    </div>
                                )}

                                {/* Icon container */}
                                <div className="relative z-10 mb-6">
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300 group-hover:scale-110">
                                        <service.icon className="w-8 h-8 text-blue-600 group-hover:text-purple-600 transition-colors duration-300" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="relative z-10 flex flex-col h-full">
                                    <h3 className={`text-xl lg:text-2xl font-bold mb-4 transition-colors duration-300 ${currentTheme.text} group-hover:text-blue-600`}>
                                        {service.title}
                                    </h3>

                                    <p className={`mb-6 leading-relaxed transition-colors duration-300 ${currentTheme.textSecondary} flex-grow`}>
                                        {service.description}
                                    </p>

                                    {/* Features */}
                                    <ul className="space-y-3 mb-6">
                                        {service.features.map((feature, index) => (
                                            <li
                                                key={index}
                                                className={`flex items-start text-sm transition-colors duration-300 ${currentTheme.textSecondary}`}
                                            >
                                                <div className="w-2 h-2 rounded-full mr-3 mt-2 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:scale-125 transition-transform duration-300 flex-shrink-0"></div>
                                                <span className="leading-relaxed">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Price and CTA */}
                                    <div className="flex items-center justify-between mt-auto pt-4">
                                        <div className={`text-2xl font-bold ${currentTheme.text}`}>
                                            {service.price}
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg"
                                        >
                                            {service.isPremium ? 'Obtener' : 'Usar Gratis'}
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Hover effect lines */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                {/* Corner accent */}
                                <div className="absolute top-3 left-3 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 group-hover:opacity-60 transition-opacity duration-300"></div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center mt-16 mb-16"
                >
                    <div className={`${currentTheme.card} rounded-3xl p-8 lg:p-12 ${currentTheme.border} border ${currentTheme.shadow} relative overflow-hidden`}>
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                backgroundSize: '60px 60px'
                            }}></div>
                        </div>

                        <div className="relative z-10">
                            <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 ${currentTheme.text}`}>
                                ¿Listo para revolucionar tu análisis futbolístico?
                            </h3>

                            <p className={`${currentTheme.textSecondary} mb-8 text-lg max-w-2xl mx-auto leading-relaxed`}>
                                Únete a miles de analistas que ya confían en nuestras herramientas para tomar decisiones más inteligentes
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <motion.button
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative overflow-hidden group px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-2xl"
                                >
                                    <Link to="/get-started" className="relative z-10 flex items-center justify-center gap-2">
                                        <SparklesIcon className="w-5 h-5" />
                                        Comenzar Ahora
                                    </Link>
                                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                </motion.button>

                                {/* <button className={`px-8 py-4 rounded-2xl font-bold text-lg border-2 ${currentTheme.text} ${currentTheme.border} ${currentTheme.hover} hover:border-blue-500 hover:text-blue-600 transition-all duration-300`}>
                                    Ver Demo
                                </button> */}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Services
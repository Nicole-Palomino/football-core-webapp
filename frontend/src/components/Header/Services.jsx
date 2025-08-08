import { motion } from 'framer-motion'
import { SparklesIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import NavbarClient from '../Navbar/NavbarClient'
import { services } from '../../utils/navbarUtils'
import { Link } from 'react-router-dom'
import { useTheme } from '@mui/material'
import { letterAnimation } from '../../utils/transitions'

const Services = () => {

    const theme = useTheme()
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
        <section className="relative w-full overflow-x-hidden">
            <NavbarClient />

            <div className="max-w-7xl mx-auto relative z-10 p-5 h-full overflow-y-auto">
                {/* Header */}
                <div
                    className="text-center mb-16 mt-10"
                >
                    <motion.h2
                        className="text-xl sm:text-3xl md:text-5xl font-title uppercase font-bold mb-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        style={{
                            color: 'transparent',
                            WebkitTextStrokeWidth: '2px',
                            WebkitTextStrokeColor: theme.palette.text.primary, // antes #000 o #fff
                            MozTextStrokeWidth: '2px',
                            MozTextStrokeColor: theme.palette.text.primary,
                            textShadow: `7px 7px ${theme.custom.azul}`, // antes #193cb8
                        }}
                    >
                        {title.split('').map((char, i) => (
                            <motion.span
                                key={i}
                                custom={i}
                                variants={letterAnimation(0.05)}
                                style={{ color: theme.palette.text.primary }}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </motion.span>
                        ))}
                    </motion.h2>

                    <motion.p
                        className="text-xl max-w-3xl mx-auto leading-relaxed"
                        style={{
                            color: theme.palette.text.primary
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Potencia tu análisis futbolístico con inteligencia artificial, algoritmos avanzados
                        y herramientas profesionales.
                    </motion.p>
                </div>

                {/* Services Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    style={{
                        padding: theme.spacing(2),
                        backgroundColor: theme.palette.background.default
                    }}
                >
                    {services.map((service) => (
                        <motion.div
                            key={service.id}
                            variants={itemVariants}
                            whileHover={{
                                scale: 1.05,
                                rotateY: 5,
                                transition: { duration: 0.3 }
                            }}
                            className="group relative"
                        >
                            {/* Card */}
                            <div
                                className="relative rounded-2xl p-8 h-full overflow-hidden transition-all duration-500 group-hover:shadow-2xl"
                                style={{
                                    backgroundColor: theme.palette.background.paper,
                                    border: `1px solid ${theme.palette.divider.primary}`,
                                    boxShadow: `0 0 10px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)'}`
                                }}
                            >
                                {/* Gradient overlay */}
                                <div
                                    className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}
                                    style={{
                                        background: `linear-gradient(to bottom right, ${theme.palette.primary.main}, ${theme.palette.info.main})`
                                    }}
                                ></div>

                                {/* Premium badge */}
                                {service.isPremium && (
                                    <div
                                        className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
                                        style={{
                                            background: `linear-gradient(to right, ${theme.palette.warning.main}, ${theme.palette.info.main})`,
                                            color: theme.palette.getContrastText(theme.palette.warning.main)
                                        }}
                                    >
                                        <CurrencyDollarIcon className="w-3 h-3" />
                                        PREMIUM
                                    </div>
                                )}

                                {/* Icon */}
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                                    style={{
                                        background: `linear-gradient(to bottom right, ${theme.palette.primary.main}, ${theme.palette.info.main})`
                                    }}
                                >
                                    <service.icon className="w-8 h-8" style={{ color: theme.palette.common.white }} />
                                </div>

                                {/* Content */}
                                <div className="relative z-10">
                                    <h3
                                        className="text-2xl font-bold mb-4 transition-colors duration-300"
                                        style={{
                                            color: theme.palette.text.primary
                                        }}
                                    >
                                        {service.title}
                                    </h3>

                                    <p
                                        className="mb-6 leading-relaxed transition-colors duration-300"
                                        style={{
                                            color: theme.palette.text.secondary
                                        }}
                                    >
                                        {service.description}
                                    </p>

                                    {/* Features */}
                                    <ul className="space-y-2 mb-6">
                                        {service.features.map((feature, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center text-sm transition-colors duration-300"
                                                style={{ color: theme.palette.text.secondary }}
                                            >
                                                <div
                                                    className="w-2 h-2 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"
                                                    style={{
                                                        background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.info.main})`
                                                    }}
                                                ></div>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Price and CTA */}
                                    <div className="flex items-center justify-between">
                                        <div
                                            className="text-2xl font-bold"
                                            style={{ color: theme.palette.text.primary }}
                                        >
                                            {service.price}
                                        </div>
                                        {/* <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`px-4 py-2 bg-gradient-to-r ${service.color} text-white rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-lg`}
                                        >
                                            {service.isPremium ? 'Obtener' : 'Usar Gratis'}
                                        </motion.button> */}
                                    </div>
                                </div>

                                {/* Hover effect lines */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center mt-16 mb-16"
                >
                    <p
                        className="text-gray-400 mb-6 text-lg"
                        style={{ color: theme.palette.text.secondary }}>
                        ¿Listo para revolucionar tu análisis futbolístico?
                    </p>
                    <motion.button
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-blue-500 via-sky-700 to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-2xl relative overflow-hidden group"
                    >
                        <Link to="/get-started">
                            <span className="relative z-10 flex items-center gap-2">
                                <SparklesIcon className="w-5 h-5" />
                                Comenzar Ahora
                            </span>
                        </Link>
                        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </motion.button>
                </motion.div>
            </div>
        </section >
    )
}

export default Services
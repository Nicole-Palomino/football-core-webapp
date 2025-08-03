import { motion } from 'framer-motion'
import React from 'react'
import {
    ChartBarIcon,
    CpuChipIcon,
    DocumentArrowDownIcon,
    EyeIcon,
    SparklesIcon,
    TrophyIcon,
    ClockIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const Services = () => {

    const services = [
        {
            id: 1,
            title: "Análisis Poisson",
            description: "Análisis estadístico avanzado de partidos utilizando distribución de Poisson para evaluar probabilidades de goles y resultados.",
            icon: ChartBarIcon,
            features: ["Distribución de goles", "Análisis de probabilidades", "Métricas avanzadas"],
            price: "Gratis",
            color: "from-blue-500 to-cyan-500",
            delay: 0.1
        },
        {
            id: 2,
            title: "Clustering K-Means",
            description: "Agrupación inteligente de equipos y jugadores basada en rendimiento, estilo de juego y características similares.",
            icon: CpuChipIcon,
            features: ["Agrupación de equipos", "Análisis de patrones", "Segmentación inteligente"],
            price: "Gratis",
            color: "from-purple-500 to-pink-500",
            delay: 0.2
        },
        {
            id: 3,
            title: "Predicciones RF",
            description: "Predicciones precisas usando Random Forest para clasificación y regresión de resultados de partidos.",
            icon: SparklesIcon,
            features: ["Clasificación de resultados", "Regresión de marcadores", "Alta precisión"],
            price: "$9.99/mes",
            isPremium: true,
            color: "from-orange-500 to-red-500",
            delay: 0.3
        },
        {
            id: 4,
            title: "Resúmenes PNG",
            description: "Genera y descarga resúmenes visuales profesionales de análisis y estadísticas en formato PNG.",
            icon: DocumentArrowDownIcon,
            features: ["Diseño profesional", "Descarga instantánea", "Múltiples formatos"],
            price: "Gratis",
            color: "from-green-500 to-emerald-500",
            delay: 0.4
        },
        {
            id: 5,
            title: "Stats de Partidos",
            description: "Visualiza estadísticas detalladas de partidos en tiempo real con métricas avanzadas y comparativas.",
            icon: EyeIcon,
            features: ["Stats en tiempo real", "Comparativas históricas", "Métricas avanzadas"],
            price: "Gratis",
            color: "from-indigo-500 to-blue-500",
            delay: 0.5
        },
        {
            id: 6,
            title: "Dashboard Pro",
            description: "Panel completo con todas las herramientas, análisis avanzados y acceso prioritario a nuevas funciones.",
            icon: TrophyIcon,
            features: ["Acceso completo", "Soporte prioritario", "Nuevas funciones"],
            price: "$19.99/mes",
            isPremium: true,
            color: "from-yellow-500 to-orange-500",
            delay: 0.6
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

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
    };

    return (
        <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-3/4 left-1/3 w-32 h-32 bg-cyan-500 rounded-full blur-2xl animate-pulse delay-2000"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <motion.h2
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Nuestros{' '}
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            Servicios
                        </span>
                    </motion.h2>

                    <motion.p
                        className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Potencia tu análisis futbolístico con inteligencia artificial, algoritmos avanzados
                        y herramientas profesionales de última generación.
                    </motion.p>
                </motion.div>

                {/* Services Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
                            <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 h-full overflow-hidden transition-all duration-500 group-hover:border-gray-600/50 group-hover:shadow-2xl group-hover:shadow-blue-500/10">
                                {/* Gradient overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}></div>

                                {/* Premium badge */}
                                {service.isPremium && (
                                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                        <CurrencyDollarIcon className="w-3 h-3" />
                                        PREMIUM
                                    </div>
                                )}

                                {/* Icon */}
                                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <service.icon className="w-8 h-8 text-white" />
                                </div>

                                {/* Content */}
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                                        {service.title}
                                    </h3>

                                    <p className="text-gray-400 mb-6 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                                        {service.description}
                                    </p>

                                    {/* Features */}
                                    <ul className="space-y-2 mb-6">
                                        {service.features.map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                                                <div className={`w-2 h-2 bg-gradient-to-r ${service.color} rounded-full mr-3 group-hover:scale-125 transition-transform duration-300`}></div>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Price and CTA */}
                                    <div className="flex items-center justify-between">
                                        <div className="text-2xl font-bold text-white">
                                            {service.price}
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`px-4 py-2 bg-gradient-to-r ${service.color} text-white rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-lg`}
                                        >
                                            {service.isPremium ? 'Obtener' : 'Usar Gratis'}
                                        </motion.button>
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
                    className="text-center mt-16"
                >
                    <p className="text-gray-400 mb-6 text-lg">
                        ¿Listo para revolucionar tu análisis futbolístico?
                    </p>
                    <motion.button
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-2xl relative overflow-hidden group"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5" />
                            Comenzar Ahora
                        </span>
                        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </motion.button>
                </motion.div>
            </div>

            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20"
                        animate={{
                            x: [0, Math.random() * 100 - 50],
                            y: [0, Math.random() * 100 - 50],
                            opacity: [0.2, 0.8, 0.2],
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: Math.random() * 2,
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>
        </section >
    )
}

export default Services
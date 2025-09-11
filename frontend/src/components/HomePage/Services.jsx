import { letterAnimation, SlideLeft } from '../../utils/transitions'
import { ServicesData } from '../../utils/navbarUtils'
import { motion } from "framer-motion"
import React, { useEffect, useState } from 'react'
import { useThemeMode } from '../../contexts/ThemeContext'
import { Link } from 'react-router-dom'

const Services = () => {
    const { currentTheme } = useThemeMode()
    const title = "Servicios que ofrecemos"

    return (
        <section className={`w-full overflow-hidden ${currentTheme.background} transition-colors duration-300`}>
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                {/* Section Header */}
                <div className="text-center mb-16">
                    {/* Split Text Title */}
                    <motion.h1
                        className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase text-center pb-4 flex flex-wrap justify-center ${currentTheme.text}`}
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
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                        className={`text-lg sm:text-xl ${currentTheme.textSecondary} max-w-3xl mx-auto leading-relaxed`}
                    >
                        Descubre nuestras soluciones especializadas en análisis deportivo y toma de decisiones basada en datos
                    </motion.p>

                    {/* Decorative line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-8 rounded-full"
                    ></motion.div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                    {ServicesData.map((service, index) => (
                        <motion.div
                            key={index}
                            variants={SlideLeft(service.delay)}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className={`group ${currentTheme.card} rounded-2xl flex flex-col gap-4 items-center justify-center p-6 py-8 transition-all duration-300 hover:scale-105 ${currentTheme.shadow} ${currentTheme.border} border ${currentTheme.hover} text-center relative overflow-hidden`}
                        >
                            {/* Background gradient on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                            
                            {/* Icon container */}
                            <div className="relative z-10 p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300">
                                {React.createElement(service.icon, {
                                    className: "w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-blue-600 group-hover:text-purple-600 transition-colors duration-300"
                                })}
                            </div>

                            {/* Service title */}
                            <h3 className={`text-base sm:text-lg lg:text-xl font-semibold px-2 ${currentTheme.text} relative z-10 group-hover:text-blue-600 transition-colors duration-300`}>
                                {service.title}
                            </h3>

                            {/* Service description (if available) */}
                            {service.description && (
                                <p className={`text-sm ${currentTheme.textSecondary} px-2 relative z-10 leading-relaxed`}>
                                    {service.description}
                                </p>
                            )}

                            {/* Floating indicator */}
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                transition={{ duration: 0.4, delay: service.delay + 0.2 }}
                                viewport={{ once: true }}
                                className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                            ></motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* Call to action section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <div className={`${currentTheme.card} rounded-2xl p-8 lg:p-12 ${currentTheme.border} border ${currentTheme.shadow} relative overflow-hidden`}>
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234F46E5' fill-opacity='0.3'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40z'/%3E%3C/g%3E%3C/svg%3E")`,
                                backgroundSize: '40px 40px'
                            }}></div>
                        </div>
                        
                        <div className="relative z-10">
                            <h3 className={`text-2xl sm:text-3xl font-bold ${currentTheme.text} mb-4`}>
                                ¿Listo para comenzar?
                            </h3>
                            <p className={`text-lg ${currentTheme.textSecondary} mb-8 max-w-2xl mx-auto`}>
                                Únete a miles de profesionales que ya confían en nuestros servicios para optimizar sus análisis deportivos
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/get-started">
                                    <button 
                                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                        Explorar Servicios
                                    </button>
                                </Link>
                                <Link to="/contact">
                                    <button 
                                        className={`px-8 py-4 rounded-xl font-semibold border-2 ${currentTheme.text} ${currentTheme.border} ${currentTheme.hover} hover:border-blue-500 hover:text-blue-600 transition-all duration-300`}>
                                        Contactar
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Services
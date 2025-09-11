import { motion } from 'framer-motion'
import { contactInfo } from '../../utils/navbarUtils'
import NavbarClient from '../Navbar/NavbarClient'
import { lazy } from 'react'
import { letterAnimation } from '../../utils/transitions'
import { useThemeMode } from '../../contexts/ThemeContext'

const ContactForm = lazy(() => import('../Forms/ContactForm'))

const Contact = () => {
    const { currentTheme } = useThemeMode()
    const title = "¿Listo para Conectar?"

    return (
        <section className={`relative w-full min-h-screen overflow-x-hidden ${currentTheme.background} transition-colors duration-300`}>
            <NavbarClient />
            <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8 py-8">
                
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
                        Estamos aquí para ayudarte a revolucionar tu análisis futbolístico.
                        Contáctanos y descubre todo lo que podemos hacer juntos.
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

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                    
                    {/* Contact Info Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <div>
                            <h3 className={`text-2xl sm:text-3xl font-bold mb-6 ${currentTheme.text}`}>
                                Hablemos
                            </h3>
                            <p className={`text-lg leading-relaxed mb-8 ${currentTheme.textSecondary}`}>
                                Nuestro equipo está listo para ayudarte con cualquier pregunta sobre
                                nuestros servicios de análisis deportivo y machine learning.
                            </p>
                        </div>

                        {/* Contact Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {contactInfo.map((info, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                    className={`group ${currentTheme.card} rounded-2xl p-6 transition-all duration-300 ${currentTheme.shadow} ${currentTheme.border} border ${currentTheme.hover} relative overflow-hidden`}
                                >
                                    {/* Background gradient on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                                    
                                    {/* Icon container */}
                                    <div className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 group-hover:scale-110 transition-all duration-300">
                                        <info.icon className="w-6 h-6 text-blue-600 group-hover:text-purple-600 transition-colors duration-300" />
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="relative z-10">
                                        <h4 className={`font-bold text-lg mb-2 ${currentTheme.text} group-hover:text-blue-600 transition-colors duration-300`}>
                                            {info.title}
                                        </h4>
                                        <p className="font-semibold mb-2 text-blue-600 group-hover:text-purple-600 transition-colors duration-300">
                                            {info.value}
                                        </p>
                                        <p className={`text-sm ${currentTheme.textSecondary} leading-relaxed`}>
                                            {info.description}
                                        </p>
                                    </div>
                                    
                                    {/* Accent dot */}
                                    <div className="absolute top-3 right-3 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-40 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Additional contact info or CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className={`${currentTheme.card} rounded-2xl p-6 ${currentTheme.border} border ${currentTheme.shadow} relative overflow-hidden`}
                        >
                            {/* Background pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234F46E5' fill-opacity='0.3'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40z'/%3E%3C/g%3E%3C/svg%3E")`,
                                    backgroundSize: '40px 40px'
                                }}></div>
                            </div>
                            
                            <div className="relative z-10">
                                <h4 className={`text-lg font-semibold mb-3 ${currentTheme.text}`}>
                                    Respuesta Rápida Garantizada
                                </h4>
                                <p className={`${currentTheme.textSecondary} mb-4 leading-relaxed`}>
                                    Nos comprometemos a responder a todas las consultas en un máximo de 24 horas.
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className={`text-sm font-medium ${currentTheme.text}`}>
                                        Equipo disponible ahora
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Contact Form Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:sticky lg:top-8"
                    >
                        <div className={`${currentTheme.card} rounded-3xl p-6 lg:p-8 ${currentTheme.shadow} ${currentTheme.border} border relative overflow-hidden`}>
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
                            
                            <div className="relative z-10">
                                <div className="text-center mb-6">
                                    <h3 className={`text-xl font-bold mb-2 ${currentTheme.text}`}>
                                        Envíanos un Mensaje
                                    </h3>
                                    <p className={`${currentTheme.textSecondary}`}>
                                        Completa el formulario y te contactaremos pronto
                                    </p>
                                </div>
                                
                                <ContactForm />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Contact
import { motion } from 'framer-motion'
import { contactInfo } from '../../utils/navbarUtils'
import NavbarClient from '../Navbar/NavbarClient'
import { lazy } from 'react'
import { useTheme } from '@mui/material'
import { letterAnimation } from '../../utils/transitions'

const ContactForm = lazy(() => import('../Forms/ContactForm'))

const Contact = () => {
    const theme = useTheme()
    const title = "¿Listo para Conectar?"

    return (
        <section className="relative w-full h-screen overflow-x-auto scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-transparent">
            <NavbarClient />
            <div className="max-w-7xl mx-auto relative z-10 p-5">
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
                        style={{ color: theme.palette.text.secondary }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Estamos aquí para ayudarte a revolucionar tu análisis futbolístico.
                        Contáctanos y descubre todo lo que podemos hacer juntos.
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <div>
                            <h3
                                className="text-3xl font-bold mb-6"
                                style={{ color: theme.palette.text.primary }}
                            >
                                Hablemos
                            </h3>
                            <p
                                className="text-lg leading-relaxed mb-8"
                                style={{ color: theme.palette.text.secondary }}
                            >
                                Nuestro equipo está listo para ayudarte con cualquier pregunta sobre
                                nuestros servicios de análisis deportivo y machine learning.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {contactInfo.map((info, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    style={{
                                        backgroundColor: theme.palette.background.paper,
                                        border: `1px solid ${theme.palette.divider.primary || theme.palette.divider}`
                                    }}
                                    className="backdrop-blur-sm rounded-2xl p-6 group transition-all duration-300"
                                >
                                    <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                                        style={{
                                            background: `linear-gradient(to bottom right, ${theme.custom.azul}, ${theme.custom.azulHover})`
                                        }}
                                    >
                                        <info.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h4
                                        className="font-bold text-lg mb-1"
                                        style={{ color: theme.palette.text.primary }}
                                    >
                                        {info.title}
                                    </h4>
                                    <p
                                        className="font-medium mb-1"
                                        style={{ color: theme.custom.azul }}
                                    >
                                        {info.value}
                                    </p>
                                    <p
                                        className="text-sm"
                                        style={{ color: theme.palette.text.secondary }}
                                    >
                                        {info.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <ContactForm />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Contact
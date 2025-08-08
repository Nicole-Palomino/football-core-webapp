import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { contactInfo } from '../../utils/navbarUtils'
import NavbarClient from '../Navbar/NavbarClient'
import { useForm } from '@formspree/react'
import { useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { useTheme } from '@mui/material'

const Contact = () => {
    const formRef = useRef(null)
    const prevSucceededRef = useRef(false)
    const [state, handleSubmit] = useForm("xeqynqwa")
    const theme = useTheme()

    useEffect(() => {
        if (state.succeeded && !prevSucceededRef.current) {
            Swal.fire({
                icon: "success",
                title: "¡Gracias!",
                text: "Has enviado el correo exitosamente.",
                timer: 3500,
                showConfirmButton: false,
                timerProgressBar: true
            })
            formRef.current?.reset()
        }
        prevSucceededRef.current = state.succeeded
    }, [state.succeeded])

    return (
        <section className="relative w-full h-screen overflow-x-auto scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-transparent">
            <NavbarClient />
            <div className="max-w-7xl mx-auto relative z-10 p-5">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
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
                        ¿Listo para Conectar?
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Estamos aquí para ayudarte a revolucionar tu análisis futbolístico.
                        Contáctanos y descubre todo lo que podemos hacer juntos.
                    </motion.p>
                </motion.div>

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
                            <h3 className="text-3xl font-bold text-white mb-6">Hablemos</h3>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8">
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
                                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 group hover:border-gray-600/50 transition-all duration-300"
                                >
                                    <div className={`w-12 h-12 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <info.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="text-white font-bold text-lg mb-1">{info.title}</h4>
                                    <p className="text-blue-400 font-medium mb-1">{info.value}</p>
                                    <p className="text-gray-500 text-sm">{info.description}</p>
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
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 mb-16">
                            <h3 className="text-2xl font-bold text-white mb-6">Envíanos un Mensaje</h3>

                            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="name">Nombre</label>
                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                                            placeholder="Tu nombre completo"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="email">Correo Electrónico</label>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                                            placeholder="tu@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="subject">Asunto</label>
                                    <input
                                        id="subject"
                                        type="text"
                                        name="subject"
                                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                                        placeholder="¿En qué podemos ayudarte?"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="message">Mensaje</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors duration-300 resize-none"
                                        placeholder="Cuéntanos más detalles sobre tu consulta..."
                                        required
                                    />
                                </div>

                                <motion.button
                                    type="submit"
                                    whileHover={state.submitting ? {} : { scale: 1.02 }}
                                    whileTap={state.submitting ? {} : { scale: 0.98 }}
                                    disabled={state.submitting}
                                    aria-busy={state.submitting}
                                    className={`w-full bg-gradient-to-r from-blue-500 via-sky-700 to-cyan-500 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 relative overflow-hidden group
                                    ${state.submitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-blue-500/25'}`}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <PaperAirplaneIcon className="w-5 h-5" />
                                        Enviar Mensaje
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Contact
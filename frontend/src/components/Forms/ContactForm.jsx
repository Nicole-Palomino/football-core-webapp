import { useForm } from '@formspree/react'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { useThemeMode } from '../../contexts/ThemeContext'

const ContactForm = () => {

    const formRef = useRef(null)
    const prevSucceededRef = useRef(false)
    const [state, handleSubmit] = useForm("xeqynqwa")
    const { currentTheme } = useThemeMode()

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
        <div className="space-y-6">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="group"
                    >
                        <label
                            className={`block text-sm font-medium mb-3 ${currentTheme.textSecondary} transition-colors duration-300`}
                            htmlFor="name"
                        >
                            Nombre *
                        </label>
                        <div className="relative">
                            <input
                                id="name"
                                type="text"
                                name="name"
                                className={`w-full px-4 py-3 lg:py-4 rounded-xl ${currentTheme.input} border ${currentTheme.inputBorder} ${currentTheme.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 group-hover:border-blue-400/50`}
                                placeholder="Tu nombre completo"
                                required
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="group"
                    >
                        <label
                            className={`block text-sm font-medium mb-3 ${currentTheme.textSecondary} transition-colors duration-300`}
                            htmlFor="email"
                        >
                            Correo Electrónico *
                        </label>
                        <div className="relative">
                            <input
                                id="email"
                                type="email"
                                name="email"
                                className={`w-full px-4 py-3 lg:py-4 rounded-xl ${currentTheme.input} border ${currentTheme.inputBorder} ${currentTheme.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 group-hover:border-blue-400/50`}
                                placeholder="tu@email.com"
                                required
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                    </motion.div>
                </div>

                {/* Subject */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="group"
                >
                    <label
                        className={`block text-sm font-medium mb-3 ${currentTheme.textSecondary} transition-colors duration-300`}
                        htmlFor="subject"
                    >
                        Asunto *
                    </label>
                    <div className="relative">
                        <input
                            id="subject"
                            type="text"
                            name="subject"
                            className={`w-full px-4 py-3 lg:py-4 rounded-xl ${currentTheme.input} border ${currentTheme.inputBorder} ${currentTheme.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 group-hover:border-blue-400/50`}
                            placeholder="¿En qué podemos ayudarte?"
                            required
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="group"
                >
                    <label
                        className={`block text-sm font-medium mb-3 ${currentTheme.textSecondary} transition-colors duration-300`}
                        htmlFor="message"
                    >
                        Mensaje *
                    </label>
                    <div className="relative">
                        <textarea
                            id="message"
                            name="message"
                            rows={5}
                            className={`w-full px-4 py-3 lg:py-4 rounded-xl ${currentTheme.input} border ${currentTheme.inputBorder} ${currentTheme.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none group-hover:border-blue-400/50`}
                            placeholder="Cuéntanos más detalles sobre tu consulta..."
                            required
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <motion.button
                        type="submit"
                        whileHover={state.submitting ? {} : { scale: 1.02, y: -2 }}
                        whileTap={state.submitting ? {} : { scale: 0.98 }}
                        disabled={state.submitting}
                        aria-busy={state.submitting}
                        className={`w-full text-white px-6 py-4 lg:py-5 rounded-xl font-bold text-base lg:text-lg transition-all duration-300 relative overflow-hidden group
                        ${state.submitting 
                            ? 'opacity-70 cursor-not-allowed' 
                            : `hover:shadow-xl ${currentTheme.buttonShadow || 'hover:shadow-blue-500/25'}`
                        }`}
                        style={{
                            background: state.submitting 
                                ? 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)'
                                : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #7c3aed 100%)'
                        }}
                    >
                        {/* Background animation */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        
                        {/* Button content */}
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            {state.submitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Enviando...</span>
                                </>
                            ) : (
                                <>
                                    <PaperAirplaneIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                                    <span>Enviar Mensaje</span>
                                </>
                            )}
                        </span>

                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </motion.button>
                </motion.div>

                {/* Form status messages */}
                {state.errors && state.errors.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl"
                    >
                        <p className="text-red-600 text-sm font-medium">
                            Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.
                        </p>
                    </motion.div>
                )}
            </form>

            {/* Additional info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className={`mt-8 p-4 rounded-xl ${currentTheme.card} ${currentTheme.border} border relative overflow-hidden`}
            >
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-50"></div>
                
                <div className="relative z-10 flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 animate-pulse"></div>
                    </div>
                    <div>
                        <p className={`text-sm font-medium ${currentTheme.text} mb-1`}>
                            Respuesta garantizada en 24 horas
                        </p>
                        <p className={`text-xs ${currentTheme.textSecondary}`}>
                            Nuestro equipo revisará tu mensaje y te contactará lo antes posible.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default ContactForm
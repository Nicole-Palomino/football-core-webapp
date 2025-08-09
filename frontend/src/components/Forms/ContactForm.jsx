import { useForm } from '@formspree/react'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

const ContactForm = () => {

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
        <div
            className="backdrop-blur-sm rounded-3xl p-8 mb-16"
            style={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider.primary || theme.palette.divider}`
            }}
        >
            <h3
                className="text-2xl font-bold mb-6"
                style={{ color: theme.palette.text.primary }}
            >
                Envíanos un Mensaje
            </h3>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: theme.palette.text.secondary }}
                            htmlFor="name"
                        >
                            Nombre
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            className="w-full px-4 py-3 rounded-xl placeholder-gray-400 focus:outline-none transition-colors duration-300"
                            style={{
                                backgroundColor: theme.palette.background.default,
                                border: `1px solid ${theme.palette.divider.primary || theme.palette.divider}`,
                                color: theme.palette.text.primary
                            }}
                            placeholder="Tu nombre completo"
                            required
                        />
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: theme.palette.text.secondary }}
                            htmlFor="email"
                        >
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            className="w-full px-4 py-3 rounded-xl placeholder-gray-400 focus:outline-none transition-colors duration-300"
                            style={{
                                backgroundColor: theme.palette.background.default,
                                border: `1px solid ${theme.palette.divider.primary || theme.palette.divider}`,
                                color: theme.palette.text.primary
                            }}
                            placeholder="tu@email.com"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: theme.palette.text.secondary }}
                        htmlFor="subject"
                    >
                        Asunto
                    </label>
                    <input
                        id="subject"
                        type="text"
                        name="subject"
                        className="w-full px-4 py-3 rounded-xl placeholder-gray-400 focus:outline-none transition-colors duration-300"
                        style={{
                            backgroundColor: theme.palette.background.default,
                            border: `1px solid ${theme.palette.divider.primary || theme.palette.divider}`,
                            color: theme.palette.text.primary
                        }}
                        placeholder="¿En qué podemos ayudarte?"
                        required
                    />
                </div>

                <div>
                    <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: theme.palette.text.secondary }}
                        htmlFor="message"
                    >
                        Mensaje
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl placeholder-gray-400 focus:outline-none transition-colors duration-300 resize-none"
                        style={{
                            backgroundColor: theme.palette.background.default,
                            border: `1px solid ${theme.palette.divider.primary || theme.palette.divider}`,
                            color: theme.palette.text.primary
                        }}
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
                    className={`w-full text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 relative overflow-hidden group
                    ${state.submitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'}`}
                    style={{
                        background: `linear-gradient(to right, ${theme.custom.azul}, ${theme.custom.azulHover}, ${theme.custom.azulClaro || theme.palette.primary.main})`
                    }}
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <PaperAirplaneIcon className="w-5 h-5" />
                        Enviar Mensaje
                    </span>
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </motion.button>
            </form>
        </div>
    )
}

export default ContactForm
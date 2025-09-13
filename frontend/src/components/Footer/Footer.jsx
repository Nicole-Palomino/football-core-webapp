import { motion } from "framer-motion"
import { FaTiktok } from "react-icons/fa"
import { useForm, ValidationError } from '@formspree/react'
import { useEffect, useRef } from 'react'
import { Link } from "react-router-dom"
import { Box, Button, Container, TextField, Typography } from "@mui/material"
import { useThemeMode } from "../../contexts/ThemeContext"

const Footer = () => {

    const [state, handleSubmit] = useForm("xeqynqwa")
    const emailRef = useRef(null)
    const { currentTheme } = useThemeMode()

    useEffect(() => {
        if (state.succeeded) {
            Swal.fire({
                icon: "success",
                title: "¡Gracias!",
                text: "Te has suscrito con éxito.",
                confirmButtonColor: "#228B22",
                confirmButtonText: "Aceptar",
            })

            // Limpia el campo del email
            if (emailRef.current) {
                emailRef.current.value = ""
            }
        }
    }, [state.succeeded])

    const services = ["Análisis comparativo", "Pronóstico del partido", "Resúmenes estadísticos", "Soporte técnico"]
    const links = [
        { text: "Inicio", to: "/" },
        { text: "Servicios", to: "/services" },
        { text: "Sobre nosotros", to: "/about-us" },
        { text: "Contacto", to: "/contact" },
    ]

    return (
        <footer className={`w-full overflow-hidden ${currentTheme.background} transition-colors duration-300 mt-16`}>
            <div className={`w-full ${currentTheme.border} border-t`}>
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                            
                            {/* Logo + descripción */}
                            <div className="lg:col-span-2 space-y-6">
                                <div>
                                    <h2 className={`text-2xl lg:text-3xl font-bold ${currentTheme.text} mb-4`}>
                                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">S</span>
                                        CORE
                                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">X</span>
                                        XPERT{" "}
                                        {/* <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">C</span>
                                        ORE */}
                                    </h2>
                                    
                                    <p className={`${currentTheme.textSecondary} leading-relaxed max-w-md`}>
                                        SCOREXPERT: La plataforma esencial para el aficionado al fútbol que busca analizar y comprender el deporte desde un enfoque estadístico. Accede a datos históricos, pronósticos y resúmenes personalizados para profundizar en el rendimiento de tus equipos favoritos.
                                    </p>
                                </div>

                                {/* Redes sociales */}
                                <div className="flex items-center gap-4">
                                    <span className={`text-sm ${currentTheme.textSecondary}`}>Síguenos:</span>
                                    <a
                                        href="https://www.tiktok.com/@fooball_core"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`p-3 rounded-xl ${currentTheme.hover} ${currentTheme.border} border transition-all duration-300 hover:scale-110 group`}
                                    >
                                        <FaTiktok className={`text-xl ${currentTheme.text} group-hover:text-purple-600 transition-colors duration-300`} />
                                    </a>
                                </div>
                            </div>

                            {/* Servicios */}
                            <div className="space-y-6">
                                <h3 className={`text-lg font-semibold ${currentTheme.text} uppercase tracking-wide`}>
                                    Servicios
                                </h3>
                                <ul className="space-y-3">
                                    {services.map((service, index) => (
                                        <li key={index}>
                                            <span className={`${currentTheme.textSecondary} hover:text-blue-600 transition-colors duration-300 cursor-pointer`}>
                                                {service}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Enlaces */}
                            <div className="space-y-6">
                                <h3 className={`text-lg font-semibold ${currentTheme.text} uppercase tracking-wide`}>
                                    Enlaces
                                </h3>
                                <ul className="space-y-3">
                                    {links.map((link, index) => (
                                        <li key={index}>
                                            <Link
                                                to={link.to}
                                                className={`${currentTheme.textSecondary} hover:text-blue-600 transition-colors duration-300`}
                                            >
                                                {link.text}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Newsletter Section */}
                        <div className={`mt-12 pt-8 ${currentTheme.border} border-t`}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h3 className={`text-xl font-semibold ${currentTheme.text} mb-2`}>
                                        Mantente actualizado
                                    </h3>
                                    <p className={`${currentTheme.textSecondary}`}>
                                        Recibe las últimas estadísticas y análisis directamente en tu bandeja de entrada.
                                    </p>
                                </div>
                                
                                <div>
                                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                                        <div className="flex-1">
                                            <input
                                                ref={emailRef}
                                                type="email"
                                                name="email"
                                                placeholder="Ingresa tu correo electrónico"
                                                required
                                                className={`w-full px-4 py-3 rounded-xl ${currentTheme.input} ${currentTheme.border} border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300`}
                                            />
                                            <ValidationError
                                                prefix="Email"
                                                field="email"
                                                errors={state.errors}
                                                className="text-red-500 text-sm mt-1"
                                            />
                                        </div>
                                        
                                        <button
                                            type="submit"
                                            disabled={state.submitting}
                                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap"
                                        >
                                            {state.submitting ? "Enviando..." : "Suscribirse"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className={`mt-12 pt-8 ${currentTheme.border} border-t`}>
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <p className={`text-sm ${currentTheme.textSecondary} text-center sm:text-left`}>
                                    © 2025 SCOREXPERT. Todos los derechos reservados.
                                </p>
                                
                                {/* <div className="flex flex-wrap justify-center sm:justify-end gap-6 text-sm">
                                    <span className={`${currentTheme.textSecondary} hover:text-blue-600 transition-colors duration-300 cursor-pointer`}>
                                        Política de Privacidad
                                    </span>
                                    <span className={`${currentTheme.textSecondary} hover:text-blue-600 transition-colors duration-300 cursor-pointer`}>
                                        Términos de Servicio
                                    </span>
                                    <span className={`${currentTheme.textSecondary} hover:text-blue-600 transition-colors duration-300 cursor-pointer`}>
                                        Cookies
                                    </span>
                                </div> */}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
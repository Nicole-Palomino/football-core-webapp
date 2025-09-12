import { useState } from 'react'
import { useAuth } from '../contexts/AuthContexts'
import { useNavigate } from 'react-router-dom'
import SignInForm from '../components/Forms/SignInForm'
import { loginUser as loginService } from '../services/api/usuario'
import { useThemeMode } from '../contexts/ThemeContext'
import { motion } from 'framer-motion'
import { 
    UserIcon, 
    SparklesIcon, 
    CheckCircleIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { FaChartPie } from "react-icons/fa"
import { CiCalendarDate } from "react-icons/ci"
import { FaTrophy } from "react-icons/fa"
import { useMutation } from '@tanstack/react-query'

const SignIn = ({ setActiveTab }) => {

    const navigate = useNavigate()
    const { login } = useAuth()
    const { currentTheme } = useThemeMode()
    const [hover, setHover] = useState(false)

    const mutation = useMutation({
        mutationFn: loginService,
        onSuccess: async (data) => {
            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido de vuelta!',
                text: 'Inicio de sesión exitoso. Redirigiendo al dashboard...',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                background: currentTheme.resolved === 'dark' ? '#1f2937' : '#ffffff',
                color: currentTheme.resolved === 'dark' ? '#f9fafb' : '#1f2937',
                customClass: {
                    popup: 'rounded-2xl shadow-2xl',
                    title: 'text-lg font-bold',
                    content: 'text-sm'
                }
            })

            await login(data.access_token)
            setTimeout(() => navigate("/dashboard"), 1500)
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Error de autenticación',
                text: error.response?.data?.detail || error.message || 'Credenciales incorrectas. Verifica tu email y contraseña.',
                background: currentTheme.resolved === 'dark' ? '#1f2937' : '#ffffff',
                color: currentTheme.resolved === 'dark' ? '#f9fafb' : '#1f2937',
                confirmButtonColor: '#ef4444',
                customClass: {
                    popup: 'rounded-2xl shadow-2xl',
                    title: 'text-lg font-bold',
                    content: 'text-sm',
                    confirmButton: 'rounded-lg px-6 py-3 font-medium'
                }
            })
        },
    })

    const onSubmit = (formData) => {
        mutation.mutate(formData)
    }

    return (
        <div className="flex flex-col space-y-6">
            {/* Header mejorado con iconos como HomePage */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center relative"
            >
                {/* Elementos decorativos de fondo */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/4 w-8 h-8 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-sm animate-pulse"></div>
                    <div className="absolute top-4 right-1/3 w-6 h-6 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-sm animate-pulse delay-1000"></div>
                </div>

                {/* Logo y título principal */}
                <div className="flex items-center justify-center gap-3 mb-4">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, type: "spring", bounce: 0.4 }}
                        className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg"
                    >
                        <FaTrophy className="w-6 h-6 text-white" />
                    </motion.div>

                    <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${currentTheme.text} tracking-tight`}>
                        ¡Bienvenido de Nuevo!
                    </h2>

                    <motion.div
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    >
                        <SparklesIcon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                    </motion.div>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className={`text-base sm:text-lg lg:text-xl ${currentTheme.textSecondary} max-w-lg mx-auto leading-relaxed`}
                >
                    Nos alegra verte de vuelta. Accede a tu panel deportivo y continúa gestionando tus datos.
                </motion.p>

                {/* Línea decorativa animada */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 mx-auto mt-6 rounded-full relative"
                >
                    <motion.div
                        animate={{ x: [-20, 68, -20] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-0.5 left-0 w-2 h-2 bg-white rounded-full shadow-lg"
                    />
                </motion.div>
            </motion.div>

            {/* Iconos de funcionalidades como en HomePage */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6`}
            >
                <h3 className={`text-lg font-semibold mb-4 ${currentTheme.text} text-center flex items-center justify-center gap-2`}>
                    <ShieldCheckIcon className="w-5 h-5 text-blue-500" />
                    Tu Panel Deportivo te Espera
                </h3>
                
                <div className="flex justify-center gap-6">
                    {[
                        { icon: <UserIcon className="w-5 h-5 text-blue-500" />, label: "Equipos", desc: "Gestiona equipos" },
                        { icon: <FaChartPie className="w-5 h-5 text-green-500" />, label: "Estadísticas", desc: "Análisis avanzados" },
                        { icon: <CiCalendarDate className="w-5 h-5 text-purple-500" />, label: "Partidos", desc: "Calendario completo" },
                        // { icon: <FaTrophy className="w-5 h-5 text-yellow-500" />, label: "Torneos", desc: "Competiciones" }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                            className="flex flex-col items-center text-center"
                        >
                            <div className={`w-12 h-12 bg-gradient-to-br ${
                                index === 0 ? 'from-blue-50 to-blue-100' :
                                index === 1 ? 'from-green-50 to-green-100' :
                                index === 2 ? 'from-purple-50 to-purple-100' : 'from-yellow-50 to-yellow-100'
                            } rounded-xl flex items-center justify-center mb-2 hover:scale-110 transition-transform duration-300 cursor-pointer`}>
                                {item.icon}
                            </div>
                            <span className={`text-xs font-medium ${currentTheme.text} mb-1`}>
                                {item.label}
                            </span>
                            <span className={`text-xs ${currentTheme.textSecondary}`}>
                                {item.desc}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Formulario */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <SignInForm onSubmit={onSubmit} loading={mutation.isPending} />
            </motion.div>

            {/* Divider con "o" */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="relative flex items-center justify-center py-4"
            >
                <div className={`absolute inset-x-0 top-1/2 h-px ${currentTheme.border} bg-gradient-to-r from-transparent via-gray-300 to-transparent`}></div>
                <div className={`relative ${currentTheme.card} px-4 py-1 rounded-full ${currentTheme.border} border`}>
                    <span className={`text-xs font-medium ${currentTheme.textSecondary}`}>o</span>
                </div>
            </motion.div>

            {/* Switch to Sign Up */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex justify-center items-center pt-2"
            >
                <motion.button
                    onClick={() => setActiveTab('signup')}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`group inline-flex items-center gap-3 text-sm font-medium cursor-pointer transition-all duration-300 px-6 py-3 rounded-xl ${currentTheme.hover} ${currentTheme.card} ${currentTheme.border} border relative overflow-hidden`}
                >
                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Content */}
                    <div className="relative z-10 flex items-center gap-3">
                        <motion.div
                            animate={hover ? { rotate: 360 } : { rotate: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <UserIcon className={`w-5 h-5 transition-colors duration-300 ${hover ? 'text-purple-600' : currentTheme.textSecondary}`} />
                        </motion.div>

                        <div className="text-left">
                            <div className={`transition-colors duration-300 ${hover ? 'text-purple-600' : currentTheme.textSecondary}`}>
                                ¿No tienes cuenta?
                            </div>
                            <div className={`font-semibold text-xs transition-colors duration-300 ${hover ? 'text-purple-700' : currentTheme.text}`}>
                                Regístrate aquí
                            </div>
                        </div>
                    </div>
                </motion.button>
            </motion.div>

            {/* Información de seguridad */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-4 text-center`}
            >
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    </div>
                    <span className={`text-sm font-medium ${currentTheme.text}`}>
                        Acceso Seguro
                    </span>
                </div>
                <p className={`text-xs ${currentTheme.textSecondary} leading-relaxed`}>
                    Tu sesión está protegida con encriptación de nivel bancario.
                    Todos los datos se mantienen seguros y privados.
                </p>
            </motion.div>
        </div>

    )
}

export default SignIn
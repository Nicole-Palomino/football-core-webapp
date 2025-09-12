import { useState } from 'react'
import SignUpForm from '../components/Forms/SignUpForm'
import { registerUser } from '../services/api/usuario'
import { useThemeMode } from '../contexts/ThemeContext'
import {
    RocketLaunchIcon,
    UserIcon,
    SparklesIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const SignUp = ({ setActiveTab }) => {

    const [loading, setLoading] = useState(false)
    const { currentTheme } = useThemeMode()
    const [hover, setHover] = useState(false)

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            await registerUser(data)

            Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: 'Tu cuenta ha sido creada correctamente. ¡Bienvenido a Football Core!',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
                toast: false,
                background: currentTheme.resolved === 'dark' ? '#1f2937' : '#ffffff',
                color: currentTheme.resolved === 'dark' ? '#f9fafb' : '#1f2937',
                customClass: {
                    popup: 'rounded-2xl shadow-2xl',
                    title: 'text-lg font-bold',
                    content: 'text-sm'
                }
            })

            setActiveTab("signin")
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error en el registro',
                text: error.message || 'Ocurrió un problema al crear tu cuenta. Inténtalo de nuevo.',
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
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col space-y-6">
            {/* Header con animaciones mejoradas */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center relative"
            >
                {/* Elementos decorativos de fondo */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/4 w-8 h-8 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-sm animate-pulse"></div>
                    <div className="absolute top-4 right-1/3 w-6 h-6 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-sm animate-pulse delay-1000"></div>
                    <div className="absolute -top-2 right-1/4 w-4 h-4 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full blur-sm animate-pulse delay-500"></div>
                </div>

                <div className="flex items-center justify-center gap-3 mb-4">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, type: "spring", bounce: 0.4 }}
                    >
                        <RocketLaunchIcon className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
                    </motion.div>

                    <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold uppercase ${currentTheme.text} tracking-tight`}>
                        ¡Únete a Nosotros!
                    </h2>

                    <motion.div
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    >
                        <SparklesIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                    </motion.div>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className={`text-sm sm:text-base lg:text-lg ${currentTheme.textSecondary} max-w-md mx-auto`}
                >
                    Crea tu cuenta y accede a experiencias increíbles en el mundo del fútbol.
                </motion.p>

                {/* Línea decorativa animada */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="w-20 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 mx-auto mt-6 rounded-full relative"
                >
                    <motion.div
                        animate={{ x: [-20, 60, -20] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-0.5 left-0 w-2 h-2 bg-white rounded-full shadow-lg"
                    />
                </motion.div>
            </motion.div>

            {/* Beneficios de registro */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-4 ${currentTheme.shadow}`}
            >
                <h3 className={`text-sm font-semibold mb-3 ${currentTheme.text} flex items-center gap-2`}>
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    ¿Por qué unirse?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {[
                        "Acceso completo a estadísticas",
                        "Análisis personalizado de equipos",
                        "Résumenes estadísticos en imagen",
                        "Comunidad de fanáticos del fútbol"
                    ].map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                            className={`flex items-center gap-2 ${currentTheme.textSecondary}`}
                        >
                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                            <span>{benefit}</span>
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
                <SignUpForm onSubmit={onSubmit} loading={loading} />
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

            {/* Cambiar a iniciar sesión */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex justify-center items-center pt-2"
            >
                <motion.button
                    onClick={() => setActiveTab('signin')}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`group inline-flex items-center gap-3 text-sm font-medium cursor-pointer transition-all duration-300 px-6 py-3 rounded-xl ${currentTheme.hover} ${currentTheme.card} ${currentTheme.border} border relative overflow-hidden`}
                >
                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Content */}
                    <div className="relative z-10 flex items-center gap-3">
                        <motion.div
                            animate={hover ? { rotate: 360 } : { rotate: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <UserIcon className={`w-5 h-5 transition-colors duration-300 ${hover ? 'text-blue-600' : currentTheme.textSecondary.replace('text-', 'text-')
                                }`} />
                        </motion.div>

                        <button
                            onClick={() => setActiveTab("signin")}
                            onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}
                            className="text-left"
                        >
                            <div className={`transition-colors duration-300 ${hover ? 'text-blue-600' : currentTheme.textSecondary
                                }`}>
                                ¿Ya tienes cuenta?
                            </div>
                            <div className={`font-semibold text-xs transition-colors duration-300 ${hover ? 'text-purple-600' : currentTheme.text
                                }`}>
                                Inicia sesión aquí
                            </div>
                        </button>
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
                        Registro 100% Seguro
                    </span>
                </div>
                <p className={`text-xs ${currentTheme.textSecondary} leading-relaxed`}>
                    Tus datos están protegidos con encriptación de nivel bancario.
                    No compartimos tu información personal.
                </p>
            </motion.div>
        </div>
    )
}

export default SignUp
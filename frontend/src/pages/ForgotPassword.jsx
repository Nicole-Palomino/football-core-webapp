import { motion } from 'framer-motion'
import ForgotForm from '../components/Forms/ForgotForm'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { forgotUser } from '../services/api/usuario'
import {
    LockClosedIcon,
    EnvelopeIcon,
    SparklesIcon,
    CheckCircleIcon,
    ShieldExclamationIcon
} from '@heroicons/react/24/outline'
import { useThemeMode } from '../contexts/ThemeContext'

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { currentTheme } = useThemeMode()

    const onSubmit = async (data) => {
        setLoading(true)

        try {
            await forgotUser(data)

            sessionStorage.setItem('pwd_reset_email', data.correo)

            Swal.fire({
                icon: 'success',
                title: '¡Código solicitado exitosamente!',
                text: 'Revisa tu correo para el código de verificación.',
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

            navigate(`/reset-password`)
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error al solicitar código',
                text: error.response?.data?.detail || 'Ocurrió un problema al enviar el código. Inténtalo de nuevo.',
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
        <section className={`w-full min-h-screen ${currentTheme.background} transition-colors duration-300`}>
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-130px)] px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
                    className="flex flex-col w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto"
                >
                    <div className={`${currentTheme.card} ${currentTheme.shadow} backdrop-blur-lg border ${currentTheme.border} rounded-3xl p-8 lg:p-12 relative overflow-hidden`}>
                        {/* Background Decoration */}
                        <div className="absolute inset-0 -z-10">
                            <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl animate-pulse"></div>
                            <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-cyan-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
                        </div>

                        <div className="space-y-8">
                            {/* Header */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-center relative"
                            >
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ duration: 0.8, delay: 0.6, type: "spring", bounce: 0.4 }}
                                    >
                                        <LockClosedIcon className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
                                    </motion.div>

                                    <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${currentTheme.text} tracking-tight`}>
                                        ¿Olvidaste tu contraseña?
                                    </h1>

                                    <motion.div
                                        animate={{ rotate: [0, 15, -15, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                                    >
                                        <SparklesIcon className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
                                    </motion.div>
                                </div>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.8 }}
                                    className={`text-base sm:text-lg lg:text-xl ${currentTheme.textSecondary} max-w-lg mx-auto leading-relaxed`}
                                >
                                    No te preocupes, te ayudaremos a recuperar el acceso a tu cuenta de forma segura.
                                </motion.p>

                                {/* Línea decorativa animada */}
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.8, delay: 1.0 }}
                                    className="w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 mx-auto mt-6 rounded-full relative"
                                >
                                    <motion.div
                                        animate={{ x: [-20, 68, -20] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute -top-0.5 left-0 w-2 h-2 bg-white rounded-full shadow-lg"
                                    />
                                </motion.div>
                            </motion.div>

                            {/* Proceso de recuperación */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6`}
                            >
                                <h3 className={`text-lg font-semibold mb-4 ${currentTheme.text} flex items-center gap-2`}>
                                    <ShieldExclamationIcon className="w-5 h-5 text-blue-500" />
                                    Proceso de Recuperación
                                </h3>
                                
                                <div className="space-y-4">
                                    {[
                                        { 
                                            step: "1", 
                                            title: "Solicitar código", 
                                            desc: "Ingresa tu correo electrónico",
                                            icon: <EnvelopeIcon className="w-4 h-4" />
                                        },
                                        { 
                                            step: "2", 
                                            title: "Verificar código", 
                                            desc: "Revisa tu correo y copia el código",
                                            icon: <CheckCircleIcon className="w-4 h-4" />
                                        },
                                        { 
                                            step: "3", 
                                            title: "Nueva contraseña", 
                                            desc: "Establece una contraseña segura",
                                            icon: <LockClosedIcon className="w-4 h-4" />
                                        }
                                    ].map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                                            className="flex items-center gap-4"
                                        >
                                            <div className={`w-8 h-8 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-gray-300'} text-white flex items-center justify-center text-sm font-bold transition-all duration-300`}>
                                                {index === 0 ? item.icon : item.step}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`text-sm font-medium ${index === 0 ? 'text-blue-600' : currentTheme.text}`}>
                                                    {item.title}
                                                </h4>
                                                <p className={`text-xs ${currentTheme.textSecondary}`}>
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Formulario */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                            >
                                <ForgotForm onSubmit={onSubmit} loading={loading} />
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
                                        Recuperación Segura
                                    </span>
                                </div>
                                <p className={`text-xs ${currentTheme.textSecondary} leading-relaxed`}>
                                    El código de verificación expira en 15 minutos por tu seguridad. 
                                    Solo tú tendrás acceso al código enviado a tu correo.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default ForgotPassword
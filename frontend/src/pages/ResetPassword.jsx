import { useState } from 'react'
import NavbarClient from '../components/Navbar/NavbarClient'
import { motion } from 'framer-motion'
import { Paper } from '@mui/material'
import ResetForm from '../components/Forms/ResetForm'
import { resetUser, verifyUser } from '../services/api/usuario'
import { useNavigate } from 'react-router-dom'
import { useThemeMode } from '../contexts/ThemeContext'
import {
    ShieldCheckIcon,
    KeyIcon,
    SparklesIcon,
    CheckCircleIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline'

const ResetPassword = () => {
    const [loading, setLoading] = useState(false)
    const { currentTheme } = useThemeMode()
    const navigate = useNavigate()

    const onVerifyCode = async (data) => {
        try {
            const response = await verifyUser(data)
            return response
        } catch (error) {
            throw error
        }
    }

    const onSubmit = async (data) => {
        setLoading(true)

        try {
            const res = await resetUser(data)

            Swal.fire({
                icon: 'success',
                title: '¡Contraseña restablecida!',
                text: 'Tu contraseña ha sido cambiada exitosamente. Serás redirigido al inicio de sesión.',
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
            
            sessionStorage.removeItem('pwd_reset_email')
            navigate('/get-started')
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error al cambiar contraseña',
                text: error.response?.data?.detail || error.message || 'Ocurrió un problema al cambiar tu contraseña. Inténtalo de nuevo.',
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
                            <div className="absolute top-0 right-1/4 w-32 h-32 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse"></div>
                            <div className="absolute bottom-0 left-1/4 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
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
                                        <ShieldCheckIcon className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
                                    </motion.div>

                                    <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${currentTheme.text} tracking-tight`}>
                                        Restablecer Contraseña
                                    </h1>

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
                                    transition={{ duration: 0.6, delay: 0.8 }}
                                    className={`text-base sm:text-lg lg:text-xl ${currentTheme.textSecondary} max-w-lg mx-auto leading-relaxed`}
                                >
                                    Verifica tu identidad y establece una nueva contraseña segura.
                                </motion.p>

                                {/* Línea decorativa animada */}
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.8, delay: 1.0 }}
                                    className="w-24 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-green-500 mx-auto mt-6 rounded-full relative"
                                >
                                    <motion.div
                                        animate={{ x: [-20, 68, -20] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute -top-0.5 left-0 w-2 h-2 bg-white rounded-full shadow-lg"
                                    />
                                </motion.div>
                            </motion.div>

                            {/* Pasos del proceso */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-6`}
                            >
                                <h3 className={`text-lg font-semibold mb-4 ${currentTheme.text} flex items-center gap-2`}>
                                    <KeyIcon className="w-5 h-5 text-green-500" />
                                    Proceso de Verificación
                                </h3>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { 
                                            title: "Verificar Código", 
                                            desc: "Confirma el código enviado a tu correo",
                                            icon: <CheckCircleIcon className="w-4 h-4" />,
                                            color: "text-blue-600"
                                        },
                                        { 
                                            title: "Nueva Contraseña", 
                                            desc: "Establece una contraseña fuerte y segura",
                                            icon: <LockClosedIcon className="w-4 h-4" />,
                                            color: "text-green-600"
                                        }
                                    ].map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                                            className={`flex items-start gap-3 p-3 rounded-lg ${currentTheme.hover} transition-colors duration-300`}
                                        >
                                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${index === 0 ? 'from-blue-500/20 to-blue-600/20' : 'from-green-500/20 to-green-600/20'} flex items-center justify-center mt-0.5`}>
                                                <span className={item.color}>
                                                    {item.icon}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`text-sm font-medium ${currentTheme.text} mb-1`}>
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
                                <ResetForm 
                                    onSubmit={onSubmit} 
                                    loading={loading} 
                                    onVerifyCode={onVerifyCode}
                                />
                            </motion.div>

                            {/* Información adicional de seguridad */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                                className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-4 text-center`}
                            >
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                                        <ShieldCheckIcon className="w-4 h-4 text-green-500" />
                                    </div>
                                    <span className={`text-sm font-medium ${currentTheme.text}`}>
                                        Restablecimiento Seguro
                                    </span>
                                </div>
                                <p className={`text-xs ${currentTheme.textSecondary} leading-relaxed`}>
                                    Tu sesión está protegida con encriptación de extremo a extremo. 
                                    Una vez completado el proceso, todas las sesiones anteriores serán cerradas automáticamente.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default ResetPassword
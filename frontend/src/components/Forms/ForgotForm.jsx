import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { EnvelopeIcon, PaperAirplaneIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useThemeMode } from '../../contexts/ThemeContext'

const ForgotForm = ({ onSubmit, loading }) => {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const { currentTheme } = useThemeMode()
    const [focusedField, setFocusedField] = useState(null)
    const [hover, setHover] = useState(false)

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="group"
            >
                <label
                    className={`block text-sm font-medium mb-3 ${currentTheme.textSecondary} transition-colors duration-300`}
                    htmlFor="correo"
                >
                    Correo Electrónico *
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <EnvelopeIcon className={`h-5 w-5 ${
                            focusedField === 'correo' ? 'text-blue-500' : currentTheme.textSecondary
                        } transition-colors duration-300`} />
                    </div>
                    <input
                        id="correo"
                        type="email"
                        autoComplete="email"
                        autoFocus
                        className={`w-full pl-12 pr-4 py-3 lg:py-4 rounded-xl ${currentTheme.input} border ${
                            errors.correo ? 'border-red-500' : currentTheme.border
                        } ${currentTheme.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 group-hover:border-blue-400/50`}
                        placeholder="tu@email.com"
                        onFocus={() => setFocusedField('correo')}
                        onBlur={() => setFocusedField(null)}
                        {...register("correo", {
                            required: "Correo electrónico requerido",
                            pattern: {
                                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
                                message: "Formato de correo electrónico inválido"
                            }
                        })}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                {errors.correo && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-500"
                    >
                        {errors.correo.message}
                    </motion.p>
                )}
            </motion.div>

            {/* Submit Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <motion.button
                    type="submit"
                    whileHover={loading ? {} : { scale: 1.02, y: -2 }}
                    whileTap={loading ? {} : { scale: 0.98 }}
                    disabled={loading}
                    className={`w-full text-white px-6 py-4 lg:py-5 rounded-xl font-bold text-base lg:text-lg transition-all duration-300 relative overflow-hidden group
                    ${loading 
                        ? 'opacity-70 cursor-not-allowed' 
                        : 'hover:shadow-xl hover:shadow-blue-500/25'
                    }`}
                    style={{
                        background: loading 
                            ? 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)'
                            : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%)'
                    }}
                >
                    {/* Background animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    
                    {/* Button content */}
                    <span className="relative z-10 flex items-center justify-center gap-3">
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Enviando código...</span>
                            </>
                        ) : (
                            <>
                                <PaperAirplaneIcon className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                <span>Solicitar código de recuperación</span>
                            </>
                        )}
                    </span>

                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </motion.button>
            </motion.div>

            {/* Back to Login */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex justify-center items-center pt-2"
            >
                <Link to="/get-started">
                    <motion.button
                        type="button"
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`group inline-flex items-center gap-3 text-sm font-medium cursor-pointer transition-all duration-300 px-6 py-3 rounded-xl ${currentTheme.hover} ${currentTheme.card} ${currentTheme.border} border relative overflow-hidden`}
                    >
                        {/* Background gradient on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Content */}
                        <div className="relative z-10 flex items-center gap-3">
                            <motion.div
                                animate={hover ? { x: -3 } : { x: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ArrowLeftIcon className={`w-5 h-5 transition-colors duration-300 ${hover ? 'text-blue-600' : currentTheme.textSecondary}`} />
                            </motion.div>

                            <div className="text-left">
                                <div className={`transition-colors duration-300 ${hover ? 'text-blue-600' : currentTheme.textSecondary}`}>
                                    ¿Recordaste tu contraseña?
                                </div>
                                <div className={`font-semibold text-xs transition-colors duration-300 ${hover ? 'text-blue-700' : currentTheme.text}`}>
                                    Volver al inicio de sesión
                                </div>
                            </div>
                        </div>
                    </motion.button>
                </Link>
            </motion.div>

            {/* Help text */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-4 text-center`}
            >
                <div className="flex items-center justify-center gap-2 mb-2">
                    <EnvelopeIcon className="w-5 h-5 text-blue-500" />
                    <span className={`text-sm font-medium ${currentTheme.text}`}>
                        ¿Cómo funciona?
                    </span>
                </div>
                <p className={`text-xs ${currentTheme.textSecondary} leading-relaxed`}>
                    Te enviaremos un código de verificación a tu correo electrónico.
                    Úsalo para restablecer tu contraseña de forma segura.
                </p>
            </motion.div>
        </form>
    )
}

export default ForgotForm
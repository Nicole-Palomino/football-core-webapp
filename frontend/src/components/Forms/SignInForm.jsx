import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useThemeMode } from '../../contexts/ThemeContext'
import { motion } from 'framer-motion'

const SignInForm = ({ onSubmit, loading }) => {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const { currentTheme } = useThemeMode()
    const [showPassword, setShowPassword] = useState(false)
    const [hover, setHover] = useState(false)

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="group"
            >
                <label
                    className={`block text-sm font-medium mb-3 ${currentTheme.textSecondary} transition-colors duration-300`}
                    htmlFor="email"
                >
                    Correo Electrónico *
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <EnvelopeIcon className={`h-5 w-5 ${currentTheme.textSecondary} group-focus-within:text-blue-500 transition-colors duration-300`} />
                    </div>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        className={`w-full pl-12 pr-4 py-3 lg:py-4 rounded-xl ${currentTheme.input} border ${
                            errors.email ? 'border-red-500' : currentTheme.inputBorder || currentTheme.border
                        } ${currentTheme.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 group-hover:border-blue-400/50`}
                        placeholder="tu@email.com"
                        {...register("email", {
                            required: "Correo electrónico requerido",
                            pattern: {
                                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
                                message: "Formato de correo electrónico inválido"
                            }
                        })}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                {errors.email && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-500"
                    >
                        {errors.email.message}
                    </motion.p>
                )}
            </motion.div>

            {/* Password Field */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="group"
            >
                <label
                    className={`block text-sm font-medium mb-3 ${currentTheme.textSecondary} transition-colors duration-300`}
                    htmlFor="password"
                >
                    Contraseña *
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <LockClosedIcon className={`h-5 w-5 ${currentTheme.textSecondary} group-focus-within:text-blue-500 transition-colors duration-300`} />
                    </div>
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        className={`w-full pl-12 pr-12 py-3 lg:py-4 rounded-xl ${currentTheme.input} border ${
                            errors.password ? 'border-red-500' : currentTheme.inputBorder || currentTheme.border
                        } ${currentTheme.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 group-hover:border-blue-400/50`}
                        placeholder="••••••••"
                        {...register("password", {
                            required: "Contraseña requerida",
                            minLength: {
                                value: 8,
                                message: "La contraseña debe tener al menos 8 caracteres"
                            },
                            pattern: {
                                value: /^(?=.*[A-Z])(?=.*\d).*$/,
                                message: "La contraseña debe incluir una letra mayúscula y un número"
                            }
                        })}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100/10 rounded-r-xl transition-colors duration-200"
                    >
                        {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors duration-200" />
                        ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors duration-200" />
                        )}
                    </button>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                {errors.password && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-500"
                    >
                        {errors.password.message}
                    </motion.p>
                )}
            </motion.div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
                <Link 
                    to="/forgot-password"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    className={`text-sm font-medium transition-all duration-300 hover:underline ${
                        hover ? 'text-blue-600' : currentTheme.textSecondary
                    }`}
                >
                    ¿Olvidaste tu contraseña?
                </Link>
            </div>

            {/* Submit Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <motion.button
                    type="submit"
                    whileHover={loading ? {} : { scale: 1.02, y: -2 }}
                    whileTap={loading ? {} : { scale: 0.98 }}
                    disabled={loading}
                    className={`w-full text-white px-6 py-4 lg:py-5 rounded-xl font-bold text-base lg:text-lg transition-all duration-300 relative overflow-hidden group
                    ${loading 
                        ? 'opacity-70 cursor-not-allowed' 
                        : `hover:shadow-xl ${currentTheme.buttonShadow || 'hover:shadow-blue-500/25'}`
                    }`}
                    style={{
                        background: loading 
                            ? 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)'
                            : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #7c3aed 100%)'
                    }}
                >
                    {/* Background animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    
                    {/* Button content */}
                    <span className="relative z-10 flex items-center justify-center gap-3">
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Iniciando Sesión...</span>
                            </>
                        ) : (
                            <>
                                <LockClosedIcon className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-300" />
                                <span>Iniciar Sesión</span>
                            </>
                        )}
                    </span>

                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </motion.button>
            </motion.div>
        </form>
    )
}

export default SignInForm
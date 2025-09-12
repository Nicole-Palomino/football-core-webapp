import { 
    EyeIcon, 
    EyeSlashIcon, 
    LockClosedIcon,
    ShieldCheckIcon,
    UserIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useThemeMode } from '../../contexts/ThemeContext'
import { motion } from 'framer-motion'

const SignInForm = ({ onSubmit, loading }) => {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const { currentTheme } = useThemeMode()
    const [showPassword, setShowPassword] = useState(false)
    const [focusedField, setFocusedField] = useState(null)
    const [hover, setHover] = useState(false)

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username/Email Field - Unificado para aceptar ambos */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="group"
            >
                <label
                    className={`block text-sm font-medium mb-3 ${currentTheme.textSecondary} transition-colors duration-300`}
                    htmlFor="username"
                >
                    Correo o Usuario *
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserIcon className={`h-5 w-5 ${
                            focusedField === 'username' ? 'text-blue-500' : currentTheme.textSecondary
                        } transition-colors duration-300`} />
                    </div>
                    <input
                        id="username"
                        type="text"
                        autoComplete="username"
                        autoFocus
                        className={`w-full pl-12 pr-4 py-3 lg:py-4 rounded-xl ${currentTheme.input} border ${
                            errors.username ? 'border-red-500' : currentTheme.border
                        } ${currentTheme.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 group-hover:border-blue-400/50`}
                        placeholder="admin@sports.com o tu usuario"
                        onFocus={() => setFocusedField('username')}
                        onBlur={() => setFocusedField(null)}
                        {...register("username", {
                            required: "El correo o usuario es requerido",
                            minLength: {
                                value: 3,
                                message: "Debe tener al menos 3 caracteres"
                            }
                        })}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                {errors.username && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-500"
                    >
                        {errors.username.message}
                    </motion.p>
                )}
            </motion.div>

            {/* Password Field */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
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
                        <LockClosedIcon className={`h-5 w-5 ${
                            focusedField === 'password' ? 'text-blue-500' : currentTheme.textSecondary
                        } transition-colors duration-300`} />
                    </div>
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        className={`w-full pl-12 pr-12 py-3 lg:py-4 rounded-xl ${currentTheme.input} border ${
                            errors.password ? 'border-red-500' : currentTheme.border
                        } ${currentTheme.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 group-hover:border-blue-400/50`}
                        placeholder="••••••••"
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        {...register("password", {
                            required: "La contraseña es requerida",
                            minLength: {
                                value: 6,
                                message: "La contraseña debe tener al menos 6 caracteres"
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
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="flex justify-end"
            >
                <Link 
                    to="/forgot-password"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    className={`text-sm font-medium transition-all duration-300 hover:underline px-2 py-1 rounded-md ${
                        hover ? 'text-blue-600 bg-blue-50' : currentTheme.textSecondary
                    }`}
                >
                    ¿Olvidaste tu contraseña?
                </Link>
            </motion.div>

            {/* Submit Button - Estilo mejorado como HomePage */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                <motion.button
                    type="submit"
                    whileHover={loading ? {} : { scale: 1.02, y: -2 }}
                    whileTap={loading ? {} : { scale: 0.98 }}
                    disabled={loading}
                    className={`w-full text-white px-6 py-4 lg:py-5 rounded-xl font-bold text-base lg:text-lg transition-all duration-300 relative overflow-hidden group shadow-lg
                    ${loading 
                        ? 'opacity-70 cursor-not-allowed' 
                        : 'hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-[1.02]'
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
                                <span>Verificando...</span>
                            </>
                        ) : (
                            <>
                                <ShieldCheckIcon className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-300" />
                                <span>Acceder al Panel</span>
                            </>
                        )}
                    </span>

                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </motion.button>
            </motion.div>

            {/* Quick Access Hint - Información útil como en HomePage */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-4`}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <ShieldCheckIcon className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className={`text-sm font-medium ${currentTheme.text}`}>
                        Acceso rápido
                    </span>
                </div>
                <div className="text-xs space-y-1">
                    <p className={`${currentTheme.textSecondary} leading-relaxed`}>
                        • Puedes usar tu <span className="font-medium text-blue-600">correo electrónico</span> o <span className="font-medium text-blue-600">nombre de usuario</span>
                    </p>
                    <p className={`${currentTheme.textSecondary} leading-relaxed`}>
                        • Tu sesión permanecerá activa por seguridad hasta que cierres sesión
                    </p>
                </div>
            </motion.div>
        </form>
    )
}

export default SignInForm
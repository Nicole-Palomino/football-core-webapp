import { useForm } from 'react-hook-form'
import { useThemeMode } from '../../contexts/ThemeContext'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, CheckIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

const SignUpForm = ({ onSubmit, loading }) => {

    const { register, handleSubmit, formState: { errors }, watch } = useForm()
    const { currentTheme } = useThemeMode()
    const [showPassword, setShowPassword] = useState(false)
    const [focusedField, setFocusedField] = useState(null)

    const password = watch("contrasena", "")

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: "", color: "" }
        
        let strength = 0
        const checks = [
            password.length >= 8,
            /[A-Z]/.test(password),
            /[a-z]/.test(password),
            /\d/.test(password),
            /[!@#$%^&*(),.?":{}|<>]/.test(password)
        ]
        
        strength = checks.filter(Boolean).length
        
        const levels = [
            { strength: 0, label: "", color: "" },
            { strength: 1, label: "Muy débil", color: "text-red-500" },
            { strength: 2, label: "Débil", color: "text-orange-500" },
            { strength: 3, label: "Regular", color: "text-yellow-500" },
            { strength: 4, label: "Fuerte", color: "text-blue-500" },
            { strength: 5, label: "Muy fuerte", color: "text-green-500" }
        ]
        
        return levels[strength]
    }

    const passwordStrength = getPasswordStrength(password)

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="group"
            >
                <label
                    className={`block text-sm font-medium mb-3 ${currentTheme.textSecondary} transition-colors duration-300`}
                    htmlFor="usuario"
                >
                    Nombre de usuario *
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserIcon className={`h-5 w-5 ${
                            focusedField === 'usuario' ? 'text-blue-500' : currentTheme.textSecondary
                        } transition-colors duration-300`} />
                    </div>
                    <input
                        id="usuario"
                        type="text"
                        autoComplete="username"
                        className={`w-full pl-12 pr-4 py-3 lg:py-4 rounded-xl ${currentTheme.input} border ${
                            errors.usuario ? 'border-red-500' : currentTheme.border
                        } ${currentTheme.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 group-hover:border-blue-400/50`}
                        placeholder="Ingresa tu nombre de usuario"
                        onFocus={() => setFocusedField('usuario')}
                        onBlur={() => setFocusedField(null)}
                        {...register("usuario", {
                            required: "Nombre de usuario requerido",
                            minLength: {
                                value: 3,
                                message: "El nombre debe tener al menos 3 caracteres"
                            },
                            pattern: {
                                value: /^[a-zA-Z0-9_]+$/,
                                message: "Solo se permiten letras, números y guiones bajos"
                            }
                        })}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                {errors.usuario && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-500"
                    >
                        {errors.usuario.message}
                    </motion.p>
                )}
            </motion.div>

            {/* Email Field */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
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

            {/* Password Field */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="group"
            >
                <label
                    className={`block text-sm font-medium mb-3 ${currentTheme.textSecondary} transition-colors duration-300`}
                    htmlFor="contrasena"
                >
                    Contraseña *
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <LockClosedIcon className={`h-5 w-5 ${
                            focusedField === 'contrasena' ? 'text-blue-500' : currentTheme.textSecondary
                        } transition-colors duration-300`} />
                    </div>
                    <input
                        id="contrasena"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className={`w-full pl-12 pr-12 py-3 lg:py-4 rounded-xl ${currentTheme.input} border ${
                            errors.contrasena ? 'border-red-500' : currentTheme.border
                        } ${currentTheme.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 group-hover:border-blue-400/50`}
                        placeholder="••••••••"
                        onFocus={() => setFocusedField('contrasena')}
                        onBlur={() => setFocusedField(null)}
                        {...register("contrasena", {
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

                {/* Password Strength Indicator */}
                {password && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 space-y-2"
                    >
                        <div className="flex items-center justify-between">
                            <span className={`text-xs font-medium ${passwordStrength.color}`}>
                                {passwordStrength.label}
                            </span>
                            <span className={`text-xs ${currentTheme.textSecondary}`}>
                                {Math.round((passwordStrength.strength / 5) * 100)}%
                            </span>
                        </div>
                        <div className={`w-full bg-gray-200 rounded-full h-2 ${currentTheme.background}`}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                transition={{ duration: 0.3 }}
                                className={`h-2 rounded-full ${
                                    passwordStrength.strength === 5 ? 'bg-green-500' :
                                    passwordStrength.strength === 4 ? 'bg-blue-500' :
                                    passwordStrength.strength === 3 ? 'bg-yellow-500' :
                                    passwordStrength.strength === 2 ? 'bg-orange-500' : 'bg-red-500'
                                }`}
                            />
                        </div>
                    </motion.div>
                )}

                {errors.contrasena && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-500"
                    >
                        {errors.contrasena.message}
                    </motion.p>
                )}
            </motion.div>

            {/* Password Requirements */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className={`${currentTheme.card} ${currentTheme.border} border rounded-lg p-4`}
            >
                <h4 className={`text-sm font-medium mb-3 ${currentTheme.text}`}>
                    Requisitos de contraseña:
                </h4>
                <div className="space-y-2">
                    {[
                        { check: password.length >= 8, label: "Al menos 8 caracteres" },
                        { check: /[A-Z]/.test(password), label: "Una letra mayúscula" },
                        { check: /[a-z]/.test(password), label: "Una letra minúscula" },
                        { check: /\d/.test(password), label: "Un número" },
                        { check: /[!@#$%^&*(),.?":{}|<>]/.test(password), label: "Un carácter especial (opcional)" }
                    ].map((req, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                req.check ? 'bg-green-500' : 'bg-gray-300'
                            } transition-colors duration-300`}>
                                {req.check && <CheckIcon className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`text-xs ${req.check ? 'text-green-600' : currentTheme.textSecondary}`}>
                                {req.label}
                            </span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
            >
                <motion.button
                    type="submit"
                    whileHover={loading ? {} : { scale: 1.02, y: -2 }}
                    whileTap={loading ? {} : { scale: 0.98 }}
                    disabled={loading}
                    className={`w-full text-white px-6 py-4 lg:py-5 rounded-xl font-bold text-base lg:text-lg transition-all duration-300 relative overflow-hidden group
                    ${loading 
                        ? 'opacity-70 cursor-not-allowed' 
                        : 'hover:shadow-xl hover:shadow-purple-500/25'
                    }`}
                    style={{
                        background: loading 
                            ? 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)'
                            : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #3b82f6 100%)'
                    }}
                >
                    {/* Background animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    
                    {/* Button content */}
                    <span className="relative z-10 flex items-center justify-center gap-3">
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Creando Cuenta...</span>
                            </>
                        ) : (
                            <>
                                <UserIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                                <span>Crear Cuenta</span>
                            </>
                        )}
                    </span>

                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </motion.button>
            </motion.div>

            {/* Terms and Privacy */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className={`text-center text-xs ${currentTheme.textSecondary}`}
            >
                Al crear una cuenta, aceptas nuestros{' '}
                <a href="/terms" className="text-blue-600 hover:text-blue-800 underline transition-colors">
                    Términos de Servicio
                </a>{' '}
                y{' '}
                <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline transition-colors">
                    Política de Privacidad
                </a>
                .
            </motion.div>
        </form>
    )
}

export default SignUpForm
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useThemeMode } from '../../contexts/ThemeContext'
import { motion } from 'framer-motion'
import { 
    EnvelopeIcon, 
    KeyIcon, 
    LockClosedIcon, 
    EyeIcon, 
    EyeSlashIcon, 
    CheckIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const ResetForm = ({ onSubmit, loading, onVerifyCode }) => {

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm()
    const { currentTheme } = useThemeMode()
    const [focusedField, setFocusedField] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [step, setStep] = useState(1) // 1: verify code, 2: reset password
    const [verifying, setVerifying] = useState(false)
    const [codeVerified, setCodeVerified] = useState(false)

    const password = watch("nueva_contrasena", "")
    const codigo = watch("codigo_verificacion", "")

    useEffect(() => {
        const email = sessionStorage.getItem('pwd_reset_email') || ''
        if (email) {
            setValue('correo', email)
        }
    }, [setValue])

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

    // Verify code function
    const handleVerifyCode = async () => {
        if (!codigo || codigo.length < 6) {
            return
        }

        setVerifying(true)
        try {
            // Call verification API
            const email = sessionStorage.getItem('pwd_reset_email') || ''
            await onVerifyCode({
                correo: email,
                codigo_verificacion: parseInt(codigo)
            })

            setCodeVerified(true)
            setStep(2)
            
            // Success feedback
            const successDiv = document.createElement('div')
            successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg z-50 transition-all duration-300'
            successDiv.textContent = '✓ Código verificado correctamente'
            document.body.appendChild(successDiv)
            
            setTimeout(() => {
                successDiv.remove()
            }, 3000)

        } catch (error) {
            // Error feedback
            const errorDiv = document.createElement('div')
            errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg z-50 transition-all duration-300'
            errorDiv.textContent = '✗ Código incorrecto. Intenta de nuevo.'
            document.body.appendChild(errorDiv)
            
            setTimeout(() => {
                errorDiv.remove()
            }, 3000)
        } finally {
            setVerifying(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step Indicator */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center mb-6"
            >
                <div className="flex items-center space-x-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                        step >= 1 ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 text-gray-300'
                    } transition-all duration-300`}>
                        {codeVerified ? <CheckIcon className="w-4 h-4" /> : '1'}
                    </div>
                    <div className={`w-16 h-1 rounded-full ${
                        codeVerified ? 'bg-blue-500' : 'bg-gray-300'
                    } transition-all duration-300`}></div>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                        step >= 2 ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 text-gray-300'
                    } transition-all duration-300`}>
                        2
                    </div>
                </div>
            </motion.div>

            {/* Email Field (always visible) */}
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
                    Correo Electrónico
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <EnvelopeIcon className={`h-5 w-5 ${currentTheme.textSecondary} opacity-50`} />
                    </div>
                    <input
                        id="correo"
                        type="email"
                        readOnly
                        className={`w-full pl-12 pr-4 py-3 lg:py-4 rounded-xl ${currentTheme.input} border ${currentTheme.border} ${currentTheme.text} bg-gray-50 cursor-not-allowed opacity-70`}
                        {...register("correo")}
                    />
                </div>
            </motion.div>

            {/* Verification Code Field */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="group"
            >
                <label
                    className={`block text-sm font-medium mb-3 ${currentTheme.textSecondary} transition-colors duration-300`}
                    htmlFor="codigo_verificacion"
                >
                    Código de Verificación *
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <KeyIcon className={`h-5 w-5 ${
                            focusedField === 'codigo_verificacion' ? 'text-blue-500' : currentTheme.textSecondary
                        } transition-colors duration-300`} />
                    </div>
                    <input
                        id="codigo_verificacion"
                        type="number"
                        autoComplete="off"
                        disabled={codeVerified}
                        className={`w-full pl-12 pr-32 py-3 lg:py-4 rounded-xl ${currentTheme.input} border ${
                            errors.codigo_verificacion ? 'border-red-500' : 
                            codeVerified ? 'border-green-500 bg-green-50' : currentTheme.border
                        } ${currentTheme.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 group-hover:border-blue-400/50
                        ${codeVerified ? 'cursor-not-allowed opacity-70' : ''}`}
                        placeholder="Ingresa el código de 6 dígitos"
                        onFocus={() => setFocusedField('codigo_verificacion')}
                        onBlur={() => setFocusedField(null)}
                        {...register("codigo_verificacion", {
                            required: "Código de verificación requerido",
                            minLength: {
                                value: 6,
                                message: "El código debe tener 6 dígitos"
                            }
                        })}
                    />
                    
                    {/* Verify Button */}
                    {!codeVerified && (
                        <button
                            type="button"
                            onClick={handleVerifyCode}
                            disabled={!codigo || codigo.length < 6 || verifying}
                            className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-all duration-200 ${
                                codigo && codigo.length >= 6 && !verifying
                                    ? 'text-blue-600 hover:text-blue-700 cursor-pointer' 
                                    : 'text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {verifying ? (
                                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <motion.div
                                    whileHover={codigo && codigo.length >= 6 ? { scale: 1.1 } : {}}
                                    whileTap={codigo && codigo.length >= 6 ? { scale: 0.9 } : {}}
                                    className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                >
                                    Verificar
                                </motion.div>
                            )}
                        </button>
                    )}

                    {/* Success indicator */}
                    {codeVerified && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg">
                                <CheckIcon className="w-4 h-4" />
                                Verificado
                            </div>
                        </div>
                    )}

                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                {errors.codigo_verificacion && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-500"
                    >
                        {errors.codigo_verificacion.message}
                    </motion.p>
                )}
            </motion.div>

            {/* Password Field - Only visible when code is verified */}
            {step === 2 && (
                <>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="group"
                    >
                        <label
                            className={`block text-sm font-medium mb-3 ${currentTheme.textSecondary} transition-colors duration-300`}
                            htmlFor="nueva_contrasena"
                        >
                            Nueva Contraseña *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <LockClosedIcon className={`h-5 w-5 ${
                                    focusedField === 'nueva_contrasena' ? 'text-blue-500' : currentTheme.textSecondary
                                } transition-colors duration-300`} />
                            </div>
                            <input
                                id="nueva_contrasena"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                className={`w-full pl-12 pr-12 py-3 lg:py-4 rounded-xl ${currentTheme.input} border ${
                                    errors.nueva_contrasena ? 'border-red-500' : currentTheme.border
                                } ${currentTheme.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 group-hover:border-blue-400/50`}
                                placeholder="••••••••"
                                onFocus={() => setFocusedField('nueva_contrasena')}
                                onBlur={() => setFocusedField(null)}
                                {...register("nueva_contrasena", {
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

                        {errors.nueva_contrasena && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 text-sm text-red-500"
                            >
                                {errors.nueva_contrasena.message}
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
                </>
            )}

            {/* Submit Button - Only visible when password step is active */}
            {step === 2 && (
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
                            : 'hover:shadow-xl hover:shadow-green-500/25'
                        }`}
                        style={{
                            background: loading 
                                ? 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)'
                                : 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)'
                        }}
                    >
                        {/* Background animation */}
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        
                        {/* Button content */}
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Cambiando contraseña...</span>
                                </>
                            ) : (
                                <>
                                    <ShieldCheckIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                                    <span>Cambiar Contraseña</span>
                                </>
                            )}
                        </span>

                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </motion.button>
                </motion.div>
            )}

            {/* Security Notice */}
            {step === 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-4`}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <ExclamationTriangleIcon className="w-5 h-5 text-blue-500" />
                        </div>
                        <span className={`text-sm font-medium ${currentTheme.text}`}>
                            Código de Verificación
                        </span>
                    </div>
                    <p className={`text-xs ${currentTheme.textSecondary} leading-relaxed`}>
                        Ingresa el código de 6 dígitos que enviamos a tu correo electrónico. 
                        Una vez verificado, podrás establecer tu nueva contraseña.
                    </p>
                </motion.div>
            )}

            {step === 2 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
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
                        Tu identidad ha sido verificada. Establece una contraseña segura 
                        que cumpla con todos los requisitos de seguridad.
                    </p>
                </motion.div>
            )}
        </form>
    )
}

export default ResetForm
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContexts'
import { useNavigate } from 'react-router-dom'
import SignInForm from '../components/Forms/SignInForm'
import { getCurrentUser, loginUser as loginService } from '../services/api/usuario'
import { encryptData } from '../services/encryptionService'
import { useThemeMode } from '../contexts/ThemeContext'
import { motion } from 'framer-motion'
import { UserIcon } from '@heroicons/react/24/outline'

const SignIn = ({ setActiveTab }) => {

    const { login } = useAuth()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { currentTheme } = useThemeMode()
    const [hover, setHover] = useState(false)

    const onSubmit = async (data) => {
        setLoading(true)

        try {
            const response = await loginService(data)
            localStorage.setItem("token", response.access_token)

            const user = await getCurrentUser()
            localStorage.setItem("user", encryptData(user))

            login(response.access_token)

            Swal.fire({
                icon: 'success',
                title: '¡Inicio de sesión exitoso!',
                text: 'Serás redirigido al dashboard.',
                timer: 2500,
                showConfirmButton: false,
            })

            navigate('/dashboard')
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data?.detail || 'Credenciales incorrectas',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
            >
                <h2 className={`text-2xl sm:text-3xl font-bold uppercase mb-3 ${currentTheme.text}`}>
                    Bienvenido de Nuevo
                </h2>
                <p className={`text-sm sm:text-base ${currentTheme.textSecondary}`}>
                    Nos alegra verte otra vez. ¡Accede a tu cuenta!
                </p>
                
                {/* Decorative line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"
                ></motion.div>
            </motion.div>

            {/* Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <SignInForm onSubmit={onSubmit} loading={loading} />
            </motion.div>

            {/* Switch to Sign Up */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex justify-center items-center pt-4"
            >
                <motion.button 
                    onClick={() => setActiveTab('signup')}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`group inline-flex items-center gap-2 text-sm font-medium cursor-pointer transition-all duration-300 px-4 py-2 rounded-lg ${currentTheme.hover}`}
                >
                    <UserIcon className={`w-4 h-4 transition-colors duration-300 ${
                        hover ? 'text-blue-600' : currentTheme.textSecondary.replace('text-', 'text-')
                    }`} />
                    <span className={`transition-colors duration-300 ${
                        hover ? 'text-blue-600' : currentTheme.textSecondary
                    }`}>
                        ¿No tienes cuenta? <span className="font-semibold">Regístrate aquí</span>
                    </span>
                </motion.button>
            </motion.div>
        </div>
    )
}

export default SignIn
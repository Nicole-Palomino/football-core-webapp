import { useState } from 'react'
import { useAuth } from '../contexts/AuthContexts'
import { useNavigate } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'
import SignInForm from '../components/Forms/SignInForm'
import { getCurrentUser, loginUser as loginService } from '../services/api/usuario'
import { encryptData } from '../services/encryptionService'
import { useTheme } from '@mui/material'

const SignIn = ({ setValue }) => {

    const { login } = useAuth()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const theme = useTheme()
    const [hover, setHover] = useState(false)

    const onSubmit = async (data) => {
        setLoading(true)

        try {
            const response = await loginService(data)
            console.log(response)
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
        <div className='flex flex-col'>
            <div className="font-bold font-subtitle text-center self-center text-xl sm:text-3xl uppercase"
                style={{ color: theme.palette.primary.main }}>
                bienvenido de nuevo
            </div>

            <div className="font-bold font-subtitle text-center self-center text-md md:text-md"
                style={{ color: theme.palette.text.primary }}>
                Nos alegra verte otra vez. ¡Accede a tu cuenta!
            </div>

            <div className="mt-5">
                <SignInForm onSubmit={onSubmit} loading={loading} />
            </div>

            <div className="flex justify-center items-center mt-6">
                <button onClick={() => setValue(1)}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    className="inline-flex items-center font-subtitle text-sm text-center cursor-pointer"
                    style={{
                        color: hover ? theme.palette.primary.main : theme.palette.text.primary,
                    }}>
                    <span className="mr-2">
                        <FaUser style={{ color: hover ? theme.palette.primary.main : theme.palette.text.primary }} />
                    </span>
                    <span>No tienes cuenta?</span>
                </button>
            </div>
        </div>
    )
}

export default SignIn
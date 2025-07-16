import { useState } from 'react'
import { useAuth } from '../contexts/AuthContexts'
import { useNavigate } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'
import SignInForm from '../components/SignInForm'
import { getCurrentUser, loginUser as loginService } from '../services/usuario'
import { encryptData } from '../services/encryptionService'

const SignIn = ({ setValue }) => {

    const { login } = useAuth()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

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
            <div className="font-bold font-subtitle text-white text-center self-center text-xl sm:text-3xl uppercase">
                bienvenido de nuevo
            </div>

            <div className="font-bold font-subtitle text-white text-center self-center text-md md:text-md">
                Nos alegra verte otra vez. ¡Accede a tu cuenta!
            </div>

            <div className="mt-5">
                <SignInForm onSubmit={onSubmit} loading={loading} />
            </div>

            <div className="flex justify-center items-center mt-6">
                <button onClick={() => setValue(1)}
                    className="inline-flex items-center font-subtitle text-sm text_hover text-white text-center cursor-pointer">
                    <span className="mr-2">
                        <FaUser className='text-white'/>
                    </span>
                    <span>No tienes cuenta?</span>
                </button>
            </div>
        </div>
    )
}

export default SignIn
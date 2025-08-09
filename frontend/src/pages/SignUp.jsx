import { useState } from 'react'
import { FaUser } from 'react-icons/fa'
import SignUpForm from '../components/Forms/SignUpForm'
import { registerUser } from '../services/api/usuario'
import { useTheme } from '@mui/material'

const SignUp = ({ setValue }) => {

    const [loading, setLoading] = useState(false)
    const theme = useTheme()
    const [hover, setHover] = useState(false)

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            await registerUser(data)

            Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: 'Serás redirigido al dashboard.',
                timer: 2500,
                showConfirmButton: false,
            })

            setValue(0)
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Ocurrió un problema en el registro',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex flex-col'>
            <div className="font-bold font-subtitle text-center self-center text-xl sm:text-3xl uppercase"
                style={{ color: theme.palette.primary.main }}>
                ¡Únete a Nosotros! 🚀
            </div>

            <div className="font-bold font-subtitle text-center self-center text-sm sm:text-sm"
                style={{ color: theme.palette.text.primary }}>
                Crea tu cuenta y accede a experiencias increíbles.
            </div>

            <div className="mt-5">
                <SignUpForm onSubmit={onSubmit} loading={loading} />
            </div>

            <div className="flex justify-center items-center mt-6">
                <button onClick={() => setValue(0)}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    className="inline-flex items-center font-subtitle text-sm cursor-pointer text-center"
                    style={{
                        color: hover ? theme.palette.primary.main : theme.palette.text.primary,
                    }}>
                    <span className="mr-2">
                        <FaUser style={{ color: hover ? theme.palette.primary.main : theme.palette.text.primary }} />
                    </span>
                    <span>Tienes cuenta?</span>
                </button>
            </div>
        </div>
    )
}

export default SignUp
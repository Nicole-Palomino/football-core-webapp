import { useState } from 'react'
import { FaUser } from 'react-icons/fa'
import SignUpForm from '../components/Forms/SignUpForm'
import { registerUser } from '../services/api/usuario'

const SignUp = ({ setValue }) => {

    const [loading, setLoading] = useState(false)

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
            <div className="font-bold font-subtitle text-white text-center self-center text-xl sm:text-3xl uppercase">
                ¡Únete a Nosotros! 🚀
            </div>

            <div className="font-bold font-subtitle text-white text-center self-center text-sm sm:text-sm">
                Crea tu cuenta y accede a experiencias increíbles.
            </div>

            <div className="mt-5">
                <SignUpForm onSubmit={onSubmit} loading={loading} />
            </div>

            <div className="flex justify-center items-center mt-6">
                <button onClick={() => setValue(0)}
                    className="inline-flex items-center font-subtitle text-sm cursor-pointer text-white hover:text-blue-500 hover:text-light text-center">
                    <span className="mr-2">
                        <FaUser />
                    </span>
                    <span>Tienes cuenta?</span>
                </button>
            </div>
        </div>
    )
}

export default SignUp
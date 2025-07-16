import { useState } from 'react'
import {  FaUser } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const SignUp = ({ setValue }) => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data) => {

    }

    return (
        <div className='flex flex-col'>
            <div className="font-bold font-subtitle text-white text-center self-center text-xl sm:text-3xl uppercase">
                ¡Únete a Nosotros! 🚀
            </div>

            <div className="font-bold font-subtitle text-white text-center self-center text-sm sm:text-sm">
                Crea tu cuenta y accede a experiencias increíbles.
            </div>

            <div className="flex justify-center items-center mt-6">
                <button onClick={() => setValue(0)}
                    className="inline-flex items-center font-subtitle text-sm text-text_hover hover:text-light text-center">
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
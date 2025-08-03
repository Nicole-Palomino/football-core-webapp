import { motion } from "framer-motion"
import { FaTiktok } from "react-icons/fa"
import { useForm, ValidationError } from '@formspree/react'
import { useEffect, useRef } from 'react'

const Footer = () => {

    const [state, handleSubmit] = useForm("xeqynqwa")
    const emailRef = useRef(null)

    useEffect(() => {
        if (state.succeeded) {
            Swal.fire({
            icon: "success",
            title: "¡Gracias!",
            text: "Te has suscrito con éxito.",
            confirmButtonColor: "#228B22",
            confirmButtonText: "Aceptar",
            })

            // Limpia el campo del email
            if (emailRef.current) {
                emailRef.current.value = ""
            }
        }
    }, [state.succeeded])


    return (
        <footer className='py-28 bg-navbar fixed-bottom'>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 md:gap-4">
                        <div className="space-y-4 max-w-[300px]">
                            <div className='flex items-center space-x-2'>
                                <h1 className="text-3xl text-white">
                                    <span className='text-blue-500'>F</span>OOT<span className='text-blue-500'>B</span>ALL <span className='text-blue-500'>C</span>ORE
                                </h1>
                            </div>
                            <p className="text-white font-subtitle">
                                FOOTBALL CORE: La plataforma esencial para el aficionado al fútbol que busca analizar 
                                y comprender el deporte desde un enfoque estadístico. Accede a datos históricos, 
                                pronósticos y resúmenes personalizados para profundizar en el rendimiento de tus 
                                equipos favoritos.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <h1 className="text-2xl font-subtitle text-white">SERVICIOS</h1>
                                <div className="text-dark">
                                    <ul className="space-y-2 text-lg">
                                        <li className="cursor-pointer text-white font-subtitle hover:text-blue-500 duration-200">
                                            Análisis comparativo
                                        </li>
                                        <li className="cursor-pointer text-white font-subtitle hover:text-blue-500 duration-200">
                                            Pronóstico del partido
                                        </li>
                                        <li className="cursor-pointer text-white font-subtitle hover:text-blue-500 duration-200">
                                            Resúmenes estadísticos 
                                        </li>
                                        <li className="cursor-pointer text-white font-subtitle hover:text-blue-500 duration-200">
                                            Soporte técnico
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-2xl font-subtitle text-white">Enlaces</h1>
                                <div className="text-dark">
                                    <ul className="space-y-2 text-lg">
                                        <li className="cursor-pointer text-white font-subtitle hover:text-blue-500 duration-200">
                                            Inicio
                                        </li>
                                        <li className="cursor-pointer text-white font-subtitle hover:text-blue-500 duration-200">
                                            Servicios
                                        </li>
                                        <li className="cursor-pointer text-white font-subtitle hover:text-blue-500 duration-200">
                                            Sobre nosotros
                                        </li>
                                        <li className="cursor-pointer text-white font-subtitle hover:text-blue-500 duration-200">
                                            Contacto
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 max-w-[300px]">
                            <h1 className="text-2xl font-subtitle text-white">Suscríbete</h1>
                                <form onSubmit={handleSubmit}>
                                    <div className="flex items-center">
                                            <input
                                                ref={emailRef}
                                                type="email"
                                                name='email'
                                                placeholder="Ingresa tu correo electrónico"
                                                required
                                                className="p-3 rounded-s-xl font-subtitle bg-white w-full py-4 focus:ring-0 focus:outline-none placeholder:text-dark" />
                                            <ValidationError 
                                                prefix="Email" 
                                                field="email"
                                                errors={state.errors} />
                                            <button type='submit' disabled={state.submitting} className="bg-blue-500 text-white font-subtitle py-4 px-6 rounded-e-xl cursor-pointer">
                                                Ir
                                            </button>
                                    </div>
                                </form>

                            {/* social icons */}
                            <div className="flex space-x-6 py-3">
                                <a href="https://www.tiktok.com/@fooball_core" target='_blank' rel="noopener noreferrer" className="relative group">
                                    <FaTiktok className="cursor-pointer hover:text-blue-500 text-white text-lg hover:scale-105 duration-200" />
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 rounded bg-black text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        Visítanos en Tik Tok
                                    </span>
                                </a>
                                {/* <a href="https://thecodingjourney.com/" target='_blank'>
                                    <TbWorldWww className="cursor-pointer hover:text-blue-500 text-white text-lg hover:scale-105 duration-200" />
                                </a>
                                <a href="https://www.facebook.com/" target='_blank'>
                                    <CiFacebook className="cursor-pointer hover:text-blue-500 text-white text-lg hover:scale-105 duration-200" />
                                </a> */}
                            </div>
                        </div>
                    </div>
            </motion.div>
        </footer>
    )
}

export default Footer
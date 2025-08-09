import NavbarClient from '../components/Navbar/NavbarClient'
import { motion } from 'framer-motion'
import { Paper, useTheme } from '@mui/material'
import ForgotForm from '../components/Forms/ForgotForm'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { forgotUser } from '../services/api/usuario'

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const paperStyle = { margin: 'auto' }

    const onSubmit = async (data) => {
        setLoading(true)

        try {
            await forgotUser(data)

            sessionStorage.setItem('pwd_reset_email', data.correo)

            Swal.fire({
                icon: 'success',
                title: '¡Código solicitado exitosamente!',
                text: 'Revisa tu correo para el código.',
                timer: 2500,
                showConfirmButton: false,
            })

            navigate(`/reset-password`)
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data?.detail,
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className='w-full min-h-screen bg-background'>
            <NavbarClient />
            <div className='flex flex-col items-center justify-center min-h-[calc(100vh-130px)] px-4 sm:px-6'>
                <motion.div className='flex flex-col mt-5 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl px-4 sm:px-6 md:px-8 lg:px-10 rounded-2xl mx-auto' initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}>
                    <Paper elevation={20} style={paperStyle}
                        sx={{
                            backdropFilter: "blur(10px)",
                            width: "100%",
                            maxWidth: "500px",
                        }}>
                        <div className="relative w-full h-full mt-10" style={{ minHeight: '430px' }}>
                            <ForgotForm onSubmit={onSubmit} loading={loading} />
                        </div>
                    </Paper>
                </motion.div>
            </div>
        </section>
    )
}

export default ForgotPassword
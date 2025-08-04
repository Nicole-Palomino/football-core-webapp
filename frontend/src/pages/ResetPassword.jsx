import React, { useState } from 'react'
import NavbarClient from '../components/Navbar/NavbarClient'
import { motion } from 'framer-motion'
import { Paper } from '@mui/material'
import ResetForm from '../components/Forms/ResetForm'

const ResetPassword = () => {
    const [loading, setLoading] = useState(false)
    const paperStyle = { margin: 'auto' }

    const onSubmit = async (data) => {
        setLoading(true)

        try {
            await forgotUser(data)

            Swal.fire({
                icon: 'success',
                title: '¡Código solicitado exitosamente!',
                text: 'Serás redirigido para cambiar tu contraseña.',
                timer: 2500,
                showConfirmButton: false,
            })

            navigate(`/reset-password?correo=${encodeURIComponent(data.correo)}`)
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
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            backdropFilter: "blur(10px)",
                            width: "100%",
                            maxWidth: "500px",
                            "& .MuiTabs-indicator": {
                                backgroundColor: "#193cb8",
                            },
                        }}>
                        <div className="relative w-full h-full mt-10" style={{ minHeight: '430px' }}>
                            <ResetForm onSubmit={onSubmit} loading={loading} />
                        </div>
                    </Paper>
                </motion.div>
            </div>
        </section>
    )
}

export default ResetPassword
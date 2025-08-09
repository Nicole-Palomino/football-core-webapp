import { TextField, useTheme } from '@mui/material'
import { IoArrowBackCircle } from "react-icons/io5"
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const ForgotForm = ({ onSubmit, loading }) => {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const theme = useTheme()
    const [hover, setHover] = useState(false)

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex flex-col mb-5">
                <h1 className='text-center font-bold text-3xl mb-2' style={{ color: theme.palette.primary.main }}>¿Olvidaste tu contraseña?</h1>
                <h1 className='text-center text-lg mb-8' style={{ color: theme.palette.text.primary }}>Ingresa tu Correo Electrónico para enviar el código de recuperación</h1>
                <div className="relative">
                    {/* Input de email */}
                    <TextField
                        label="Correo Electrónico"
                        variant="outlined"
                        fullWidth
                        autoFocus
                        type='email'
                        autoComplete="off"
                        sx={{
                            "& label": { color: theme.palette.text.primary },
                            "& .MuiOutlinedInput-root": {
                                color: theme.palette.text.primary,
                                "& fieldset": { borderColor: theme.palette.text.primary },
                                "&:hover fieldset": { borderColor: theme.palette.primary.main },
                            },
                            "& .Mui-error": {
                                "& label": { color: theme.custom.rojo },
                                "& label.Mui-focused": { color: theme.custom.rojo },
                                "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.custom.rojo },
                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: theme.custom.rojo },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: theme.custom.rojo }
                            },
                        }}
                        {...register("correo", {
                            required: {
                                value: true,
                                message: "Correo Electrónico requerido"
                            },
                            pattern: {
                                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
                                message: "El correo electrónico debe proceder de Gmail, Hotmail o Outlook"
                            }
                        })}
                        error={!!errors.correo}
                        helperText={errors.correo ? errors.correo.message : ''} />
                </div>
            </div>

            <div className="flex w-full mt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 text-white text-lg cursor-pointer font-subtitle rounded-lg transition-all ${loading
                            ? "cursor-not-allowed"
                            : ""
                        }`}
                    style={{
                        backgroundColor: loading
                            ? theme.palette.action.disabledBackground
                            : theme.custom.azul,
                    }}
                    onMouseEnter={(e) => {
                        if (!loading) e.currentTarget.style.backgroundColor = theme.custom.azulHover
                    }}
                    onMouseLeave={(e) => {
                        if (!loading) e.currentTarget.style.backgroundColor = theme.custom.azul
                    }}
                >
                    <span className="mr-2 uppercase">{loading ? "Cargando..." : "Solicitar código de recuperación"}</span>
                </button>
            </div>

            <div className="flex justify-center items-center mt-6">
                <Link to="/get-started">
                    <button
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        className="inline-flex items-center font-subtitle text-lg text-center cursor-pointer"
                        style={{
                            color: hover ? theme.palette.primary.main : theme.palette.text.primary,
                        }}>
                        <span className="mr-2">
                            <IoArrowBackCircle style={{ color: theme.palette.text.primary }} />
                        </span>
                        <span>Regresar</span>
                    </button>
                </Link>

            </div>
        </form>
    )
}

export default ForgotForm
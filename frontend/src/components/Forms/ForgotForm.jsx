import { TextField } from '@mui/material'
import { IoArrowBackCircle } from "react-icons/io5"
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

const ForgotForm = ({ onSubmit, loading }) => {

    const { register, handleSubmit, formState: { errors } } = useForm()

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex flex-col mb-5">
                <h1 className='text-center text-white font-bold text-3xl mb-2'>¿Olvidaste tu contraseña?</h1>
                <h1 className='text-center text-white text-lg mb-8'>Ingresa tu Correo Electrónico para enviar el código de recuperación</h1>
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
                            "& label": { color: "white" },
                            "& .MuiOutlinedInput-root": {
                                color: "white",
                                "& fieldset": { borderColor: "white" },
                                "&:hover fieldset": { borderColor: "#368FF4" },
                            },
                            "& .Mui-error": {
                                "& label": { color: "#f44336" },
                                "& label.Mui-focused": { color: "#f44336" },
                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#f44336" },
                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#f44336" },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#f44336" }
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
                        error={!!errors.email}
                        helperText={errors.email ? errors.email.message : ''} />
                </div>
            </div>

            <div className="flex w-full mt-4">
                <button type="submit" className={`w-full py-3 text-white text-lg cursor-pointer font-subtitle rounded-lg transition-all ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                    disabled={loading}>
                    <span className="mr-2 uppercase">{loading ? "Cargando..." : "Solicitar código de recuperación"}</span>
                </button>
            </div>

            <div className="flex justify-center items-center mt-6">
                <Link to="/get-started">
                    <button
                        className="inline-flex items-center font-subtitle text-lg hover:text-blue-600 text-white text-center cursor-pointer">
                        <span className="mr-2">
                            <IoArrowBackCircle className='text-white' />
                        </span>
                        <span>Regresar</span>
                    </button>
                </Link>

            </div>
        </form>
    )
}

export default ForgotForm
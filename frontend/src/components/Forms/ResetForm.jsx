import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TextField } from '@mui/material'

const ResetForm = ({ onSubmit, loading }) => {

    const { register, handleSubmit, formState: { errors }, setValue } = useForm()
    
    useEffect(() => {
        const email = sessionStorage.getItem('pwd_reset_email') || ''
        if (email) {
            setValue('correo', email)
        }
    }, [setValue])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex flex-col mb-5">
                <h1 className='text-center text-white font-bold text-3xl mb-2'>¿Olvidaste tu contraseña?</h1>
                <h1 className='text-center text-white text-lg mb-8'>Ingresa tu Correo Electrónico para enviar el código de recuperación</h1>
                <div className="flex flex-col mb-5">
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
                            error={!!errors.correo}
                            helperText={errors.correo ? errors.correo.message : ''} />
                    </div>
                </div>

                <div className="flex flex-col mb-5">
                    <div className="relative">
                        {/* Input de codigo */}
                        <TextField
                            label="Código de verificación"
                            variant="outlined"
                            fullWidth
                            autoFocus
                            type='number'
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
                            {...register("codigo_verificacion", {
                                required: {
                                    value: true,
                                    message: "Código de verificación requerido"
                                }
                            })}
                            error={!!errors.codigo_verificacion}
                            helperText={errors.codigo_verificacion ? errors.codigo_verificacion.message : ''} />
                    </div>
                </div>
                
                <div className="flex flex-col">
                    <div className="relative">
                        {/* Input password */}
                        <TextField
                            label="Contraseña"
                            variant="outlined"
                            fullWidth
                            type="password"
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
                            {...register("nueva_contrasena", {
                                required: {
                                    value: true,
                                    message: "Contraseña requerida"
                                },
                                minLength: {
                                    value: 8,
                                    message: "La contraseña debe tener al menos 8 caracteres"
                                },
                                pattern: {
                                    value: /^(?=.*[A-Z])(?=.*\d).*$/,
                                    message: "La contraseña debe incluir una letra mayúscula y un número"
                                }
                            })}
                            error={!!errors.nueva_contrasena}
                            helperText={errors.nueva_contrasena ? errors.nueva_contrasena.message : ''} />
                    </div>
                </div>
            </div>

            <div className="flex w-full mt-4">
                <button type="submit" className={`w-full py-3 text-white text-lg cursor-pointer font-subtitle rounded-lg transition-all ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                    disabled={loading}>
                    <span className="mr-2 uppercase">{loading ? "Cargando..." : "Cambiar contraseña"}</span>
                </button>
            </div>
        </form>
    )
}

export default ResetForm
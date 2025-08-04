import { useForm } from 'react-hook-form'
import { TextField } from '@mui/material'

const SignUpForm = ({ onSubmit, loading }) => {

    const { register, handleSubmit, formState: { errors } } = useForm()

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex flex-col mb-5">
                <div className="relative">
                    {/* username */}
                    <TextField 
                        label="Nombre de usuario"
                        variant="outlined"
                        fullWidth
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
                        { ... register("usuario", {
                            required: {
                                value: true,
                                message: "Nombre de usuario requerido"
                            }
                        })}
                        error={!!errors.usuario}
                        helperText={errors.usuario ? errors.usuario.message : ''}/>
                </div>
            </div>

            <div className="flex flex-col mb-5">
                <div className="relative">
                    {/* Input de email */}
                    <TextField 
                        label="Correo Electrónico"
                        variant="outlined"
                        fullWidth
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
                        { ... register("correo", {
                            required: {
                                value: true,
                                message: "Correo Electrónico requerido"
                            },
                            pattern: {
                                value: /^[a-z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.com)$/i,
                                message: "El correo electrónico debe proceder de Gmail, Hotmail o Outlook"
                            }
                        })}
                        error={!!errors.correo}
                        helperText={errors.correo ? errors.correo.message : ''}/>
                </div>
            </div>

            <div className="flex flex-col mb-3">
                <div className="relative">
                    {/* Input password */}
                    <TextField 
                        label="Contraseña"
                        variant="outlined"
                        fullWidth
                        type='password'
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
                        { ... register("contrasena", {
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
                        error={!!errors.contrasena}
                        helperText={errors.contrasena ? errors.contrasena.message : ''}/>
                </div>
            </div>

            <div className="flex w-full mt-4">
                <button type="submit" className={`w-full py-3 text-white text-lg font-subtitle rounded-lg transition-all ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}`}
                    disabled={loading}>
                        <span className="mr-2 uppercase">{loading ? "Cargando..." : "Registrarse"}</span>
                </button>
            </div>
        </form>
    )
}

export default SignUpForm
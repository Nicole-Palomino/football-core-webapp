import { useForm } from "react-hook-form"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useAuth } from "../contexts/AuthContexts"
import { loginUser } from "../services/api/auth"
import Spinner from "../components/Spinners/Spinner"
import { Eye, EyeOff, Trophy, Users, BarChart3, Calendar, Shield } from 'lucide-react'

const HomePage = () => {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const { setAuthToken } = useAuth()
    const [showPassword, setShowPassword] = useState(false)

    const mutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            setAuthToken(data.access_token) // guardamos en contexto
        },
        onError: (error) => {
            console.error("Error en login:", error)
        },
    })

    const onSubmit = (formData) => {
        mutation.mutate(formData)
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
            {/* Elementos decorativos de fondo */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-100 opacity-50"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-50 opacity-30"></div>
                <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-blue-200 opacity-20"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Card principal */}
                <div className="bg-white shadow-2xl rounded-3xl p-8 backdrop-blur-sm border border-blue-100">
                    {/* Header con logo y título */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
                            <Trophy className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Panel Deportivo</h1>
                        <p className="text-gray-500 text-sm">Administra tu sistema deportivo</p>
                    </div>

                    {/* Iconos de funcionalidades */}
                    <div className="flex justify-center gap-6 mb-8">
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-1">
                                <Users className="w-5 h-5 text-blue-500" />
                            </div>
                            <span className="text-xs text-gray-400">Equipos</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-1">
                                <BarChart3 className="w-5 h-5 text-blue-500" />
                            </div>
                            <span className="text-xs text-gray-400">Stats</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-1">
                                <Calendar className="w-5 h-5 text-blue-500" />
                            </div>
                            <span className="text-xs text-gray-400">Partidos</span>
                        </div>
                    </div>

                    <div onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Campo de usuario */}
                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Correo o Usuario
                            </label>
                            <div className="relative">
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="admin@sports.com"
                                    {...register("username", {
                                        required: "El usuario es requerido",
                                        minLength: { value: 3, message: "Mínimo 3 caracteres" }
                                    })}
                                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none bg-gray-50 ${errors.username
                                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                        : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300'
                                        }`}
                                />
                                <Shield className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                            </div>
                            {errors.username && (
                                <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
                            )}
                        </div>

                        {/* Campo de contraseña */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    {...register("password", {
                                        required: "La contraseña es requerida",
                                        minLength: { value: 6, message: "Mínimo 6 caracteres" }
                                    })}
                                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none bg-gray-50 pr-12 ${errors.password
                                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                        : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Botón de envío */}
                        <button
                            type="button"
                            onClick={handleSubmit(onSubmit)}
                            disabled={mutation.isPending}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {mutation.isPending ? (
                                <>
                                    <Spinner />
                                    <span>Verificando...</span>
                                </>
                            ) : (
                                <>
                                    <Shield className="w-5 h-5" />
                                    <span>Acceder al Panel</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Mensaje de error */}
                    {mutation.isError && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <p className="text-red-700 text-sm font-medium">
                                    Credenciales inválidas. Verifica tus datos e intenta nuevamente.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-center text-xs text-gray-400">
                            Sistema de Administración Deportiva v2.0
                        </p>
                    </div>
                </div>

                {/* Stats decorativas */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 hidden sm:block">
                    <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">17K+</div>
                        <div className="text-xs text-gray-500">Partidos</div>
                    </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 hidden sm:block">
                    <div className="text-center">
                        <div className="text-lg font-bold text-green-600">85%</div>
                        <div className="text-xs text-gray-500">Accuracy</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage
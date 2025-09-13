import React, { useState, useEffect } from 'react'
import { formatFechaHora } from '../utils/helpers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContexts'
import { updateUser } from '../services/api/usuario'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { setStoredUser } from '../services/auth'
import Swal from 'sweetalert2'
import {
    EnvelopeIcon,
    CalendarDaysIcon,
    ShieldCheckIcon,
    UserCircleIcon,
    ClockIcon,
    PencilIcon,
    Cog6ToothIcon,
    HeartIcon,
    TrophyIcon,
    ArrowRightOnRectangleIcon,
    Squares2X2Icon,
    CreditCardIcon,
    XMarkIcon,
    CheckIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline'
import {
    UserIcon as UserSolidIcon,
    ShieldCheckIcon as ShieldSolidIcon,
    CheckBadgeIcon
} from '@heroicons/react/24/solid'
import { useThemeMode } from '../contexts/ThemeContext'

const schema = yup.object().shape({
    usuario: yup
        .string()
        .min(3, "El usuario debe tener al menos 3 caracteres")
        .max(50, "El usuario no puede tener más de 50 caracteres"),
    correo: yup
        .string()
        .email("Ingresa un correo electrónico válido"),
})

const PageProfile = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [profileCompletion, setProfileCompletion] = useState(0)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' })
    const { logout, user } = useAuth()
    const { currentTheme } = useThemeMode()

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: yupResolver(schema)
    })

    const onSubmit = (data) => {
        const updateData = {}
        if (data.usuario !== user.usuario) updateData.usuario = data.usuario
        if (data.correo !== user.correo) updateData.correo = data.correo

        if (Object.keys(updateData).length === 0) {
            return
        }
        updateUserMutation.mutate(updateData)
    }

    const updateUserMutation = useMutation({
        mutationFn: async (userData) => updateUser(user.id_usuario, userData),
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(['user'], updatedUser)
            setStoredUser(updatedUser)
            setNotification({
                show: true,
                message: '¡Perfil actualizado exitosamente!',
                type: 'success'
            })
            setEditModalOpen(false)
            setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 5000)
        },
        onError: (error) => {
            setNotification({
                show: true,
                message: error?.response?.data?.message || error.message || 'Error al actualizar el perfil',
                type: 'error'
            })
            setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 5000)
        }
    })

    useEffect(() => {
        if (user) {
            let completion = 0
            if (user.usuario) completion += 25
            if (user.correo) completion += 25
            if (user.rol?.nombre_rol) completion += 25
            if (user.is_active) completion += 25
            setProfileCompletion(completion)
        }
    }, [user])

    const handleEditProfile = () => {
        reset({
            usuario: user?.usuario || "",
            correo: user?.correo || ""
        })
        setEditModalOpen(true)
    }

    const handleLogout = () => {
        Swal.fire({
            title: "¿Cerrar sesión?",
            text: "Tu sesión será cerrada.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cerrar",
            confirmButtonColor: "#368FF4",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Cerrando sesión...",
                    text: "Serás redirigido en un momento.",
                    icon: "info",
                    timer: 2000,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    didClose: () => {
                        logout()
                        navigate('/get-started')
                    }
                })
            }
        })
    }

    const getRoleConfig = (roleName) => {
        switch (roleName?.toLowerCase()) {
            case 'admin':
            case 'administrador':
                return {
                    bg: 'from-red-500 to-red-600',
                    text: 'text-red-500',
                    bgColor: 'bg-red-500/10',
                    icon: ShieldSolidIcon
                }
            case 'user':
            case 'usuario':
                return {
                    bg: 'from-blue-500 to-blue-600',
                    text: 'text-blue-500',
                    bgColor: 'bg-blue-500/10',
                    icon: UserSolidIcon
                }
            case 'moderador':
                return {
                    bg: 'from-yellow-500 to-yellow-600',
                    text: 'text-yellow-500',
                    bgColor: 'bg-yellow-500/10',
                    icon: ShieldSolidIcon
                }
            default:
                return {
                    bg: 'from-gray-500 to-gray-600',
                    text: 'text-gray-500',
                    bgColor: 'bg-gray-500/10',
                    icon: UserSolidIcon
                }
        }
    }

    const getInitials = (name) => {
        if (!name) return 'U'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const calculateDaysActive = (registrationDate) => {
        const now = new Date()
        const registration = new Date(registrationDate)
        const diffTime = Math.abs(now - registration)
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const roleConfig = getRoleConfig(user.rol?.nombre_rol)
    const daysActive = calculateDaysActive(user.registro)

    return (
        <div className={`min-h-screen ${currentTheme.background}`}>
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header con navegación rápida */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 p-6 ${currentTheme.card} ${currentTheme.border} border rounded-xl gap-4`}
                >
                    <div className="flex items-center gap-4 w-full">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                            <UserCircleIcon className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className={`text-3xl font-bold ${currentTheme.text}`}>Mi Perfil</h1>
                            <p className={`${currentTheme.textSecondary} text-sm`}>Gestiona tu información personal</p>
                        </div>
                    </div>

                    <div className="flex gap-2 justify-start sm:justify-end w-full sm:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/dashboard')}
                            className="p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors duration-200 group"
                            title="Dashboard"
                        >
                            <Squares2X2Icon className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform duration-200" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/dashboard/settings')}
                            className="p-3 bg-yellow-500/10 hover:bg-yellow-500/20 rounded-lg transition-colors duration-200 group"
                            title="Configuración"
                        >
                            <Cog6ToothIcon className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform duration-200" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors duration-200 group"
                            title="Cerrar Sesión"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform duration-200" />
                        </motion.button>
                    </div>
                </motion.div>

                {/* Main Profile Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className={`${currentTheme.card} ${currentTheme.border} border rounded-xl overflow-hidden relative`}
                        >
                            {/* Decorative top border */}
                            <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>

                            <div className="p-8">
                                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 mb-8">
                                    {/* Avatar with badge */}
                                    <div className="relative">
                                        <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${roleConfig.bg} flex items-center justify-center text-white text-4xl font-bold shadow-2xl border-4 border-white/10`}>
                                            {getInitials(user.usuario)}
                                        </div>
                                        {user.is_active && (
                                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center border-4 border-gray-800">
                                                <CheckBadgeIcon className="w-6 h-6 text-blue-500" />
                                            </div>
                                        )}
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <h2 className={`text-3xl font-bold ${currentTheme.text}`}>@{user.usuario}</h2>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleEditProfile}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg transition-colors duration-200 border border-blue-500/20"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                                Editar
                                            </motion.button>
                                        </div>

                                        {/* Badges */}
                                        <div className="flex flex-wrap gap-3">
                                            <div className={`flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${roleConfig.bg} rounded-full text-white text-sm font-bold`}>
                                                <roleConfig.icon className="w-4 h-4" />
                                                {user.rol?.nombre_rol || 'Usuario'}
                                            </div>
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${user.is_active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                                <ShieldCheckIcon className="w-4 h-4" />
                                                {user.is_active ? 'Cuenta Activa' : 'Cuenta Inactiva'}
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className={`${currentTheme.textSecondary} text-sm`}>Completitud del perfil</span>
                                                <span className={`${currentTheme.text} font-bold text-sm`}>{profileCompletion}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${profileCompletion}%` }}
                                                    transition={{ duration: 1, delay: 0.5 }}
                                                    className={`h-2.5 rounded-full ${profileCompletion === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                                        <div className="flex items-center gap-3">
                                            <EnvelopeIcon className="w-6 h-6 text-red-500" />
                                            <div className="flex-1 min-w-0">
                                                <p className={`${currentTheme.textSecondary} text-sm`}>Correo Electrónico</p>
                                                <p className={`${currentTheme.text} font-semibold truncate`}>{user.correo}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                        <div className="flex items-center gap-3">
                                            <CalendarDaysIcon className="w-6 h-6 text-blue-500" />
                                            <div>
                                                <p className={`${currentTheme.textSecondary} text-sm`}>Miembro desde</p>
                                                <p className={`${currentTheme.text} font-semibold`}>{formatFechaHora(user.registro)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
                                        <div className="flex items-center gap-3">
                                            <ClockIcon className="w-6 h-6 text-orange-500" />
                                            <div>
                                                <p className={`${currentTheme.textSecondary} text-sm`}>Última actividad</p>
                                                <p className={`${currentTheme.text} font-semibold`}>{formatFechaHora(user.updated_at)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                        <div className="flex items-center gap-3">
                                            <CreditCardIcon className="w-6 h-6 text-purple-500" />
                                            <div>
                                                <p className={`${currentTheme.textSecondary} text-sm`}>Plan de Usuario</p>
                                                <p className={`${currentTheme.text} font-semibold`}>{user.estado?.nombre_estado}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Stats and Quick Actions */}
                    <div className="space-y-6">
                        {/* Statistics */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className={`${currentTheme.card} ${currentTheme.border} border rounded-xl overflow-hidden`}
                        >
                            <div className="h-1 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
                            <div className="p-6">
                                <h3 className={`${currentTheme.text} text-xl font-bold mb-4 text-center`}>Estadísticas</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                        <div className="text-3xl font-bold text-blue-500 mb-1">{daysActive}</div>
                                        <div className={`${currentTheme.textSecondary} text-sm`}>Días activo</div>
                                    </div>
                                    <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                                        <div className="text-3xl font-bold text-red-500 mb-1">{user.is_active ? '✓' : '✗'}</div>
                                        <div className={`${currentTheme.textSecondary} text-sm`}>Estado</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className={`${currentTheme.card} ${currentTheme.border} border rounded-xl overflow-hidden`}
                        >
                            <div className="h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>
                            <div className="p-6">
                                <h3 className={`${currentTheme.text} text-xl font-bold mb-4 text-center`}>Accesos Rápidos</h3>
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => navigate('/dashboard/favorites')}
                                        className="flex flex-col items-center gap-2 p-4 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors duration-200 border border-red-500/20 group"
                                    >
                                        <HeartIcon className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform duration-200" />
                                        <span className={`${currentTheme.text} text-sm font-medium`}>Favoritos</span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => navigate('/dashboard')}
                                        className="flex flex-col items-center gap-2 p-4 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors duration-200 border border-blue-500/20 group"
                                    >
                                        <TrophyIcon className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform duration-200" />
                                        <span className={`${currentTheme.text} text-sm font-medium`}>Partidos</span>
                                    </motion.button>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/dashboard/settings')}
                                    className="w-full flex items-center justify-center gap-2 p-4 bg-orange-500/10 hover:bg-orange-500/20 rounded-lg transition-colors duration-200 border border-orange-500/20 group"
                                >
                                    <Cog6ToothIcon className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform duration-200" />
                                    <span className={`${currentTheme.text} text-sm font-medium`}>Configuración</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {editModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                        onClick={() => setEditModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full max-w-md ${currentTheme.card} ${currentTheme.border} border rounded-xl overflow-hidden`}
                        >
                            {/* Header */}
                            <div className={`flex items-center justify-between p-6 border-b ${currentTheme.border}`}>
                                <div className="flex items-center gap-3">
                                    <PencilIcon className="w-6 h-6 text-blue-500" />
                                    <h2 className={`${currentTheme.text} text-xl font-bold`}>Editar Perfil</h2>
                                </div>
                                <button
                                    onClick={() => setEditModalOpen(false)}
                                    className={`p-2 rounded-lg ${currentTheme.hover} transition-colors duration-200`}
                                >
                                    <XMarkIcon className={`w-5 h-5 ${currentTheme.textSecondary}`} />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                                <div>
                                    <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                                        Nombre de usuario
                                    </label>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        {...register("usuario")}
                                        className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${currentTheme.background} ${currentTheme.text} ${errors.usuario
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                : `${currentTheme.border} border focus:border-blue-500 focus:ring-blue-500/20`
                                            } focus:ring-2 focus:outline-none`}
                                    />
                                    {errors.usuario && (
                                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                                            <ExclamationTriangleIcon className="w-4 h-4" />
                                            {errors.usuario.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        autoComplete="off"
                                        {...register("correo")}
                                        className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${currentTheme.background} ${currentTheme.text} ${errors.correo
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                : `${currentTheme.border} border focus:border-blue-500 focus:ring-blue-500/20`
                                            } focus:ring-2 focus:outline-none`}
                                    />
                                    {errors.correo && (
                                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                                            <ExclamationTriangleIcon className="w-4 h-4" />
                                            {errors.correo.message}
                                        </p>
                                    )}
                                </div>

                                {/* Info Alert */}
                                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                    <div className="flex gap-3">
                                        <InformationCircleIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            <p className={`${currentTheme.text} text-sm`}>• Solo puedes modificar el nombre de usuario y el correo electrónico</p>
                                            <p className={`${currentTheme.text} text-sm`}>• El nombre de usuario debe tener entre 3 y 50 caracteres</p>
                                            <p className={`${currentTheme.text} text-sm`}>• La contraseña no puede modificarse desde este formulario</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditModalOpen(false)}
                                        className={`flex-1 px-4 py-2 rounded-lg border ${currentTheme.border} ${currentTheme.text} ${currentTheme.hover} transition-colors duration-200`}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {updateUserMutation.isLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Guardando...
                                            </>
                                        ) : (
                                            <>
                                                <CheckIcon className="w-4 h-4" />
                                                Guardar Cambios
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Notification Toast */}
            <AnimatePresence>
                {notification.show && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="fixed bottom-6 right-6 z-50"
                    >
                        <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${notification.type === 'success'
                                ? 'bg-green-500/90 text-white'
                                : 'bg-red-500/90 text-white'
                            }`}>
                            {notification.type === 'success' ? (
                                <CheckIcon className="w-5 h-5" />
                            ) : (
                                <ExclamationTriangleIcon className="w-5 h-5" />
                            )}
                            <span className="font-medium">{notification.message}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default PageProfile
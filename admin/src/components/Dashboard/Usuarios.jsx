import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, Snackbar } from '@mui/material'
import { useUsers } from '../../hooks/useUsers'
import {
    Plus, Edit, Trash2, Search, Filter, X, Eye, AlertTriangle, Check, User,
} from 'lucide-react'
import LoadingSpinner from '../Loading/LoadingSpinner'
import { useFunctions } from '../../hooks/useFunctions'
import { useThemeMode } from '../../contexts/ThemeContext'
import { formatDate } from '../../utils/utils'

const Usuarios = () => {
    const { currentTheme } = useThemeMode()
    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState('')

    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    const [selectedUser, setSelectedUser] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterRole, setFilterRole] = useState('todos')
    const [filterStatus, setFilterStatus] = useState('todos')
    const [showPassword, setShowPassword] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const usersPerPage = 10
    const contentClasses = `p-6 ${currentTheme.text}`

    const { allusers, isLoading, createUser, updatedUser, deletedUser } = useUsers()
    const { allroles, allstates } = useFunctions()

    const filteredUsers = (allusers || []).filter(user => {
        const matchesSearch = user.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.correo.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = filterRole === 'todos' || user.rol.nombre_rol === filterRole
        const matchesStatus = filterStatus === 'todos' ||
            (filterStatus === 'activo' && user.is_active) ||
            (filterStatus === 'inactivo' && !user.is_active)

        return matchesSearch && matchesRole && matchesStatus
    })

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage) || 1
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    )

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success", // success | error | warning | info
    })

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false })
    }

    const handleFormSubmit = (data) => {
        if (modalType === 'create') {
            createUser.mutate(data, {
                onSuccess: () => {
                    setSnackbar({
                        open: true,
                        message: "Usuario creado con éxito 🎉",
                        severity: "success",
                    })
                    closeModal()
                },
                onError: (error) => {
                    setSnackbar({
                        open: true,
                        message: error.message || "Error al crear el usuario",
                        severity: "error",
                    })
                }
            })
        } else if (modalType === 'edit') {
            updatedUser.mutate({ id_usuario: selectedUser.id_usuario, data }, {
                onSuccess: () => {
                    setSnackbar({
                        open: true,
                        message: "Usuario actualizado con éxito 🎉",
                        severity: "success",
                    })
                    closeModal()
                },
                onError: (error) => {
                    setSnackbar({
                        open: true,
                        message: error.message || "Error al actualizar el usuario",
                        severity: "error",
                    })
                }
            })
        }
        closeModal()
    }

    const openModal = (type, user = null) => {
        setModalType(type)
        setSelectedUser(user)
        setShowModal(true)

        if (type === "create") {
            reset({
                usuario: "",
                correo: "",
                password: "",
                rol_id: 2,
                estado_id: 1,
                is_active: true,
            })
        } else if (type === "edit" && user) {
            reset({
                usuario: user.usuario,
                correo: user.correo,
                password: "",
                rol_id: user.rol.id,
                estado_id: user.estado.id,
                is_active: user.is_active,
            })
        }
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedUser(null)
        setModalType('')

        // 🔑 resetear valores del formulario
        reset({
            usuario: '',
            correo: '',
            password: '',
            rol_id: 1,
            estado_id: 1,
            is_active: true
        })

        setShowPassword(false)
    }

    const handleDelete = () => {
        if (!selectedUser) return
        deletedUser.mutate(selectedUser.id_usuario, {
            onSuccess: () => {
                setSnackbar({
                    open: true,
                    message: "Usuario eliminado con éxito 🎉",
                    severity: "success",
                })
                closeModal()
            },
            onError: (error) => {
                setSnackbar({
                    open: true,
                    message: error.message || "Error al eliminar el usuario",
                    severity: "error",
                })
            }
        })
    }

    const getStatusBadge = (estado, isActive) => {
        if (!isActive) {
            return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">Inactivo</span>
        }

        const colorClasses = {
            green: 'bg-green-100 text-green-800',
            red: 'bg-red-100 text-red-800',
            yellow: 'bg-yellow-100 text-yellow-800'
        }

        return (
            <span className={`${colorClasses[estado.color] || colorClasses.green} px-2 py-1 rounded-full text-sm`}>
                {estado.nombre_estado}
            </span>
        )
    }

    const passwordValidation = modalType === "create"
        ? { required: "La contraseña es requerida", minLength: { value: 6, message: "Mínimo 6 caracteres" } }
        : { minLength: { value: 6, message: "Mínimo 6 caracteres" } }

    if (isLoading) {
        return (
            <LoadingSpinner />
        )
    }
    return (
        <div className={contentClasses}>
            <div className="flex justify-between items-center mb-6">
                <h1 className={`text-3xl font-bold mb-6 ${currentTheme.text}`}>Gestión de Usuarios</h1>
                <button
                    onClick={() => openModal('create')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                    <Plus size={20} />
                    <span>Nuevo Usuario</span>
                </button>
            </div>

            {/* Filtros y Búsqueda */}
            <div className={`${currentTheme.sidebar} rounded-lg shadow-sm ${currentTheme.border} border p-4 mb-6`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar usuarios..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`pl-10 pr-4 py-2 w-full rounded-lg ${currentTheme.input} ${currentTheme.border} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                    </div>

                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className={`px-4 py-2 rounded-lg ${currentTheme.input} ${currentTheme.border} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        <option value="todos">Todos los roles</option>
                        {allroles?.map(rol => (
                            <option key={rol.id_rol} value={rol.nombre_rol}>{rol.nombre_rol}</option>
                        ))}
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className={`px-4 py-2 rounded-lg ${currentTheme.input} ${currentTheme.border} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="activo">Activos</option>
                        <option value="inactivo">Inactivos</option>
                    </select>

                    <div className="flex justify-end">
                        <button
                            onClick={() => {
                                setSearchTerm('')
                                setFilterRole('todos')
                                setFilterStatus('todos')
                            }}
                            className={`px-4 py-2 rounded-lg ${currentTheme.hover} ${currentTheme.textSecondary} flex items-center space-x-2`}
                        >
                            <Filter size={16} />
                            <span>Limpiar</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabla de Usuarios */}
            <div className={`${currentTheme.sidebar} rounded-lg shadow-sm ${currentTheme.border} border`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`${currentTheme.border} border-b`}>
                                <th className="text-left p-4">Usuario</th>
                                <th className="text-left p-4">Correo</th>
                                <th className="text-left p-4">Rol</th>
                                <th className="text-left p-4">Estado</th>
                                <th className="text-left p-4">Registro</th>
                                <th className="text-left p-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-8">
                                        <div className="flex justify-center items-center space-x-2">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                            <span>Cargando...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-8">
                                        <div className="flex flex-col items-center space-y-2">
                                            <User size={48} className="text-gray-400" />
                                            <span className={currentTheme.textSecondary}>No se encontraron usuarios</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedUsers.map((user) => (
                                    <tr key={user.id_usuario} className={`${currentTheme.border} border-b ${currentTheme.hover}`}>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                                    {user.usuario.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium">{user.usuario}</span>
                                            </div>
                                        </td>

                                        <td className="p-4">{user.correo}</td>

                                        <td className="p-4">
                                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                                                {user.rol.nombre_rol}
                                            </span>
                                        </td>

                                        <td className="p-4">{getStatusBadge(user.estado, user.is_active)}</td>

                                        <td className="p-4 text-sm">{formatDate(user.registro)}</td>

                                        <td className="p-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openModal('view', user)}
                                                    className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                                    title="Ver detalles"
                                                >
                                                    <Eye size={16} />
                                                </button>

                                                <button
                                                    onClick={() => openModal('edit', user)}
                                                    className="text-green-600 hover:text-green-800 p-1 rounded"
                                                    title="Editar"
                                                >
                                                    <Edit size={16} />
                                                </button>

                                                <button
                                                    onClick={() => openModal('delete', user)}
                                                    className="text-red-600 hover:text-red-800 p-1 rounded"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {filteredUsers.length > 0 && (
                    <div className={`flex flex-col sm:flex-row justify-between items-center p-4 border-t ${currentTheme.border} gap-4`}>
                        <div className="flex items-center space-x-2">
                            <span className={`text-sm ${currentTheme.textSecondary}`}>
                                Mostrando {((currentPage - 1) * usersPerPage) + 1} a {Math.min(currentPage * usersPerPage, filteredUsers.length)} de {filteredUsers.length} usuarios
                            </span>
                            {totalPages > 0 && (
                                <span className={`text-sm ${currentTheme.textSecondary}`}>
                                    • Página {currentPage} de {totalPages}
                                </span>
                            )}
                        </div>

                        {/* Controles de paginación - Mostrar siempre que haya más de 1 página */}
                        <div className="flex items-center space-x-2">
                            {totalPages > 0 && (
                                <>
                                    {/* Botón Primera página */}
                                    <button
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                        className="px-2 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        title="Primera página"
                                    >
                                        ««
                                    </button>

                                    {/* Botón Anterior */}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        Anterior
                                    </button>

                                    {/* Números de página */}
                                    <div className="hidden sm:flex space-x-1">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }

                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={`px-3 py-1 rounded-md text-sm ${
                                                        pageNum === currentPage
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Botón Siguiente */}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        Siguiente
                                    </button>

                                    {/* Botón Última página */}
                                    <button
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="px-2 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        title="Última página"
                                    >
                                        »»
                                    </button>

                                    {/* Ir a página específica - Solo en desktop */}
                                    <div className="hidden lg:flex items-center space-x-2 ml-4">
                                        <span className={`text-sm ${currentTheme.textSecondary}`}>Ir a:</span>
                                        <input
                                            type="number"
                                            min="1"
                                            max={totalPages}
                                            value={currentPage}
                                            onChange={(e) => {
                                                const page = parseInt(e.target.value);
                                                if (page >= 1 && page <= totalPages) {
                                                    setCurrentPage(page);
                                                }
                                            }}
                                            className={`w-16 px-2 py-1 text-sm rounded-md ${currentTheme.input} border ${currentTheme.border}`}
                                        />
                                        <span className={`text-sm ${currentTheme.textSecondary}`}>de {totalPages}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`${currentTheme.modal} rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto`}>
                        {/* Header del Modal */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold">
                                {modalType === 'create' && 'Crear Usuario'}
                                {modalType === 'edit' && 'Editar Usuario'}
                                {modalType === 'delete' && 'Eliminar Usuario'}
                                {modalType === 'view' && 'Detalles del Usuario'}
                            </h3>

                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Contenido del Modal */}
                        <div className="p-6">
                            {modalType === 'view' && selectedUser && (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                                            {selectedUser.usuario.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg">{selectedUser.usuario}</h4>
                                            <p className={`${currentTheme.textSecondary} text-sm`}>{selectedUser.correo}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Rol</label>
                                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                                                {selectedUser.rol.nombre_rol}
                                            </span>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Estado</label>
                                            {getStatusBadge(selectedUser.estado, selectedUser.is_active)}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Registro</label>
                                            <p className={`${currentTheme.textSecondary} text-sm`}>
                                                {formatDate(selectedUser.registro)}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Última actualización</label>
                                            <p className={`${currentTheme.textSecondary} text-sm`}>
                                                {selectedUser.updated_at ? formatDate(selectedUser.updated_at) : 'Nunca'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalType === 'delete' && selectedUser && (
                                <div className="text-center">
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                        <AlertTriangle className="h-6 w-6 text-red-600" />
                                    </div>

                                    <h3 className="text-lg font-medium mb-2">¿Eliminar usuario?</h3>
                                    <p className={`${currentTheme.textSecondary} mb-6`}>
                                        Esta acción no se puede deshacer. El usuario "{selectedUser.usuario}" será eliminado permanentemente.
                                    </p>

                                    <div className="flex space-x-4 justify-center">
                                        <button
                                            onClick={closeModal}
                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            onClick={handleDelete}
                                            disabled={deletedUser.isLoading}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                        >
                                            {deletedUser.isLoading ? 'Eliminando...' : 'Eliminar'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {(modalType === 'create' || modalType === 'edit') && (
                                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                                    {/* Usuario */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Nombre de Usuario <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register("usuario", { required: "El nombre de usuario es requerido", minLength: { value: 3, message: "Mínimo 3 caracteres" } })}
                                            className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border ${errors.usuario ? 'border-red-500' : currentTheme.border}`}
                                            placeholder="Ingrese el nombre de usuario"
                                        />
                                        {errors.usuario && <p className="text-red-500 text-sm mt-1">{errors.usuario.message}</p>}
                                    </div>

                                    {/* Correo */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Correo Electrónico <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            {...register("correo", {
                                                required: "El correo es requerido",
                                                pattern: { value: /\S+@\S+\.\S+/, message: "Correo no válido" }
                                            })}
                                            className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border ${errors.correo ? 'border-red-500' : currentTheme.border}`}
                                            placeholder="usuario@email.com"
                                        />
                                        {errors.correo && <p className="text-red-500 text-sm mt-1">{errors.correo.message}</p>}
                                    </div>

                                    {/* Contraseña */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Contraseña {modalType === "create" && <span className="text-red-500">*</span>}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                {...register("contrasena", passwordValidation)}
                                                className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border ${errors.contrasena ? 'border-red-500' : currentTheme.border}`}
                                                placeholder="••••••••"
                                            />

                                            {/* Botón toggle */}
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                                            >
                                                {showPassword ? "🔓" : "🔒"}
                                            </button>
                                        </div>
                                        {errors.contrasena && <p className="text-red-500 text-sm mt-1">{errors.contrasena.message}</p>}
                                    </div>

                                    {/* Rol */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Rol</label>
                                        <select
                                            {...register("id_rol")}
                                            className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border`}
                                        >
                                            {allroles?.map(rol => (
                                                <option key={rol.id_rol} value={rol.id_rol}>{rol.nombre_rol}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Estado */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Estado</label>
                                        <select
                                            {...register("id_estado")}
                                            className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border`}
                                        >
                                            {allstates?.map(estado => (
                                                <option key={estado.id_estado} value={estado.id_estado}>{estado.nombre_estado}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {modalType === "edit" && (
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Activo</label>
                                            <select
                                                {...register("is_active")}
                                                className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border ${errors.is_active ? 'border-red-500' : currentTheme.border}`}
                                            >
                                                <option value={true}>Sí</option>
                                                <option value={false}>No</option>
                                            </select>
                                            {errors.is_active && (
                                                <p className="text-red-500 text-sm mt-1">{errors.is_active.message}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Botones */}
                                    <div className="flex space-x-4 pt-6">
                                        <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">Cancelar</button>
                                        <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
                                            <Check size={16} />
                                            <span>{modalType === "create" ? "Crear Usuario" : "Guardar Cambios"}</span>
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Usuarios
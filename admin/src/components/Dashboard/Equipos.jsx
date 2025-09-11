import { useState } from "react"
import { useThemeMode } from "../../contexts/ThemeContext"
import { useForm } from "react-hook-form"
import { useFunctions } from "../../hooks/useFunctions"
import { useLeagues } from "../../hooks/useLeagues"
import { useTeams } from "../../hooks/useTeams"
import {
    Plus, Edit, Trash2, Search, Filter, X, Eye, AlertTriangle, Check, Shield,
    MapPin, Image
} from 'lucide-react'
import LoadingSpinner from "../Loading/LoadingSpinner"
import { formatDate } from "../../utils/utils"
import { Alert, Snackbar } from "@mui/material"

const Equipos = () => {

    const { currentTheme } = useThemeMode()
    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState('')

    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    const [selectedTeam, setSelectedTeam] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterLeague, setFilterLeague] = useState('todos')
    const [filterStatus, setFilterStatus] = useState('todos')
    const [currentPage, setCurrentPage] = useState(1)
    const teamsPerPage = 10
    const contentClasses = `p-6 ${currentTheme.text}`

    const { allteams, isLoading, createTeam, updatedTeam, deletedTeam } = useTeams()
    console.log(allteams)
    const { allstates } = useFunctions()
    const { allleagues } = useLeagues()

    const filteredTeams = (allteams || []).filter(team => {
        const matchesSearch = team.nombre_equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.estadio.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesLeague = filterLeague === 'todos' || team.liga?.nombre_liga === filterLeague
        const matchesStatus = filterStatus === 'todos' || team.estado?.nombre_estado === filterStatus

        return matchesSearch && matchesLeague && matchesStatus
    })

    const totalPages = Math.ceil(filteredTeams.length / teamsPerPage) || 1
    const paginatedTeams = filteredTeams.slice(
        (currentPage - 1) * teamsPerPage,
        currentPage * teamsPerPage
    )

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    })

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false })
    }

    const handleFormSubmit = (data) => {
        // Convertir string IDs a números
        const formattedData = {
            ...data,
            id_estado: parseInt(data.id_estado),
            id_liga: parseInt(data.id_liga)
        }

        if (modalType === 'create') {
            createTeam.mutate(formattedData, {
                onSuccess: () => {
                    setSnackbar({
                        open: true,
                        message: "Equipo creado con éxito 🎉",
                        severity: "success",
                    })
                    closeModal()
                },
                onError: (error) => {
                    setSnackbar({
                        open: true,
                        message: error.message || "Error al crear el equipo",
                        severity: "error",
                    })
                }
            })
        } else if (modalType === 'edit') {
            updatedTeam.mutate({ id_equipo: selectedTeam.id_equipo, data: formattedData }, {
                onSuccess: () => {
                    setSnackbar({
                        open: true,
                        message: "Equipo actualizado con éxito 🎉",
                        severity: "success",
                    })
                    closeModal()
                },
                onError: (error) => {
                    setSnackbar({
                        open: true,
                        message: error.message || "Error al actualizar el equipo",
                        severity: "error",
                    })
                }
            })
        }
    }

    const openModal = (type, team = null) => {
        setModalType(type)
        setSelectedTeam(team)
        setShowModal(true)

        if (type === "create") {
            reset({
                nombre_equipo: "",
                estadio: "",
                logo: "",
                id_estado: 1,
                id_liga: 1,
            })
        } else if (type === "edit" && team) {
            reset({
                nombre_equipo: team.nombre_equipo,
                estadio: team.estadio,
                logo: team.logo,
                id_estado: team.id_estado,
                id_liga: team.id_liga,
            })
        }
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedTeam(null)
        setModalType('')

        reset({
            nombre_equipo: '',
            estadio: '',
            logo: '',
            id_estado: 1,
            id_liga: 1
        })
    }

    const handleDelete = () => {
        if (!selectedTeam) return
        deletedTeam.mutate(selectedTeam.id_equipo, {
            onSuccess: () => {
                setSnackbar({
                    open: true,
                    message: "Equipo eliminado con éxito 🎉",
                    severity: "success",
                })
                closeModal()
            },
            onError: (error) => {
                setSnackbar({
                    open: true,
                    message: error.message || "Error al eliminar el equipo",
                    severity: "error",
                })
            }
        })
    }

    const getStatusBadge = (estado) => {
        const colorClasses = {
            green: 'bg-green-100 text-green-800',
            red: 'bg-red-100 text-red-800',
            yellow: 'bg-yellow-100 text-yellow-800',
            blue: 'bg-blue-100 text-blue-800'
        }

        return (
            <span className={`${colorClasses[estado?.color] || colorClasses.green} px-2 py-1 rounded-full text-sm`}>
                {estado?.nombre_estado || 'Sin estado'}
            </span>
        )
    }

    if (isLoading) {
        return (
            <LoadingSpinner />
        )
    }

    return (
        <div className={contentClasses}>
            <div className="flex justify-between items-center mb-6">
                <h1 className={`text-3xl font-bold mb-6 ${currentTheme.text}`}>Gestión de Equipos</h1>
                <button
                    onClick={() => openModal('create')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                    <Plus size={20} />
                    <span>Nuevo Equipo</span>
                </button>
            </div>

            {/* Filtros y Búsqueda */}
            <div className={`${currentTheme.sidebar} rounded-lg shadow-sm ${currentTheme.border} border p-4 mb-6`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar equipos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`pl-10 pr-4 py-2 w-full rounded-lg ${currentTheme.input} ${currentTheme.border} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                    </div>

                    <select
                        value={filterLeague}
                        onChange={(e) => setFilterLeague(e.target.value)}
                        className={`px-4 py-2 rounded-lg ${currentTheme.input} ${currentTheme.border} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        <option value="todos">Todas las ligas</option>
                        {allleagues?.map(league => (
                            <option key={league.id_liga} value={league.nombre_liga}>{league.nombre_liga}</option>
                        ))}
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className={`px-4 py-2 rounded-lg ${currentTheme.input} ${currentTheme.border} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        <option value="todos">Todos los estados</option>
                        {allstates?.map(state => (
                            <option key={state.id_estado} value={state.nombre_estado}>{state.nombre_estado}</option>
                        ))}
                    </select>

                    <div className="flex justify-end">
                        <button
                            onClick={() => {
                                setSearchTerm('')
                                setFilterLeague('todos')
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

            {/* Tabla de Equipos */}
            <div className={`${currentTheme.sidebar} rounded-lg shadow-sm ${currentTheme.border} border`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`${currentTheme.border} border-b`}>
                                <th className="text-left p-4">ID</th>
                                <th className="text-left p-4">Equipo</th>
                                <th className="text-left p-4">Estadio</th>
                                <th className="text-left p-4">Liga</th>
                                <th className="text-left p-4">Estado</th>
                                <th className="text-left p-4">Creación</th>
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
                            ) : filteredTeams.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-8">
                                        <div className="flex flex-col items-center space-y-2">
                                            <Shield size={48} className="text-gray-400" />
                                            <span className={currentTheme.textSecondary}>No se encontraron equipos</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedTeams.map((team) => (
                                    <tr key={team.id_equipo} className={`${currentTheme.border} border-b ${currentTheme.hover}`}>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                                    {team.id_equipo}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                {team.logo ? (
                                                    <img
                                                        src={team.logo}
                                                        alt={team.nombre_equipo}
                                                        className="w-8 h-8 rounded fit-content"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none'
                                                            e.target.nextSibling.style.display = 'flex'
                                                        }}
                                                    />
                                                ) : null}
                                                <div
                                                    className={`w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded flex items-center justify-center text-white text-sm font-semibold ${team.logo ? 'hidden' : 'flex'}`}
                                                >
                                                    <Shield size={16} />
                                                </div>
                                                <span className="font-medium">{team.nombre_equipo}</span>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center space-x-2">
                                                <MapPin size={16} className="text-gray-400" />
                                                <span>{team.estadio}</span>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                                {team.liga?.nombre_liga || 'Sin liga'}
                                            </span>
                                        </td>

                                        <td className="p-4">{getStatusBadge(team.estado)}</td>

                                        <td className="p-4 text-sm">{formatDate(team.created_at)}</td>

                                        <td className="p-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openModal('view', team)}
                                                    className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                                    title="Ver detalles"
                                                >
                                                    <Eye size={16} />
                                                </button>

                                                <button
                                                    onClick={() => openModal('edit', team)}
                                                    className="text-green-600 hover:text-green-800 p-1 rounded"
                                                    title="Editar"
                                                >
                                                    <Edit size={16} />
                                                </button>

                                                <button
                                                    onClick={() => openModal('delete', team)}
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
                {filteredTeams.length > 0 && (
                    <div className={`flex flex-col sm:flex-row justify-between items-center p-4 border-t ${currentTheme.border} gap-4`}>
                        <div className="flex items-center space-x-2">
                            <span className={`text-sm ${currentTheme.textSecondary}`}>
                                Mostrando {((currentPage - 1) * teamsPerPage) + 1} a {Math.min(currentPage * teamsPerPage, filteredTeams.length)} de {filteredTeams.length} equipos
                            </span>
                            {totalPages > 0 && (
                                <span className={`text-sm ${currentTheme.textSecondary}`}>
                                    • Página {currentPage} de {totalPages}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            {totalPages > 1 && (
                                <>
                                    <button
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                        className="px-2 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        ««
                                    </button>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        Anterior
                                    </button>

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

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        Siguiente
                                    </button>

                                    <button
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="px-2 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        »»
                                    </button>
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
                                {modalType === 'create' && 'Crear Equipo'}
                                {modalType === 'edit' && 'Editar Equipo'}
                                {modalType === 'delete' && 'Eliminar Equipo'}
                                {modalType === 'view' && 'Detalles del Equipo'}
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
                            {modalType === 'view' && selectedTeam && (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                                            {selectedTeam.logo ? (
                                                <img
                                                    src={selectedTeam.logo}
                                                    alt={selectedTeam.nombre_equipo}
                                                    className="w-16 h-16 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <Shield size={24} className="text-white" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg">{selectedTeam.nombre_equipo}</h4>
                                            <p className={`${currentTheme.textSecondary} text-sm flex items-center space-x-1`}>
                                                <MapPin size={14} />
                                                <span>{selectedTeam.estadio}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Logo del Equipo</label>
                                            {selectedTeam.logo ? (
                                                <img
                                                    src={selectedTeam.logo}
                                                    alt={selectedTeam.nombre_equipo}
                                                    className="w-24 h-24 rounded-lg object-cover border"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center border">
                                                    <Image size={24} className="text-gray-400" />
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Liga</label>
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                                {selectedTeam.liga?.nombre_liga || 'Sin liga'}
                                            </span>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Estado</label>
                                            {getStatusBadge(selectedTeam.estado)}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Fecha de Creación</label>
                                            <p className={`${currentTheme.textSecondary} text-sm`}>
                                                {formatDate(selectedTeam.created_at)}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Última Actualización</label>
                                            <p className={`${currentTheme.textSecondary} text-sm`}>
                                                {selectedTeam.updated_at ? formatDate(selectedTeam.updated_at) : 'Nunca'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalType === 'delete' && selectedTeam && (
                                <div className="text-center">
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                        <AlertTriangle className="h-6 w-6 text-red-600" />
                                    </div>

                                    <h3 className="text-lg font-medium mb-2">¿Eliminar equipo?</h3>
                                    <p className={`${currentTheme.textSecondary} mb-6`}>
                                        Esta acción no se puede deshacer. El equipo "{selectedTeam.nombre_equipo}" será eliminado permanentemente.
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
                                            disabled={deletedTeam.isLoading}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                        >
                                            {deletedTeam.isLoading ? 'Eliminando...' : 'Eliminar'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {(modalType === 'create' || modalType === 'edit') && (
                                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                                    {/* Nombre del Equipo */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Nombre del Equipo <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register("nombre_equipo", {
                                                required: "El nombre del equipo es requerido",
                                                minLength: { value: 2, message: "Mínimo 2 caracteres" }
                                            })}
                                            className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border ${errors.nombre_equipo ? 'border-red-500' : currentTheme.border}`}
                                            placeholder="Ingrese el nombre del equipo"
                                        />
                                        {errors.nombre_equipo && <p className="text-red-500 text-sm mt-1">{errors.nombre_equipo.message}</p>}
                                    </div>

                                    {/* Estadio */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Estadio <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register("estadio", {
                                                required: "El estadio es requerido",
                                                minLength: { value: 2, message: "Mínimo 2 caracteres" }
                                            })}
                                            className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border ${errors.estadio ? 'border-red-500' : currentTheme.border}`}
                                            placeholder="Ingrese el nombre del estadio"
                                        />
                                        {errors.estadio && <p className="text-red-500 text-sm mt-1">{errors.estadio.message}</p>}
                                    </div>

                                    {/* URL Logo */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            URL Logo del Equipo
                                        </label>
                                        <input
                                            type="url"
                                            {...register("logo", {
                                                pattern: {
                                                    value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                                                    message: "URL no válida"
                                                }
                                            })}
                                            className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border ${errors.logo ? 'border-red-500' : currentTheme.border}`}
                                            placeholder="https://ejemplo.com/logo.jpg"
                                        />
                                        {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo.message}</p>}
                                    </div>

                                    {/* Estado */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Estado <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            {...register("id_estado", { required: "Debe seleccionar un estado" })}
                                            className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border ${errors.id_estado ? 'border-red-500' : currentTheme.border}`}
                                        >
                                            <option value="">Seleccione un estado</option>
                                            {allstates?.map(state => (
                                                <option key={state.id_estado} value={state.id_estado}>{state.nombre_estado}</option>
                                            ))}
                                        </select>
                                        {errors.id_estado && <p className="text-red-500 text-sm mt-1">{errors.id_estado.message}</p>}
                                    </div>

                                    {/* Liga */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Liga <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            {...register("id_liga", { required: "Debe seleccionar una liga" })}
                                            className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border ${errors.id_liga ? 'border-red-500' : currentTheme.border}`}
                                        >
                                            <option value="">Seleccione una liga</option>
                                            {allleagues?.map(league => (
                                                <option key={league.id_liga} value={league.id_liga}>{league.nombre_liga}</option>
                                            ))}
                                        </select>
                                        {errors.id_liga && <p className="text-red-500 text-sm mt-1">{errors.id_liga.message}</p>}
                                    </div>

                                    {/* Botones */}
                                    <div className="flex space-x-4 pt-6">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                                        >
                                            <Check size={16} />
                                            <span>{modalType === "create" ? "Crear Equipo" : "Guardar Cambios"}</span>
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

export default Equipos
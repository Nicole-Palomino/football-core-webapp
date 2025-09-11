import { useState } from 'react'
import { useThemeMode } from '../../contexts/ThemeContext'
import { useForm } from 'react-hook-form'
import { useSeason } from '../../hooks/useSeason'
import LoadingSpinner from '../Loading/LoadingSpinner'
import {
    Plus, Edit, Trash2, Search, Filter, X, Eye, AlertTriangle, Check, Calendar,
    Clock
} from 'lucide-react'
import { formatDate } from '../../utils/utils'
import { Alert, Snackbar } from '@mui/material'

const Temporada = () => {

    const { currentTheme } = useThemeMode()
    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState('')

    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    const [selectedSeason, setSelectedSeason] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const seasonsPerPage = 10
    const contentClasses = `p-6 ${currentTheme.text}`

    const { allseason, isLoading, createSeason, updatedSeason, deletedSeason } = useSeason()

    const filteredSeasons = (allseason || []).filter(season => {
        const matchesSearch = season.nombre_temporada.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch
    })

    const totalPages = Math.ceil(filteredSeasons.length / seasonsPerPage) || 1
    const paginatedSeasons = filteredSeasons.slice(
        (currentPage - 1) * seasonsPerPage,
        currentPage * seasonsPerPage
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
            createSeason.mutate(data, {
                onSuccess: () => {
                    setSnackbar({
                        open: true,
                        message: "Temporada creada con éxito 🎉",
                        severity: "success",
                    })
                    closeModal()
                },
                onError: (error) => {
                    setSnackbar({
                        open: true,
                        message: error.message || "Error al crear la temporada",
                        severity: "error",
                    })
                }
            })
        } else if (modalType === 'edit') {
            updatedSeason.mutate({ id_temporada: selectedSeason.id_temporada, data }, {
                onSuccess: () => {
                    setSnackbar({
                        open: true,
                        message: "Temporada actualizada con éxito 🎉",
                        severity: "success",
                    })
                    closeModal()
                },
                onError: (error) => {
                    setSnackbar({
                        open: true,
                        message: error.message || "Error al actualizar la temporada",
                        severity: "error",
                    })
                }
            })
        }
    }

    const openModal = (type, season = null) => {
        setModalType(type)
        setSelectedSeason(season)
        setShowModal(true)

        if (type === "create") {
            reset({
                nombre_temporada: "",
            })
        } else if (type === "edit" && season) {
            reset({
                nombre_temporada: season.nombre_temporada,
            })
        }
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedSeason(null)
        setModalType('')

        // Resetear valores del formulario
        reset({
            nombre_temporada: ''
        })
    }

    const handleDelete = () => {
        if (!selectedSeason) return
        deletedSeason.mutate(selectedSeason.id_temporada, {
            onSuccess: () => {
                setSnackbar({
                    open: true,
                    message: "Temporada eliminada con éxito 🎉",
                    severity: "success",
                })
                closeModal()
            },
            onError: (error) => {
                setSnackbar({
                    open: true,
                    message: error.message || "Error al eliminar la temporada",
                    severity: "error",
                })
            }
        })
    }

    if (isLoading) {
        return (
            <LoadingSpinner />
        )
    }

    return (
        <div className={contentClasses}>
            <div className="flex justify-between items-center mb-6">
                <h1 className={`text-3xl font-bold mb-6 ${currentTheme.text}`}>Gestión de Temporadas</h1>
                <button
                    onClick={() => openModal('create')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                    <Plus size={20} />
                    <span>Nueva Temporada</span>
                </button>
            </div>

            {/* Filtros y Búsqueda */}
            <div className={`${currentTheme.sidebar} rounded-lg shadow-sm ${currentTheme.border} border p-4 mb-6`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar temporadas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`pl-10 pr-4 py-2 w-full rounded-lg ${currentTheme.input} ${currentTheme.border} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={() => {
                                setSearchTerm('')
                            }}
                            className={`px-4 py-2 rounded-lg ${currentTheme.hover} ${currentTheme.textSecondary} flex items-center space-x-2`}
                        >
                            <Filter size={16} />
                            <span>Limpiar</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabla de Temporadas */}
            <div className={`${currentTheme.sidebar} rounded-lg shadow-sm ${currentTheme.border} border`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`${currentTheme.border} border-b`}>
                                <th className="text-left p-4">ID</th>
                                <th className="text-left p-4">Nombre de Temporada</th>
                                <th className="text-left p-4">Fecha de Creación</th>
                                <th className="text-left p-4">Última Actualización</th>
                                <th className="text-left p-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="text-center p-8">
                                        <div className="flex justify-center items-center space-x-2">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                            <span>Cargando...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredSeasons.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center p-8">
                                        <div className="flex flex-col items-center space-y-2">
                                            <Calendar size={48} className="text-gray-400" />
                                            <span className={currentTheme.textSecondary}>No se encontraron temporadas</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedSeasons.map((season) => (
                                    <tr key={season.id_temporada} className={`${currentTheme.border} border-b ${currentTheme.hover}`}>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                                    {season.id_temporada}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <Calendar size={20} className="text-blue-500" />
                                                <span className="font-medium">{season.nombre_temporada}</span>
                                            </div>
                                        </td>

                                        <td className="p-4 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <Clock size={16} className="text-gray-400" />
                                                <span>{formatDate(season.created_at)}</span>
                                            </div>
                                        </td>

                                        <td className="p-4 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <Clock size={16} className="text-gray-400" />
                                                <span>
                                                    {season.updated_at ? formatDate(season.updated_at) : 'Nunca'}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openModal('view', season)}
                                                    className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                                    title="Ver detalles"
                                                >
                                                    <Eye size={16} />
                                                </button>

                                                <button
                                                    onClick={() => openModal('edit', season)}
                                                    className="text-green-600 hover:text-green-800 p-1 rounded"
                                                    title="Editar"
                                                >
                                                    <Edit size={16} />
                                                </button>

                                                <button
                                                    onClick={() => openModal('delete', season)}
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
                {filteredSeasons.length > 0 && (
                    <div className={`flex flex-col sm:flex-row justify-between items-center p-4 border-t ${currentTheme.border} gap-4`}>
                        <div className="flex items-center space-x-2">
                            <span className={`text-sm ${currentTheme.textSecondary}`}>
                                Mostrando {((currentPage - 1) * seasonsPerPage) + 1} a {Math.min(currentPage * seasonsPerPage, filteredSeasons.length)} de {filteredSeasons.length} temporadas
                            </span>
                            {totalPages > 0 && (
                                <span className={`text-sm ${currentTheme.textSecondary}`}>
                                    • Página {currentPage} de {totalPages}
                                </span>
                            )}
                        </div>

                        {/* Controles de paginación - Mostrar siempre que haya más de 1 página */}
                        <div className="flex items-center space-x-2">
                            {totalPages > 1 && (
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
                                {modalType === 'create' && 'Crear Temporada'}
                                {modalType === 'edit' && 'Editar Temporada'}
                                {modalType === 'delete' && 'Eliminar Temporada'}
                                {modalType === 'view' && 'Detalles de la Temporada'}
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
                            {modalType === 'view' && selectedSeason && (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                            <Calendar size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg">{selectedSeason.nombre_temporada}</h4>
                                            <p className={`${currentTheme.textSecondary} text-sm flex items-center space-x-1`}>
                                                <span>ID: {selectedSeason.id_temporada}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">ID de Temporada</label>
                                            <p className={`${currentTheme.textSecondary} text-lg font-mono`}>
                                                {selectedSeason.id_temporada}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Nombre de Temporada</label>
                                            <p className={`${currentTheme.text} text-lg`}>
                                                {selectedSeason.nombre_temporada}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Fecha de Creación</label>
                                            <p className={`${currentTheme.textSecondary} text-sm flex items-center space-x-2`}>
                                                <Clock size={16} />
                                                <span>{formatDate(selectedSeason.created_at)}</span>
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Última Actualización</label>
                                            <p className={`${currentTheme.textSecondary} text-sm flex items-center space-x-2`}>
                                                <Clock size={16} />
                                                <span>
                                                    {selectedSeason.updated_at ? formatDate(selectedSeason.updated_at) : 'Nunca actualizada'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalType === 'delete' && selectedSeason && (
                                <div className="text-center">
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                        <AlertTriangle className="h-6 w-6 text-red-600" />
                                    </div>

                                    <h3 className="text-lg font-medium mb-2">¿Eliminar temporada?</h3>
                                    <p className={`${currentTheme.textSecondary} mb-6`}>
                                        Esta acción no se puede deshacer. La temporada "{selectedSeason.nombre_temporada}" será eliminada permanentemente.
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
                                            disabled={deletedSeason.isLoading}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                        >
                                            {deletedSeason.isLoading ? 'Eliminando...' : 'Eliminar'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {(modalType === 'create' || modalType === 'edit') && (
                                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                                    {/* Nombre de Temporada */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Nombre de la Temporada <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <input
                                                {...register("nombre_temporada", { 
                                                    required: "El nombre de la temporada es requerido", 
                                                    minLength: { value: 2, message: "Mínimo 2 caracteres" },
                                                    maxLength: { value: 50, message: "Máximo 50 caracteres" }
                                                })}
                                                className={`pl-10 pr-4 py-2 w-full rounded-lg ${currentTheme.input} border ${errors.nombre_temporada ? 'border-red-500' : currentTheme.border} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                placeholder="Ej: Temporada 2024, Liga Primavera 2025, etc."
                                            />
                                        </div>
                                        {errors.nombre_temporada && <p className="text-red-500 text-sm mt-1">{errors.nombre_temporada.message}</p>}
                                        <p className={`text-xs ${currentTheme.textSecondary} mt-1`}>
                                            Ingrese un nombre descriptivo para la temporada
                                        </p>
                                    </div>

                                    {/* Botones */}
                                    <div className="flex space-x-4 pt-6">
                                        <button 
                                            type="button" 
                                            onClick={closeModal} 
                                            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center justify-center space-x-2"
                                        >
                                            <X size={16} />
                                            <span>Cancelar</span>
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={createSeason.isLoading || updatedSeason.isLoading}
                                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                        >
                                            <Check size={16} />
                                            <span>
                                                {modalType === "create" 
                                                    ? (createSeason.isLoading ? 'Creando...' : 'Crear Temporada')
                                                    : (updatedSeason.isLoading ? 'Guardando...' : 'Guardar Cambios')
                                                }
                                            </span>
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

export default Temporada
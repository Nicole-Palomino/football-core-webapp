import { useState } from 'react'
import { useThemeMode } from '../../contexts/ThemeContext'
import { useForm } from 'react-hook-form'
import {
    Plus, Edit, Trash2, Search, Filter, X, Eye, AlertTriangle, Check, 
    FileText, Image, Award, Target, ExternalLink
} from 'lucide-react'
import { useSummaries } from '../../hooks/useSummary'
import { useMatches } from '../../hooks/useMatchStat'
import LoadingSpinner from '../Loading/LoadingSpinner'
import { formatDate } from '../../utils/utils'
import { Alert, Snackbar } from '@mui/material'

const Resumenes = () => {

    const { currentTheme } = useThemeMode()
    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState('')

    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    const [selectedResumen, setSelectedResumen] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterPartido, setFilterPartido] = useState('todos')
    const [currentPage, setCurrentPage] = useState(1)
    const resumenesPerPage = 10
    const contentClasses = `p-6 ${currentTheme.text}`

    const { 
        allsummary, 
        isLoading, 
        createSummary, 
        updatedSummary, 
        deletedSummary
    } = useSummaries()

    const { allmatches } = useMatches()

    const filteredResumenes = (allsummary || []).filter(resumen => {
        const matchesSearch = resumen.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesPartido = filterPartido === 'todos' || resumen.id_partido.toString() === filterPartido

        return matchesSearch && matchesPartido
    })

    const totalPages = Math.ceil(filteredResumenes.length / resumenesPerPage) || 1
    const paginatedResumenes = filteredResumenes.slice(
        (currentPage - 1) * resumenesPerPage,
        currentPage * resumenesPerPage
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
        if (modalType === 'create') {
            createSummary.mutate(data, {
                onSuccess: () => {
                    setSnackbar({
                        open: true,
                        message: "Resumen creado con éxito 🎉",
                        severity: "success",
                    })
                    closeModal()
                },
                onError: (error) => {
                    setSnackbar({
                        open: true,
                        message: error.message || "Error al crear el resumen",
                        severity: "error",
                    })
                }
            })
        } else if (modalType === 'edit') {
            updatedSummary.mutate({ id_resumen: selectedResumen.id_resumen, data }, {
                onSuccess: () => {
                    setSnackbar({
                        open: true,
                        message: "Resumen actualizado con éxito 🎉",
                        severity: "success",
                    })
                    closeModal()
                },
                onError: (error) => {
                    setSnackbar({
                        open: true,
                        message: error.message || "Error al actualizar el resumen",
                        severity: "error",
                    })
                }
            })
        }
    }

    const openModal = (type, resumen = null) => {
        setModalType(type)
        setSelectedResumen(resumen)
        setShowModal(true)

        if (type === "create") {
            reset({
                nombre: "",
                url_imagen: "",
                url_mvp: "",
                url_shotmap: "",
                id_partido: allpartidos?.[0]?.id_partido || 1
            })
        } else if (type === "edit" && resumen) {
            reset({
                nombre: resumen.nombre,
                url_imagen: resumen.url_imagen,
                url_mvp: resumen.url_mvp,
                url_shotmap: resumen.url_shotmap,
                id_partido: resumen.id_partido
            })
        }
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedResumen(null)
        setModalType('')
        reset()
    }

    const handleDelete = () => {
        if (!selectedResumen) return
        deletedSummary.mutate(selectedResumen.id_resumen, {
            onSuccess: () => {
                setSnackbar({
                    open: true,
                    message: "Resumen eliminado con éxito 🎉",
                    severity: "success",
                })
                closeModal()
            },
            onError: (error) => {
                setSnackbar({
                    open: true,
                    message: error.message || "Error al eliminar el resumen",
                    severity: "error",
                })
            }
        })
    }

    const getPartidoInfo = (id_partido) => {
        const partido = allmatches?.find(p => p.id_partido === id_partido)
        if (!partido) return "Partido no encontrado"
        
        return `${partido.equipo_local?.nombre_equipo || 'Local'} vs ${partido.equipo_visita?.nombre_equipo || 'Visitante'}`
    }

    const isValidUrl = (url) => {
        if (!url) return false
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    }

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className={contentClasses}>
            <div className="flex justify-between items-center mb-6">
                <h1 className={`text-3xl font-bold mb-6 ${currentTheme.text}`}>Gestión de Resúmenes</h1>
                <button
                    onClick={() => openModal('create')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                    <Plus size={20} />
                    <span>Nuevo Resumen</span>
                </button>
            </div>

            {/* Filtros y Búsqueda */}
            <div className={`${currentTheme.sidebar} rounded-lg shadow-sm ${currentTheme.border} border p-4 mb-6`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar resúmenes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`pl-10 pr-4 py-2 w-full rounded-lg ${currentTheme.input} ${currentTheme.border} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                    </div>

                    <select
                        value={filterPartido}
                        onChange={(e) => setFilterPartido(e.target.value)}
                        className={`px-4 py-2 rounded-lg ${currentTheme.input} ${currentTheme.border} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        <option value="todos">Todos los partidos</option>
                        {allmatches?.map(partido => (
                            <option key={partido.id_partido} value={partido.id_partido}>
                                {`${partido.equipo_local?.nombre_equipo || 'Local'} vs ${partido.equipo_visita?.nombre_equipo || 'Visitante'}`}
                            </option>
                        ))}
                    </select>

                    <div className="flex justify-end">
                        <button
                            onClick={() => {
                                setSearchTerm('')
                                setFilterPartido('todos')
                            }}
                            className={`px-4 py-2 rounded-lg ${currentTheme.hover} ${currentTheme.textSecondary} flex items-center space-x-2`}
                        >
                            <Filter size={16} />
                            <span>Limpiar</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabla de Resúmenes */}
            <div className={`${currentTheme.sidebar} rounded-lg shadow-sm ${currentTheme.border} border`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`${currentTheme.border} border-b`}>
                                <th className="text-left p-4">Nombre</th>
                                <th className="text-left p-4">Partido</th>
                                <th className="text-left p-4">Recursos</th>
                                <th className="text-left p-4">Creado</th>
                                <th className="text-left p-4">Actualizado</th>
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
                            ) : filteredResumenes.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-8">
                                        <div className="flex flex-col items-center space-y-2">
                                            <FileText size={48} className="text-gray-400" />
                                            <span className={currentTheme.textSecondary}>No se encontraron resúmenes</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedResumenes.map((resumen) => (
                                    <tr key={resumen.id_resumen} className={`${currentTheme.border} border-b ${currentTheme.hover}`}>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                                    <FileText size={16} />
                                                </div>
                                                <div>
                                                    <span className="font-medium">{resumen.nombre}</span>
                                                    {resumen.url_imagen && isValidUrl(resumen.url_imagen) && (
                                                        <div className="mt-1">
                                                            <img 
                                                                src={resumen.url_imagen} 
                                                                alt={resumen.nombre}
                                                                className="w-16 h-12 object-cover rounded border"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none'
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <span className="text-sm">{getPartidoInfo(resumen.id_partido)}</span>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex space-x-2">
                                                {resumen.url_imagen && isValidUrl(resumen.url_imagen) && (
                                                    <div className="flex items-center space-x-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                        <Image size={12} />
                                                        <span>Imagen</span>
                                                    </div>
                                                )}
                                                {resumen.url_mvp && isValidUrl(resumen.url_mvp) && (
                                                    <div className="flex items-center space-x-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                                        <Award size={12} />
                                                        <span>MVP</span>
                                                    </div>
                                                )}
                                                {resumen.url_shotmap && isValidUrl(resumen.url_shotmap) && (
                                                    <div className="flex items-center space-x-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                                        <Target size={12} />
                                                        <span>Shotmap</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        <td className="p-4 text-sm">{formatDate(resumen.created_at)}</td>

                                        <td className="p-4 text-sm">
                                            {resumen.updated_at ? formatDate(resumen.updated_at) : 'Nunca'}
                                        </td>

                                        <td className="p-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openModal('view', resumen)}
                                                    className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                                    title="Ver detalles"
                                                >
                                                    <Eye size={16} />
                                                </button>

                                                <button
                                                    onClick={() => openModal('edit', resumen)}
                                                    className="text-green-600 hover:text-green-800 p-1 rounded"
                                                    title="Editar"
                                                >
                                                    <Edit size={16} />
                                                </button>

                                                <button
                                                    onClick={() => openModal('delete', resumen)}
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
                {filteredResumenes.length > 0 && (
                    <div className={`flex flex-col sm:flex-row justify-between items-center p-4 border-t ${currentTheme.border} gap-4`}>
                        <div className="flex items-center space-x-2">
                            <span className={`text-sm ${currentTheme.textSecondary}`}>
                                Mostrando {((currentPage - 1) * resumenesPerPage) + 1} a {Math.min(currentPage * resumenesPerPage, filteredResumenes.length)} de {filteredResumenes.length} resúmenes
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
                    <div className={`${currentTheme.modal} rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
                        {/* Header del Modal */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold">
                                {modalType === 'create' && 'Crear Resumen'}
                                {modalType === 'edit' && 'Editar Resumen'}
                                {modalType === 'delete' && 'Eliminar Resumen'}
                                {modalType === 'view' && 'Detalles del Resumen'}
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
                            {modalType === 'view' && selectedResumen && (
                                <div className="space-y-6">
                                    {/* Información básica */}
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold mx-auto mb-4">
                                            <FileText size={32} />
                                        </div>
                                        <h4 className="text-xl font-semibold mb-2">{selectedResumen.nombre}</h4>
                                        <p className="text-gray-600">{getPartidoInfo(selectedResumen.id_partido)}</p>
                                    </div>

                                    {/* Imagen principal */}
                                    {selectedResumen.url_imagen && isValidUrl(selectedResumen.url_imagen) && (
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Imagen del Resumen</label>
                                            <div className="border rounded-lg p-4 bg-gray-50">
                                                <img 
                                                    src={selectedResumen.url_imagen} 
                                                    alt={selectedResumen.nombre}
                                                    className="w-full max-h-64 object-contain rounded"
                                                    onError={(e) => {
                                                        e.target.src = '/placeholder-image.png'
                                                    }}
                                                />
                                                <div className="mt-2 text-center">
                                                    <a 
                                                        href={selectedResumen.url_imagen} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        <ExternalLink size={14} className="mr-1" />
                                                        Ver imagen completa
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Enlaces de recursos */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* MVP */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">MVP del Partido</label>
                                            {selectedResumen.url_mvp && isValidUrl(selectedResumen.url_mvp) ? (
                                                <a 
                                                    href={selectedResumen.url_mvp} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 hover:bg-yellow-100 transition-colors"
                                                >
                                                    <Award size={20} />
                                                    <span>Ver MVP</span>
                                                    <ExternalLink size={14} />
                                                </a>
                                            ) : (
                                                <div className="p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500">
                                                    <span>No disponible</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Shotmap */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Mapa de Disparos</label>
                                            {selectedResumen.url_shotmap && isValidUrl(selectedResumen.url_shotmap) ? (
                                                <a 
                                                    href={selectedResumen.url_shotmap} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center space-x-2 p-3 bg-purple-50 border border-purple-200 rounded-lg text-purple-800 hover:bg-purple-100 transition-colors"
                                                >
                                                    <Target size={20} />
                                                    <span>Ver Shotmap</span>
                                                    <ExternalLink size={14} />
                                                </a>
                                            ) : (
                                                <div className="p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500">
                                                    <span>No disponible</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Fechas */}
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Creado</label>
                                            <p className={`${currentTheme.textSecondary}`}>
                                                {formatDate(selectedResumen.created_at)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Última actualización</label>
                                            <p className={`${currentTheme.textSecondary}`}>
                                                {selectedResumen.updated_at ? formatDate(selectedResumen.updated_at) : 'Nunca'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalType === 'delete' && selectedResumen && (
                                <div className="text-center">
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                        <AlertTriangle className="h-6 w-6 text-red-600" />
                                    </div>

                                    <h3 className="text-lg font-medium mb-2">¿Eliminar resumen?</h3>
                                    <p className={`${currentTheme.textSecondary} mb-6`}>
                                        Esta acción no se puede deshacer. El resumen "{selectedResumen.nombre}" será eliminado permanentemente.
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
                                            disabled={deletedSummary.isLoading}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                        >
                                            {deletedSummary.isLoading ? 'Eliminando...' : 'Eliminar'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {(modalType === 'create' || modalType === 'edit') && (
                                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                                    {/* Nombre */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Nombre del Resumen <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register("nombre", { 
                                                required: "El nombre es requerido", 
                                                minLength: { value: 3, message: "Mínimo 3 caracteres" } 
                                            })}
                                            className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border ${errors.nombre ? 'border-red-500' : currentTheme.border}`}
                                            placeholder="Ej: Resumen Arsenal vs Chelsea"
                                        />
                                        {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>}
                                    </div>

                                    {/* URL Imagen */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            URL de la Imagen
                                        </label>
                                        <input
                                            type="url"
                                            {...register("url_imagen", {
                                                pattern: {
                                                    value: /^https?:\/\/.+/,
                                                    message: "Debe ser una URL válida (http:// o https://)"
                                                }
                                            })}
                                            className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border ${errors.url_imagen ? 'border-red-500' : currentTheme.border}`}
                                            placeholder="https://ejemplo.com/imagen.jpg"
                                        />
                                        {errors.url_imagen && <p className="text-red-500 text-sm mt-1">{errors.url_imagen.message}</p>}
                                    </div>

                                    {/* URL MVP */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            URL del MVP
                                        </label>
                                        <input
                                            type="url"
                                            {...register("url_mvp", {
                                                pattern: {
                                                    value: /^https?:\/\/.+/,
                                                    message: "Debe ser una URL válida (http:// o https://)"
                                                }
                                            })}
                                            className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border ${errors.url_mvp ? 'border-red-500' : currentTheme.border}`}
                                            placeholder="https://ejemplo.com/mvp.jpg"
                                        />
                                        {errors.url_mvp && <p className="text-red-500 text-sm mt-1">{errors.url_mvp.message}</p>}
                                    </div>

                                    {/* URL Shotmap */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            URL del Shotmap
                                        </label>
                                        <input
                                            type="url"
                                            {...register("url_shotmap", {
                                                pattern: {
                                                    value: /^https?:\/\/.+/,
                                                    message: "Debe ser una URL válida (http:// o https://)"
                                                }
                                            })}
                                            className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border ${errors.url_shotmap ? 'border-red-500' : currentTheme.border}`}
                                            placeholder="https://ejemplo.com/shotmap.jpg"
                                        />
                                        {errors.url_shotmap && <p className="text-red-500 text-sm mt-1">{errors.url_shotmap.message}</p>}
                                    </div>

                                    {/* Partido */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Partido <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            {...register("id_partido", { required: "Debe seleccionar un partido" })}
                                            className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border ${errors.id_partido ? 'border-red-500' : currentTheme.border}`}
                                        >
                                            {allmatches?.map(partido => (
                                                <option key={partido.id_partido} value={partido.id_partido}>
                                                    {`${partido.equipo_local?.nombre_equipo || 'Local'} vs ${partido.equipo_visita?.nombre_equipo || 'Visitante'} - ${partido.dia}`}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.id_partido && <p className="text-red-500 text-sm mt-1">{errors.id_partido.message}</p>}
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
                                            disabled={modalType === 'create' ? createSummary.isLoading : updatedSummary.isLoading}
                                        >
                                            <Check size={16} />
                                            <span>{modalType === "create" ? "Crear Resumen" : "Guardar Cambios"}</span>
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

export default Resumenes
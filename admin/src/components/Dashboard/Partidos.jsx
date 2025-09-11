import {
    Plus, Edit, Trash2, Search, Filter, X, Eye, AlertTriangle, Check, 
    Calendar, Clock, BarChart3
} from 'lucide-react'
import { useThemeMode } from '../../contexts/ThemeContext'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMatches } from '../../hooks/useMatchStat'
import { useFunctions } from '../../hooks/useFunctions'
import { useLeagues } from '../../hooks/useLeagues'
import { useSeason } from '../../hooks/useSeason'
import LoadingSpinner from '../Loading/LoadingSpinner'
import { formatDate, formatOnlyDate, formatTime } from '../../utils/utils'
import { Alert, Snackbar } from '@mui/material'

const Partidos = () => {
    const { currentTheme } = useThemeMode()
    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState('')

    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    const [selectedPartido, setSelectedPartido] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterLiga, setFilterLiga] = useState('todos')
    const [filterEstado, setFilterEstado] = useState('todos')
    const [currentPage, setCurrentPage] = useState(1)
    const partidosPerPage = 10
    const contentClasses = `p-6 ${currentTheme.text}`

    const { 
        allmatches, 
        isLoading, 
        createMatch, 
        updatedMatch, 
        deletedMatch,
        createStat,
        updatedStat 
    } = useMatches()
    
    const { 
        allstates, 
        activeteams,
    } = useFunctions()

    const {
        allleagues
    } = useLeagues()

    const {
        allseason
    } = useSeason()

    const filteredPartidos = (allmatches || []).filter(partido => {
        const matchesSearch = partido.equipo_local.nombre_equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            partido.equipo_visita.nombre_equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            partido.liga.nombre_liga.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesLiga = filterLiga === 'todos' || partido.liga.nombre_liga === filterLiga
        const matchesEstado = filterEstado === 'todos' || partido.estado.nombre_estado === filterEstado

        return matchesSearch && matchesLiga && matchesEstado
    })

    const totalPages = Math.ceil(filteredPartidos.length / partidosPerPage) || 1
    const paginatedPartidos = filteredPartidos.slice(
        (currentPage - 1) * partidosPerPage,
        currentPage * partidosPerPage
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
            createMatch.mutate(data, {
                onSuccess: () => {
                    setSnackbar({
                        open: true,
                        message: "Partido creado con éxito 🎉",
                        severity: "success",
                    })
                    closeModal()
                },
                onError: (error) => {
                    setSnackbar({
                        open: true,
                        message: error.message || "Error al crear el partido",
                        severity: "error",
                    })
                }
            })
        } else if (modalType === 'edit') {
            updatedMatch.mutate({ id_partido: selectedPartido.id_partido, data }, {
                onSuccess: () => {
                    setSnackbar({
                        open: true,
                        message: "Partido actualizado con éxito 🎉",
                        severity: "success",
                    })
                    closeModal()
                },
                onError: (error) => {
                    setSnackbar({
                        open: true,
                        message: error.message || "Error al actualizar el partido",
                        severity: "error",
                    })
                }
            })
        } else if (modalType === 'estadisticas-create') {
            createStat.mutate(data, {
                onSuccess: () => {
                    setSnackbar({
                        open: true,
                        message: "Estadísticas agregadas con éxito 🎉",
                        severity: "success",
                    })
                    closeModal()
                },
                onError: (error) => {
                    setSnackbar({
                        open: true,
                        message: error.message || "Error al agregar estadísticas",
                        severity: "error",
                    })
                }
            })
        } else if (modalType === 'estadisticas-edit') {
            updatedStat.mutate({ id_partido: selectedPartido.id_partido, data }, {
                onSuccess: () => {
                    setSnackbar({
                        open: true,
                        message: "Estadísticas actualizadas con éxito 🎉",
                        severity: "success",
                    })
                    closeModal()
                },
                onError: (error) => {
                    setSnackbar({
                        open: true,
                        message: error.message || "Error al actualizar estadísticas",
                        severity: "error",
                    })
                }
            })
        }
    }

    const openModal = (type, partido = null) => {
        setModalType(type)
        setSelectedPartido(partido)
        setShowModal(true)

        if (type === "create") {
            reset({
                id_liga: 1,
                id_temporada: 1,
                dia: new Date().toISOString().split('T')[0],
                hora: new Date().toTimeString().split(' ')[0],
                id_equipo_local: 1,
                id_equipo_visita: 2,
                enlace_threesixfive: "",
                enlace_datafactory: "",
                id_estado: 5
            })
        } else if (type === "edit" && partido) {
            reset({
                id_liga: partido.liga.id_liga,
                id_temporada: partido.temporada.id_temporada,
                dia: new Date(partido.dia).toISOString().split('T')[0],
                hora: partido.hora,
                id_equipo_local: partido.equipo_local.id_equipo,
                id_equipo_visita: partido.equipo_visita.id_equipo,
                enlace_threesixfive: partido.enlace_threesixfive || "",
                enlace_datafactory: partido.enlace_datafactory || "",
                id_estado: partido.estado.id_estado
            })
        } else if (type === "estadisticas-create" && partido) {
            reset({
                id_partido: partido.id_partido,
                FTHG: 0,
                FTAG: 0,
                FTR: "D",
                HTHG: 0,
                HTAG: 0,
                HTR: "D",
                HS: 0,
                AS: 0,
                HST: 0,
                AST: 0,
                HF: 0,
                AF: 0,
                HC: 0,
                AC: 0,
                HY: 0,
                AY: 0,
                HR: 0,
                AR: 0
            })
        } else if (type === "estadisticas-edit" && partido && partido.estadisticas) {
            reset({
                id_partido: partido.id_partido,
                FTHG: partido.estadisticas.FTHG || 0,
                FTAG: partido.estadisticas.FTAG || 0,
                FTR: partido.estadisticas.FTR || "D",
                HTHG: partido.estadisticas.HTHG || 0,
                HTAG: partido.estadisticas.HTAG || 0,
                HTR: partido.estadisticas.HTR || "D",
                HS: partido.estadisticas.HS || 0,
                AS: partido.estadisticas.AS_ || 0,
                HST: partido.estadisticas.HST || 0,
                AST: partido.estadisticas.AST || 0,
                HF: partido.estadisticas.HF || 0,
                AF: partido.estadisticas.AF || 0,
                HC: partido.estadisticas.HC || 0,
                AC: partido.estadisticas.AC || 0,
                HY: partido.estadisticas.HY || 0,
                AY: partido.estadisticas.AY || 0,
                HR: partido.estadisticas.HR || 0,
                AR: partido.estadisticas.AR || 0
            })
        }
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedPartido(null)
        setModalType('')
        reset()
    }

    const handleDelete = () => {
        if (!selectedPartido) return
        deletedMatch.mutate(selectedPartido.id_partido, {
            onSuccess: () => {
                setSnackbar({
                    open: true,
                    message: "Partido eliminado con éxito 🎉",
                    severity: "success",
                })
                closeModal()
            },
            onError: (error) => {
                setSnackbar({
                    open: true,
                    message: error.message || "Error al eliminar el partido",
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
            <span className={`${colorClasses[estado.color] || colorClasses.blue} px-2 py-1 rounded-full text-sm`}>
                {estado.nombre_estado}
            </span>
        )
    }

    const hasEstadisticas = (partido) => {
        return partido.estadisticas && partido.estadisticas.id_estadistica
    }

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className={contentClasses}>
            <div className="flex justify-between items-center mb-6">
                <h1 className={`text-3xl font-bold mb-6 ${currentTheme.text}`}>Gestión de Partidos</h1>
                <button
                    onClick={() => openModal('create')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                    <Plus size={20} />
                    <span>Nuevo Partido</span>
                </button>
            </div>

            {/* Filtros y Búsqueda */}
            <div className={`${currentTheme.sidebar} rounded-lg shadow-sm ${currentTheme.border} border p-4 mb-6`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar partidos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`pl-10 pr-4 py-2 w-full rounded-lg ${currentTheme.input} ${currentTheme.border} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                    </div>

                    <select
                        value={filterLiga}
                        onChange={(e) => setFilterLiga(e.target.value)}
                        className={`px-4 py-2 rounded-lg ${currentTheme.input} ${currentTheme.border} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        <option value="todos">Todas las ligas</option>
                        {allleagues?.map(liga => (
                            <option key={liga.id_liga} value={liga.nombre_liga}>{liga.nombre_liga}</option>
                        ))}
                    </select>

                    <select
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                        className={`px-4 py-2 rounded-lg ${currentTheme.input} ${currentTheme.border} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        <option value="todos">Todos los estados</option>
                        {allstates?.map(estado => (
                            <option key={estado.id_estado} value={estado.nombre_estado}>{estado.nombre_estado}</option>
                        ))}
                    </select>

                    <div className="flex justify-end">
                        <button
                            onClick={() => {
                                setSearchTerm('')
                                setFilterLiga('todos')
                                setFilterEstado('todos')
                            }}
                            className={`px-4 py-2 rounded-lg ${currentTheme.hover} ${currentTheme.textSecondary} flex items-center space-x-2`}
                        >
                            <Filter size={16} />
                            <span>Limpiar</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabla de Partidos */}
            <div className={`${currentTheme.sidebar} rounded-lg shadow-sm ${currentTheme.border} border`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`${currentTheme.border} border-b`}>
                                <th className="text-left p-4">Equipos</th>
                                <th className="text-left p-4">Liga</th>
                                <th className="text-left p-4">Fecha/Hora</th>
                                <th className="text-left p-4">Estado</th>
                                <th className="text-left p-4">Estadísticas</th>
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
                            ) : filteredPartidos.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-8">
                                        <div className="flex flex-col items-center space-y-2">
                                            {/* <Stadium size={48} className="text-gray-400" /> */}
                                            <span className={currentTheme.textSecondary}>No se encontraron partidos</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedPartidos.map((partido) => (
                                    <tr key={partido.id_partido} className={`${currentTheme.border} border-b ${currentTheme.hover}`}>
                                        <td className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    {partido.equipo_local.logo && (
                                                        <img 
                                                            src={partido.equipo_local.logo} 
                                                            alt={partido.equipo_local.nombre_equipo}
                                                            className="w-6 h-6"
                                                        />
                                                    )}
                                                    <span className="font-medium">{partido.equipo_local.nombre_equipo}</span>
                                                </div>
                                                <span className="mx-2 text-gray-500">vs</span>
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-medium">{partido.equipo_visita.nombre_equipo}</span>
                                                    {partido.equipo_visita.logo && (
                                                        <img 
                                                            src={partido.equipo_visita.logo} 
                                                            alt={partido.equipo_visita.nombre_equipo}
                                                            className="w-6 h-6"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center space-x-2">
                                                {partido.liga.imagen_pais && (
                                                    <img 
                                                        src={partido.liga.imagen_pais} 
                                                        alt="País"
                                                        className="w-4 h-4"
                                                    />
                                                )}
                                                <span className="text-sm">{partido.liga.nombre_liga}</span>
                                            </div>
                                            <span className="text-xs text-gray-500">{partido.temporada.nombre_temporada}</span>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar size={14} className="text-gray-400" />
                                                    <span className="text-sm">{partido.dia}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Clock size={14} className="text-gray-400" />
                                                    <span className="text-sm">{formatTime(partido.hora)}</span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4">{getStatusBadge(partido.estado)}</td>

                                        <td className="p-4">
                                            {hasEstadisticas(partido) ? (
                                                <div className="text-sm">
                                                    <span className="font-semibold">
                                                        {partido.estadisticas.FTHG} - {partido.estadisticas.FTAG}
                                                    </span>
                                                    <div className="text-xs text-gray-500">
                                                        HT: {partido.estadisticas.HTHG} - {partido.estadisticas.HTAG}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm">Sin estadísticas</span>
                                            )}
                                        </td>

                                        <td className="p-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openModal('view', partido)}
                                                    className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                                    title="Ver detalles"
                                                >
                                                    <Eye size={16} />
                                                </button>

                                                <button
                                                    onClick={() => openModal('edit', partido)}
                                                    className="text-green-600 hover:text-green-800 p-1 rounded"
                                                    title="Editar"
                                                >
                                                    <Edit size={16} />
                                                </button>

                                                <button
                                                    onClick={() => openModal(hasEstadisticas(partido) ? 'estadisticas-edit' : 'estadisticas-create', partido)}
                                                    className="text-purple-600 hover:text-purple-800 p-1 rounded"
                                                    title={hasEstadisticas(partido) ? "Editar estadísticas" : "Agregar estadísticas"}
                                                >
                                                    <BarChart3 size={16} />
                                                </button>

                                                <button
                                                    onClick={() => openModal('delete', partido)}
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
                {filteredPartidos.length > 0 && (
                    <div className={`flex flex-col sm:flex-row justify-between items-center p-4 border-t ${currentTheme.border} gap-4`}>
                        <div className="flex items-center space-x-2">
                            <span className={`text-sm ${currentTheme.textSecondary}`}>
                                Mostrando {((currentPage - 1) * partidosPerPage) + 1} a {Math.min(currentPage * partidosPerPage, filteredPartidos.length)} de {filteredPartidos.length} partidos
                            </span>
                            {totalPages > 0 && (
                                <span className={`text-sm ${currentTheme.textSecondary}`}>
                                    • Página {currentPage} de {totalPages}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            {totalPages > 0 && (
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
                    <div className={`${currentTheme.modal} rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto`}>
                        {/* Header del Modal */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold">
                                {modalType === 'create' && 'Crear Partido'}
                                {modalType === 'edit' && 'Editar Partido'}
                                {modalType === 'delete' && 'Eliminar Partido'}
                                {modalType === 'view' && 'Detalles del Partido'}
                                {modalType === 'estadisticas-create' && 'Agregar Estadísticas'}
                                {modalType === 'estadisticas-edit' && 'Editar Estadísticas'}
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
                            {modalType === 'view' && selectedPartido && (
                                <div className="space-y-6">
                                    {/* Información del partido */}
                                    <div className="text-center">
                                        <div className="flex items-center justify-center space-x-8 mb-4">
                                            <div className="text-center">
                                                {selectedPartido.equipo_local.logo && (
                                                    <img 
                                                        src={selectedPartido.equipo_local.logo} 
                                                        alt={selectedPartido.equipo_local.nombre_equipo}
                                                        className="w-16 h-16 mx-auto mb-2"
                                                    />
                                                )}
                                                <h4 className="font-semibold">{selectedPartido.equipo_local.nombre_equipo}</h4>
                                                <p className="text-sm text-gray-500">{selectedPartido.equipo_local.estadio}</p>
                                            </div>
                                            <div className="text-4xl font-bold text-gray-400">VS</div>
                                            <div className="text-center">
                                                {selectedPartido.equipo_visita.logo && (
                                                    <img 
                                                        src={selectedPartido.equipo_visita.logo} 
                                                        alt={selectedPartido.equipo_visita.nombre_equipo}
                                                        className="w-16 h-16 mx-auto mb-2"
                                                    />
                                                )}
                                                <h4 className="font-semibold">{selectedPartido.equipo_visita.nombre_equipo}</h4>
                                                <p className="text-sm text-gray-500">{selectedPartido.equipo_visita.estadio}</p>
                                            </div>
                                        </div>

                                        {hasEstadisticas(selectedPartido) && (
                                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                                {selectedPartido.estadisticas.FTHG} - {selectedPartido.estadisticas.FTAG}
                                            </div>
                                        )}
                                    </div>

                                    {/* Información adicional */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Liga</label>
                                            <p>{selectedPartido.liga.nombre_liga}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Temporada</label>
                                            <p>{selectedPartido.temporada.nombre_temporada}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Fecha</label>
                                            <p>{selectedPartido.dia}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Hora</label>
                                            <p>{formatTime(selectedPartido.hora)}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Estado</label>
                                            {getStatusBadge(selectedPartido.estado)}
                                        </div>
                                    </div>

                                    {/* Enlaces */}
                                    {(selectedPartido.enlace_threesixfive || selectedPartido.enlace_datafactory) && (
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Enlaces</label>
                                            <div className="space-y-2">
                                                {selectedPartido.enlace_threesixfive && (
                                                    <div>
                                                        <span className="text-sm font-medium">365Scores: </span>
                                                        <a href={selectedPartido.enlace_threesixfive} target="_blank" rel="noopener noreferrer" 
                                                           className="text-blue-600 hover:underline text-sm">
                                                            {selectedPartido.enlace_threesixfive}
                                                        </a>
                                                    </div>
                                                )}
                                                {selectedPartido.enlace_datafactory && (
                                                    <div>
                                                        <span className="text-sm font-medium">DataFactory: </span>
                                                        <a href={selectedPartido.enlace_datafactory} target="_blank" rel="noopener noreferrer" 
                                                           className="text-blue-600 hover:underline text-sm">
                                                            {selectedPartido.enlace_datafactory}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Estadísticas detalladas */}
                                    {hasEstadisticas(selectedPartido) && (
                                        <div>
                                            <h5 className="font-semibold mb-3">Estadísticas del Partido</h5>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                    <div className="font-semibold text-lg">{selectedPartido.estadisticas.FTHG} - {selectedPartido.estadisticas.FTAG}</div>
                                                    <div className="text-gray-600">Tiempo Completo</div>
                                                </div>
                                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                    <div className="font-semibold text-lg">{selectedPartido.estadisticas.HTHG} - {selectedPartido.estadisticas.HTAG}</div>
                                                    <div className="text-gray-600">Medio Tiempo</div>
                                                </div>
                                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                    <div className="font-semibold text-lg">{selectedPartido.estadisticas.HS} - {selectedPartido.estadisticas.AS_}</div>
                                                    <div className="text-gray-600">Disparos</div>
                                                </div>
                                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                    <div className="font-semibold text-lg">{selectedPartido.estadisticas.HST} - {selectedPartido.estadisticas.AST}</div>
                                                    <div className="text-gray-600">Disparos al Arco</div>
                                                </div>
                                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                    <div className="font-semibold text-lg">{selectedPartido.estadisticas.HF} - {selectedPartido.estadisticas.AF}</div>
                                                    <div className="text-gray-600">Faltas</div>
                                                </div>
                                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                    <div className="font-semibold text-lg">{selectedPartido.estadisticas.HC} - {selectedPartido.estadisticas.AC}</div>
                                                    <div className="text-gray-600">Corners</div>
                                                </div>
                                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                    <div className="font-semibold text-lg">{selectedPartido.estadisticas.HY} - {selectedPartido.estadisticas.AY}</div>
                                                    <div className="text-gray-600">Tarjetas Amarillas</div>
                                                </div>
                                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                    <div className="font-semibold text-lg">{selectedPartido.estadisticas.HR} - {selectedPartido.estadisticas.AR}</div>
                                                    <div className="text-gray-600">Tarjetas Rojas</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {modalType === 'delete' && selectedPartido && (
                                <div className="text-center">
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                        <AlertTriangle className="h-6 w-6 text-red-600" />
                                    </div>

                                    <h3 className="text-lg font-medium mb-2">¿Eliminar partido?</h3>
                                    <p className={`${currentTheme.textSecondary} mb-6`}>
                                        Esta acción no se puede deshacer. El partido entre "{selectedPartido.equipo_local.nombre_equipo}" y "{selectedPartido.equipo_visita.nombre_equipo}" será eliminado permanentemente.
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
                                            disabled={deletedMatch.isLoading}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                        >
                                            {deletedMatch.isLoading ? 'Eliminando...' : 'Eliminar'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {(modalType === 'create' || modalType === 'edit') && (
                                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Liga */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Liga <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                {...register("id_liga", { required: "La liga es requerida" })}
                                                className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border ${errors.id_liga ? 'border-red-500' : currentTheme.border}`}
                                            >
                                                {allleagues?.map(liga => (
                                                    <option key={liga.id_liga} value={liga.id_liga}>{liga.nombre_liga}</option>
                                                ))}
                                            </select>
                                            {errors.id_liga && <p className="text-red-500 text-sm mt-1">{errors.id_liga.message}</p>}
                                        </div>

                                        {/* Temporada */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Temporada <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                {...register("id_temporada", { required: "La temporada es requerida" })}
                                                className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border ${errors.id_temporada ? 'border-red-500' : currentTheme.border}`}
                                            >
                                                {allseason?.map(temporada => (
                                                    <option key={temporada.id_temporada} value={temporada.id_temporada}>{temporada.nombre_temporada}</option>
                                                ))}
                                            </select>
                                            {errors.id_temporada && <p className="text-red-500 text-sm mt-1">{errors.id_temporada.message}</p>}
                                        </div>

                                        {/* Fecha */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Fecha <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                {...register("dia", { required: "La fecha es requerida" })}
                                                className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border ${errors.dia ? 'border-red-500' : currentTheme.border}`}
                                            />
                                            {errors.dia && <p className="text-red-500 text-sm mt-1">{errors.dia.message}</p>}
                                        </div>

                                        {/* Hora */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Hora <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="time"
                                                {...register("hora", { required: "La hora es requerida" })}
                                                className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border ${errors.hora ? 'border-red-500' : currentTheme.border}`}
                                            />
                                            {errors.hora && <p className="text-red-500 text-sm mt-1">{errors.hora.message}</p>}
                                        </div>

                                        {/* Equipo Local */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Equipo Local <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                {...register("id_equipo_local", { required: "El equipo local es requerido" })}
                                                className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border ${errors.id_equipo_local ? 'border-red-500' : currentTheme.border}`}
                                            >
                                                {activeteams?.map(equipo => (
                                                    <option key={equipo.id_equipo} value={equipo.id_equipo}>{equipo.nombre_equipo}</option>
                                                ))}
                                            </select>
                                            {errors.id_equipo_local && <p className="text-red-500 text-sm mt-1">{errors.id_equipo_local.message}</p>}
                                        </div>

                                        {/* Equipo Visitante */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Equipo Visitante <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                {...register("id_equipo_visita", { required: "El equipo visitante es requerido" })}
                                                className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border ${errors.id_equipo_visita ? 'border-red-500' : currentTheme.border}`}
                                            >
                                                {activeteams?.map(equipo => (
                                                    <option key={equipo.id_equipo} value={equipo.id_equipo}>{equipo.nombre_equipo}</option>
                                                ))}
                                            </select>
                                            {errors.id_equipo_visita && <p className="text-red-500 text-sm mt-1">{errors.id_equipo_visita.message}</p>}
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
                                    </div>

                                    {/* Enlaces */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Enlace 365Scores</label>
                                            <input
                                                type="url"
                                                {...register("enlace_threesixfive")}
                                                className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border ${currentTheme.border}`}
                                                placeholder="https://..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Enlace DataFactory</label>
                                            <input
                                                type="url"
                                                {...register("enlace_datafactory")}
                                                className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border ${currentTheme.border}`}
                                                placeholder="https://..."
                                            />
                                        </div>
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
                                            <span>{modalType === "create" ? "Crear Partido" : "Guardar Cambios"}</span>
                                        </button>
                                    </div>
                                </form>
                            )}

                            {(modalType === 'estadisticas-create' || modalType === 'estadisticas-edit') && (
                                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                                    <div className="text-center mb-4">
                                        <h4 className="text-lg font-semibold">
                                            {selectedPartido.equipo_local.nombre_equipo} vs {selectedPartido.equipo_visita.nombre_equipo}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            {selectedPartido.dia} - {formatTime(selectedPartido.hora)}
                                        </p>
                                    </div>

                                    {/* Resultados */}
                                    <div>
                                        <h5 className="font-semibold mb-3">Resultados</h5>
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Tiempo Completo */}
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium mb-2 text-center">Tiempo Completo</label>
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex-1">
                                                        <label className="block text-xs text-gray-500 mb-1">{selectedPartido.equipo_local.nombre_equipo}</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            {...register("FTHG", { required: "Requerido", min: 0 })}
                                                            className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border text-center`}
                                                        />
                                                    </div>
                                                    <span className="text-2xl font-bold">-</span>
                                                    <div className="flex-1">
                                                        <label className="block text-xs text-gray-500 mb-1">{selectedPartido.equipo_visita.nombre_equipo}</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            {...register("FTAG", { required: "Requerido", min: 0 })}
                                                            className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border text-center`}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-xs text-gray-500 mb-1">Resultado</label>
                                                        <select
                                                            {...register("FTR")}
                                                            className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border`}
                                                        >
                                                            <option value="H">Local</option>
                                                            <option value="D">Empate</option>
                                                            <option value="A">Visitante</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Medio Tiempo */}
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium mb-2 text-center">Medio Tiempo</label>
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex-1">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            {...register("HTHG", { required: "Requerido", min: 0 })}
                                                            className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border text-center`}
                                                        />
                                                    </div>
                                                    <span className="text-2xl font-bold">-</span>
                                                    <div className="flex-1">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            {...register("HTAG", { required: "Requerido", min: 0 })}
                                                            className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border text-center`}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <select
                                                            {...register("HTR")}
                                                            className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border`}
                                                        >
                                                            <option value="H">Local</option>
                                                            <option value="D">Empate</option>
                                                            <option value="A">Visitante</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Estadísticas detalladas */}
                                    <div>
                                        <h5 className="font-semibold mb-3">Estadísticas del Partido</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Disparos */}
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Disparos</label>
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        {...register("HS", { min: 0 })}
                                                        className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border text-center`}
                                                        placeholder="Local"
                                                    />
                                                    <span>-</span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        {...register("AS", { min: 0 })}
                                                        className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border text-center`}
                                                        placeholder="Visitante"
                                                    />
                                                </div>
                                            </div>

                                            {/* Disparos al arco */}
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Disparos al Arco</label>
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        {...register("HST", { min: 0 })}
                                                        className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border text-center`}
                                                        placeholder="Local"
                                                    />
                                                    <span>-</span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        {...register("AST", { min: 0 })}
                                                        className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border text-center`}
                                                        placeholder="Visitante"
                                                    />
                                                </div>
                                            </div>

                                            {/* Faltas */}
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Faltas</label>
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        {...register("HF", { min: 0 })}
                                                        className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border text-center`}
                                                        placeholder="Local"
                                                    />
                                                    <span>-</span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        {...register("AF", { min: 0 })}
                                                        className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border text-center`}
                                                        placeholder="Visitante"
                                                    />
                                                </div>
                                            </div>

                                            {/* Corners */}
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Corners</label>
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        {...register("HC", { min: 0 })}
                                                        className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border text-center`}
                                                        placeholder="Local"
                                                    />
                                                    <span>-</span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        {...register("AC", { min: 0 })}
                                                        className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border text-center`}
                                                        placeholder="Visitante"
                                                    />
                                                </div>
                                            </div>

                                            {/* Tarjetas Amarillas */}
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Tarjetas Amarillas</label>
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        {...register("HY", { min: 0 })}
                                                        className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border text-center`}
                                                        placeholder="Local"
                                                    />
                                                    <span>-</span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        {...register("AY", { min: 0 })}
                                                        className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border text-center`}
                                                        placeholder="Visitante"
                                                    />
                                                </div>
                                            </div>

                                            {/* Tarjetas Rojas */}
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Tarjetas Rojas</label>
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        {...register("HR", { min: 0 })}
                                                        className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border text-center`}
                                                        placeholder="Local"
                                                    />
                                                    <span>-</span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        {...register("AR", { min: 0 })}
                                                        className={`w-full px-3 py-2 rounded-lg ${currentTheme.input} border text-center`}
                                                        placeholder="Visitante"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Campo oculto para ID del partido */}
                                    <input type="hidden" {...register("id_partido")} />

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
                                            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-2"
                                            disabled={modalType === 'estadisticas-create' ? createEstadistica.isLoading : updatedStat.isLoading}
                                        >
                                            <BarChart3 size={16} />
                                            <span>
                                                {modalType === 'estadisticas-create' ? 'Agregar Estadísticas' : 'Actualizar Estadísticas'}
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

export default Partidos
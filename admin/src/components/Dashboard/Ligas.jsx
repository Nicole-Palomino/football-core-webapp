import { useState } from 'react'
import { useThemeMode } from '../../contexts/ThemeContext'
import {
    Plus, Edit, Trash2, Search, Filter, X, Eye, AlertTriangle, Check, Trophy,
    Globe, Image
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useLeagues } from '../../hooks/useLeagues'
import LoadingSpinner from '../Loading/LoadingSpinner'
import { formatDate } from '../../utils/utils'

const Ligas = () => {

    const { currentTheme } = useThemeMode()
    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState('')

    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    const [selectedLeague, setSelectedLeague] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterCountry, setFilterCountry] = useState('todos')
    const [currentPage, setCurrentPage] = useState(1)
    const leaguesPerPage = 10
    const contentClasses = `p-6 ${currentTheme.text}`

    const { allleagues, isLoading, createLeague, updateLeague, deleteLeague } = useLeagues()

    const filteredLeagues = (allleagues || []).filter(league => {
        const matchesSearch = league.nombre_liga.toLowerCase().includes(searchTerm.toLowerCase()) ||
            league.pais.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch
    })

    const totalPages = Math.ceil(filteredLeagues.length / leaguesPerPage) || 1
    const paginatedLeagues = filteredLeagues.slice(
        (currentPage - 1) * leaguesPerPage,
        currentPage * leaguesPerPage
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
            createLeague.mutate(data, {
                onSuccess: () => {
                    setSnackbar({
                        open: true,
                        message: "Liga creada con éxito 🎉",
                        severity: "success",
                    })
                    closeModal()
                },
                onError: (error) => {
                    setSnackbar({
                        open: true,
                        message: error.message || "Error al crear la liga",
                        severity: "error",
                    })
                }
            })
        } else if (modalType === 'edit') {
            updateLeague.mutate({ id_liga: selectedLeague.id_liga, data }, {
                onSuccess: () => {
                    setSnackbar({
                        open: true,
                        message: "Liga actualizada con éxito 🎉",
                        severity: "success",
                    })
                    closeModal()
                },
                onError: (error) => {
                    setSnackbar({
                        open: true,
                        message: error.message || "Error al actualizar la liga",
                        severity: "error",
                    })
                }
            })
        }
    }

    const openModal = (type, league = null) => {
        setModalType(type)
        setSelectedLeague(league)
        setShowModal(true)

        if (type === "create") {
            reset({
                nombre_liga: "",
                pais: "",
                imagen_liga: "",
                imagen_pais: "",
            })
        } else if (type === "edit" && league) {
            reset({
                nombre_liga: league.nombre_liga,
                pais: league.pais,
                imagen_liga: league.imagen_liga,
                imagen_pais: league.imagen_pais,
            })
        }
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedLeague(null)
        setModalType('')

        // Resetear valores del formulario
        reset({
            nombre_liga: '',
            pais: '',
            imagen_liga: '',
            imagen_pais: ''
        })
    }

    const handleDelete = () => {
        if (!selectedLeague) return
        deleteLeague.mutate(selectedLeague.id_liga, {
            onSuccess: () => {
                setSnackbar({
                    open: true,
                    message: "Liga eliminada con éxito 🎉",
                    severity: "success",
                })
                closeModal()
            },
            onError: (error) => {
                setSnackbar({
                    open: true,
                    message: error.message || "Error al eliminar la liga",
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
                <h1 className={`text-3xl font-bold mb-6 ${currentTheme.text}`}>Gestión de Ligas</h1>
                <button
                    onClick={() => openModal('create')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                    <Plus size={20} />
                    <span>Nueva Liga</span>
                </button>
            </div>

            {/* Filtros y Búsqueda */}
            <div className={`${currentTheme.sidebar} rounded-lg shadow-sm ${currentTheme.border} border p-4 mb-6`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar ligas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`pl-10 pr-4 py-2 w-full rounded-lg ${currentTheme.input} ${currentTheme.border} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={() => {
                                setSearchTerm('')
                                setCurrentPage(1)
                            }}
                            className={`px-4 py-2 rounded-lg ${currentTheme.hover} ${currentTheme.textSecondary} flex items-center space-x-2`}
                        >
                            <Filter size={16} />
                            <span>Limpiar</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabla de Ligas */}
            <div className={`${currentTheme.sidebar} rounded-lg shadow-sm ${currentTheme.border} border`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`${currentTheme.border} border-b`}>
                                <th className="text-left p-4">Liga</th>
                                <th className="text-left p-4">País</th>
                                <th className="text-left p-4">Imagen Liga</th>
                                <th className="text-left p-4">Imagen País</th>
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
                            ) : filteredLeagues.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-8">
                                        <div className="flex flex-col items-center space-y-2">
                                            <Trophy size={48} className="text-gray-400" />
                                            <span className={currentTheme.textSecondary}>No se encontraron ligas</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedLeagues.map((league) => (
                                    <tr key={league.id_liga} className={`${currentTheme.border} border-b ${currentTheme.hover}`}>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <span className="font-medium">{league.nombre_liga}</span>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center space-x-2">
                                                {league.imagen_pais ? (
                                                    <img 
                                                        src={league.imagen_pais} 
                                                        alt={league.pais}
                                                        className="w-6 h-6 rounded object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none'
                                                            e.target.nextSibling.style.display = 'inline'
                                                        }}
                                                    />
                                                ) : null}
                                                <Globe size={16} className={`text-gray-400 ${league.imagen_pais ? 'hidden' : 'inline'}`} />
                                                <span>{league.pais}</span>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            {league.imagen_liga ? (
                                                <img 
                                                    src={league.imagen_liga} 
                                                    alt={league.nombre_liga}
                                                    className="w-12 h-12 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                                    <Image size={16} className="text-gray-400" />
                                                </div>
                                            )}
                                        </td>

                                        <td className="p-4">
                                            {league.imagen_pais ? (
                                                <img 
                                                    src={league.imagen_pais} 
                                                    alt={league.pais}
                                                    className="w-12 h-8 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                                                    <Globe size={16} className="text-gray-400" />
                                                </div>
                                            )}
                                        </td>

                                        <td className="p-4 text-sm">{formatDate(league.created_at)}</td>

                                        <td className="p-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openModal('view', league)}
                                                    className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                                    title="Ver detalles"
                                                >
                                                    <Eye size={16} />
                                                </button>

                                                <button
                                                    onClick={() => openModal('edit', league)}
                                                    className="text-green-600 hover:text-green-800 p-1 rounded"
                                                    title="Editar"
                                                >
                                                    <Edit size={16} />
                                                </button>

                                                <button
                                                    onClick={() => openModal('delete', league)}
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
                {filteredLeagues.length > 0 && (
                    <div className={`flex flex-col sm:flex-row justify-between items-center p-4 border-t ${currentTheme.border} gap-4`}>
                        <div className="flex items-center space-x-2">
                            <span className={`text-sm ${currentTheme.textSecondary}`}>
                                Mostrando {((currentPage - 1) * leaguesPerPage) + 1} a {Math.min(currentPage * leaguesPerPage, filteredLeagues.length)} de {filteredLeagues.length} ligas
                            </span>
                            {totalPages > 0 && (
                                <span className={`text-sm ${currentTheme.textSecondary}`}>
                                    • Página {currentPage} de {totalPages}
                                </span>
                            )}
                        </div>

                        {/* Controles de paginación */}
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
                                {modalType === 'create' && 'Crear Liga'}
                                {modalType === 'edit' && 'Editar Liga'}
                                {modalType === 'delete' && 'Eliminar Liga'}
                                {modalType === 'view' && 'Detalles de la Liga'}
                            </h3>

                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Ligas
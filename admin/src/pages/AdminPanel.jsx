import { useState } from 'react'
import {
    LayoutDashboard, Users, Users2, Trophy, Settings, Shield, FileText, LogOut, Sun, Moon,
    Menu, X, ChevronDown, BarChart3, UserCheck, Calendar, Activity
} from 'lucide-react'
import { lightTheme, darkTheme } from '../utils/themes'
import { menuItems } from '../utils/items'
import { useAuth } from '../contexts/AuthContexts'
import Dashboard from '../components/Dashboard/Dashboard'

const AdminPanel = () => {

    const [activeTab, setActiveTab] = useState('dashboard')
    const [darkMode, setDarkMode] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const { user, logout } = useAuth()

    const currentTheme = darkMode ? darkTheme : lightTheme

    const getInitials = (name) => {
        if (!name) return ''
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
    }

    const renderContent = () => {
        const contentClasses = `p-6 ${currentTheme.text}`

        switch (activeTab) {
            case 'dashboard':
                return ( <Dashboard /> )
            case 'usuarios':
                return (
                    <div className={contentClasses}>
                        <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>
                        <div className={`${currentTheme.sidebar} rounded-lg shadow-sm ${currentTheme.border} border`}>
                            <div className="p-6">
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-4">
                                    Nuevo Usuario
                                </button>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className={`${currentTheme.border} border-b`}>
                                                <th className="text-left p-3">Nombre</th>
                                                <th className="text-left p-3">Email</th>
                                                <th className="text-left p-3">Rol</th>
                                                <th className="text-left p-3">Estado</th>
                                                <th className="text-left p-3">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className={`${currentTheme.border} border-b ${currentTheme.hover}`}>
                                                <td className="p-3">Juan Pérez</td>
                                                <td className="p-3">juan@email.com</td>
                                                <td className="p-3">Administrador</td>
                                                <td className="p-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">Activo</span></td>
                                                <td className="p-3">
                                                    <button className="text-blue-600 hover:underline mr-2">Editar</button>
                                                    <button className="text-red-600 hover:underline">Eliminar</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 'equipos':
                return (
                    <div className={contentClasses}>
                        <h1 className="text-3xl font-bold mb-6">Gestión de Equipos</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className={`${currentTheme.sidebar} p-6 rounded-lg shadow-sm ${currentTheme.border} border`}>
                                <h3 className="font-semibold mb-2">Equipo Alpha</h3>
                                <p className={`${currentTheme.textSecondary} text-sm mb-4`}>15 miembros</p>
                                <div className="flex space-x-2">
                                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Ver</button>
                                    <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700">Editar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 'partidos':
                return (
                    <div className={contentClasses}>
                        <h1 className="text-3xl font-bold mb-6">Gestión de Partidos</h1>
                        <div className={`${currentTheme.sidebar} p-6 rounded-lg shadow-sm ${currentTheme.border} border`}>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Próximos Partidos</h2>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                    Programar Partido
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className={`p-4 ${currentTheme.border} border rounded-lg`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-semibold">Equipo A vs Equipo B</h3>
                                            <p className={`${currentTheme.textSecondary} text-sm`}>Hoy, 15:00 - Estadio Central</p>
                                        </div>
                                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">Programado</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 'estados':
                return (
                    <div className={contentClasses}>
                        <h1 className="text-3xl font-bold mb-6">Estados del Sistema</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={`${currentTheme.sidebar} p-6 rounded-lg shadow-sm ${currentTheme.border} border`}>
                                <h3 className="font-semibold mb-4">Estado del Servidor</h3>
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span>Operacional</span>
                                </div>
                                <p className={`${currentTheme.textSecondary} text-sm`}>Última actualización: hace 2 minutos</p>
                            </div>
                            <div className={`${currentTheme.sidebar} p-6 rounded-lg shadow-sm ${currentTheme.border} border`}>
                                <h3 className="font-semibold mb-4">Base de Datos</h3>
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span>Conectada</span>
                                </div>
                                <p className={`${currentTheme.textSecondary} text-sm`}>Tiempo de respuesta: 45ms</p>
                            </div>
                        </div>
                    </div>
                )
            case 'roles':
                return (
                    <div className={contentClasses}>
                        <h1 className="text-3xl font-bold mb-6">Gestión de Roles</h1>
                        <div className={`${currentTheme.sidebar} p-6 rounded-lg shadow-sm ${currentTheme.border} border`}>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-4">
                                Crear Rol
                            </button>
                            <div className="space-y-4">
                                <div className={`p-4 ${currentTheme.border} border rounded-lg`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-semibold">Administrador</h3>
                                            <p className={`${currentTheme.textSecondary} text-sm`}>Acceso completo al sistema</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:underline">Editar</button>
                                            <button className="text-red-600 hover:underline">Eliminar</button>
                                        </div>
                                    </div>
                                </div>
                                <div className={`p-4 ${currentTheme.border} border rounded-lg`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-semibold">Usuario</h3>
                                            <p className={`${currentTheme.textSecondary} text-sm`}>Acceso limitado</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:underline">Editar</button>
                                            <button className="text-red-600 hover:underline">Eliminar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 'resumenes':
                return (
                    <div className={contentClasses}>
                        <h1 className="text-3xl font-bold mb-6">Resúmenes y Reportes</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className={`${currentTheme.sidebar} p-6 rounded-lg shadow-sm ${currentTheme.border} border`}>
                                <FileText className="h-8 w-8 text-blue-500 mb-3" />
                                <h3 className="font-semibold mb-2">Reporte Mensual</h3>
                                <p className={`${currentTheme.textSecondary} text-sm mb-4`}>Estadísticas del último mes</p>
                                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                                    Generar
                                </button>
                            </div>
                            <div className={`${currentTheme.sidebar} p-6 rounded-lg shadow-sm ${currentTheme.border} border`}>
                                <BarChart3 className="h-8 w-8 text-green-500 mb-3" />
                                <h3 className="font-semibold mb-2">Análisis de Usuarios</h3>
                                <p className={`${currentTheme.textSecondary} text-sm mb-4`}>Comportamiento y métricas</p>
                                <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                                    Ver Reporte
                                </button>
                            </div>
                        </div>
                    </div>
                )
            default:
                return (
                    <div className={contentClasses}>
                        <h1 className="text-3xl font-bold">Bienvenido</h1>
                        <p className={currentTheme.textSecondary}>Selecciona una opción del menú</p>
                    </div>
                )
        }
    }

    return (
        <div className={`min-h-screen ${currentTheme.bg}`}>
            {/* Mobile Header */}
            <div className={`lg:hidden ${currentTheme.sidebar} ${currentTheme.border} border-b p-4 flex justify-between items-center`}>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className={`${currentTheme.text}`}
                >
                    {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <h1 className={`font-bold ${currentTheme.text}`}>Admin Panel</h1>
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`p-2 rounded-lg ${currentTheme.hover} ${currentTheme.text}`}
                >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 ${currentTheme.sidebar} ${currentTheme.border} border-r transition-transform duration-300 ease-in-out flex flex-col`}>

                    {/* Logo/Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className={`text-xl font-bold ${currentTheme.text}`}>Panel</h2>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive
                                        ? currentTheme.active
                                        : `${currentTheme.text} ${currentTheme.hover}`
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* User Section */}
                    <div className={`p-4 ${currentTheme.border} border-t`}>
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg ${currentTheme.hover} ${currentTheme.text}`}
                            >
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                    {getInitials(user?.nombre || user?.correo || 'U')}
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="font-medium">
                                        {user?.nombre}
                                    </p>
                                    <p className={`text-sm ${currentTheme.textSecondary}`}>
                                        {user?.roles?.join(', ') || 'Sin rol'}
                                    </p>
                                </div>
                                <ChevronDown size={16} className={userMenuOpen ? 'transform rotate-180' : ''} />
                            </button>

                            {userMenuOpen && (
                                <div className={`absolute bottom-full left-0 right-0 mb-2 ${currentTheme.sidebar} ${currentTheme.border} border rounded-lg shadow-lg`}>
                                    <button className={`w-full flex items-center space-x-3 px-3 py-2 rounded-t-lg ${currentTheme.hover} ${currentTheme.text}`}>
                                        <Settings size={16} />
                                        <span>Configuración</span>
                                    </button>
                                    <button 
                                        onClick={logout}
                                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-b-lg ${currentTheme.hover} text-red-600`}>
                                        <LogOut size={16} />
                                        <span>Cerrar Sesión</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Theme Toggle - Hidden on mobile (shown in header) */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`hidden lg:flex w-full items-center space-x-3 px-3 py-2 mt-2 rounded-lg ${currentTheme.hover} ${currentTheme.text}`}
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                            <span>{darkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
                        </button>
                    </div>
                </div>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <div className="flex-1 lg:ml-0">
                    {renderContent()}
                </div>
            </div>
        </div>
    )
}

export default AdminPanel
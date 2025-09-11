import { useState } from 'react'
import {
    Settings, LogOut, Sun, Moon, Menu, X, ChevronDown,
} from 'lucide-react'
import { menuItems } from '../utils/items'
import { useAuth } from '../contexts/AuthContexts'
import Dashboard from '../components/Dashboard/Dashboard'
import Usuarios from '../components/Dashboard/Usuarios'
import { useThemeMode } from '../contexts/ThemeContext'
import Estados from '../components/Dashboard/Estados'
import Roles from '../components/Dashboard/Roles'
import { getInitials } from '../utils/utils'
import Ligas from '../components/Dashboard/Ligas'
import Temporada from '../components/Dashboard/Temporada'
import Equipos from '../components/Dashboard/Equipos'
import Partidos from '../components/Dashboard/Partidos'
import Resumenes from '../components/Dashboard/Resumenes'

const AdminPanel = () => {

    const [activeTab, setActiveTab] = useState('dashboard')
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const { user, logout } = useAuth()
    
    const { currentTheme, setDarkMode, darkMode } = useThemeMode()

    const renderContent = () => {
        const contentClasses = `p-6 ${currentTheme.text}`

        switch (activeTab) {
            case 'dashboard':
                return ( <Dashboard /> )
            case 'usuarios':
                return ( <Usuarios /> )
            case 'ligas':
                return ( <Ligas /> )
            case 'temporadas':
                return ( <Temporada /> )
            case 'equipos':
                return ( <Equipos /> )
            case 'partidos':
                return ( <Partidos /> )
            case 'estados':
                return ( <Estados /> )
            case 'roles':
                return ( <Roles /> )
            case 'resumenes':
                return ( <Resumenes /> )
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

            <div className="min-h-screen flex">
                {/* Sidebar */}
                <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 ${currentTheme.sidebar} ${currentTheme.border} border-r transition-transform duration-300 ease-in-out flex flex-col h-screen overflow-y-auto`}>
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
                                    {/* <button className={`w-full flex items-center space-x-3 px-3 py-2 rounded-t-lg ${currentTheme.hover} ${currentTheme.text}`}>
                                        <Settings size={16} />
                                        <span>Configuración</span>
                                    </button> */}
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
                <div className="flex-1 h-screen overflow-y-auto lg:ml-0">
                    {renderContent()}
                </div>
            </div>
        </div>
    )
}

export default AdminPanel
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline"
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import { motion, AnimatePresence } from "framer-motion"
import { settings } from '../../utils/navbarUtils'
import { useAuth } from '../../contexts/AuthContexts'
import ThemeToggleButton from '../Buttons/ThemeToggleButton'
import { useThemeMode } from '../../contexts/ThemeContext'
import Swal from 'sweetalert2'

const NavbarUsers = () => {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const userMenuRef = useRef(null)

    // datos de usuario
    const { user, logout } = useAuth()
    const firstLetter = user?.nombre?.charAt(0).toUpperCase() || "F"
    const correo = user?.correo || ""
    const { currentTheme } = useThemeMode()
    const navigate = useNavigate()

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const iconMap = {
        "Perfil": <AccountCircleIcon sx={{ color: "blue" }} />,
        // "Configuración": <SettingsIcon sx={{ color: "blue" }} />
    }

    // cerrar sesión
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

    const navLinks = [
        { to: '/dashboard/favorites', label: 'FAVORITOS' },
        { to: '/dashboard/analysis', label: 'ANÁLISIS' },
        { to: '/dashboard/forecasts', label: 'PREDICCIÓN' },
    ]

    return (
        <header className={`shadow-md ${currentTheme.background} sticky top-0 z-50`}>
            <nav className={`mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 border-b ${currentTheme.border} backdrop-blur-md`}>
                {/* Logo */}
                <div className="flex flex-1">
                    <Link to="/dashboard" className="flex items-center space-x-2 group">
                        <motion.h1
                            whileHover={{ scale: 1.05 }}
                            className={`text-2xl md:text-3xl font-bold transition-all duration-300 ${currentTheme.text}`}
                        >
                            <span className={currentTheme.accent}>F</span>OOT
                            <span className={currentTheme.accent}>B</span>ALL
                            <span className={currentTheme.accent}> C</span>ORE
                        </motion.h1>
                    </Link>
                </div>

                {/* Links principales - Desktop */}
                <div className="hidden lg:flex flex-1 justify-center space-x-8">
                    {navLinks.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`text-lg font-medium transition-all duration-300 relative group px-3 py-2 rounded-lg ${currentTheme.text} ${currentTheme.hover}`}
                        >
                            {label}
                            <span className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 group-hover:w-3/4 transition-all duration-300 ${currentTheme.accent.replace('text-', 'bg-')}`} />
                        </Link>
                    ))}
                </div>

                {/* Avatar y menú de usuario - Desktop */}
                <div className="hidden lg:flex flex-1 justify-end items-center gap-4">
                    <ThemeToggleButton />

                    <div className="relative" ref={userMenuRef}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className={`w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300`}
                            title={correo}
                        >
                            {firstLetter}
                        </motion.button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                            {userMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className={`absolute right-0 mt-2 w-64 ${currentTheme.card} ${currentTheme.border} border rounded-xl shadow-2xl z-50 overflow-hidden`}
                                >
                                    {/* User Info Header */}
                                    <div className="p-4 border-b border-gray-800">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold`}>
                                                {firstLetter}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`${currentTheme.text} font-medium truncate`}>{user.usuario}</p>
                                                <p className={`${currentTheme.textSecondary} text-sm truncate`}>{correo}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-2">
                                        {settings.map(({ name, path }) => (
                                            <Link
                                                key={name}
                                                to={path}
                                                onClick={() => setUserMenuOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 transition-colors duration-200 ${currentTheme.hover} group`}
                                            >
                                                <div className="text-blue-500 group-hover:scale-110 transition-transform duration-200">
                                                    {iconMap[name]}
                                                </div>
                                                <span className={`${currentTheme.text} font-medium`}>{name}</span>
                                            </Link>
                                        ))}

                                        <div className="border-t border-gray-800 my-2"></div>

                                        <button
                                            onClick={() => {
                                                setUserMenuOpen(false)
                                                handleLogout()
                                            }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 transition-colors duration-200 ${currentTheme.hover} group`}
                                        >
                                            <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform duration-200" />
                                            <span className={`${currentTheme.text} font-medium`}>Cerrar Sesión</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Botón menú móvil */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    className={`lg:hidden p-2 rounded-lg ${currentTheme.hover} transition-colors duration-200`}
                    onClick={() => setMobileMenuOpen(true)}
                >
                    <Bars3Icon className={`w-6 h-6 ${currentTheme.text}`} />
                </motion.button>
            </nav>

            {/* Menú móvil */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto ${currentTheme.background} ${currentTheme.border} border-l shadow-2xl lg:hidden`}
                        >
                            {/* Header */}
                            <div className={`flex items-center justify-between p-6 border-b ${currentTheme.border}`}>
                                <Link to="/dashboard" className={`flex items-center space-x-2 ${currentTheme.text}`}>
                                    <h1 className={`text-2xl font-bold ${currentTheme.text}`}>
                                        <span className={currentTheme.accent}>F</span>OOT
                                        <span className={currentTheme.accent}>B</span>ALL
                                        <span className={currentTheme.accent}> C</span>ORE
                                    </h1>
                                </Link>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`p-2 rounded-lg ${currentTheme.hover} transition-colors duration-200`}
                                >
                                    <XMarkIcon className={`w-6 h-6 ${currentTheme.text}`} />
                                </motion.button>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-6 space-y-6">
                                {/* Navigation Links */}
                                <div className="space-y-2">
                                    {navLinks.map(({ to, label }, index) => (
                                        <motion.div
                                            key={to}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Link
                                                to={to}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={`block px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200 ${currentTheme.text} ${currentTheme.hover}`}
                                            >
                                                {label}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Divider */}
                                <div className={`border-t ${currentTheme.border}`}></div>

                                {/* User Info */}
                                <div className="flex items-center space-x-3">
                                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg`}>
                                        {firstLetter}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`${currentTheme.text} font-medium truncate`}>{user.usuario}</p>
                                        <p className={`${currentTheme.textSecondary} text-sm truncate`}>{correo}</p>
                                    </div>
                                </div>

                                {/* Theme Toggle */}
                                <div className="flex justify-start">
                                    <ThemeToggleButton />
                                </div>

                                {/* Profile Links */}
                                <div className="space-y-2">
                                    {settings.map(({ name, path }) => (
                                        <Link
                                            key={name}
                                            to={path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${currentTheme.text} ${currentTheme.hover}`}
                                        >
                                            <div className="text-blue-500">
                                                {iconMap[name]}
                                            </div>
                                            {name}
                                        </Link>
                                    ))}

                                    <button
                                        onClick={() => {
                                            setMobileMenuOpen(false)
                                            handleLogout()
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${currentTheme.text} ${currentTheme.hover}`}
                                    >
                                        <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-500" />
                                        Cerrar Sesión
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    )
}

export default NavbarUsers
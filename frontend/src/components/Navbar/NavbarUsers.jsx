import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { Avatar, Box, Tooltip, IconButton, Menu, MenuItem, ListItemIcon, ListItem, Divider } from "@mui/material"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import Logout from "@mui/icons-material/Logout"
import { Dialog, DialogPanel } from "@headlessui/react"
import { settings } from '../../utils/navbarUtils'
import { useAuth } from '../../contexts/AuthContexts'
import ThemeToggleButton from '../Buttons/ThemeToggleButton'
import { useThemeMode } from '../../contexts/ThemeContext'
import Swal from 'sweetalert2'

const NavbarUsers = () => {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [anchorElUser, setAnchorElUser] = useState(null)

    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget)
    const handleCloseUserMenu = () => setAnchorElUser(null)

    // datos de usuario
    const { user, logout } = useAuth()
    const firstLetter = user?.nombre?.charAt(0).toUpperCase() || "F"
    const correo = user?.correo || ""
    const { currentTheme } = useThemeMode()
    const navigate = useNavigate()

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

    return (
        <header className={`shadow-md ${currentTheme.background}`}>
            <nav className={`mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 border-b shadow-xl ${currentTheme.border}`}>
                {/* Logo */}
                <div className="flex flex-1">
                    <Link to="/dashboard" className="flex items-center space-x-2">
                        <h1 className={`text-2xl md:text-3xl font-bold ${currentTheme.text}`}>
                            <span className={currentTheme.accent}>F</span>OOT
                            <span className={currentTheme.accent}>B</span>ALL
                            <span className={currentTheme.accent}> C</span>ORE
                        </h1>
                    </Link>
                </div>

                {/* Links principales */}
                <div className="hidden lg:flex flex-1 justify-center space-x-6">
                    {[
                        { to: '/dashboard/favorites', label: 'FAVORITOS' },
                        { to: '/dashboard/analysis', label: 'ANÁLISIS' },
                        { to: '/dashboard/forecasts', label: 'PREDICCIÓN' },
                    ].map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`text-lg font-medium transition-colors duration-300 relative group ${currentTheme.text}`}
                        >
                            {label}
                            <span
                                className={`${currentTheme.accent} absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300`}
                            />
                        </Link>
                    ))}
                </div>

                {/* Avatar y menú de usuario */}
                <div className="flex flex-2 justify-end">
                    <Box sx={{ flexGrow: 0 }} className="hidden lg:flex">
                        <ThemeToggleButton />
                        <Tooltip title={correo}>
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar className={`${currentTheme.accent} text-white`}>{firstLetter}</Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: "45px" }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{ vertical: "top", horizontal: "right" }}
                            keepMounted
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}>
                            {settings.map(({ name, path }) => (
                                <MenuItem key={name} onClick={handleCloseUserMenu}>
                                    <ListItemIcon>{React.cloneElement(iconMap[name], { className: currentTheme.accent })}</ListItemIcon>
                                    <ListItem>
                                        <Link to={path} className={`no-underline ${currentTheme.text} block w-full`}>
                                            {name}
                                        </Link>
                                    </ListItem>
                                </MenuItem>
                            ))}
                            {/* <Divider /> */}
                            <MenuItem onClick={() => { handleLogout(); handleCloseUserMenu(); }}>
                                <ListItemIcon><Logout fontSize="small" className={currentTheme.accent} /></ListItemIcon>
                                <ListItem>Cerrar Sesión</ListItem>
                            </MenuItem>
                        </Menu>
                    </Box>
                </div>

                {/* Menú móvil */}
                <button className={`lg:hidden ${currentTheme.text}`} onClick={() => setMobileMenuOpen(true)}>
                    ☰
                </button>
            </nav>

            {/* Menú lateral para móviles */}
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-10" />
                <DialogPanel className={`fixed inset-y-0 right-0 z-10 w-full overflow-y-auto px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-blue-900 ${currentTheme.background}`}>
                    <div className="flex items-center justify-between">
                        <Link to="/" className={`flex items-center space-x-2 ${currentTheme.text}`}>
                            <h1 className={`text-2xl md:text-3xl font-bold ${currentTheme.text}`}>
                                <span className={currentTheme.accent}>F</span>OOT
                                <span className={currentTheme.accent}>B</span>ALL
                                <span className={currentTheme.accent}> C</span>ORE
                            </h1>
                        </Link>
                        <button onClick={() => setMobileMenuOpen(false)} className={currentTheme.text}>
                            <XMarkIcon className="size-6" />
                        </button>
                    </div>
                    <div className="mt-6 space-y-4 font">
                        {[
                            { to: '/dashboard/favorites', label: 'FAVORITOS' },
                            { to: '/dashboard/analysis', label: 'ANÁLISIS' },
                            { to: '/dashboard/forecasts', label: 'PREDICCIÓN' },
                        ].map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`block text-lg ${currentTheme.text}`}
                            >
                                {label}
                                <span
                                    className={`${currentTheme.accent} absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300`}
                                />
                            </Link>
                        ))}

                        {/* Avatar en menú móvil */}
                        <div className="mt-6 flex items-center space-x-3">
                            <Avatar className={`${currentTheme.accent} text-white`}>{firstLetter}</Avatar>
                            <span className={`text-lg ${currentTheme.text}`}>{correo}</span>
                        </div>
                        <div className="mt-3 space-y-2">
                            <ThemeToggleButton />
                            {settings.map(({ name, path }) => (
                                <Link key={name} to={path} className={`block text-lg ${currentTheme.text}`}>
                                    {name}
                                </Link>
                            ))}
                            <button onClick={handleLogout} className={`block w-full text-left text-lg ${currentTheme.text}`}>
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}

export default NavbarUsers
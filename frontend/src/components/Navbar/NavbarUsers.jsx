import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { GiSoccerKick } from "react-icons/gi"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { Avatar, Box, Tooltip, IconButton, Menu, MenuItem, ListItemIcon, ListItem, Divider, useTheme } from "@mui/material"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import SettingsIcon from '@mui/icons-material/Settings'
import Logout from "@mui/icons-material/Logout"
import { Dialog, DialogPanel } from "@headlessui/react"
import { decryptData } from '../../services/encryptionService'
import { settings } from '../../utils/navbarUtils'
import { useAuth } from '../../contexts/AuthContexts'
import ThemeToggleButton from '../Buttons/ThemeToggleButton'

const NavbarUsers = () => {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [anchorElUser, setAnchorElUser] = useState(null)

    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget)
    const handleCloseUserMenu = () => setAnchorElUser(null)

    // datos de usuario
    const { user, logout } = useAuth()
    const firstLetter = user?.usuario?.charAt(0).toUpperCase() || "F"
    const correo = user?.correo || ""
    const theme = useTheme()
    const navigate = useNavigate()

    const iconMap = {
        "Perfil": <AccountCircleIcon sx={{ color: "blue" }} />,
        "Configuración": <SettingsIcon sx={{ color: "blue" }} />
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
        <header className="shadow-md" style={{ backgroundColor: theme.palette.background.default }}>
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 border-b shadow-xl"
                style={{ borderBottom: `1px solid ${theme.palette.primary.dark}` }}>
                {/* Logo */}
                <div className="flex flex-1">
                    <Link to="/dashboard" className="flex items-center space-x-2">
                        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: theme.palette.text.primary }}>
                            <span style={{ color: theme.palette.primary.main }}>F</span>OOT
                            <span style={{ color: theme.palette.primary.main }}>B</span>ALL
                            <span style={{ color: theme.palette.primary.main }}> C</span>ORE
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
                            className="text-lg font-medium transition-colors duration-300 relative group"
                            style={{ color: theme.palette.text.primary }}
                        >
                            {label}
                            <span
                                className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                                style={{ backgroundColor: theme.palette.primary.main }}
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
                                <Avatar sx={{ bgcolor: theme.palette.primary.dark }}>{firstLetter}</Avatar>
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
                                    <ListItemIcon>{React.cloneElement(iconMap[name], { style: { color: theme.custom.azulHover } })}</ListItemIcon>
                                    <ListItem>
                                        <Link to={path} style={{ textDecoration: "none", color: theme.palette.text.primary, display: "block", width: "100%" }}>
                                            {name}
                                        </Link>
                                    </ListItem>
                                </MenuItem>
                            ))}
                            {/* <Divider /> */}
                            <MenuItem onClick={() => { handleLogout(); handleCloseUserMenu(); }}>
                                <ListItemIcon><Logout fontSize="small" sx={{ color: theme.custom.azulHover }} /></ListItemIcon>
                                <ListItem>Cerrar Sesión</ListItem>
                            </MenuItem>
                        </Menu>
                    </Box>
                </div>

                {/* Menú móvil */}
                <button className="lg:hidden" onClick={() => setMobileMenuOpen(true)} style={{ color: theme.palette.text.primary }}>
                    ☰
                </button>
            </nav>

            {/* Menú lateral para móviles */}
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-10" />
                <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-blue-900"
                    style={{ backgroundColor: theme.palette.background.default }}>
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center space-x-2" style={{ color: theme.palette.text.primary }}>
                            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: theme.palette.text.primary }}>
                                <span style={{ color: theme.palette.primary.main }}>F</span>OOT
                                <span style={{ color: theme.palette.primary.main }}>B</span>ALL
                                <span style={{ color: theme.palette.primary.main }}> C</span>ORE
                            </h1>
                        </Link>
                        <button onClick={() => setMobileMenuOpen(false)} style={{ color: theme.palette.text.primary }}>
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
                                className="block text-lg"
                                style={{ color: theme.palette.text.primary }}
                            >
                                {label}
                                <span
                                    className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                                    style={{ backgroundColor: theme.palette.primary.main }}
                                />
                            </Link>
                        ))}

                        {/* Avatar en menú móvil */}
                        <div className="mt-6 flex items-center space-x-3">
                            <Avatar sx={{ bgcolor: theme.palette.primary.dark }}>{firstLetter}</Avatar>
                            <span className="text-lg" style={{ color: theme.palette.text.primary }}>{correo}</span>
                        </div>
                        <div className="mt-3 space-y-2">
                            <ThemeToggleButton />
                            {settings.map(({ name, path }) => (
                                <Link key={name} to={path} className="block text-lg" style={{ color: theme.palette.text.primary }}>
                                    {name}
                                </Link>
                            ))}
                            <button onClick={handleLogout} className="block w-full text-left text-lg" style={{ color: theme.palette.text.primary }}>
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
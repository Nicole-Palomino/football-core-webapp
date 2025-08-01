import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { GiSoccerKick } from "react-icons/gi"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { Avatar, Box, Tooltip, IconButton, Menu, MenuItem, ListItemIcon, ListItem, Divider } from "@mui/material"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import SettingsIcon from '@mui/icons-material/Settings'
import Logout from "@mui/icons-material/Logout"
import { Dialog, DialogPanel } from "@headlessui/react"
import { decryptData } from '../services/encryptionService'
import { settings } from '../utils/navbarData'
import { useAuth } from '../contexts/AuthContexts'

const NavbarUsers = () => {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [anchorElUser, setAnchorElUser] = useState(null)

    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget)
    const handleCloseUserMenu = () => setAnchorElUser(null)

    // datos de usuario
    const storedUser = localStorage.getItem("user")
    const user = storedUser ? decryptData(storedUser) : null
    const firstLetter = user?.usuario ? user.usuario.charAt(0).toUpperCase() : "S"
    const correo = user?.correo

    const iconMap = {
        "Perfil": <AccountCircleIcon sx={{ color: "green" }} />,
        "Configuración": <SettingsIcon sx={{ color: "green" }} />
    }

    const { logout } = useAuth()
    const navigate = useNavigate()

    // cerrar sesión
    const handleLogout = () => {
        Swal.fire({
            title: "¿Cerrar sesión?",
            text: "Tu sesión será cerrada.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cerrar",
            confirmButtonColor: "#228B22",
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
        <header className="shadow-md bg-navbar">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 border-b border-white/20 shadow-xl">
                {/* Logo */}
                <div className="flex flex-1">
                    <Link to="/dashboard" className="flex items-center space-x-2">
                        <GiSoccerKick className="text-4xl text-white" />
                        <h1 className="text-3xl font-title text-white">
                            SCORE<span className="text-light">X</span>PERT
                        </h1>
                    </Link>
                </div>

                {/* Links principales */}
                <div className="hidden lg:flex flex-1 justify-center space-x-6">
                    <Link to="/dashboard/favorites" className="text-lg font-subtitle text-white p-2 hover:bg-green-600 rounded-lg">FAVORITOS</Link>
                    <Link to="/dashboard/analysis" className="text-lg font-subtitle text-white p-2 hover:bg-green-600 rounded-lg">ANÁLISIS</Link>
                    <Link to="/dashboard/forecasts" className="text-lg font-subtitle text-white p-2 hover:bg-green-600 rounded-lg">PREDICCIÓN</Link>
                </div>

                {/* Avatar y menú de usuario */}
                <div className="flex flex-2 justify-end">
                    <Box sx={{ flexGrow: 0 }} className="hidden lg:flex">
                        <Tooltip title={correo}>
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar sx={{ bgcolor: "#228B22" }}>{firstLetter}</Avatar>
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
                                        <ListItemIcon>{iconMap[name]}</ListItemIcon>
                                        <ListItem>
                                            <Link to={path} style={{ textDecoration: "none", color: "inherit", display: "block", width: "100%" }}>
                                                {name}
                                            </Link>
                                        </ListItem>
                                    </MenuItem>
                                ))}
                            <Divider />
                            <MenuItem onClick={() => { handleLogout(); handleCloseUserMenu(); }}>
                                <ListItemIcon><Logout fontSize="small" sx={{ color: "green" }} /></ListItemIcon>
                                <ListItem>Cerrar Sesión</ListItem>
                            </MenuItem>
                        </Menu>
                    </Box>
                </div>

                {/* Menú móvil */}
                <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(true)}>
                    ☰
                </button>
            </nav>

            {/* Menú lateral para móviles */}
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-10" />
                <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-navbar px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-blue-900">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="text-white flex items-center space-x-2">
                            <GiSoccerKick className="text-4xl" />
                            <h1 className="text-3xl font-title">
                                SCORE<span className="text-light">X</span>PERT
                            </h1>
                        </Link>
                        <button onClick={() => setMobileMenuOpen(false)} className="text-white">
                            <XMarkIcon className="size-6" />
                        </button>
                    </div>
                    <div className="mt-6 space-y-4 font">
                        <Link to="/dashboard/favorites" className="block text-lg text-white">FAVORITOS</Link>
                        <Link to="/dashboard/analysis" className="block text-lg text-white">ANÁLISIS</Link>
                        <Link to="/dashboard/forecasts" className="block text-lg text-white">PREDICCIÓN</Link>

                        {/* Avatar en menú móvil */}
                        <div className="mt-6 flex items-center space-x-3">
                            <Avatar sx={{ bgcolor: "#228B22" }}>{firstLetter}</Avatar>
                            <span className="text-lg text-white">{correo}</span>
                        </div>
                        <div className="mt-3 space-y-2">
                            {settings.map(({ name, path }) => (
                                <Link key={name} to={path} className="block text-lg text-white">
                                    {name}
                                </Link>
                            ))}
                            <button onClick={handleLogout} className="block w-full text-left text-lg text-white">
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
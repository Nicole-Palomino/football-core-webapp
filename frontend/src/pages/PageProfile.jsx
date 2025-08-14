import React, { useState, useEffect } from 'react'
import {
    Avatar, Box, Card, CardContent, Container, Typography, Chip, Grid, CircularProgress,
    IconButton, Badge, LinearProgress, Button, Tooltip, Dialog, DialogTitle, Alert,
    Snackbar, DialogContent, TextField, DialogActions, useTheme
} from '@mui/material'
import {
    Person as PersonIcon, Email as EmailIcon, CalendarToday as CalendarIcon, Security as SecurityIcon,
    AdminPanelSettings as AdminIcon, Verified as VerifiedIcon, Schedule as ScheduleIcon,
    AccountCircle as AccountIcon, Edit as EditIcon, Settings as SettingsIcon, Favorite as FavoriteIcon,
    Sports as SportsIcon, Shield as ShieldIcon, Logout as LogoutIcon, Dashboard as DashboardIcon,
    AccountBalanceWallet as AccountBalanceWalletIcon, Close as CloseIcon, Save as SaveIcon,
} from '@mui/icons-material'
import { formatFechaHora } from '../utils/helpers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContexts'
import { updateUser } from '../services/api/usuario'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { setStoredUser } from '../services/auth'

const schema = yup.object().shape({
    usuario: yup
        .string()
        .min(3, "El usuario debe tener al menos 3 caracteres")
        .max(50, "El usuario no puede tener más de 50 caracteres"),
    correo: yup
        .string()
        .email("Ingresa un correo electrónico válido"),
})

const PageProfile = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [profileCompletion, setProfileCompletion] = useState(0)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const { logout, user } = useAuth()

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: yupResolver(schema)
    })

    const onSubmit = (data) => {
        const updateData = {}
        if (data.usuario !== user.usuario) updateData.usuario = data.usuario
        if (data.correo !== user.correo) updateData.correo = data.correo

        if (Object.keys(updateData).length === 0) {
            return
        }
        updateUserMutation.mutate(updateData)
    }

    const [editForm, setEditForm] = useState({
        usuario: '',
        correo: '',
        id_rol: null,
        id_estado: null,
    })
    const [formErrors, setFormErrors] = useState({})

    const updateUserMutation = useMutation({
        mutationFn: async (userData) => updateUser(user.id_usuario, userData),
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(['user'], updatedUser)
            setStoredUser(updatedUser)
            setSnackbar({
                open: true,
                message: '¡Perfil actualizado exitosamente!',
                severity: 'success'
            })
            setEditModalOpen(false)
            resetEditForm()
        },
        onError: (error) => {
            setSnackbar({
                open: true,
                message: error?.response?.data?.message || error.message || 'Error al actualizar el perfil',
                severity: 'error'
            })
        }
    })

    useEffect(() => {
        if (user) {
            let completion = 0
            if (user.usuario) completion += 25
            if (user.correo) completion += 25
            if (user.rol?.nombre_rol) completion += 25
            if (user.is_active) completion += 25
            setProfileCompletion(completion)
        }
    }, [user])

    const resetEditForm = () => {
        setEditForm({
            usuario: user?.usuario || '',
            correo: user?.correo || '',
            id_rol: user.rol?.id_rol,
            id_estado: user.estado?.id_estado,
        })
        setFormErrors({})
    }

    const handleEditProfile = () => {
        reset({
            usuario: user?.usuario || "",
            correo: user?.correo || ""
        })
        setEditModalOpen(true)
    }

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

    const getRoleColor = (roleName) => {
        switch (roleName?.toLowerCase()) {
            case 'admin':
            case 'administrador':
                return { bg: '#FF4444', icon: AdminIcon }
            case 'user':
            case 'usuario':
                return { bg: '#368FF4', icon: PersonIcon }
            case 'moderador':
                return { bg: '#FFD700', icon: ShieldIcon }
            default:
                return { bg: '#888888', icon: PersonIcon }
        }
    }

    const getStatusColor = (status) => {
        return status ? '#368FF4' : '#FF4444'
    }

    const getInitials = (name) => {
        if (!name) return 'U'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const calculateDaysActive = (registrationDate) => {
        const now = new Date()
        const registration = new Date(registrationDate)
        const diffTime = Math.abs(now - registration)
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const roleInfo = getRoleColor(user.rol?.nombre_rol)
    const daysActive = calculateDaysActive(user.registro)

    return (
        <Box sx={{
            minHeight: "100vh",
            background: theme.palette.background.default
        }}>
            <Container maxWidth="xl" sx={{ py: { xs: 1, md: 2 } }}>
                {/* Header con navegación rápida */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        mb: 4,
                        p: 2,
                        bgcolor: theme.palette.background.default,
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.text.secondary}`,
                        gap: { xs: 2, sm: 0 }
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                            <AccountIcon sx={{ color: theme.palette.primary.main, fontSize: 40 }} />
                            <Box>
                                <Typography variant="h4" sx={{ color: theme.palette.text.primary, fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                                    Mi Perfil
                                </Typography>
                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                    Gestiona tu información personal
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', sm: 'flex-end' }, width: { xs: '100%', sm: 'auto' } }}>
                            <Tooltip title="Dashboard" arrow>
                                <IconButton
                                    onClick={() => navigate('/dashboard')}
                                    sx={{
                                        color: '#368FF4',
                                        bgcolor: 'rgba(54,143,244,0.1)',
                                        '&:hover': {
                                            bgcolor: 'rgba(54,143,244,0.2)',
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                >
                                    <DashboardIcon sx={{ color: '#368FF4' }} />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Configuración" arrow>
                                <IconButton
                                    onClick={() => navigate('/dashboard/settings')}
                                    sx={{
                                        color: '#FFD700',
                                        bgcolor: 'rgba(255,215,0,0.1)',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,215,0,0.2)',
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                >
                                    <SettingsIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Cerrar Sesión" arrow>
                                <IconButton
                                    onClick={handleLogout}
                                    sx={{
                                        color: '#FF4444',
                                        bgcolor: 'rgba(255,68,68,0.1)',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,68,68,0.2)',
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                >
                                    <LogoutIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                </motion.div>

                <Grid container spacing={4} sx={{ mb: 4, justifyContent: 'center', width: '100%' }}>
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: { md: '100%', xs: '100%' }
                        }}
                    >
                        <Grid className="grid grid-cols-1 gap-4 mt-5">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <Card
                                    sx={{
                                        backgroundColor: theme.palette.background.default,
                                        borderRadius: 1,
                                        overflow: 'hidden',
                                        position: 'relative',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: 'linear-gradient(90deg, #368FF4, #1755FF)'
                                        }
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            p: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            textAlign: 'center'
                                        }}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 3 }}>
                                            <Badge
                                                overlap="circular"
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                badgeContent={
                                                    user.is_active ? (
                                                        <Box sx={{
                                                            width: 28,
                                                            height: 28,
                                                            borderRadius: '50%',
                                                            bgcolor: theme.custom.blanco,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            border: '3px solid #1a1a1a'
                                                        }}>
                                                            <VerifiedIcon sx={{ color: '#368FF4', fontSize: 20 }} />
                                                        </Box>
                                                    ) : null
                                                }
                                            >
                                                <Avatar sx={{
                                                    width: 120,
                                                    height: 120,
                                                    color: theme.custom.blanco,
                                                    background: `linear-gradient(45deg, ${roleInfo.bg}, ${roleInfo.bg}90)`,
                                                    fontSize: '2.5rem',
                                                    fontWeight: 'bold',
                                                    boxShadow: `0 0 30px ${roleInfo.bg}40`,
                                                    border: '4px solid rgba(255,255,255,0.1)'
                                                }}>
                                                    {getInitials(user.usuario)}
                                                </Avatar>
                                            </Badge>

                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                                    <Typography variant="h4" sx={{
                                                        color: theme.palette.text.primary,
                                                        fontWeight: 'bold',
                                                        mr: 2,
                                                        fontSize: { xs: 20, md: 26 }
                                                    }}>
                                                        @{user.usuario}
                                                    </Typography>

                                                    <Button
                                                        onClick={handleEditProfile}
                                                        startIcon={<EditIcon />}
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{
                                                            color: '#368FF4',
                                                            borderColor: '#368FF4',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(54,143,244,0.1)',
                                                                borderColor: '#368FF4',
                                                                transform: 'scale(1.05)'
                                                            }
                                                        }}
                                                    >
                                                        Editar
                                                    </Button>
                                                </Box>

                                                {/* Chips de Estado y Rol */}
                                                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                                                    <Chip
                                                        icon={React.createElement(roleInfo.icon)}
                                                        label={user.rol?.nombre_rol || 'Usuario'}
                                                        sx={{
                                                            bgcolor: roleInfo.bg,
                                                            color: theme.custom.blanco,
                                                            fontWeight: 'bold',
                                                            '& .MuiChip-icon': { color: theme.custom.blanco, }
                                                        }}
                                                    />

                                                    <Chip
                                                        icon={<SecurityIcon />}
                                                        label={user.is_active ? 'Cuenta Activa' : 'Cuenta Inactiva'}
                                                        sx={{
                                                            bgcolor: getStatusColor(user.is_active),
                                                            color: theme.custom.blanco,
                                                            fontWeight: 'bold',
                                                            '& .MuiChip-icon': { color: theme.custom.blanco }
                                                        }}
                                                    />
                                                </Box>

                                                {/* Progreso del Perfil */}
                                                <Box sx={{ mb: 3, flexWrap: 'wrap', gap: 2, }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                            Completitud del perfil
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                                                            {profileCompletion}%
                                                        </Typography>
                                                    </Box>

                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={profileCompletion}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 4,
                                                            bgcolor: 'rgba(255,255,255,0.1)',
                                                            '& .MuiLinearProgress-bar': {
                                                                bgcolor: profileCompletion === 100 ? theme.palette.primary.main : theme.palette.text.secondary,
                                                                borderRadius: 4
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        </Box>

                                        {/* Información Detallada */}
                                        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
                                            <Grid item xs={12} md={6}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    p: 2,
                                                    bgcolor: theme.custom.rojo,
                                                    borderRadius: 2,
                                                    border: '1px solid #ccc',
                                                }}>
                                                    <EmailIcon sx={{ color: theme.custom.blanco, fontSize: { xs: 20, md: 28 }, mr: 2 }} />
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        <Typography variant="caption" sx={{ color: theme.custom.blanco, display: 'block' }}>
                                                            Correo Electrónico
                                                        </Typography>
                                                        <Typography variant="body1" sx={{
                                                            color: theme.custom.blanco,
                                                            fontWeight: 'bold',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            fontSize: { xs: 15, md: 20 }
                                                        }}>
                                                            {user.correo}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    p: 2,
                                                    bgcolor: theme.custom.azul,
                                                    borderRadius: 2,
                                                    border: '1px solid #ccc'
                                                }}>
                                                    <CalendarIcon sx={{ color: theme.custom.blanco, fontSize: { xs: 20, md: 28 }, mr: 2 }} />
                                                    <Box>
                                                        <Typography variant="caption" sx={{ color: theme.custom.blanco, display: 'block' }}>
                                                            Miembro desde
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ color: theme.custom.blanco, fontWeight: 'bold', fontSize: { xs: 15, md: 20 } }}>
                                                            {formatFechaHora(user.registro)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    p: 2,
                                                    bgcolor: theme.custom.naranja,
                                                    borderRadius: 2,
                                                    border: '1px solid #ccc'
                                                }}>
                                                    <ScheduleIcon sx={{ color: theme.custom.blanco, fontSize: { xs: 20, md: 28 }, mr: 2 }} />
                                                    <Box>
                                                        <Typography variant="caption" sx={{ color: theme.custom.blanco, display: 'block' }}>
                                                            Última actividad
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ color: theme.custom.blanco, fontWeight: 'bold', fontSize: { xs: 15, md: 20 } }}>
                                                            {formatFechaHora(user.updated_at)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    p: 2,
                                                    bgcolor: theme.custom.morado,
                                                    borderRadius: 2,
                                                    border: '1px solid rgba(138,43,226,0.2)'
                                                }}>
                                                    <AccountBalanceWalletIcon sx={{ color: theme.custom.blanco, fontSize: { xs: 20, md: 28 }, mr: 2 }} />
                                                    <Box>
                                                        <Typography variant="caption" sx={{ color: theme.custom.blanco, display: 'block' }}>
                                                            Plan de Usuario
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ color: theme.custom.blanco, fontWeight: 'bold', fontSize: { xs: 15, md: 20 } }}>
                                                            {user.estado?.nombre_estado}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>

                        <Grid className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <Card
                                    sx={{
                                        backgroundColor: theme.palette.background.default,
                                        borderRadius: 1,
                                        overflow: 'hidden',
                                        position: 'relative',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: 'linear-gradient(90deg, #FFD700, #FFA500)'
                                        }
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            p: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            textAlign: 'center'
                                        }}>
                                        <Typography variant="h5" sx={{ color: theme.palette.text.primary, mb: 1, fontWeight: 'bold' }}>
                                            Estadísticas
                                        </Typography>

                                        <Box sx={{ mt: 3 }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <Box sx={{
                                                        p: 2,
                                                        bgcolor: 'rgba(54,143,244,0.1)',
                                                        borderRadius: 2,
                                                        border: '1px solid rgba(54,143,244,0.2)'
                                                    }}>
                                                        <Typography variant="h4" sx={{ color: '#368FF4', fontWeight: 'bold' }}>
                                                            {daysActive}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                                            Días activo
                                                        </Typography>
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <Box sx={{
                                                        p: 2,
                                                        bgcolor: 'rgba(255,107,107,0.1)',
                                                        borderRadius: 2,
                                                        border: '1px solid rgba(255,107,107,0.2)'
                                                    }}>
                                                        <Typography variant="h4" sx={{ color: '#FF6B6B', fontWeight: 'bold' }}>
                                                            {user.is_active ? '✓' : '✗'}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                                            Estado
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                <Card
                                    sx={{
                                        backgroundColor: theme.palette.background.default,
                                        borderRadius: 1,
                                        overflow: 'hidden',
                                        position: 'relative',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: 'linear-gradient(90deg, #FF6B6B, #FF4444)'
                                        }
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            p: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            textAlign: 'center'
                                        }}>
                                        <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
                                            Accesos Rápidos
                                        </Typography>

                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Button
                                                    fullWidth
                                                    startIcon={<FavoriteIcon />}
                                                    onClick={() => navigate('/dashboard/favorites')}
                                                    sx={{
                                                        color: '#FF1717',
                                                        bgcolor: 'rgba(255,23,23,0.1)',
                                                        border: '1px solid rgba(255,23,23,0.3)',
                                                        '&:hover': {
                                                            bgcolor: 'rgba(255,23,23,0.2)',
                                                            transform: 'translateY(-2px)'
                                                        },
                                                        py: 1.5
                                                    }}
                                                >
                                                    Favoritos
                                                </Button>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Button
                                                    fullWidth
                                                    startIcon={<SportsIcon />}
                                                    onClick={() => navigate('/dashboard')}
                                                    sx={{
                                                        color: '#368FF4',
                                                        bgcolor: 'rgba(54,143,244,0.1)',
                                                        border: '1px solid rgba(54,143,244,0.3)',
                                                        '&:hover': {
                                                            bgcolor: 'rgba(54,143,244,0.2)',
                                                            transform: 'translateY(-2px)'
                                                        },
                                                        py: 1.5
                                                    }}
                                                >
                                                    Partidos
                                                </Button>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Button
                                                    fullWidth
                                                    startIcon={<SettingsIcon />}
                                                    onClick={() => navigate('/dashboard/settings')}
                                                    sx={{
                                                        color: '#ffa726',
                                                        bgcolor: 'rgba(255,167,38,0.1)',
                                                        border: '1px solid rgba(255,167,38,0.3)',
                                                        '&:hover': {
                                                            bgcolor: 'rgba(255,167,38,0.2)',
                                                            transform: 'translateY(-2px)'
                                                        },
                                                        py: 1.5,
                                                    }}
                                                >
                                                    Configuración
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>

            {/* Modal de Edición de Perfil */}
            <Dialog
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: theme.palette.background.paper,
                        border: '1px solid #333',
                        borderRadius: 2,
                        backgroundImage: 'none'
                    }
                }}
            >
                <DialogTitle sx={{
                    color: theme.palette.text.primary,
                    borderBottom: '1px solid #333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pb: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <EditIcon sx={{ color: '#368FF4' }} />
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            Editar Perfil
                        </Typography>
                    </Box>

                    <IconButton
                        onClick={() => setEditModalOpen(false)}
                        sx={{ color: theme.palette.text.secondary }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 4, mt: 3 }}>
                    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 6 }}>
                        <div className="relative">
                            <TextField
                                label="Nombre de usuario"
                                variant="outlined"
                                fullWidth
                                autoComplete="off"
                                sx={{
                                    "& label": { color: theme.palette.text.primary },
                                    "& .MuiOutlinedInput-root": {
                                        color: theme.palette.text.primary,
                                        "& fieldset": { borderColor: theme.palette.text.primary },
                                        "&:hover fieldset": { borderColor: theme.palette.primary.main },
                                    },
                                    "& .Mui-error": {
                                        "& label": { color: theme.custom.rojo },
                                        "& label.Mui-focused": { color: theme.custom.rojo },
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.custom.rojo },
                                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: theme.custom.rojo },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: theme.custom.rojo }
                                    },
                                }}
                                {...register("usuario", {
                                    required: {
                                        value: true,
                                        message: "Nombre de usuario requerido"
                                    }
                                })}
                                error={!!errors.usuario}
                                helperText={errors.usuario ? errors.usuario.message : ''} />
                        </div>

                        <div className="relative mt-5 mb-5">
                            <TextField
                                label="Correo Electrónico"
                                variant="outlined"
                                fullWidth
                                type='email'
                                autoComplete="off"
                                sx={{
                                    "& label": { color: theme.palette.text.primary },
                                    "& .MuiOutlinedInput-root": {
                                        color: theme.palette.text.primary,
                                        "& fieldset": { borderColor: theme.palette.text.primary },
                                        "&:hover fieldset": { borderColor: theme.palette.primary.main },
                                    },
                                    "& .Mui-error": {
                                        "& label": { color: theme.custom.rojo },
                                        "& label.Mui-focused": { color: theme.custom.rojo },
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.custom.rojo },
                                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: theme.custom.rojo },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: theme.custom.rojo }
                                    },
                                }}
                                {...register("correo", {
                                    required: {
                                        value: true,
                                        message: "Correo Electrónico requerido"
                                    },
                                    pattern: {
                                        value: /^[a-z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.com)$/i,
                                        message: "El correo electrónico debe proceder de Gmail, Hotmail o Outlook"
                                    }
                                })}
                                error={!!errors.correo}
                                helperText={errors.correo ? errors.correo.message : ''} />
                        </div>

                        {/* Información adicional */}
                        <Grid item xs={12}>
                            <Alert
                                severity="info"
                                sx={{
                                    bgcolor: 'rgba(54,143,244,0.1)',
                                    border: '1px solid rgba(54,143,244,0.3)',
                                    color: theme.palette.text.primary,
                                    '& .MuiAlert-icon': {
                                        color: '#368FF4'
                                    }
                                }}
                            >
                                <Typography variant="body2">
                                    • Solo puedes modificar el nombre de usuario y el correo electrónico
                                </Typography>
                                <Typography variant="body2">
                                    • El nombre de usuario debe tener entre 3 y 50 caracteres
                                </Typography>
                                <Typography variant="body2">
                                    • La contraseña no puede modificarse desde este formulario
                                </Typography>
                            </Alert>
                        </Grid>

                        <DialogActions>
                            <Button onClick={() => setEditModalOpen(false)}>Cancelar</Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                startIcon={
                                    updateUserMutation.isLoading ? (
                                        <CircularProgress size={20} sx={{ color: '#368FF4' }} />
                                    ) : (
                                        <SaveIcon />
                                    )
                                }>
                                {updateUserMutation.isLoading ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Snackbar para notificaciones */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{
                        bgcolor: snackbar.severity === 'success' ? '#1a5d1a' : '#5d1a1a',
                        color: 'white',
                        '& .MuiAlert-icon': {
                            color: snackbar.severity === 'success' ? '#4caf50' : '#f44336'
                        }
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default PageProfile
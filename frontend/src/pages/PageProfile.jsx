import React, { useState, useEffect } from 'react'
import { 
    Avatar, 
    Box, 
    Card, 
    CardContent, 
    Container, 
    Typography, 
    Chip, 
    Grid, 
    Fade, 
    Zoom,
    CircularProgress,
    Divider,
    IconButton,
    Badge,
    Paper,
    LinearProgress,
    Button,
    Tooltip
} from '@mui/material'
import {
    Person as PersonIcon,
    Email as EmailIcon,
    CalendarToday as CalendarIcon,
    Security as SecurityIcon,
    AdminPanelSettings as AdminIcon,
    Verified as VerifiedIcon,
    Schedule as ScheduleIcon,
    AccountCircle as AccountIcon,
    Edit as EditIcon,
    Settings as SettingsIcon,
    Favorite as FavoriteIcon,
    Sports as SportsIcon,
    TrendingUp as TrendingUpIcon,
    AccessTime as AccessTimeIcon,
    Shield as ShieldIcon,
    Star as StarIcon,
    AccountBox as AccountBoxIcon,
    VpnKey as VpnKeyIcon,
    Logout as LogoutIcon,
    Dashboard as DashboardIcon
} from '@mui/icons-material'
import { getStoredUser } from '../services/auth'
import { formatFechaHora } from '../utils/helpers'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const PageProfile = () => {
    const navigate = useNavigate()
    const [hoveredCard, setHoveredCard] = useState(null)
    const [profileCompletion, setProfileCompletion] = useState(0)

    const { data: user, isLoading, isError, error } = useQuery({
        queryKey: ['user-profile'],
        queryFn: getStoredUser,
        staleTime: Infinity,
        cacheTime: Infinity
    })  

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    backgroundColor: "#0e0f0f",
                    color: "white"
                }}>
                <Box sx={{ position: 'relative', mb: 4 }}>
                    <CircularProgress
                        size={80} 
                        sx={{ 
                            color: '#00FF88',
                            filter: 'drop-shadow(0 0 20px #00FF88)'
                        }} 
                    />
                    <PersonIcon 
                        sx={{ 
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: '#00FF88',
                            fontSize: 30
                        }} 
                    />
                </Box>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        color: '#00FF88',
                        fontFamily: 'cursive',
                        textShadow: '0 0 10px #00FF88'
                    }}>
                    Cargando perfil...
                </Typography>
            </Box>
        )
    }

    if (isError) {
        return (
            <Container sx={{ textAlign: 'center', mt: 4, color: 'white' }}>
                <Typography variant="h6">Error: {error.message}</Typography>
                <Typography variant="body1">No se pudieron cargar los datos del usuario.</Typography>
            </Container>
        )
    }

    const getRoleColor = (roleName) => {
        switch (roleName?.toLowerCase()) {
            case 'admin':
            case 'administrador':
                return { bg: '#FF4444', icon: AdminIcon }
            case 'user':
            case 'usuario':
                return { bg: '#00FF88', icon: PersonIcon }
            case 'moderador':
                return { bg: '#FFD700', icon: ShieldIcon }
            default:
                return { bg: '#888888', icon: PersonIcon }
        }
    }

    const getStatusColor = (status) => {
        return status ? '#00FF88' : '#FF4444'
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

    const handleEditProfile = () => {
        console.log("Editar perfil")
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

    const roleInfo = getRoleColor(user.rol?.nombre_rol)
    const daysActive = calculateDaysActive(user.registro)

    return (
        <Box sx={{ 
            bgcolor: "#0a0a0a", 
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)"
        }}>
            <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
                {/* Header con navegación rápida */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 4,
                        p: 2,
                        bgcolor: 'rgba(255,255,255,0.05)',
                        borderRadius: 3,
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <AccountIcon sx={{ color: '#00FF88', fontSize: 40 }} />
                            <Box>
                                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                                    Mi Perfil
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#888' }}>
                                    Gestiona tu información personal
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Dashboard" arrow>
                                <IconButton 
                                    onClick={() => navigate('/dashboard')}
                                    sx={{ 
                                        color: '#00FF88',
                                        bgcolor: 'rgba(0,255,136,0.1)',
                                        '&:hover': { 
                                            bgcolor: 'rgba(0,255,136,0.2)',
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                >
                                    <DashboardIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Configuración" arrow>
                                <IconButton 
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

                <Grid container spacing={4}>
                    {/* Card Principal del Perfil */}
                    <Grid item xs={12} lg={8}>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Card
                                onMouseEnter={() => setHoveredCard('main')}
                                onMouseLeave={() => setHoveredCard(null)}
                                sx={{
                                    bgcolor: '#1a1a1a',
                                    border: hoveredCard === 'main' ? '2px solid #00FF88' : '1px solid #333',
                                    borderRadius: 4,
                                    transition: 'all 0.3s ease',
                                    transform: hoveredCard === 'main' ? 'translateY(-5px)' : 'translateY(0)',
                                    boxShadow: hoveredCard === 'main' 
                                        ? '0 20px 40px rgba(0,255,136,0.2)' 
                                        : '0 10px 30px rgba(0,0,0,0.5)',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '4px',
                                        background: 'linear-gradient(90deg, #00FF88, #17FF4D)'
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    {/* Header con Avatar y Info Principal */}
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
                                                        bgcolor: '#00FF88',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        border: '3px solid #1a1a1a'
                                                    }}>
                                                        <VerifiedIcon sx={{ color: 'black', fontSize: 18 }} />
                                                    </Box>
                                                ) : null
                                            }
                                        >
                                            <Avatar sx={{ 
                                                width: 120, 
                                                height: 120,
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
                                                <Typography variant="h3" sx={{ 
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    mr: 2
                                                }}>
                                                    {user.usuario}
                                                </Typography>
                                                <Button
                                                    onClick={handleEditProfile}
                                                    startIcon={<EditIcon />}
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        color: '#00FF88',
                                                        borderColor: '#00FF88',
                                                        '&:hover': {
                                                            bgcolor: 'rgba(0,255,136,0.1)',
                                                            borderColor: '#00FF88',
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
                                                        color: 'black',
                                                        fontWeight: 'bold',
                                                        '& .MuiChip-icon': { color: 'black' }
                                                    }}
                                                />
                                                <Chip
                                                    icon={<SecurityIcon />}
                                                    label={user.is_active ? 'Cuenta Activa' : 'Cuenta Inactiva'}
                                                    sx={{
                                                        bgcolor: getStatusColor(user.is_active),
                                                        color: 'black',
                                                        fontWeight: 'bold',
                                                        '& .MuiChip-icon': { color: 'black' }
                                                    }}
                                                />
                                            </Box>

                                            {/* Progreso del Perfil */}
                                            <Box sx={{ mb: 3 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="body2" sx={{ color: '#888' }}>
                                                        Completitud del perfil
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#00FF88', fontWeight: 'bold' }}>
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
                                                            bgcolor: profileCompletion === 100 ? '#00FF88' : '#FFD700',
                                                            borderRadius: 4
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 4 }} />

                                    {/* Información Detallada */}
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                p: 2,
                                                bgcolor: 'rgba(0,255,136,0.05)',
                                                borderRadius: 2,
                                                border: '1px solid rgba(0,255,136,0.2)'
                                            }}>
                                                <EmailIcon sx={{ color: '#00FF88', fontSize: 28, mr: 2 }} />
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography variant="caption" sx={{ color: '#888', display: 'block' }}>
                                                        Correo Electrónico
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ 
                                                        color: 'white', 
                                                        fontWeight: 'bold',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
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
                                                bgcolor: 'rgba(255,215,0,0.05)',
                                                borderRadius: 2,
                                                border: '1px solid rgba(255,215,0,0.2)'
                                            }}>
                                                <CalendarIcon sx={{ color: '#FFD700', fontSize: 28, mr: 2 }} />
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: '#888', display: 'block' }}>
                                                        Miembro desde
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
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
                                                bgcolor: 'rgba(255,107,107,0.05)',
                                                borderRadius: 2,
                                                border: '1px solid rgba(255,107,107,0.2)'
                                            }}>
                                                <ScheduleIcon sx={{ color: '#FF6B6B', fontSize: 28, mr: 2 }} />
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: '#888', display: 'block' }}>
                                                        Última actividad
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
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
                                                bgcolor: 'rgba(138,43,226,0.05)',
                                                borderRadius: 2,
                                                border: '1px solid rgba(138,43,226,0.2)'
                                            }}>
                                                <VpnKeyIcon sx={{ color: '#8A2BE2', fontSize: 28, mr: 2 }} />
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: '#888', display: 'block' }}>
                                                        ID de Usuario
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                        #{user.id_usuario}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                    {/* Cards Laterales */}
                    <Grid item xs={12} lg={4}>
                        <Grid container spacing={3}>
                            {/* Estadísticas Rápidas */}
                            <Grid item xs={12}>
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    <Card
                                        onMouseEnter={() => setHoveredCard('stats')}
                                        onMouseLeave={() => setHoveredCard(null)}
                                        sx={{
                                            bgcolor: '#1a1a1a',
                                            border: hoveredCard === 'stats' ? '2px solid #FFD700' : '1px solid #333',
                                            borderRadius: 4,
                                            transition: 'all 0.3s ease',
                                            transform: hoveredCard === 'stats' ? 'translateY(-5px)' : 'translateY(0)',
                                            boxShadow: hoveredCard === 'stats' 
                                                ? '0 20px 40px rgba(255,215,0,0.2)' 
                                                : '0 10px 30px rgba(0,0,0,0.5)',
                                            position: 'relative',
                                            overflow: 'hidden',
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
                                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                            <TrendingUpIcon sx={{ 
                                                color: '#FFD700', 
                                                fontSize: 48, 
                                                mb: 2,
                                                filter: 'drop-shadow(0 0 10px #FFD700)'
                                            }} />

                                            <Typography variant="h5" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
                                                Estadísticas
                                            </Typography>

                                            <Box sx={{ mt: 3 }}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <Box sx={{ 
                                                            p: 2, 
                                                            bgcolor: 'rgba(0,255,136,0.1)', 
                                                            borderRadius: 2,
                                                            border: '1px solid rgba(0,255,136,0.2)'
                                                        }}>
                                                            <Typography variant="h4" sx={{ color: '#00FF88', fontWeight: 'bold' }}>
                                                                {daysActive}
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ color: '#888' }}>
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
                                                            <Typography variant="caption" sx={{ color: '#888' }}>
                                                                Estado
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>

                            {/* Accesos Rápidos */}
                            <Grid item xs={12}>
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                >
                                    <Card
                                        onMouseEnter={() => setHoveredCard('quick')}
                                        onMouseLeave={() => setHoveredCard(null)}
                                        sx={{
                                            bgcolor: '#1a1a1a',
                                            border: hoveredCard === 'quick' ? '2px solid #FF6B6B' : '1px solid #333',
                                            borderRadius: 4,
                                            transition: 'all 0.3s ease',
                                            transform: hoveredCard === 'quick' ? 'translateY(-5px)' : 'translateY(0)',
                                            boxShadow: hoveredCard === 'quick' 
                                                ? '0 20px 40px rgba(255,107,107,0.2)' 
                                                : '0 10px 30px rgba(0,0,0,0.5)',
                                            position: 'relative',
                                            overflow: 'hidden',
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
                                        <CardContent sx={{ p: 3 }}>
                                            <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
                                                Accesos Rápidos
                                            </Typography>
                                            
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <Button
                                                        fullWidth
                                                        startIcon={<FavoriteIcon />}
                                                        onClick={() => navigate('/favorites')}
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
                                                            color: '#00FF88',
                                                            bgcolor: 'rgba(0,255,136,0.1)',
                                                            border: '1px solid rgba(0,255,136,0.3)',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(0,255,136,0.2)',
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
                                                        sx={{
                                                            color: '#FFD700',
                                                            bgcolor: 'rgba(255,215,0,0.1)',
                                                            border: '1px solid rgba(255,215,0,0.3)',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(255,215,0,0.2)',
                                                                transform: 'translateY(-2px)'
                                                            },
                                                            py: 1.5,
                                                            // mt: 1
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
                </Grid>
            </Container>
        </Box>
    )
}

export default PageProfile
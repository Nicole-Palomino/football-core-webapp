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
    Badge
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
    Edit as EditIcon
} from '@mui/icons-material'
import { getStoredUser } from '../services/auth'
import { formatFecha, formatFechaHora } from '../services/encryptionService'

const PageProfile = () => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [hoveredCard, setHoveredCard] = useState(null)

    useEffect(() => {
        const fetchUserData = () => {
            setLoading(true)
            try {
                const userData = getStoredUser()
                setUser(userData)
            } catch (error) {
                console.error("Error al obtener datos del usuario:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [])

    const getRoleColor = (roleName) => {
        switch (roleName?.toLowerCase()) {
            case 'admin':
            case 'administrador':
                return '#FF4444'
            case 'user':
            case 'usuario':
                return '#00FF88'
            case 'moderador':
                return '#FFD700'
            default:
                return '#888888'
        }
    }

    const getStatusColor = (status) => {
        return status ? '#00FF88' : '#FF4444'
    }

    const getInitials = (name) => {
        if (!name) return 'U'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    if (loading) {
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

    if (!user) {
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
                <PersonIcon sx={{ fontSize: 100, color: '#333', mb: 3, opacity: 0.5 }} />
                <Typography variant="h4" sx={{ color: '#666', mb: 2, fontFamily: 'cursive' }}>
                    Error al cargar perfil
                </Typography>
                <Typography variant="body1" sx={{ color: '#888' }}>
                    No se pudo obtener la información del usuario
                </Typography>
            </Box>
        )
    }

    return (
        <Box
            sx={{ 
                backgroundColor: "#0e0f0f",
                minHeight: "100vh",
                padding: { xs: 2, md: 4 },
                background: `
                    radial-gradient(circle at 20% 80%, rgba(53, 189, 125, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(4, 214, 116, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 40% 40%, rgba(0, 255, 136, 0.05) 0%, transparent 50%),
                    #0e0f0f
                `
            }}>
                <Container maxWidth="lg">
                    {/* Header */}
                    <Fade in={true} timeout={1000}>
                        <Box sx={{ textAlign: 'center', mb: 6 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                <AccountIcon  
                                    sx={{ 
                                        fontSize: 60, 
                                        color: '#00FF88',
                                        mr: 2,
                                        filter: 'drop-shadow(0 0 20px #00FF88)',
                                        animation: 'pulse 3s infinite'
                                    }} 
                                />

                                <Typography 
                                    variant="h2" 
                                    sx={{ 
                                        color: 'white',
                                        fontFamily: 'cursive',
                                        fontWeight: 'bold',
                                        background: 'linear-gradient(45deg, #02C268, #00FF88)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        textShadow: '0 0 30px rgba(30, 212, 100, 0.5)'
                                    }}>
                                    Mi Perfil
                                </Typography>
                            </Box>

                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    color: '#9E9D9D',
                                    fontStyle: 'italic',
                                    maxWidth: 600,
                                    margin: '0 auto'
                                }}>
                                Información de tu cuenta y configuración personal
                            </Typography>
                        </Box>
                    </Fade>

                    {/* Profile Content */}
                    <Grid container spacing={4} justifyContent="center">
                        {/* Main Profile Card */}
                        <Grid item xs={12} md={8}>
                            <Zoom in={true} timeout={800}>
                                <Card
                                    onMouseEnter={() => setHoveredCard('main')}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    sx={{
                                        background: hoveredCard === 'main' 
                                            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 255, 136, 0.1) 100%)'
                                            : 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(10px)',
                                        border: hoveredCard === 'main' 
                                            ? '2px solid #00FF88'
                                            : '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: 4,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        transform: hoveredCard === 'main' ? 'translateY(-5px)' : 'translateY(0)',
                                        // boxShadow: hoveredCard === 'main' 
                                        //     ? '0 20px 40px rgba(0, 255, 136, 0.2)' 
                                        //     : '0 8px 32px rgba(0, 0, 0, 0.3)',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: `linear-gradient(90deg, #00FF88, #17FF4D)`,
                                            opacity: hoveredCard === 'main' ? 1 : 0.7
                                        }
                                    }}>
                                        <CardContent sx={{ p: 4 }}>
                                            {/* Avatar and Basic Info */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                                                <Badge
                                                    overlap="circular"
                                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                    badgeContent={
                                                        user.is_active ? (
                                                            <VerifiedIcon 
                                                                sx={{ 
                                                                    color: '#00FF88', 
                                                                    fontSize: 24,
                                                                    // filter: 'drop-shadow(0 0 5px #00FF88)'
                                                                }} 
                                                            />
                                                        ) : null
                                                    }>
                                                        <Avatar 
                                                            sx={{ 
                                                                width: 120, 
                                                                height: 120, 
                                                                mr: 4,
                                                                background: 'linear-gradient(45deg, #00FF88, #17FF4D)',
                                                                fontSize: '2.5rem',
                                                                fontWeight: 'bold',
                                                                boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)'
                                                            }}>
                                                            {getInitials(user.usuario)}
                                                        </Avatar>
                                                </Badge>

                                                <Box sx={{ flex: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                        <Typography 
                                                            variant="h3" 
                                                            sx={{ 
                                                                color: 'white',
                                                                fontFamily: 'cursive',
                                                                fontWeight: 'bold',
                                                                mr: 2
                                                            }}>
                                                            {user.usuario}
                                                        </Typography>
                                                        <IconButton 
                                                            sx={{ 
                                                                color: '#00FF88',
                                                                '&:hover': { 
                                                                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                                                                    transform: 'scale(1.1)'
                                                                }
                                                            }}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                                        <Chip
                                                            icon={user.rol?.nombre_rol?.toLowerCase() === 'admin' ? <AdminIcon /> : <PersonIcon />}
                                                            label={user.rol?.nombre_rol || 'Usuario'}
                                                            sx={{
                                                                backgroundColor: getRoleColor(user.rol?.nombre_rol),
                                                                color: 'black',
                                                                fontWeight: 'bold',
                                                                '& .MuiChip-icon': { color: 'black' }
                                                            }}
                                                        />
                                                        
                                                        <Chip
                                                            icon={<SecurityIcon />}
                                                            label={user.is_active ? 'Activo' : 'Inactivo'}
                                                            sx={{
                                                                backgroundColor: getStatusColor(user.is_active),
                                                                color: 'black',
                                                                fontWeight: 'bold',
                                                                '& .MuiChip-icon': { color: 'black' }
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Box>

                                            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 4 }} />

                                            {/* Detailed Information */}
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                                        <EmailIcon sx={{ color: '#00FF88', fontSize: 24, mr: 2 }} />
                                                        <Box>
                                                            <Typography variant="body2" sx={{ color: '#888', mb: 0.5 }}>
                                                                Correo Electrónico
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                                {user.correo}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                                        <CalendarIcon sx={{ color: '#00FF88', fontSize: 24, mr: 2 }} />
                                                        <Box>
                                                            <Typography variant="body2" sx={{ color: '#888', mb: 0.5 }}>
                                                                Fecha de Registro
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                                {formatFechaHora(user.registro)}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                                
                                                <Grid item xs={12} md={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                                        <ScheduleIcon sx={{ color: '#00FF88', fontSize: 24, mr: 2 }} />
                                                        <Box>
                                                            <Typography variant="body2" sx={{ color: '#888', mb: 0.5 }}>
                                                                Última Actualización
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                                {formatFechaHora(user.updated_at)}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                                
                                                <Grid item xs={12} md={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                                        <SecurityIcon sx={{ color: '#00FF88', fontSize: 24, mr: 2 }} />
                                                        <Box>
                                                            <Typography variant="body2" sx={{ color: '#888', mb: 0.5 }}>
                                                                Estado de la Cuenta
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                                {user.estado?.nombre_estado || 'No especificado'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                </Card>
                            </Zoom>
                        </Grid>

                        {/* Additional Info Cards */}
                        <Grid item xs={12} md={4}>
                            <Grid container spacing={3}>
                                {/* Stats Card */}
                                <Grid item xs={12}>
                                    <Zoom in={true} timeout={1200}>
                                        <Card
                                            onMouseEnter={() => setHoveredCard('stats')}
                                            onMouseLeave={() => setHoveredCard(null)}
                                            sx={{
                                                background: hoveredCard === 'stats' 
                                                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 215, 0, 0.1) 100%)'
                                                    : 'rgba(255, 255, 255, 0.05)',
                                                backdropFilter: 'blur(10px)',
                                                border: hoveredCard === 'stats' 
                                                    ? '2px solid #FFD700'
                                                    : '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: 4,
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                transform: hoveredCard === 'stats' ? 'translateY(-5px)' : 'translateY(0)',
                                                // boxShadow: hoveredCard === 'stats' 
                                                //     ? '0 20px 40px rgba(255, 215, 0, 0.2)' 
                                                //     : '0 8px 32px rgba(0, 0, 0, 0.3)',
                                                overflow: 'hidden',
                                                position: 'relative',
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: '4px',
                                                    background: `linear-gradient(90deg, #FFD700, #FFA500)`,
                                                    opacity: hoveredCard === 'stats' ? 1 : 0.7
                                                }
                                            }}>
                                                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                                    <PersonIcon 
                                                        sx={{ 
                                                            color: '#FFD700', 
                                                            fontSize: 48, 
                                                            mb: 2,
                                                            filter: 'drop-shadow(0 0 10px #FFD700)'
                                                        }} 
                                                    />

                                                    <Typography variant="h6" sx={{ color: 'white', mb: 1, fontFamily: 'cursive' }}>
                                                        Resumen
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#888', mb: 2 }}>
                                                        Actividad de la cuenta
                                                    </Typography>

                                                    <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                                                        <Box>
                                                            <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                                                                {user.is_active ? '✓' : '✗'}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: '#888' }}>
                                                                Estado
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                        </Card>
                                    </Zoom>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* CSS Animations */}
                    <style jsx>{`
                        @keyframes pulse {
                            0%, 100% { opacity: 1; transform: scale(1); }
                            50% { opacity: 0.7; transform: scale(0.95); }
                        }
                    `}</style>
                </Container>
        </Box>
    )
}

export default PageProfile
import React, { useEffect, useState } from 'react'
import { deleteFavorite, getFavorites } from '../services/favorites'
import { Avatar, Box, Card, CardContent, Chip, CircularProgress, Container, Fade, Grid, IconButton, Typography, Zoom } from '@mui/material'
import { 
    Favorite as FavoriteIcon, 
    FavoriteBorder as FavoriteBorderIcon,
    Star as StarIcon,
    Schedule as ScheduleIcon,
    Sports as SportsIcon,
    EmojiEvents as TrophyIcon
} from '@mui/icons-material'
import { getStoredUser } from '../services/auth'
import { formatFecha } from '../services/encryptionService'

const Favorite = () => {
    const user = getStoredUser()
    const id_usuario = user?.id_usuario

    const [favoriteMatches, setFavoriteMatches] = useState([])
    const [loading, setLoading] = useState(true)
    const [hoveredCard, setHoveredCard] = useState(null)
    const [deletingIds, setDeletingIds] = useState(new Set())

    useEffect(() => {
        if (!id_usuario) return
        const fetchFavorites = async () => {
            setLoading(true)

            try {
                const response = await getFavorites(id_usuario)
                setFavoriteMatches(response || [])
            } catch (error) {
                console.error("Error al obtener estadísticas", error)
            } finally {
                setLoading(false)
            }
        }

        fetchFavorites()
    }, [id_usuario])

    const toggleFavorite = async (matchId) => {
        if (!id_usuario) return
        if (deletingIds.has(matchId)) return

        const prev = [...favoriteMatches]
        setDeletingIds(s => new Set(s).add(matchId))
        setFavoriteMatches(favs => favs.filter(m => m.id_partido !== matchId))

        try {
            await deleteFavorite(matchId, id_usuario)
        } catch (err) {
            console.error("Error eliminando favorito:", err)
            setFavoriteMatches(prev)
        } finally {
            setDeletingIds(s => {
                const copy = new Set(s)
                copy.delete(matchId)
                return copy
            })
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Finalizado': return '#FF4444'
            case 'Por Jugar': return '#00FF88'
            default: return '#888888'
        }
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
                    <FavoriteIcon 
                        sx={{ 
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: '#FF1717',
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
                    Cargando tus partidos favoritos...
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
                <Container maxWidth="xl">
                    {/* Header */}
                    <Fade in={true} timeout={1000}>
                        <Box sx={{ textAlign: 'center', mb: 6 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                <FavoriteIcon  
                                    sx={{ 
                                        fontSize: 60, 
                                        color: '#FF1717',
                                        mr: 2,
                                        filter: 'drop-shadow(0 0 20px #FF1717)',
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
                                        Mis Favoritos
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
                                Los partidos que más te emocionan, siempre a tu alcance
                            </Typography>
                        </Box>
                    </Fade>

                    {/* Matches Grid */}
                    {favoriteMatches.length === 0 ? (
                        <Fade in={true} timeout={1500}>
                            <Box 
                                sx={{ 
                                    textAlign: 'center', 
                                    py: 10,
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    borderRadius: 4,
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}>
                                    <FavoriteBorderIcon 
                                        sx={{ 
                                            fontSize: 100, 
                                            color: '#333',
                                            mb: 3,
                                            opacity: 0.5
                                        }} 
                                    />
                                    <Typography 
                                        variant="h4" 
                                        sx={{ 
                                            color: '#666',
                                            mb: 2,
                                            fontFamily: 'cursive'
                                        }}>
                                        No hay favoritos aún
                                    </Typography>
                                    <Typography 
                                        variant="body1" 
                                        sx={{ color: '#888' }}>
                                        Agrega partidos a tus favoritos para verlos aquí
                                    </Typography>
                            </Box>
                        </Fade>
                    ) : (
                        <Grid container spacing={3} justifyContent="center">
                            {favoriteMatches.map((match, index) => (
                                <Grid item xs={12} md={6} lg={4} key={match.id_partido}>
                                    <Zoom in={true} timeout={500 + index * 200}>
                                        <Card
                                            onMouseEnter={() => setHoveredCard(match.id_partido)}
                                            onMouseLeave={() => setHoveredCard(null)}
                                            sx={{
                                                // width: 1, 
                                                // maxWidth: 550,
                                                height: 260,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                background: hoveredCard === match.id_partido 
                                                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 255, 136, 0.1) 100%)'
                                                    : 'rgba(255, 255, 255, 0.05)',
                                                backdropFilter: 'blur(10px)',
                                                border: hoveredCard === match.id_partido 
                                                    ? '2px solid #00FF88'
                                                    : '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: 4,
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                transform: hoveredCard === match.id_partido ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
                                                boxShadow: hoveredCard === match.id_partido 
                                                    ? '0 20px 40px rgba(0, 255, 136, 0.2)' 
                                                    : '0 8px 32px rgba(0, 0, 0, 0.3)',
                                                cursor: 'pointer',
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
                                                    opacity: hoveredCard === match.id_partido ? 1 : 0.7
                                                }
                                            }}>
                                                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                    {/* Header with status and favorite */}
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Chip
                                                                label={match.partido.estado.nombre_estado === 'Histórico' ? 'HISTÓRICO' : match.partido.estado.nombre_estado === 'Por Jugar' ? 'PRÓXIMO' : 'FINALIZADO'}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: getStatusColor(match.partido.estado.nombre_estado),
                                                                    color: 'black',
                                                                    fontWeight: 'bold',
                                                                    fontSize: '0.7rem',
                                                                    animation: match.partido.estado.nombre_estado === 'Por Jugar' ? 'pulse 1.5s infinite' : 'none'
                                                                }}
                                                            />
                                                        </Box>

                                                        <IconButton
                                                            onClick={() => toggleFavorite(match.id_partido)}
                                                            disabled={deletingIds.has(match.id_partido)}
                                                            sx={{
                                                                color: '#FF1717',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(255, 23, 68, 0.1)',
                                                                    transform: 'scale(1.2)'
                                                                },
                                                                transition: 'all 0.3s'
                                                            }}>
                                                            <FavoriteIcon />
                                                        </IconButton>
                                                    </Box>

                                                    {/* Teams */}
                                                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', mb: 2 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                                                                <Avatar 
                                                                    sx={{ 
                                                                        mr: 2, 
                                                                        width: 55, 
                                                                        height: 55, 
                                                                        '& img': {
                                                                            objectFit: 'contain'
                                                                        } 
                                                                    }} 
                                                                    src={match.partido.equipo_local.logo}
                                                                />
                                                                
                                                                <Typography variant="body1" sx={{ 
                                                                        color: 'white', 
                                                                        fontWeight: 'bold',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'nowrap'
                                                                    }}>
                                                                    {match.partido.equipo_local.nombre_equipo}
                                                                </Typography>
                                                            </Box>

                                                            <Box sx={{ 
                                                                textAlign: 'center', 
                                                                mx: 2,
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                flexShrink: 0
                                                            }}>
                                                                <Typography variant="body1" sx={{ color: '#888' }}>
                                                                    VS
                                                                </Typography>
                                                            </Box>

                                                            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end', minWidth: 0 }}>
                                                                <Typography variant="body1" sx={{ 
                                                                    color: 'white', 
                                                                    fontWeight: 'bold', 
                                                                    mr: 1.5,
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap'
                                                                }}>
                                                                    {match.partido.equipo_visita.nombre_equipo}
                                                                </Typography>
                                                                <Avatar 
                                                                    sx={{ 
                                                                        mr: 2, 
                                                                        width: 55, 
                                                                        height: 55, 
                                                                        '& img': {
                                                                            objectFit: 'contain'
                                                                        } 
                                                                    }} 
                                                                    src={match.partido.equipo_visita.logo}
                                                                />
                                                            </Box>
                                                        </Box>
                                                    </Box>

                                                    {/* Match Info */}
                                                    <Box sx={{ 
                                                        display: 'flex', 
                                                        justifyContent: 'space-between', 
                                                        alignItems: 'center',
                                                        pt: 2,
                                                        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                                                    }}>
                                                        <Box>
                                                            <Typography variant="body2" sx={{ color: '#00FF88', fontWeight: 'bold' }}>
                                                                {match.partido.liga.nombre_liga}
                                                            </Typography>
                                                        </Box>

                                                        <Box sx={{ textAlign: 'right' }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 0.5 }}>
                                                                <ScheduleIcon sx={{ fontSize: 16, color: '#888', mr: 0.5 }} />
                                                                <Typography variant="body2" sx={{ color: 'white' }}>
                                                                    {formatFecha(match.partido.dia)}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                        </Card>
                                    </Zoom>
                                </Grid>
                            ))}
                        </Grid>
                    )}  
                </Container>

                {/* CSS Animations */}
                <style jsx>{`
                    @keyframes pulse {
                        0%, 100% { opacity: 1; transform: scale(1); }
                        50% { opacity: 0.7; transform: scale(0.95); }
                    }
                `}</style>
        </Box>
    )
}

export default Favorite
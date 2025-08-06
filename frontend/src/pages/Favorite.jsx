import { useState } from 'react'
import { deleteFavorite, getFavorites } from '../services/api/favorites'
import { Avatar, Box, Chip, CircularProgress, Container, Fade, Grid, IconButton, List, ListItem, Paper, Tooltip, Typography } from '@mui/material'
import {
    Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon, Schedule as ScheduleIcon,
    InfoOutlined, Assessment as AssessmentIcon
} from '@mui/icons-material'
import { getStoredUser } from '../services/auth'
import { formatFecha } from '../utils/helpers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useFavoritos } from '../hooks/FavoritosContext'
import { useNavigate } from 'react-router-dom'

const Favorite = () => {
    const user = getStoredUser()
    const id_usuario = user?.id_usuario
    const queryClient = useQueryClient()
    const [hoveredItem, setHoveredItem] = useState(null)
    const navigate = useNavigate()

    const { favoritos: favoriteMatches, loadingFavoritos: isLoading, isError, error } = useFavoritos()

    const deleteFavoriteMutation = useMutation({
        mutationFn: (matchId) => deleteFavorite(matchId, id_usuario),
        onMutate: async (matchId) => {
            await queryClient.cancelQueries(['favorites', id_usuario])
            const previousFavorites = queryClient.getQueryData(['favorites', id_usuario])
            queryClient.setQueryData(['favorites', id_usuario], old => old?.filter(m => m.id_partido !== matchId))
            return { previousFavorites }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites', id_usuario] })
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(['favorites', id_usuario], context.previousFavorites)
            console.error("Error al eliminar favorito. Revertiendo:", err)
        },
    })

    const handleInfoClick = (team1_id, team2_id, partido_id) => {
        navigate(`/dashboard/${partido_id}`, {
            state: {
                equipo_local: team1_id,
                equipo_visita: team2_id
            }
        })
    }

    const handleRemoveFavorite = (matchId) => {
        deleteFavoriteMutation.mutate(matchId)
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Finalizado':
            case 'Histórico':
                return '#FF4444'
            case 'Por Jugar':
                return '#368FF4'
            default:
                return '#888888'
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Finalizado':
            case 'Histórico':
                return <AssessmentIcon />
            case 'Por Jugar':
                return <InfoOutlined />
            default:
                return <ScheduleIcon />
        }
    }

    const getStatusLabel = (status) => {
        switch (status) {
            case 'Finalizado':
                return 'Resumen'
            case 'Histórico':
                return 'Resumen'
            case 'Por Jugar':
                return 'Información'
            default:
                return 'Info'
        }
    }

    if (isLoading) {
        return (
            <Box sx={{
                bgcolor: "#0a0a0a",
                minHeight: "100vh",
                background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)"
            }}>
                <Box sx={{ position: 'relative', mb: 4 }}>
                    <CircularProgress
                        size={80}
                        sx={{
                            color: '#368FF4',
                            filter: 'drop-shadow(0 0 20px #368FF4)'
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
                        color: '#368FF4',
                        fontFamily: 'cursive',
                        textShadow: '0 0 10px #368FF4'
                    }}>
                    Cargando tus partidos favoritos...
                </Typography>
            </Box>
        )
    }

    if (isError) {
        return (
            <Box sx={{ color: 'red', textAlign: 'center', p: 4, backgroundColor: '#0e0f0f', minHeight: '100vh' }}>
                <Typography variant="h5">Error al cargar los favoritos.</Typography>
                <Typography variant="body1">{error.message}</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{
            bgcolor: "#0a0a0a",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)"
        }}>
            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
                {/* Header */}
                <Fade in={true} timeout={1000}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                            <FavoriteIcon
                                sx={{
                                    fontSize: 50,
                                    color: '#FF1717',
                                    mr: 2,
                                    filter: 'drop-shadow(0 0 15px #FF1717)'
                                }}
                            />
                            <Typography
                                variant="h3"
                                sx={{
                                    color: 'white',
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(45deg, #FF1717, #FF6B6B)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                Mis Favoritos
                            </Typography>
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#888',
                                fontStyle: 'italic'
                            }}>
                            {favoriteMatches.length} {favoriteMatches.length === 1 ? 'partido favorito' : 'partidos favoritos'}
                        </Typography>
                    </Box>
                </Fade>

                {/* Matches Grid */}
                {favoriteMatches.length === 0 ? (
                    <Fade in={true} timeout={1500}>
                        <Paper
                            elevation={8}
                            sx={{
                                textAlign: 'center',
                                py: 8,
                                px: 4,
                                bgcolor: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 4
                            }}>
                            <FavoriteBorderIcon
                                sx={{
                                    fontSize: 80,
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
                                    fontWeight: 'bold'
                                }}>
                                No tienes favoritos aún
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ color: '#888' }}>
                                Agrega partidos a tus favoritos desde la lista principal para verlos aquí
                            </Typography>
                        </Paper>
                    </Fade>
                ) : (
                    <Paper
                        elevation={12}
                        sx={{
                            bgcolor: '#1a1a1a',
                            border: '1px solid #333',
                            borderRadius: 3,
                            overflow: 'hidden'
                        }}
                    >
                        <List sx={{ py: 0 }}>
                            {favoriteMatches.map((match, index) => {
                                const partido = match.partido
                                const status = partido.estado.nombre_estado
                                const statusColor = getStatusColor(status)

                                return (
                                    <motion.div
                                        key={partido.id_partido}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                    >
                                        <ListItem
                                            onMouseEnter={() => setHoveredItem(partido.id_partido)}
                                            onMouseLeave={() => setHoveredItem(null)}
                                            sx={{
                                                width: '100%',
                                                borderBottom: index < favoriteMatches.length - 1 ? "1px solid #333" : 'none',
                                                py: 2,
                                                px: 1,
                                                bgcolor: hoveredItem === partido.id_partido ? 'rgba(54,143,244,0.05)' : 'transparent',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    bgcolor: 'rgba(54,143,244,0.08)',
                                                    transform: 'translateX(8px)'
                                                }
                                            }}
                                        >
                                            <Grid
                                                container
                                                alignItems="center"
                                                // no hace falta spacing grande si usas justifyContent
                                                sx={{ width: '100%' }}
                                                wrap="nowrap"
                                            >
                                                {/* Estado */}
                                                <Grid item xs="auto" sx={{ mr: 1 }}>
                                                    <Chip
                                                        label={
                                                            status === 'Histórico' ? 'HISTÓRICO' :
                                                                status === 'Por Jugar' ? 'PRÓXIMO' :
                                                                    'FINALIZADO'
                                                        }
                                                        size="small"
                                                        sx={{
                                                            bgcolor: statusColor,
                                                            color: 'black',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.65rem',
                                                            minWidth: '80px'
                                                        }}
                                                    />
                                                </Grid>

                                                {/* Equipos: este debe crecer y ocupar el espacio intermedio */}
                                                <Grid item xs sx={{ minWidth: 0, mx: 1 }}>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                        {/* Local */}
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 1,
                                                                justifyContent: 'space-between'
                                                            }}
                                                        >
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                                                                <Avatar
                                                                    alt={partido.equipo_local.nombre_equipo}
                                                                    src={partido.equipo_local.logo}
                                                                    sx={{ width: 28, height: 28, '& img': { objectFit: 'contain' } }}
                                                                />
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        color: 'white',
                                                                        fontSize: '14px',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'nowrap',
                                                                        flex: 1,
                                                                        minWidth: 0
                                                                    }}
                                                                >
                                                                    {partido.equipo_local.nombre_equipo}
                                                                </Typography>
                                                            </Box>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: 'white',
                                                                    fontWeight: 'bold',
                                                                    minWidth: '30px',
                                                                    textAlign: 'center',
                                                                }}
                                                            >
                                                                {partido.estadisticas?.FTHG ?? '-'}
                                                            </Typography>
                                                        </Box>

                                                        {/* Visitante */}
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 1,
                                                                justifyContent: 'space-between'
                                                            }}
                                                        >
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                                                                <Avatar
                                                                    alt={partido.equipo_visita.nombre_equipo}
                                                                    src={partido.equipo_visita.logo}
                                                                    sx={{ width: 28, height: 28, '& img': { objectFit: 'contain' } }}
                                                                />
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        color: 'white',
                                                                        fontSize: '14px',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'nowrap',
                                                                        flex: 1,
                                                                        minWidth: 0
                                                                    }}
                                                                >
                                                                    {partido.equipo_visita.nombre_equipo}
                                                                </Typography>
                                                            </Box>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: 'white',
                                                                    fontWeight: 'bold',
                                                                    minWidth: '30px',
                                                                    textAlign: 'center',
                                                                }}
                                                            >
                                                                {partido.estadisticas?.FTAG ?? '-'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Grid>

                                                {/* Fecha / Liga */}
                                                <Grid item xs="auto" sx={{ mx: 10 }}>
                                                    <Box sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: '#368FF4',
                                                                fontWeight: 'bold',
                                                                display: 'block',
                                                                mb: 0.5
                                                            }}
                                                        >
                                                            {partido.liga.nombre_liga}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: 'white', fontSize: '11px' }}>
                                                            {formatFecha(partido.dia)}
                                                        </Typography>
                                                    </Box>
                                                </Grid>

                                                {/* Acciones */}
                                                <Grid item xs="auto" sx={{ ml: 'auto' }}>
                                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                        <Tooltip title={getStatusLabel(status)} arrow>
                                                            <IconButton
                                                                onClick={() =>
                                                                    handleInfoClick(
                                                                        partido.equipo_local.nombre_equipo,
                                                                        partido.equipo_visita.nombre_equipo,
                                                                        partido.id_partido
                                                                    )
                                                                }
                                                                sx={{
                                                                    color: statusColor,
                                                                    bgcolor: `${statusColor}20`,
                                                                    '&:hover': {
                                                                        bgcolor: `${statusColor}30`,
                                                                        transform: 'scale(1.1)'
                                                                    },
                                                                    transition: 'all 0.3s ease'
                                                                }}
                                                            >
                                                                {getStatusIcon(status)}
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Quitar de favoritos" arrow>
                                                            <IconButton
                                                                onClick={() => handleRemoveFavorite(partido.id_partido)}
                                                                disabled={deleteFavoriteMutation.isLoading}
                                                                sx={{
                                                                    color: '#FF1717',
                                                                    '&:hover': {
                                                                        bgcolor: 'rgba(255, 23, 23, 0.2)',
                                                                        transform: 'scale(1.1)'
                                                                    },
                                                                    transition: 'all 0.3s ease'
                                                                }}
                                                            >
                                                                {deleteFavoriteMutation.isLoading ? (
                                                                    <CircularProgress size={20} sx={{ color: '#FF1717' }} />
                                                                ) : (
                                                                    <FavoriteIcon />
                                                                )}
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                    </motion.div>
                                )
                            })}
                        </List>
                    </Paper>
                )}
            </Container>
        </Box>
    )
}

export default Favorite
import { useState } from 'react'
import { deleteFavorite } from '../services/api/favorites'
import { Avatar, Box, Chip, CircularProgress, Container, Fade, Grid, IconButton, List, ListItem, Paper, Tooltip, Typography, useTheme } from '@mui/material'
import {
    Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon, Schedule as ScheduleIcon,
    InfoOutlined, Assessment as AssessmentIcon
} from '@mui/icons-material'
import { getStoredUser } from '../services/auth'
import { formatFecha } from '../utils/helpers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useFavoritos } from '../hooks/FavoritosContext'
import { useNavigate } from 'react-router-dom'
import LoadingFavorite from '../components/Loading/LoadingFavorite'
import Header from '../components/Forms/controls/Header'

const Favorite = () => {
    const user = getStoredUser()
    const id_usuario = user?.id_usuario
    const queryClient = useQueryClient()
    const [hoveredItem, setHoveredItem] = useState(null)
    const navigate = useNavigate()
    const theme = useTheme()

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
            <LoadingFavorite />
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
            minHeight: "100vh",
            background: theme.palette.background.default
        }}>
            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
                {/* Header */}
                <Header
                    title='Mis Favoritos'
                    subtitle={`${favoriteMatches.length} ${favoriteMatches.length === 1 ? 'partido favorito' : 'partidos favoritos'}`} />

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
                            bgcolor: theme.palette.background.default,
                            border: `1px solid ${theme.palette.text.secondary}`,
                            borderRadius: 2,
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
                                                sx={{
                                                    width: '100%',
                                                    flexWrap: { xs: 'wrap', sm: 'nowrap' }
                                                }}
                                            >
                                                {/* Estado */}
                                                <Grid item xs="auto" sx={{ ml: 3 }}>
                                                    <Chip
                                                        label={
                                                            status === 'Histórico' ? 'HISTÓRICO' :
                                                                status === 'Por Jugar' ? 'PRÓXIMO' :
                                                                    'FINALIZADO'
                                                        }
                                                        size="small"
                                                        sx={{
                                                            bgcolor: statusColor,
                                                            color: theme.custom.blanco,
                                                            fontWeight: 'bold',
                                                            fontSize: '0.65rem',
                                                            minWidth: { xs: '60px', sm: '80px' }
                                                        }}
                                                    />
                                                </Grid>

                                                {/* Equipos: este debe crecer y ocupar el espacio intermedio */}
                                                <Grid item xs sx={{ minWidth: 0, mx: { xs: 2, sm: 10 } }}>
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
                                                                    sx={{ width: 30, height: 30, '& img': { objectFit: 'contain' } }}
                                                                />
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        color: theme.palette.text.primary,
                                                                        fontSize: { xs: '12px', sm: '14px' },
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
                                                                    fontSize: { xs: '12px', sm: '14px' },
                                                                    color: theme.palette.text.primary,
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
                                                                    sx={{ width: 30, height: 30, '& img': { objectFit: 'contain' } }}
                                                                />
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        color: theme.palette.text.primary,
                                                                        fontSize: { xs: '12px', sm: '14px' },
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
                                                                    color: theme.palette.text.primary,
                                                                    fontSize: { xs: '12px', sm: '14px' },
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
                                                <Grid item xs="auto" sx={{ mx: { xs: 2, sm: 10 } }}>
                                                    <Box sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                fontSize: { xs: '12px', sm: '14px' },
                                                                color: theme.palette.primary.light,
                                                                fontWeight: 'bold',
                                                                display: 'block',
                                                                mb: 0.5
                                                            }}
                                                        >
                                                            {partido.liga.nombre_liga}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: theme.palette.text.primary, fontSize: '11px' }}>
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
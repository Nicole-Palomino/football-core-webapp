import { Avatar, Box, Chip, Container, Grid, IconButton, Paper, Tooltip, Typography, useTheme } from '@mui/material'
import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getMatcheByID } from '../../../services/api/matches'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from '../../Loading/LoadingSpinner'
import {
    HorizontalRule, Stadium, CalendarToday, ArrowBack,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { formatFecha } from '../../../utils/helpers'
import CustomPrediction from '../Details/CustomPrediction'

const MatchPrediction = () => {

    const theme = useTheme()
    const { id_partido } = useParams()
    const location = useLocation()
    const [value, setValue] = useState(0)
    const navigate = useNavigate()

    const equipo_local = location.state?.equipo_local
    const equipo_visita = location.state?.equipo_visita

    // 1. Consulta para Match by ID
    const {
        data: matchData,
        isLoading: isLoadingMatch,
        isError: isErrorMatch,
        error: errorMatch
    } = useQuery({
        queryKey: ["matchById", id_partido],
        queryFn: () => getMatcheByID({ id_partido }),
        staleTime: 1000 * 60 * 15,
        cacheTime: 5 * 60 * 1000
    })

    const nombre_liga = matchData?.liga?.nombre_liga

    // Manejo de estados de carga combinados
    const isLoading = isLoadingMatch
    const isError = isErrorMatch

    if (isLoading) return <LoadingSpinner />

    if (isError) {
        return (
            <div>
                <h2>Error al cargar datos:</h2>
                {isErrorMatch && <p>Match by ID: {errorMatch.message}</p>}
            </div>
        )
    }

    const finalMatchDataAsArray = matchData
        ? (Array.isArray(matchData) ? matchData : [matchData])
        : []

    const handleGoBack = () => navigate(-1)

    return (
        <Box sx={{
            minHeight: "100vh",
        }}>
            {/* Header con botón de regreso */}
            <Box sx={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                backdropFilter: "blur(10px)",
                borderBottom: "1px solid #333",
                py: 1
            }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: "flex", alignItems: "center", py: 1 }}>
                        <Tooltip title="Regresar" arrow>
                            <IconButton
                                onClick={handleGoBack}
                                sx={{
                                    bgcolor: theme.palette.primary.dark,
                                    border: "1px solid rgba(54, 143, 244, 0.3)",
                                    mr: 2,
                                    "&:hover": {
                                        bgcolor: theme.palette.primary.main,
                                        transform: "translateX(-2px)"
                                    },
                                    transition: "all 0.3s ease"
                                }}
                            >
                                <ArrowBack sx={{ color: theme.custom.blanco }} />
                            </IconButton>
                        </Tooltip>
                        <Typography
                            variant="h5"
                            sx={{
                                color: theme.palette.text.primary,
                                fontWeight: "bold",
                                flexGrow: 1
                            }}
                        >
                            Predicciones para el Partido
                        </Typography>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: { xs: 1, md: 4 } }}>
                {finalMatchDataAsArray.map((partidoID, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <Paper
                            elevation={24}
                            sx={{
                                bgcolor: theme.palette.background.paper,
                                borderRadius: 4,
                                overflow: "hidden",
                                boxShadow: "0 20px 40px rgba(54,143,244,0.1)"
                            }}
                        >
                            {/* Header - Liga */}
                            <Box sx={{
                                background: "linear-gradient(135deg, #368FF4 0%, #165AA6 100%)",
                                py: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: "white",
                                        fontWeight: "bold",
                                        fontSize: { xs: "1.2rem", md: "1.5rem" }
                                    }}
                                >
                                    {partidoID.liga?.nombre_liga}
                                </Typography>
                            </Box>

                            {/* Información del partido */}
                            <Box sx={{ p: { xs: 1, md: 4 }, background: theme.palette.background.paper, }}>
                                {/* Estadio y fecha */}
                                <Box sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 2,
                                    mb: 3,
                                    flexWrap: "wrap"
                                }}>
                                    <Chip
                                        icon={<Stadium />}
                                        label={partidoID.equipo_local?.estadio}
                                        sx={{
                                            padding: "5px",
                                            bgcolor: theme.palette.background.paper,
                                            boxShadow: "0 5px 5px #888",
                                            fontSize: "20px",
                                            color: theme.palette.text.primary,
                                            "& .MuiChip-icon": { color: theme.palette.primary.main }
                                        }}
                                    />
                                    <Chip
                                        icon={<CalendarToday />}
                                        label={formatFecha(partidoID.dia)}
                                        sx={{
                                            padding: "5px",
                                            bgcolor: theme.palette.background.paper,
                                            boxShadow: "0 5px 5px #888",
                                            fontSize: "20px",
                                            color: theme.palette.text.primary,
                                            "& .MuiChip-icon": { color: theme.palette.primary.main }
                                        }}
                                    />
                                </Box>

                                {/* Equipos y marcador */}
                                <Grid container spacing={2} alignItems="center" sx={{ mb: 4, justifyContent: { xs: 'center', md: 'space-between' } }}>
                                    {/* Equipo Local */}
                                    <Grid item xs={4} sm={4} md={3} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Box sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                p: { xs: 1, md: 2 },
                                                borderRadius: 2,
                                                border: "2px solid #333",
                                                minWidth: { xs: 80, md: 140 },
                                            }}>
                                                <Avatar
                                                    alt={partidoID.equipo_local?.nombre_equipo}
                                                    src={partidoID.equipo_local?.logo}
                                                    sx={{
                                                        width: { xs: 35, md: 80 },
                                                        height: { xs: 35, md: 80 },
                                                        '& img': { objectFit: 'contain' },
                                                    }}
                                                />
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: theme.palette.text.primary,
                                                        mt: 2,
                                                        textAlign: "center",
                                                        fontSize: { xs: "0.6rem", md: "1.1rem" },
                                                        wordBreak: 'break-word',
                                                    }}
                                                >
                                                    {partidoID.equipo_local?.nombre_equipo}
                                                </Typography>
                                            </Box>
                                        </motion.div>
                                    </Grid>

                                    {/* Marcador */}
                                    <Grid item xs={4} sm={4} md={4} sx={{ display: 'flex', justifyContent: 'center', }}>
                                        <Box sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            p: { xs: 1, md: 3 },
                                            minWidth: { xs: 'auto', md: 180 },
                                        }}>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: theme.palette.primary.main, mb: 1, fontWeight: "bold", fontSize: { xs: '0.6rem', md: '0.9rem' } }}
                                            >
                                                RESULTADO
                                            </Typography>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 0.5
                                            }}>
                                                <Typography
                                                    sx={{ fontSize: { xs: "1.2rem", md: "3.5rem" }, color: theme.palette.text.primary, fontWeight: "bold" }}
                                                >
                                                    {partidoID.estadisticas?.FTHG ?? " "}
                                                </Typography>
                                                <HorizontalRule sx={{ color: theme.palette.primary.main, fontSize: { xs: "1rem", md: "3rem" } }} />
                                                <Typography
                                                    sx={{
                                                        color: theme.palette.text.primary,
                                                        fontWeight: "bold",
                                                        fontSize: { xs: "1.2rem", md: "3.5rem" }
                                                    }}
                                                >
                                                    {partidoID.estadisticas?.FTAG ?? " "}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    {/* Equipo Visitante */}
                                    <Grid item xs={4} sm={4} md={3} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Box sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                p: { xs: 1, md: 2 },
                                                borderRadius: 2,
                                                // bgcolor: theme.palette.background.paper,
                                                border: "2px solid #333",
                                                minWidth: { xs: 80, md: 140 },
                                            }}>
                                                <Avatar
                                                    alt={partidoID.equipo_visita?.nombre_equipo}
                                                    src={partidoID.equipo_visita?.logo}
                                                    sx={{
                                                        width: { xs: 35, md: 80 },
                                                        height: { xs: 35, md: 80 },
                                                        '& img': { objectFit: 'contain' },
                                                    }}
                                                />
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: theme.palette.text.primary,
                                                        mt: 2,
                                                        textAlign: "center",
                                                        fontSize: { xs: "0.6rem", md: "1.1rem" },
                                                        wordBreak: 'break-word',
                                                    }}
                                                >
                                                    {partidoID.equipo_visita?.nombre_equipo}
                                                </Typography>
                                            </Box>
                                        </motion.div>
                                    </Grid>
                                </Grid>

                                <Box sx={{ width: '100%' }}>
                                    <Box sx={{ borderBottom: 1, borderColor: '#333' }}>
                                        <CustomPrediction 
                                            equipo_local={equipo_local}
                                            equipo_visita={equipo_visita}
                                            nombre_liga={nombre_liga}/>
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>
                    </motion.div>
                ))}
            </Container>
        </Box>
    )
}

export default MatchPrediction
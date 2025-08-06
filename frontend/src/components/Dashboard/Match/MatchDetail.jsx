import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getMatcheByID } from '../../../services/api/matches'
import { Avatar, Box, Chip, CircularProgress, Container, Grid, IconButton, Paper, Tab, Tabs, Tooltip, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { HorizontalRule, Stadium, CalendarToday, ArrowBack } from '@mui/icons-material'
import { formatFecha } from '../../../utils/helpers'
import { a11yProps, CustomTabPanel } from '../../../utils/a11yProps'
import TotalMatch from './graphics/TotalMatch'
import PieCharts from './graphics/PieChart'
import H2HTabPanel from '../../Dashboard/Details/H2HTabPanel'
import { getCompleteAnalysis } from '../../../services/functions'
import CardChart from './graphics/CardChart'

const MatchDetail = () => {
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
        queryKey: ['matchById', id_partido],
        queryFn: () => getMatcheByID({ id_partido: id_partido }),
        staleTime: 1000 * 60 * 15,
        cacheTime: 5 * 60 * 1000
    })

    const nombre_liga = matchData?.liga?.nombre_liga

    // 2. Consulta para Match Stats
    const {
        data: matchesStats,
        isLoading: isLoadingStats,
        isError: isErrorStats,
        error: errorStats
    } = useQuery({
        queryKey: ['matchesStats', equipo_local, equipo_visita],
        queryFn: () => getCompleteAnalysis(nombre_liga, equipo_local, equipo_visita),
        enabled: !!equipo_local && !!equipo_visita && !!nombre_liga,
        staleTime: 1000 * 60 * 15,
        cacheTime: 5 * 60 * 1000
    })

    // Manejo de estados de carga combinados
    const isLoading = isLoadingMatch || isLoadingStats
    const isError = isErrorMatch || isErrorStats

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    width: "100%",
                }}>
                <CircularProgress size={80} sx={{ color: '#228B22' }} />
                <Typography mt={2} variant="h6" sx={{ color: '#228B22' }}>
                    Cargando datos...
                </Typography>
            </Box>
        )
    }

    if (isError) {
        return (
            <div>
                <h2>Error al cargar datos:</h2>
                {isErrorStats && <p>Match Stats: {errorStats.message}</p>}
                {isErrorMatch && <p>Match by ID: {errorMatch.message}</p>}
            </div>
        );
    }

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const handleGoBack = () => {
        navigate(-1)
    }

    const finalMatchesStats = matchesStats || []
    const finalMatchDataAsArray = matchData
        ? (Array.isArray(matchData) ? matchData : [matchData])
        : []

    return (
        <Box sx={{
            bgcolor: "#0a0a0a",
            minHeight: "100vh",
        }}>
            {/* Header con botón de regreso */}
            <Box sx={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                bgcolor: "rgba(10, 10, 10, 0.95)",
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
                                    color: "#00FF88",
                                    bgcolor: "rgba(54, 143, 244, 0.1)",
                                    border: "1px solid rgba(54, 143, 244, 0.3)",
                                    mr: 2,
                                    "&:hover": {
                                        bgcolor: "rgba(54, 143, 244, 0.2)",
                                        transform: "translateX(-2px)"
                                    },
                                    transition: "all 0.3s ease"
                                }}
                            >
                                <ArrowBack sx={{ color: '#368FF4' }} />
                            </IconButton>
                        </Tooltip>
                        <Typography
                            variant="h5"
                            sx={{
                                color: "white",
                                fontWeight: "bold",
                                flexGrow: 1
                            }}
                        >
                            Detalles del Partido
                        </Typography>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
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
                                bgcolor: "#1a1a1a",
                                borderRadius: 4,
                                border: "1px solid #333",
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
                            <Box sx={{ p: { xs: 2, md: 4 } }}>
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
                                            bgcolor: "#333",
                                            fontSize: "20px",
                                            color: "white",
                                            "& .MuiChip-icon": { color: "#368FF4" }
                                        }}
                                    />
                                    <Chip
                                        icon={<CalendarToday />}
                                        label={formatFecha(partidoID.dia)}
                                        sx={{
                                            padding: "5px",
                                            bgcolor: "#333",
                                            fontSize: "20px",
                                            color: "white",
                                            "& .MuiChip-icon": { color: "#368FF4" }
                                        }}
                                    />
                                </Box>

                                {/* Equipos y marcador */}
                                <Grid container spacing={2} alignItems="center" sx={{ mb: 4, justifyContent: { xs: 'center', md: 'space-between' } }}>
                                    {/* Equipo Local */}
                                    <Grid item xs={12} sm={4} md={3} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Box sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: "#242424",
                                                border: "1px solid #333",
                                                minWidth: 140,
                                            }}>
                                                <Avatar
                                                    alt={partidoID.equipo_local?.nombre_equipo}
                                                    src={partidoID.equipo_local?.logo}
                                                    sx={{
                                                        width: { xs: 60, md: 80 },
                                                        height: { xs: 60, md: 80 },
                                                        '& img': { objectFit: 'contain' },
                                                        border: "2px solid #444"
                                                    }}
                                                />
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: "white",
                                                        mt: 2,
                                                        textAlign: "center",
                                                        fontSize: { xs: "0.9rem", md: "1.1rem" },
                                                        wordBreak: 'break-word',
                                                    }}
                                                >
                                                    {partidoID.equipo_local?.nombre_equipo}
                                                </Typography>
                                            </Box>
                                        </motion.div>
                                    </Grid>

                                    {/* Marcador */}
                                    <Grid item xs={12} sm={4} md={4} sx={{ display: 'flex', justifyContent: 'center', }}>
                                        <Box sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            p: 3,
                                            borderRadius: 2,
                                            bgcolor: "#242424",
                                            border: "2px solid #368FF4",
                                            minWidth: 180,
                                        }}>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: "#368FF4", mb: 2, fontWeight: "bold" }}
                                            >
                                                RESULTADO
                                            </Typography>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 1
                                            }}>
                                                <Typography
                                                    variant="h2"
                                                    sx={{
                                                        color: "white",
                                                        fontWeight: "bold",
                                                        fontSize: { xs: "2.5rem", md: "3.5rem" }
                                                    }}
                                                >
                                                    {partidoID.estadisticas?.FTHG ?? " "}
                                                </Typography>
                                                <HorizontalRule sx={{
                                                    color: "#368FF4",
                                                    fontSize: { xs: "2rem", md: "3rem" }
                                                }} />
                                                <Typography
                                                    variant="h2"
                                                    sx={{
                                                        color: "white",
                                                        fontWeight: "bold",
                                                        fontSize: { xs: "2.5rem", md: "3.5rem" }
                                                    }}
                                                >
                                                    {partidoID.estadisticas?.FTAG ?? " "}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    {/* Equipo Visitante */}
                                    <Grid item xs={12} sm={4} md={3} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Box sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: "#242424",
                                                border: "1px solid #333",
                                                minWidth: 140,
                                            }}>
                                                <Avatar
                                                    alt={partidoID.equipo_visita?.nombre_equipo}
                                                    src={partidoID.equipo_visita?.logo}
                                                    sx={{
                                                        width: { xs: 60, md: 80 },
                                                        height: { xs: 60, md: 80 },
                                                        '& img': { objectFit: 'contain' },
                                                        border: "2px solid #444"
                                                    }}
                                                />
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: "white",
                                                        mt: 2,
                                                        textAlign: "center",
                                                        fontSize: { xs: "0.9rem", md: "1.1rem" },
                                                        wordBreak: 'break-word',
                                                    }}
                                                >
                                                    {partidoID.equipo_visita?.nombre_equipo}
                                                </Typography>
                                            </Box>
                                        </motion.div>
                                    </Grid>
                                </Grid>

                                {/* Tabs de contenido */}
                                <Box sx={{ width: '100%' }}>
                                    <Box sx={{ borderBottom: 1, borderColor: '#333' }}>
                                        <Tabs
                                            value={value}
                                            onChange={handleChange}
                                            aria-label="match details tabs"
                                            variant="fullWidth"
                                            sx={{
                                                "& .MuiTabs-indicator": {
                                                    backgroundColor: "#368FF4",
                                                    height: 3
                                                },
                                                "& .MuiTab-root": {
                                                    color: "#888",
                                                    fontWeight: "bold",
                                                    fontSize: { xs: "0.9rem", md: "1rem" }
                                                },
                                                "& .MuiTab-root.Mui-selected": {
                                                    color: "#368FF4"
                                                }
                                            }}
                                        >
                                            <Tab label="📊 Estadísticas" {...a11yProps(0)} />
                                            <Tab label="⚔️ H2H" {...a11yProps(1)} />
                                        </Tabs>
                                    </Box>

                                    <CustomTabPanel value={value} index={0}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                // minHeight: '50vh',
                                                width: '100%',
                                            }}
                                        >
                                            {finalMatchesStats ? (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    <Box sx={{ width: '100%', px: { xs: 2, sm: 4 }, py: 4 }}>
                                                        <div className="flex justify-end mb-4">
                                                            <button
                                                                onClick={() => navigate('/dashboard/analysis')} // <- ajusta tu ruta aquí
                                                                className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded transition duration-300"
                                                            >
                                                                🔍 Realizar un análisis más completo
                                                            </button>
                                                        </div>
                                                        <Grid container justifyContent="center" spacing={4}>
                                                            <Grid item xs={12} md={8}>
                                                                <TotalMatch totalMatches={finalMatchesStats.resumen?.total_enfrentamientos} />
                                                            </Grid>
                                                            <Grid item xs={12} md={10}>
                                                                <div className="bg-target border text-blue-500 rounded-md p-4 text-sm leading-6 shadow-sm">
                                                                    <div className="font-semibold mb-2 text-white">🧠 ¿Qué significan estas métricas?</div>
                                                                    <ul className="list-disc list-inside space-y-1 text-white">
                                                                        <li>
                                                                            <strong>Posesión Ofensiva:</strong> (Tiros + Tiros al arco + Corners) / Partidos. Indica el nivel de participación ofensiva del equipo.
                                                                        </li>
                                                                        <li>
                                                                            <strong>Eficiencia Ofensiva:</strong> Goles / Tiros al arco. Mide la capacidad de convertir oportunidades en goles.
                                                                        </li>
                                                                        <li>
                                                                            <strong>Goles Local/Visita:</strong> Producción goleadora según la localía. Evalúa el rendimiento en casa vs fuera de casa.
                                                                        </li>
                                                                        <li>
                                                                            <strong>Indisciplina:</strong> (Amarillas + Rojas) / Partidos. Nivel promedio de sanciones por partido.
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={12} md={8}>
                                                                <CardChart stats={finalMatchesStats.estadisticas_avanzadas[0]} />
                                                            </Grid>
                                                            <Grid item xs={12} md={8}>
                                                                <CardChart stats={finalMatchesStats.estadisticas_avanzadas[1]} />
                                                            </Grid>
                                                            <Grid item xs={12} md={10}>
                                                                <PieCharts stats={finalMatchesStats.resumen} equipo1={equipo_local} equipo2={equipo_visita} />
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                </motion.div>
                                            ) : (
                                                <Box sx={{ textAlign: "center", py: 4 }}>
                                                    <Typography variant="h6" color="#888">
                                                        No hay estadísticas disponibles
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </CustomTabPanel>

                                    <CustomTabPanel value={value} index={1}>
                                        {finalMatchesStats ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <H2HTabPanel h2hMatches={finalMatchesStats.enfrentamientos_directos} />
                                            </motion.div>
                                        ) : (
                                            <Box sx={{ textAlign: "center", py: 4 }}>
                                                <Typography variant="h6" color="#888">
                                                    No hay historial de enfrentamientos disponible
                                                </Typography>
                                            </Box>
                                        )}
                                    </CustomTabPanel>
                                </Box>
                            </Box>
                        </Paper>
                    </motion.div>
                ))}
            </Container>
        </Box>
    )
}

export default MatchDetail
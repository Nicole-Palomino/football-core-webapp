import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getMatcheByID } from '../../../services/api/matches'
import { Accordion, AccordionDetails, AccordionSummary, Alert, Avatar, Box, Card, CardContent, Chip, Container, Grid, IconButton, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tooltip, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
    Assessment as AssessmentIcon, HorizontalRule, Stadium, CalendarToday, ArrowBack,
    ExpandMore as ExpandMoreIcon, Insights as InsightsIcon, TrendingUp as TrendingUpIcon,
    Stadium as StadiumIcon, Sports as SportsIcon,
} from '@mui/icons-material'
import { formatFecha } from '../../../utils/helpers'
import { a11yProps, CustomTabPanel } from '../../../utils/a11yProps'
import TotalMatch from './graphics/TotalMatch'
import PieCharts from './graphics/PieChart'
import H2HTabPanel from '../../Dashboard/Details/H2HTabPanel'
import { getCompleteAnalysis } from '../../../services/functions'
import CardChart from './graphics/CardChart'
import LoadingSpinner from '../../Loading/LoadingSpinner'
import { TrophyIcon } from '@heroicons/react/24/outline'
import PieChartsOne from './graphics/PieChartsOne'
import CarruselSugerencias from './graphics/CarruselSugerencias'

const MatchDetail = () => {
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

    // 2. Consulta para Match Stats
    const {
        data: matchesStats,
        isLoading: isLoadingStats,
        isError: isErrorStats,
        error: errorStats
    } = useQuery({
        queryKey: ["matchesStats", equipo_local, equipo_visita],
        queryFn: () => getCompleteAnalysis(nombre_liga, equipo_local, equipo_visita),
        enabled: Boolean(equipo_local && equipo_visita && nombre_liga),
        staleTime: 1000 * 60 * 15,
        cacheTime: 5 * 60 * 1000
    })
    console.log(matchesStats)
    // Manejo de estados de carga combinados
    const isLoading = isLoadingMatch || isLoadingStats
    const isError = isErrorMatch || isErrorStats

    if (isLoading) return <LoadingSpinner />

    if (isError) {
        return (
            <div>
                <h2>Error al cargar datos:</h2>
                {isErrorStats && <p>Match Stats: {errorStats.message}</p>}
                {isErrorMatch && <p>Match by ID: {errorMatch.message}</p>}
            </div>
        );
    }

    const finalMatchesStats = matchesStats || []
    const finalMatchDataAsArray = matchData
        ? (Array.isArray(matchData) ? matchData : [matchData])
        : []

    const handleChange = (_, newValue) => setValue(newValue)
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
                                        bgcolor: "rgba(54, 143, 244, 0.2)",
                                        transform: "translateX(-2px)"
                                    },
                                    transition: "all 0.3s ease"
                                }}
                            >
                                <ArrowBack sx={{ color: theme.palette.primary.contrastText }} />
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
                            <Box sx={{ p: { xs: 2, md: 4 }, background: theme.palette.background.paper, }}>
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
                                            "& .MuiChip-icon": { color: theme.palette.primary.main }
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
                                                // bgcolor: theme.palette.background.paper,
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
                                            // borderRadius: 2,
                                            // bgcolor: theme.palette.background.paper ,
                                            // border: "2px solid #368FF4",
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
                                                    backgroundColor: theme.palette.primary.main,
                                                    height: 3
                                                },
                                                "& .MuiTab-root": {
                                                    color: theme.palette.text.secondary,
                                                    fontWeight: "bold",
                                                    fontSize: { xs: "0.6rem", md: "1.1rem" }
                                                },
                                                "& .MuiTab-root.Mui-selected": {
                                                    color: theme.palette.primary.main
                                                }
                                            }}
                                        >
                                            <Tab label="📊 Estadísticas" {...a11yProps(0)} />
                                            <Tab label="📈 Análisis" {...a11yProps(1)} />
                                            <Tab label="⚔️ H2H" {...a11yProps(2)} />
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
                                                    <Box sx={{ width: '100%' }}>
                                                        <Grid container justifyContent="center" spacing={4}>
                                                            {/* Total de enfrentamientos */}
                                                            <Grid item xs={12} md={12}
                                                                sx={{
                                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                                                    py: 2,
                                                                    px: { xs: 1, md: 3 },
                                                                    width: '100%',
                                                                }}>
                                                                <TotalMatch totalMatches={finalMatchesStats.resumen?.total_enfrentamientos} />
                                                            </Grid>

                                                            {/* Resultados por equipo */}
                                                            <Grid item xs={12} md={6}
                                                                sx={{
                                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                                                    py: 2,
                                                                    px: { xs: 1, md: 3 },
                                                                }}>
                                                                <PieChartsOne
                                                                    Data={[
                                                                        { id: 0, label: equipo_local, value: finalMatchesStats.resumen.victorias_por_equipo.local },
                                                                        { id: 1, label: equipo_visita, value: finalMatchesStats.resumen.victorias_por_equipo.visitante },
                                                                        { id: 2, label: 'Empates', value: finalMatchesStats.resumen.victorias_por_equipo.empates }
                                                                    ]}
                                                                    title='⚽ Resultados por Equipo'
                                                                />
                                                            </Grid>

                                                            {/* Resultados por Localía */}
                                                            <Grid item xs={12} md={6}
                                                                sx={{
                                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                                                    py: 2,
                                                                    px: { xs: 1, md: 3 },
                                                                }}>
                                                                <PieChartsOne
                                                                    Data={[
                                                                        { label: 'Como Local', value: finalMatchesStats.resumen.victorias_por_localia.local },
                                                                        { label: 'Como Visitante', value: finalMatchesStats.resumen.victorias_por_localia.visitante },
                                                                        { label: 'Empates', value: finalMatchesStats.resumen.victorias_por_localia.empates }
                                                                    ]}
                                                                    title='🏠 Resultados por Localía'
                                                                />
                                                            </Grid>

                                                            {/* Estadísticas Avanzadas */}
                                                            <Grid item xs={12} md={12}
                                                                sx={{
                                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                                                    py: 2,
                                                                    px: { xs: 23, md: 2 },
                                                                    width: '100%',
                                                                }}>
                                                                <Accordion
                                                                    sx={{
                                                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                                        backdropFilter: 'blur(10px)',
                                                                        '&:before': { display: 'none' }
                                                                    }}>
                                                                    <AccordionSummary
                                                                        expandIcon={<ExpandMoreIcon sx={{ color: '#368FF4' }} />}
                                                                        sx={{
                                                                            backgroundColor: 'rgba(0, 255, 136, 0.1)',
                                                                            '&:hover': { backgroundColor: 'rgba(0, 255, 136, 0.15)' }
                                                                        }}
                                                                    >
                                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                            <InsightsIcon sx={{ color: '#368FF4', mr: 2 }} />
                                                                            <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontFamily: 'cursive' }}>
                                                                                🧠 ¿Qué significan estas métricas?
                                                                            </Typography>
                                                                        </Box>
                                                                    </AccordionSummary>
                                                                    <AccordionDetails sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                                                                        <Typography variant="body1" sx={{ color: theme.palette.text.primary, mb: 2 }}>
                                                                            Estas métricas se utilizan para analizar y comparar el rendimiento y estilo de juego de los equipos:
                                                                        </Typography>

                                                                        <Grid container spacing={2}>
                                                                            <Grid item xs={12} md={6}>
                                                                                <Alert
                                                                                    icon={<TrendingUpIcon />}
                                                                                    severity="info"
                                                                                    sx={{
                                                                                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                                                                        border: '1px solid rgba(33, 150, 243, 0.3)',
                                                                                        color: theme.palette.text.primary,
                                                                                        mb: 2
                                                                                    }}
                                                                                >
                                                                                    <strong>Posesión Ofensiva:</strong> (Tiros + Tiros al arco + Corners) / Partidos.
                                                                                    Indica el nivel de participación ofensiva del equipo.
                                                                                </Alert>

                                                                                <Alert
                                                                                    icon={<AssessmentIcon />}
                                                                                    severity="success"
                                                                                    sx={{
                                                                                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                                                                        border: '1px solid rgba(76, 175, 80, 0.3)',
                                                                                        color: theme.palette.text.primary,
                                                                                    }}
                                                                                >
                                                                                    <strong>Eficiencia Ofensiva:</strong> Goles / Tiros al arco.
                                                                                    Mide la capacidad de convertir oportunidades en goles.
                                                                                </Alert>
                                                                            </Grid>

                                                                            <Grid item xs={12} md={6}>
                                                                                <Alert
                                                                                    icon={<StadiumIcon />}
                                                                                    severity="warning"
                                                                                    sx={{
                                                                                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                                                                                        border: '1px solid rgba(255, 152, 0, 0.3)',
                                                                                        color: theme.palette.text.primary,
                                                                                        mb: 2
                                                                                    }}
                                                                                >
                                                                                    <strong>Goles Local/Visita:</strong> Producción goleadora según la localía.
                                                                                    Evalúa el rendimiento en casa vs fuera de casa.
                                                                                </Alert>

                                                                                <Alert
                                                                                    icon={<SportsIcon />}
                                                                                    severity="error"
                                                                                    sx={{
                                                                                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                                                                        border: '1px solid rgba(244, 67, 54, 0.3)',
                                                                                        color: theme.palette.text.primary
                                                                                    }}
                                                                                >
                                                                                    <strong>Indisciplina:</strong> (Amarillas + Rojas) / Partidos.
                                                                                    Nivel promedio de sanciones por partido.
                                                                                </Alert>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </AccordionDetails>
                                                                </Accordion>

                                                                <Card
                                                                    sx={{
                                                                        width: '100%',
                                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                                        backdropFilter: 'blur(10px)',
                                                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                                                        borderRadius: 1,
                                                                        overflow: 'hidden',
                                                                        position: 'relative',
                                                                        mt: 2,
                                                                        '&::before': {
                                                                            content: '""',
                                                                            position: 'absolute',
                                                                            top: 0,
                                                                            left: 0,
                                                                            right: 0,
                                                                            height: '4px',
                                                                            background: `linear-gradient(90deg, #FFD700, #FFA500)`
                                                                        }
                                                                    }}>
                                                                    <CardContent sx={{ p: 3, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
                                                                            <AssessmentIcon sx={{ color: '#FFD700', mr: 2, fontSize: { xs: 24, sm: 30 } }} />
                                                                            <Typography variant="h5" sx={{ color: theme.palette.text.primary, fontFamily: 'cursive', fontSize: { xs: '0.7rem', sm: '1.5rem' } }}>
                                                                                Métricas Avanzadas por Equipo
                                                                            </Typography>
                                                                        </Box>
                                                                        <CardChart stats={finalMatchesStats.estadisticas_avanzadas[0]} />
                                                                        <CardChart stats={finalMatchesStats.estadisticas_avanzadas[1]} />
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>

                                                            <Grid item xs={12} md={12}
                                                                sx={{
                                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                                                    py: 2,
                                                                    px: { xs: 23, md: 2 },
                                                                    width: '100%',
                                                                }}>
                                                                <CarruselSugerencias
                                                                    title="Enfrentamientos Directos"
                                                                    datos={finalMatchesStats.enfrentamientos_directos_sugerencias}
                                                                />
                                                            </Grid>

                                                            <Grid container xs={12} spacing={4} justifyContent="center">
                                                                <Grid item xs={12} md={4}
                                                                    sx={{
                                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                                                        py: 2,
                                                                        px: { xs: 1, md: 3 },
                                                                    }}>
                                                                    <CarruselSugerencias
                                                                        title="Enfrentamientos Directos"
                                                                        datos={finalMatchesStats.enfrentamientos_directos_sugerencias}
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={12} md={4}
                                                                    sx={{
                                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                                                        py: 2,
                                                                        px: { xs: 1, md: 3 },
                                                                    }}>
                                                                    <CarruselSugerencias
                                                                        title="Enfrentamientos Directos"
                                                                        datos={finalMatchesStats.enfrentamientos_directos_sugerencias}
                                                                    />
                                                                </Grid>
                                                            </Grid>

                                                            <Grid item xs={12} md={12}>
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

                                    <CustomTabPanel value={value} index={2}>
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
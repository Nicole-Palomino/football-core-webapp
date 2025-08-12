import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getMatcheByID } from '../../../services/api/matches'
import {
    Accordion, AccordionDetails, AccordionSummary, Alert, Avatar, Box, Card, CardContent,
    Chip, Container, Fade, Grid, IconButton, Paper, Tab, Tabs, Tooltip, Typography, useTheme
} from '@mui/material'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
    Assessment as AssessmentIcon, HorizontalRule, Stadium, CalendarToday, ArrowBack,
    ExpandMore as ExpandMoreIcon, Insights as InsightsIcon, TrendingUp as TrendingUpIcon,
    Stadium as StadiumIcon, Sports as SportsIcon, DataSaverOff as DataSaverOffIcon, TableChart as TableChartIcon,
} from '@mui/icons-material'
import { formatFecha } from '../../../utils/helpers'
import { a11yProps, CustomTabPanel } from '../../../utils/a11yProps'
import TotalMatch from './graphics/TotalMatch'
import PieCharts from './graphics/PieChart'
import H2HTabPanel from '../../Dashboard/Details/H2HTabPanel'
import { combinarAnalisisYPrediccion, getAnalyticsCluster, getCompleteAnalysis, getPoisson, getPredictionCluster } from '../../../services/functions'
import CardChart from './graphics/CardChart'
import LoadingSpinner from '../../Loading/LoadingSpinner'
import { TrophyIcon } from '@heroicons/react/24/outline'
import PieChartsOne from './graphics/PieChartsOne'
import CarruselSugerencias from './graphics/CarruselSugerencias'
import TablaConPaginacion from './graphics/TablaConPaginacion'

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

    // 3. Consulta para Poisson
    const {
        data: matchPoisson,
        isLoading: isLoadingPoisson,
        isError: isErrorPoisson,
        error: errorPoisson
    } = useQuery({
        queryKey: ["matchPoisson", equipo_local, equipo_visita],
        queryFn: () => getPoisson(nombre_liga, equipo_local, equipo_visita),
        enabled: Boolean(equipo_local && equipo_visita && nombre_liga),
        staleTime: 1000 * 60 * 15,
        cacheTime: 5 * 60 * 1000
    })

    const fetchClusterData = async (liga, equipo1, equipo2) => {
        const clusterAnalysis = await getAnalyticsCluster(liga, equipo1, equipo2)
        const clusterPrediction = await getPredictionCluster(liga, equipo1, equipo2)
        return combinarAnalisisYPrediccion(clusterAnalysis, clusterPrediction) || []
    }

    const {
        data: clusterData,
        isLoading: isLoadingCluster,
        isError: isErrorCluster,
        error: errorCluster
    } = useQuery({
        queryKey: ["clusterData", equipo_local, equipo_visita],
        queryFn: () => fetchClusterData(nombre_liga, equipo_local, equipo_visita),
        enabled: Boolean(nombre_liga, equipo_local, equipo_visita),
        staleTime: 1000 * 60 * 15,
        cacheTime: 5 * 60 * 1000
    })

    // Manejo de estados de carga combinados
    const isLoading = isLoadingMatch || isLoadingStats || isLoadingPoisson || isLoadingCluster
    const isError = isErrorMatch || isErrorStats || isErrorPoisson || isErrorCluster

    if (isLoading) return <LoadingSpinner />

    if (isError) {
        return (
            <div>
                <h2>Error al cargar datos:</h2>
                {isErrorStats && <p>Match Stats: {errorStats.message}</p>}
                {isErrorMatch && <p>Match by ID: {errorMatch.message}</p>}
                {isErrorPoisson && <p>Match Poisson: {errorPoisson.message}</p>}
                {isErrorCluster && <p>Match Cluster Data: {errorCluster.message}</p>}
            </div>
        )
    }

    const finalMatchesStats = matchesStats || []
    const finalMatchDataAsArray = matchData
        ? (Array.isArray(matchData) ? matchData : [matchData])
        : []
    const finalMatchPoisson = matchPoisson || []
    const finalMatchCluster = clusterData || []

    console.log(finalMatchCluster)
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
                                                <Fade in={true} timeout={1200}>
                                                    <Box sx={{ width: "100%", mx: "auto", maxWidth: "1400px" }}>
                                                        <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center', width: '100%' }}>
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={6}
                                                                sx={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    minWidth: { md: 1000, xs: 'auto' }
                                                                }}
                                                            >
                                                                <Grid className="grid grid-cols-1 gap-4">
                                                                    {/* Total de enfrentamientos */}
                                                                    <Card
                                                                        sx={{
                                                                            background: theme.palette.background.paper,
                                                                            color: theme.palette.text.primary,
                                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                                                            p: 3
                                                                        }}>
                                                                        <CardContent>
                                                                            <TotalMatch totalMatches={finalMatchesStats.resumen?.total_enfrentamientos} />
                                                                        </CardContent>
                                                                    </Card>
                                                                </Grid>

                                                                <Grid className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                                                                    {/* Resultados por equipo */}
                                                                    <Card
                                                                        sx={{
                                                                            background: theme.palette.background.paper,
                                                                            color: theme.palette.text.primary,
                                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                                                            p: 2,
                                                                        }}>
                                                                        <CardContent>
                                                                            <PieChartsOne
                                                                                Data={[
                                                                                    { id: 0, label: equipo_local, value: finalMatchesStats.resumen.victorias_por_equipo.local },
                                                                                    { id: 1, label: equipo_visita, value: finalMatchesStats.resumen.victorias_por_equipo.visitante },
                                                                                    { id: 2, label: 'Empates', value: finalMatchesStats.resumen.victorias_por_equipo.empates }
                                                                                ]}
                                                                                title='⚽ Resultados por Equipo'
                                                                            />
                                                                        </CardContent>
                                                                    </Card>

                                                                    {/* Resultados por Localía */}
                                                                    <Card
                                                                        sx={{
                                                                            background: theme.palette.background.paper,
                                                                            color: theme.palette.text.primary,
                                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                                                            p: 2,
                                                                        }}>
                                                                        <CardContent>
                                                                            <PieChartsOne
                                                                                Data={[
                                                                                    { label: 'Como Local', value: finalMatchesStats.resumen.victorias_por_localia.local },
                                                                                    { label: 'Como Visitante', value: finalMatchesStats.resumen.victorias_por_localia.visitante },
                                                                                    { label: 'Empates', value: finalMatchesStats.resumen.victorias_por_localia.empates }
                                                                                ]}
                                                                                title='🏠 Resultados por Localía'
                                                                            />
                                                                        </CardContent>
                                                                    </Card>
                                                                </Grid>

                                                                <Grid className="grid grid-cols-1 gap-4 mt-5">
                                                                    {/* Estadísticas Avanzadas */}
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

                                                                <Grid className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                                                                    <Card
                                                                        sx={{
                                                                            background: theme.palette.background.paper,
                                                                            color: theme.palette.text.primary,
                                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                                                            p: 2,
                                                                        }}>
                                                                        <CarruselSugerencias
                                                                            title="Racha del Equipo Local"
                                                                            datos={finalMatchesStats.racha_equipo_1}
                                                                        />
                                                                    </Card>

                                                                    <Card
                                                                        sx={{
                                                                            background: theme.palette.background.paper,
                                                                            color: theme.palette.text.primary,
                                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                                                            p: 2,
                                                                        }}>
                                                                        <CarruselSugerencias
                                                                            title="Racha del Equipo Visitante"
                                                                            datos={finalMatchesStats.racha_equipo_2}
                                                                        />
                                                                    </Card>
                                                                </Grid>

                                                                <Grid className="grid grid-cols-1 gap-4 mt-5">
                                                                    <Card
                                                                        sx={{
                                                                            background: theme.palette.background.paper,
                                                                            color: theme.palette.text.primary,
                                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                                                            p: 2,
                                                                        }}>
                                                                        <CarruselSugerencias
                                                                            title="Enfrentamientos directos"
                                                                            datos={finalMatchesStats.enfrentamientos_directos_sugerencias}
                                                                        />
                                                                    </Card>
                                                                </Grid>

                                                                <Grid className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                                                                    <Card
                                                                        sx={{
                                                                            background: theme.palette.background.paper,
                                                                            color: theme.palette.text.primary,
                                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                                                            p: 2,
                                                                            overflow: 'hidden',
                                                                            position: 'relative',
                                                                            '&::before': {
                                                                                content: '""',
                                                                                position: 'absolute',
                                                                                top: 0,
                                                                                left: 0,
                                                                                right: 0,
                                                                                height: '4px',
                                                                                background: `linear-gradient(90deg, #368FF4, #17FF4D)`
                                                                            }
                                                                        }}>
                                                                        <CardContent sx={{ p: { xs: 1, md: 3 } }}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                                                                <SportsIcon sx={{ color: '#368FF4', mr: 2 }} />
                                                                                <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontFamily: 'cursive' }}>
                                                                                    🟦 Últimos 5 partidos de {equipo_local}
                                                                                </Typography>
                                                                            </Box>

                                                                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                                                                <table
                                                                                    className="w-full text-sm text-left rtl:text-right"
                                                                                    style={{ color: theme.palette.text.secondary }}
                                                                                >
                                                                                    <thead
                                                                                        className="text-xs uppercase"
                                                                                        style={{
                                                                                            backgroundColor: theme.palette.primary.main,
                                                                                            color: theme.palette.primary.contrastText,
                                                                                            textAlign: 'center'
                                                                                        }}
                                                                                    >
                                                                                        <tr>
                                                                                            <th scope="col" className="px-1 py-2 font-bold whitespace-nowrap">Fecha</th>
                                                                                            <th scope="col" className="px-1 py-2 font-bold whitespace-nowrap">Local</th>
                                                                                            <th scope="col" className="px-1 py-2 font-bold whitespace-nowrap">Visitante</th>
                                                                                            <th scope="col" className="px-1 py-2 font-bold whitespace-nowrap">Resultado</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {finalMatchesStats.ultimos_partidos[equipo_local].map((partido, index) => {
                                                                                            const esLocal = partido.HomeTeam === equipo_local
                                                                                            const esVisitante = partido.AwayTeam === equipo_local

                                                                                            return (
                                                                                                <tr
                                                                                                    key={index}
                                                                                                    className="border-b"
                                                                                                    style={{
                                                                                                        backgroundColor: index % 2 === 0
                                                                                                            ? theme.palette.background.paper
                                                                                                            : theme.palette.background.default,
                                                                                                        borderColor: theme.palette.divider.primary
                                                                                                    }}
                                                                                                >
                                                                                                    <td
                                                                                                        className="px-1 py-2 text-center whitespace-nowrap"
                                                                                                        style={{ color: theme.palette.text.primary }}
                                                                                                    >
                                                                                                        {formatFecha(partido.Date)}
                                                                                                    </td>
                                                                                                    <td
                                                                                                        className="px-1 py-2 text-center whitespace-nowrap"
                                                                                                        style={{
                                                                                                            fontWeight: esLocal ? '700' : '400',
                                                                                                            backgroundColor: esLocal
                                                                                                                ? theme.custom.amarillo
                                                                                                                : 'transparent',
                                                                                                            color: esLocal
                                                                                                                ? '#000'
                                                                                                                : theme.palette.text.primary,
                                                                                                        }}
                                                                                                    >
                                                                                                        {partido.HomeTeam}
                                                                                                    </td>
                                                                                                    <td
                                                                                                        className="px-1 py-2 text-center whitespace-nowrap"
                                                                                                        style={{
                                                                                                            fontWeight: esVisitante ? '700' : '400',
                                                                                                            backgroundColor: esVisitante
                                                                                                                ? theme.custom.amarillo
                                                                                                                : 'transparent',
                                                                                                            color: esVisitante
                                                                                                                ? '#000'
                                                                                                                : theme.palette.text.primary,
                                                                                                        }}
                                                                                                    >
                                                                                                        {partido.AwayTeam}
                                                                                                    </td>
                                                                                                    <td
                                                                                                        className="px-1 py-2 text-center font-bold whitespace-nowrap"
                                                                                                        style={{ color: theme.palette.text.primary }}
                                                                                                    >
                                                                                                        {partido.FTHG} - {partido.FTAG}
                                                                                                    </td>
                                                                                                </tr>
                                                                                            )
                                                                                        })}
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </CardContent>
                                                                    </Card>

                                                                    <Card
                                                                        sx={{
                                                                            background: theme.palette.background.paper,
                                                                            color: theme.palette.text.primary,
                                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                                                            p: 2,
                                                                            overflow: 'hidden',
                                                                            position: 'relative',
                                                                            '&::before': {
                                                                                content: '""',
                                                                                position: 'absolute',
                                                                                top: 0,
                                                                                left: 0,
                                                                                right: 0,
                                                                                height: '4px',
                                                                                background: `linear-gradient(90deg, #368FF4, #17FF4D)`
                                                                            }
                                                                        }}>
                                                                        <CardContent sx={{ p: { xs: 1, md: 3 } }}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                                                                <SportsIcon sx={{ color: '#FF4444', mr: 2 }} />
                                                                                <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontFamily: 'cursive' }}>
                                                                                    🟥 Últimos 5 partidos de {equipo_visita}
                                                                                </Typography>
                                                                            </Box>

                                                                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                                                                <table
                                                                                    className="w-full text-sm text-left rtl:text-right"
                                                                                    style={{ color: theme.palette.text.secondary }}
                                                                                >
                                                                                    <thead
                                                                                        className="text-xs uppercase"
                                                                                        style={{
                                                                                            backgroundColor: theme.palette.primary.main,
                                                                                            color: theme.palette.primary.contrastText,
                                                                                            textAlign: 'center'
                                                                                        }}
                                                                                    >
                                                                                        <tr>
                                                                                            <th scope="col" className="px-1 py-2 font-bold whitespace-nowrap">Fecha</th>
                                                                                            <th scope="col" className="px-1 py-2 font-bold whitespace-nowrap">Local</th>
                                                                                            <th scope="col" className="px-1 py-2 font-bold whitespace-nowrap">Visitante</th>
                                                                                            <th scope="col" className="px-1 py-2 font-bold whitespace-nowrap">Resultado</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {finalMatchesStats.ultimos_partidos[equipo_visita].map((partido, index) => {
                                                                                            const esLocal = partido.HomeTeam === equipo_visita
                                                                                            const esVisitante = partido.AwayTeam === equipo_visita

                                                                                            return (
                                                                                                <tr
                                                                                                    key={index}
                                                                                                    className="border-b"
                                                                                                    style={{
                                                                                                        backgroundColor: index % 2 === 0
                                                                                                            ? theme.palette.background.paper
                                                                                                            : theme.palette.background.default,
                                                                                                        borderColor: theme.palette.divider.primary
                                                                                                    }}
                                                                                                >
                                                                                                    <td
                                                                                                        className="px-1 py-2 text-center whitespace-nowrap"
                                                                                                        style={{ color: theme.palette.text.primary }}
                                                                                                    >
                                                                                                        {formatFecha(partido.Date)}
                                                                                                    </td>
                                                                                                    <td
                                                                                                        className="px-1 py-2 text-center whitespace-nowrap"
                                                                                                        style={{
                                                                                                            fontWeight: esLocal ? '700' : '400',
                                                                                                            backgroundColor: esLocal
                                                                                                                ? theme.custom.amarillo
                                                                                                                : 'transparent',
                                                                                                            color: esLocal
                                                                                                                ? '#000'
                                                                                                                : theme.palette.text.primary,
                                                                                                        }}
                                                                                                    >
                                                                                                        {partido.HomeTeam}
                                                                                                    </td>
                                                                                                    <td
                                                                                                        className="px-1 py-2 text-center whitespace-nowrap"
                                                                                                        style={{
                                                                                                            fontWeight: esVisitante ? '700' : '400',
                                                                                                            backgroundColor: esVisitante
                                                                                                                ? theme.custom.amarillo
                                                                                                                : 'transparent',
                                                                                                            color: esVisitante
                                                                                                                ? '#000'
                                                                                                                : theme.palette.text.primary,
                                                                                                        }}
                                                                                                    >
                                                                                                        {partido.AwayTeam}
                                                                                                    </td>
                                                                                                    <td
                                                                                                        className="px-1 py-2 text-center font-bold whitespace-nowrap"
                                                                                                        style={{ color: theme.palette.text.primary }}
                                                                                                    >
                                                                                                        {partido.FTHG} - {partido.FTAG}
                                                                                                    </td>
                                                                                                </tr>
                                                                                            );
                                                                                        })}
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </CardContent>
                                                                    </Card>
                                                                </Grid>

                                                                <Grid className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                                                                    <Card
                                                                        sx={{
                                                                            background: theme.palette.background.paper,
                                                                            color: theme.palette.text.primary,
                                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                                                            p: 2,
                                                                            overflow: 'hidden',
                                                                            position: 'relative',
                                                                            '&::before': {
                                                                                content: '""',
                                                                                position: 'absolute',
                                                                                top: 0,
                                                                                left: 0,
                                                                                right: 0,
                                                                                height: '4px',
                                                                                background: `linear-gradient(90deg, #B5FC9F, #B89FFC)`
                                                                            }
                                                                        }}>
                                                                        <CardContent>
                                                                            <PieChartsOne
                                                                                Data={[
                                                                                    { id: 0, label: equipo_local, value: finalMatchesStats.primer_tiempo.goles_primer_tiempo.local },
                                                                                    { id: 1, label: equipo_visita, value: finalMatchesStats.primer_tiempo.goles_primer_tiempo.visitante },
                                                                                ]}
                                                                                title='⚽ Goles en el Primer Tiempo'
                                                                            />
                                                                        </CardContent>
                                                                    </Card>

                                                                    <Card
                                                                        sx={{
                                                                            background: theme.palette.background.paper,
                                                                            color: theme.palette.text.primary,
                                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                                                            p: 2,
                                                                            overflow: 'hidden',
                                                                            position: 'relative',
                                                                            '&::before': {
                                                                                content: '""',
                                                                                position: 'absolute',
                                                                                top: 0,
                                                                                left: 0,
                                                                                right: 0,
                                                                                height: '4px',
                                                                                background: `linear-gradient(90deg, #FCE00A, #0AFC67)`
                                                                            }
                                                                        }}>
                                                                        <CardContent>
                                                                            <Typography variant="h6" align="center" sx={{ fontWeight: 'bold', color: theme.palette.text.primary, mb: 2 }}>
                                                                                📊 Ventaja en el Primer Tiempo
                                                                            </Typography>

                                                                            <Typography variant="body1" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                                                                                🏠 <strong>{equipo_local}</strong>: se fue al descanso ganando en <strong>{finalMatchesStats.primer_tiempo.ventaja_primer_tiempo.local}</strong> de <strong>{finalMatchesStats.primer_tiempo.ventaja_primer_tiempo.total_ht}</strong> partidos.
                                                                            </Typography>

                                                                            <Typography variant="body1" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                                                                                🟡 Ambos equipos empataron al descanso en <strong>{finalMatchesStats.primer_tiempo.ventaja_primer_tiempo.empate_ht}</strong> de <strong>{finalMatchesStats.primer_tiempo.ventaja_primer_tiempo.total_ht}</strong> partidos.
                                                                            </Typography>

                                                                            <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                                                                                ✈️ <strong>{equipo_visita}</strong>: se fue al descanso ganando en <strong>{finalMatchesStats.primer_tiempo.ventaja_primer_tiempo.visitante}</strong> de <strong>{finalMatchesStats.primer_tiempo.ventaja_primer_tiempo.total_ht}</strong> partidos.
                                                                            </Typography>
                                                                        </CardContent>
                                                                    </Card>
                                                                </Grid>

                                                                <Grid className="grid grid-cols-1 gap-4 mt-5">
                                                                    <Card
                                                                        sx={{
                                                                            background: theme.palette.background.paper,
                                                                            color: theme.palette.text.primary,
                                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                                                            p: 2,
                                                                            overflow: 'hidden',
                                                                            position: 'relative',
                                                                            '&::before': {
                                                                                content: '""',
                                                                                position: 'absolute',
                                                                                top: 0,
                                                                                left: 0,
                                                                                right: 0,
                                                                                height: '4px',
                                                                                background: `linear-gradient(90deg, #0A24BA, #BA0A24)`
                                                                            }
                                                                        }}>
                                                                        <CardContent sx={{ p: { xs: 1, md: 3 } }}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                                                                <InsightsIcon sx={{ color: '#368FF4', mr: 2 }} />
                                                                                <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontFamily: 'cursive' }}>
                                                                                    🟦 Todos los enfrentamientos entre {equipo_local} - {equipo_visita}
                                                                                </Typography>
                                                                            </Box>

                                                                            <TablaConPaginacion matches={finalMatchesStats} />
                                                                        </CardContent>
                                                                    </Card>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                </Fade>
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
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                // minHeight: '50vh',
                                                width: '100%',
                                            }}
                                        >
                                            {finalMatchPoisson ? (
                                                <Fade in={true} timeout={1200}>
                                                    <Box sx={{ width: "100%", mx: "auto", maxWidth: "1400px" }}>
                                                        <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center', width: '100%' }}>
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={6}
                                                                sx={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    minWidth: { md: 1000, xs: 'auto' }
                                                                }}
                                                            >
                                                                <Typography
                                                                    sx={{
                                                                        color: 'white',
                                                                        mb: 4,
                                                                        textAlign: 'center',
                                                                        fontFamily: 'cursive',
                                                                        background: 'linear-gradient(45deg, #368FF4, #17FF4D)',
                                                                        backgroundClip: 'text',
                                                                        WebkitBackgroundClip: 'text',
                                                                        WebkitTextFillColor: 'transparent',
                                                                        fontSize: { xs: 18, md: 36 }
                                                                    }}>
                                                                    Análisis Probabilístico (Modelo de Poisson)
                                                                </Typography>

                                                                <Grid className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    {/* goles esperados */}
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
                                                                                background: `linear-gradient(90deg, #8CC6E7, #E7AD8C)`
                                                                            }
                                                                        }}>
                                                                        <CardContent sx={{ p: 3, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
                                                                                <AssessmentIcon sx={{ color: '#E7AD8C', mr: 2, fontSize: { xs: 24, sm: 30 } }} />
                                                                                <Typography variant="h5" sx={{ color: theme.palette.text.primary, fontFamily: 'cursive', fontSize: { xs: '0.7rem', sm: '1.5rem' } }}>
                                                                                    Goles Esperados
                                                                                </Typography>
                                                                            </Box>
                                                                            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                                                                                <Box>
                                                                                    <Typography variant="h4" sx={{ color: '#368FF4', textAlign: 'center', fontWeight: 600 }}>
                                                                                        {finalMatchPoisson?.goles_esperados?.local}
                                                                                    </Typography>
                                                                                    <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                                                                                        {equipo_local}
                                                                                    </Typography>
                                                                                </Box>
                                                                                <Box>
                                                                                    <Typography variant="h4" sx={{ color: '#FF4444', textAlign: 'center', fontWeight: 600 }}>
                                                                                        {finalMatchPoisson?.goles_esperados?.visitante}
                                                                                    </Typography>
                                                                                    <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                                                                                        {equipo_visita}
                                                                                    </Typography>
                                                                                </Box>
                                                                            </Box>
                                                                        </CardContent>
                                                                    </Card>

                                                                    {/* probabilidades */}
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
                                                                                background: `linear-gradient(90deg, #E17C34, #34E1D4)`
                                                                            }
                                                                        }}>
                                                                        <CardContent sx={{ p: 3, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
                                                                                <DataSaverOffIcon sx={{ color: '#E17C34', mr: 2, fontSize: { xs: 24, sm: 30 } }} />
                                                                                <Typography variant="h5" sx={{ color: theme.palette.text.primary, fontFamily: 'cursive', fontSize: { xs: '0.7rem', sm: '1.5rem' } }}>
                                                                                    Probabilidades 1X2
                                                                                </Typography>
                                                                            </Box>
                                                                            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                                                                                <Box>
                                                                                    <Typography sx={{ color: '#368FF4', textAlign: 'center', fontWeight: 600, fontSize: { xs: 20, md: 30 } }}>
                                                                                        {finalMatchPoisson?.probabilidades_1x2.local}%
                                                                                    </Typography>
                                                                                    <Typography variant="body1" sx={{ color: theme.palette.text.primary, textAlign: 'center' }}>
                                                                                        {equipo_local}
                                                                                    </Typography>
                                                                                </Box>
                                                                                <Box>
                                                                                    <Typography sx={{ color: '#E17C34', textAlign: 'center', fontWeight: 600, fontSize: { xs: 20, md: 30 } }}>
                                                                                        {finalMatchPoisson?.probabilidades_1x2.empate}%
                                                                                    </Typography>
                                                                                    <Typography variant="body1" sx={{ color: theme.palette.text.primary, textAlign: 'center' }}>
                                                                                        Empate
                                                                                    </Typography>
                                                                                </Box>
                                                                                <Box>
                                                                                    <Typography sx={{ color: '#FF4444', textAlign: 'center', fontWeight: 600, fontSize: { xs: 20, md: 30 } }}>
                                                                                        {finalMatchPoisson?.probabilidades_1x2?.visita}%
                                                                                    </Typography>
                                                                                    <Typography variant="body1" sx={{ color: theme.palette.text.primary, textAlign: 'center' }}>
                                                                                        {equipo_visita}
                                                                                    </Typography>
                                                                                </Box>
                                                                            </Box>
                                                                        </CardContent>
                                                                    </Card>
                                                                </Grid>

                                                                <Grid className="grid grid-cols-1 gap-4 mt-5">
                                                                    {/* probabilidades */}
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
                                                                                background: `linear-gradient(90deg, #FB7452, #D9FB52)`
                                                                            }
                                                                        }}>
                                                                        <CardContent sx={{ p: 3, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
                                                                                <TableChartIcon sx={{ color: '#FB7452', mr: 2, fontSize: { xs: 24, sm: 30 } }} />
                                                                                <Typography variant="h5" sx={{ color: theme.palette.text.primary, fontFamily: 'cursive', fontSize: { xs: '0.7rem', sm: '1.5rem' } }}>
                                                                                    Matriz de Resultados Exactos
                                                                                </Typography>
                                                                            </Box>
                                                                            {finalMatchPoisson?.matriz_scores_exactos && (
                                                                                <Box sx={{ overflowX: 'auto' }}>
                                                                                    <Box component="table" sx={{ borderCollapse: 'collapse', width: '100%', minWidth: 400 }}>
                                                                                        <thead>
                                                                                            <tr>
                                                                                                <th style={{ color: theme.palette.text.primary, padding: '4px', fontSize: 'clamp(12px, 2vw, 20px)', textAlign: 'center' }}>Local \ Visita</th>
                                                                                                {Object.keys(finalMatchPoisson.matriz_scores_exactos[0]).map((col) => (
                                                                                                    <th key={col} style={{ color: theme.palette.text.primary, padding: '4px', fontSize: 'clamp(12px, 2vw, 20px)', textAlign: 'center' }}>
                                                                                                        {col}
                                                                                                    </th>
                                                                                                ))}
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            {Object.entries(finalMatchPoisson.matriz_scores_exactos).map(([golesLocal, row]) => (
                                                                                                <tr key={golesLocal}>
                                                                                                    <td style={{ color: theme.palette.primary.main, padding: '4px', fontSize: 'clamp(12px, 2vw, 20px)', textAlign: 'center' }}>{golesLocal}</td>
                                                                                                    {Object.entries(row).map(([golesVisita, prob]) => (
                                                                                                        <td key={golesVisita} style={{ color: theme.palette.text.secondary, padding: '4px', fontSize: 'clamp(12px, 2vw, 20px)', textAlign: 'center' }}>
                                                                                                            {prob.toFixed(1)}%
                                                                                                        </td>
                                                                                                    ))}
                                                                                                </tr>
                                                                                            ))}
                                                                                        </tbody>
                                                                                    </Box>
                                                                                </Box>
                                                                            )}
                                                                        </CardContent>
                                                                    </Card>
                                                                </Grid>

                                                                <Typography
                                                                    sx={{
                                                                        color: 'white',
                                                                        mb: 4,
                                                                        mt: 4,
                                                                        textAlign: 'center',
                                                                        fontFamily: 'cursive',
                                                                        background: 'linear-gradient(45deg, #368FF4, #17FF4D)',
                                                                        backgroundClip: 'text',
                                                                        WebkitBackgroundClip: 'text',
                                                                        WebkitTextFillColor: 'transparent',
                                                                        fontSize: { xs: 18, md: 36 }
                                                                    }}>
                                                                    Predicción del Partido basada en Clustering K-Means
                                                                </Typography>

                                                                <Grid className="grid grid-cols-1 gap-4">
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
                                                                                background: `linear-gradient(90deg, #D20419, #D2BD04)`
                                                                            }
                                                                        }}>
                                                                        <CardContent sx={{ p: 3, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                                                                            <h2 className="text-xl font-bold" style={{ color: theme.palette.text.primary }}>Resumen del Partido</h2>
                                                                            <p className="text-md whitespace-pre-line" style={{ color: theme.palette.text.primary }}>{finalMatchCluster?.descripcion_cluster_predicho}</p>
                                                                        </CardContent>
                                                                    </Card>
                                                                </Grid>

                                                                <Grid className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                                                background: `linear-gradient(90deg, #88EA3D, #3D88EA)`
                                                                            }
                                                                        }}>
                                                                        <CardContent sx={{ p: 3, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                                                                            <h4 className="font-semibold" style={{ color: theme.palette.text.primary }}>Goles Esperados FT</h4>
                                                                            <p style={{ color: theme.palette.text.primary }}>Local: {clusterData?.prediccion.predicciones.goles_esperados_local}</p>
                                                                            <p style={{ color: theme.palette.text.primary }}>Visitante: {clusterData?.prediccion.predicciones.goles_esperados_visitante}</p>
                                                                        </CardContent>
                                                                    </Card>

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
                                                                                background: `linear-gradient(90deg, #DD4C32, #C3DD32)`
                                                                            }
                                                                        }}>
                                                                        <CardContent sx={{ p: 3, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                                                                            <h4 className="font-semibold" style={{ color: theme.palette.text.primary }}>Goles Esperados HT</h4>
                                                                            <p style={{ color: theme.palette.text.primary }}>Local: {clusterData?.prediccion.predicciones.goles_ht_local}</p>
                                                                            <p style={{ color: theme.palette.text.primary }}>Visitante: {clusterData?.prediccion.predicciones.goles_ht_visitante}</p>
                                                                        </CardContent>
                                                                    </Card>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                </Fade>
                                            ) : (
                                                <Box sx={{ textAlign: "center", py: 4 }}>
                                                    <Typography variant="h6" color="#888">
                                                        No hay análisis disponible
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
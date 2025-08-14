import { useState } from 'react'
import {
    Box,
    Card,
    CardContent,
    Container,
    Typography,
    Grid,
    Fade,
    Zoom,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    Alert,
} from '@mui/material'
import {
    Analytics as AnalyticsIcon,
    ExpandMore as ExpandMoreIcon,
    Sports as SportsIcon,
    TrendingUp as TrendingUpIcon,
    Assessment as AssessmentIcon,
    EmojiEvents as TrophyIcon,
    Stadium as StadiumIcon,
    Insights as InsightsIcon,
    QueryStats as QueryStatsIcon,
    DataSaverOff as DataSaverOffIcon,
    TableChart as TableChartIcon
} from '@mui/icons-material'
import { combinarAnalisisYPrediccion, getAnalyticsCluster, getCompleteAnalysis, getLigues, getPoisson, getPredictionCluster, getTeams } from '../services/functions'
import { useQuery } from '@tanstack/react-query'
import CarruselSugerencias from '../components/Dashboard/Match/graphics/CarruselSugerencias'
import PieChartsOne from '../components/Dashboard/Match/graphics/PieChartsOne'
import { formatFecha } from '../utils/helpers'

const Analysis = () => {

    const [loading, setLoading] = useState(false)
    const [equipos, setEquipos] = useState([])
    const [selectedLiga, setSelectedLiga] = useState('')
    const [selectedEquipo1, setSelectedEquipo1] = useState('')
    const [selectedEquipo2, setSelectedEquipo2] = useState('')
    const [analysisData, setAnalysisData] = useState(null)
    const [hoveredCard, setHoveredCard] = useState(null)
    const [poissonData, setPoissonData] = useState(null)
    const [clusterData, setClusterData] = useState(null)

    function parseLigas(raw) {
        return Object.entries(raw).map(([key, value]) => ({
            id: key,
            nombre: key,
            logo: value.logo,
            color: value.color,
        }));
    }

    const { data: ligas, isLoading: isLoadingLigas, isError: isErrorLigas } = useQuery({
        queryKey: ['ligas'],
        queryFn: async () => {
            const response = await getLigues()
            return parseLigas(response.ligas)
        },
        // staleTime: Infinity,
        staleTime: 1000 * 60 * 15,
        cacheTime: 5 * 60 * 1000
    })

    if (isLoadingLigas) {
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

    const fetchEquipos = async (liga) => {
        try {
            setLoading(true)
            // Replace with actual API call to /analysis/equipos/{liga}
            const response = await getTeams(liga)
            setEquipos(response.equipos || [])
            console.log(response.equipos)
        } catch (error) {
            console.error('Error fetching equipos:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLigaChange = (event) => {
        const liga = event.target.value
        setSelectedLiga(liga)
        setEquipos([])
        setSelectedEquipo1('')
        setSelectedEquipo2('')
        setAnalysisData(null)
        setClusterData(null)
        setPoissonData(null)
        if (liga) {
            fetchEquipos(liga)
        }
    }

    const handleEquipo1Change = (event) => {
        const equipo = event.target.value
        setSelectedEquipo1(equipo)
        setAnalysisData(null)
        setClusterData(null)
        setPoissonData(null)
    }

    const handleEquipo2Change = (event) => {
        const equipo = event.target.value
        setSelectedEquipo2(equipo)
        setAnalysisData(null)
        setClusterData(null)
        setPoissonData(null)
    }

    const fetchAnalysis = async (liga, equipo1, equipo2) => {
        if (!selectedLiga || !selectedEquipo1 || !selectedEquipo2) return
        try {
            setLoading(true)

            const response = await getCompleteAnalysis(liga, equipo1, equipo2)
            setAnalysisData(response || [])

            const poisson = await getPoisson(liga, equipo1, equipo2)
            setPoissonData(poisson || [])

            const clusterAnalysis = await getAnalyticsCluster(liga, equipo1, equipo2)
            const clusterPrediction = await getPredictionCluster(liga, equipo1, equipo2)
            const combinado = combinarAnalisisYPrediccion(clusterAnalysis, clusterPrediction)
            setClusterData(combinado || [])
        } catch (error) {
            console.error('Error fetching analysis:', error)
        } finally {
            setLoading(false)
        }
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
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                            <AnalyticsIcon
                                sx={{
                                    fontSize: 60,
                                    color: '#368FF4',
                                    mr: 2,
                                    filter: 'drop-shadow(0 0 20px #368FF4)',
                                    animation: 'pulse 3s infinite'
                                }}
                            />

                            <Typography
                                variant="h2"
                                sx={{
                                    color: 'white',
                                    fontFamily: 'cursive',
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(45deg, #02C268, #368FF4)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    textShadow: '0 0 30px rgba(30, 212, 100, 0.5)'
                                }}>
                                Análisis Avanzado
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
                            Análisis estadístico profundo entre equipos
                        </Typography>
                    </Box>
                </Fade>

                {/* Selection Controls */}
                <Zoom in={true} timeout={800}>
                    <Card
                        sx={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 4,
                            mb: 4,
                            overflow: 'hidden',
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: `linear-gradient(90deg, #368FF4, #2765AB)`
                            }
                        }}>
                        <CardContent sx={{ p: 4 }}>
                            <Grid container spacing={3} alignItems="center">
                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth sx={{ minWidth: 200 }} variant="outlined">
                                        <InputLabel sx={{ color: 'white' }} shrink>
                                            Liga
                                        </InputLabel>
                                        <Select
                                            value={selectedLiga}
                                            onChange={handleLigaChange}
                                            label="Liga"
                                            sx={{
                                                color: 'white',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'white',
                                                },
                                                '& .MuiSvgIcon-root': {
                                                    color: 'white', // ícono del dropdown
                                                },
                                            }}
                                            MenuProps={{
                                                PaperProps: {
                                                    sx: {
                                                        bgcolor: '#1f2937', // fondo oscuro del menú
                                                        color: 'white',      // texto blanco
                                                    },
                                                },
                                            }}
                                        >
                                            {ligas.map((liga) => (
                                                <MenuItem key={liga.id} value={liga.id}>
                                                    {liga.logo} {liga.nombre}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth sx={{ minWidth: 200 }} variant="outlined">
                                        <InputLabel sx={{ color: 'white' }} shrink>
                                            Equipo Local
                                        </InputLabel>
                                        <Select
                                            value={selectedEquipo1}
                                            onChange={handleEquipo1Change}
                                            label="Equipo Local"
                                            sx={{
                                                color: 'white',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'white',
                                                },
                                                '& .MuiSvgIcon-root': {
                                                    color: 'white', // color del ícono de flecha desplegable
                                                },
                                            }}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: { maxHeight: 200 },
                                                    sx: {
                                                        bgcolor: '#1f2937', // fondo del menú (gris oscuro)
                                                        color: 'white',     // texto blanco en las opciones
                                                    },
                                                },
                                            }}
                                        >
                                            {equipos.length === 0 ? (
                                                <MenuItem disabled>No hay equipos disponibles</MenuItem>
                                            ) : (
                                                equipos.map((equipo) => (
                                                    <MenuItem key={equipo} value={equipo}>
                                                        {equipo}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth sx={{ minWidth: 200 }} variant="outlined">
                                        <InputLabel sx={{ color: 'white' }} shrink>
                                            Equipo Visitante
                                        </InputLabel>
                                        <Select
                                            value={selectedEquipo2}
                                            onChange={handleEquipo2Change}
                                            label="Equipo Visitante"
                                            sx={{
                                                color: 'white',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'white',
                                                },
                                                '& .MuiSvgIcon-root': {
                                                    color: 'white', // color del ícono de flecha desplegable
                                                },
                                            }}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: { maxHeight: 200 },
                                                    sx: {
                                                        bgcolor: '#1f2937', // fondo del menú (gris oscuro)
                                                        color: 'white',     // texto blanco en las opciones
                                                    },
                                                },
                                            }}
                                        >
                                            {equipos
                                                .filter((equipo) => equipo !== selectedEquipo1)
                                                .map((equipo) => (
                                                    <MenuItem key={equipo} value={equipo}>
                                                        {equipo}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={() => fetchAnalysis(selectedLiga, selectedEquipo1, selectedEquipo2)}
                                        disabled={!selectedLiga || !selectedEquipo1 || !selectedEquipo2 || loading}
                                        sx={{
                                            background: 'linear-gradient(45deg, #368FF4, #1F548F)',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            minWidth: 200,
                                            height: 56,
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #1F548F, #368FF4)',
                                                transform: 'translateY(-2px)'
                                            },
                                            '&:disabled': {
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                color: '#666'
                                            }
                                        }}
                                        startIcon={<AssessmentIcon />}
                                    >
                                        {loading ? <CircularProgress size={24} /> : 'Analizar'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Zoom>

                {/* Analysis Results */}
                {analysisData && (
                    <Fade in={true} timeout={1200}>
                        <Box sx={{ width: "100%", px: 2, mx: "auto", maxWidth: "1400px" }}>
                            {/* Match Summary */}
                            <Typography
                                variant="h4"
                                sx={{
                                    color: 'white',
                                    mb: 4,
                                    textAlign: 'center',
                                    fontFamily: 'cursive',
                                    background: 'linear-gradient(45deg, #368FF4, #1F548F)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                {selectedEquipo1} vs {selectedEquipo2}
                            </Typography>

                            <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center', width: '100%' }}>
                                {/* Total de Enfrentamientos */}
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Card
                                        onMouseEnter={() => setHoveredCard('summary')}
                                        onMouseLeave={() => setHoveredCard(null)}
                                        sx={{
                                            background: hoveredCard === 'summary'
                                                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(54, 143, 244, 0.1) 100%)'
                                                : 'rgba(255, 255, 255, 0.05)',
                                            backdropFilter: 'blur(10px)',
                                            border: hoveredCard === 'summary'
                                                ? '2px solid #368FF4'
                                                : '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: 4,
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            transform: hoveredCard === 'summary' ? 'translateY(-5px)' : 'translateY(0)',
                                            textAlign: 'center',
                                            p: 3
                                        }}>
                                        <TrophyIcon sx={{ fontSize: 48, color: '#FFD700', mb: 2 }} />
                                        <Typography variant="h6" sx={{ color: 'white', mb: 2, fontFamily: 'cursive' }}>
                                            Historial de Enfrentamientos
                                        </Typography>
                                        <Typography variant="h3" sx={{ color: '#368FF4', mb: 1 }}>
                                            {analysisData.resumen.total_enfrentamientos}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#888' }}>
                                            Partidos totales
                                        </Typography>
                                    </Card>
                                </Grid>

                                {/* Advanced Statistics */}
                                <Card
                                    sx={{
                                        width: '100%',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        position: 'relative',
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
                                    <CardContent sx={{ p: 4 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <AssessmentIcon sx={{ color: '#FFD700', mr: 2, fontSize: 30 }} />
                                            <Typography variant="h5" sx={{ color: 'white', fontFamily: 'cursive' }}>
                                                📊 Métricas Avanzadas por Equipo
                                            </Typography>
                                        </Box>
                                        <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1rem' }}>Equipo</TableCell>
                                                        <TableCell sx={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1rem' }}>Goles Local/Prom</TableCell>
                                                        <TableCell sx={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1rem' }}>Goles Visita/Prom</TableCell>
                                                        <TableCell sx={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1rem' }}>Posesión Ofensiva</TableCell>
                                                        <TableCell sx={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1rem' }}>Eficiencia Ofensiva</TableCell>
                                                        <TableCell sx={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1rem' }}>Indisciplina</TableCell>
                                                    </TableRow>
                                                </TableHead>

                                                <TableBody>
                                                    {analysisData.estadisticas_avanzadas.map((stat, index) => (
                                                        <TableRow
                                                            key={index}
                                                            sx={{
                                                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' },
                                                                backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                                                            }}>
                                                            <TableCell sx={{
                                                                color: stat.Equipo === selectedEquipo1 ? '#368FF4' : '#FF4444',
                                                                fontWeight: 'bold',
                                                                fontSize: '1.1rem',
                                                            }}>
                                                                {stat.Equipo}
                                                            </TableCell>
                                                            <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', textAlign: 'center' }}>
                                                                {stat['Goles_local_prom']}
                                                            </TableCell>
                                                            <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', textAlign: 'center' }}>
                                                                {stat['Goles_visita_prom']}
                                                            </TableCell>
                                                            <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', textAlign: 'center' }}>
                                                                {stat['Posesión_ofensiva']}
                                                            </TableCell>
                                                            <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', textAlign: 'center' }}>
                                                                {(stat['Eficiencia_ofensiva'] * 100).toFixed(1)}%
                                                            </TableCell>
                                                            <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', textAlign: 'center' }}>
                                                                {stat['Indisciplina']}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </CardContent>
                                </Card>

                                {/* Insights and Explanations */}
                                <Accordion
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: 2,
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
                                            <Typography variant="h6" sx={{ color: 'white', fontFamily: 'cursive' }}>
                                                🧠 ¿Qué significan estas métricas?
                                            </Typography>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                                        <Typography variant="body1" sx={{ color: '#888', mb: 2 }}>
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
                                                        color: 'white',
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
                                                        color: 'white',
                                                        mb: 2
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
                                                        color: 'white',
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
                                                        color: 'white'
                                                    }}
                                                >
                                                    <strong>Indisciplina:</strong> (Amarillas + Rojas) / Partidos.
                                                    Nivel promedio de sanciones por partido.
                                                </Alert>
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>

                                {/* Análisis de rachas */}
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                    <CarruselSugerencias
                                        title="Enfrentamientos Directos"
                                        datos={analysisData.enfrentamientos_directos_sugerencias}
                                    />
                                </Grid>

                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                    <CarruselSugerencias
                                        title="Racha del Equipo local"
                                        datos={analysisData.racha_equipo_1}
                                    />
                                </Grid>

                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                    <CarruselSugerencias
                                        title="Racha del Equipo Visitante"
                                        datos={analysisData.racha_equipo_2}
                                    />
                                </Grid>

                                {/* Resultados por localía y equipo */}
                                <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <PieChartsOne
                                        Data={[
                                            { id: 0, label: selectedEquipo1, value: analysisData.resumen.victorias_por_equipo.local },
                                            { id: 1, label: selectedEquipo2, value: analysisData.resumen.victorias_por_equipo.visitante },
                                            { id: 2, label: 'Empates', value: analysisData.resumen.victorias_por_equipo.empates }
                                        ]}
                                        title='⚽ Resultados por Equipo'
                                    />
                                </Grid>

                                <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <PieChartsOne
                                        Data={[
                                            { label: 'Local', value: analysisData.resumen.victorias_por_localia.local },
                                            { label: 'Visitante', value: analysisData.resumen.victorias_por_localia.visitante },
                                            { label: 'Empates', value: analysisData.resumen.victorias_por_localia.empates }
                                        ]}
                                        title='🏠 Resultados por Localía'
                                    />
                                </Grid>
                            </Grid>

                            {/* Recent Matches */}
                            <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center', width: '100%' }}>
                                <Grid item xs={12} md={6}>
                                    <Card
                                        sx={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: 4,
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
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                                <SportsIcon sx={{ color: '#368FF4', mr: 2 }} />
                                                <Typography variant="h6" sx={{ color: 'white', fontFamily: 'cursive' }}>
                                                    🟦 Últimos 5 partidos de {selectedEquipo1}
                                                </Typography>
                                            </Box>

                                            <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell sx={{ color: '#888', fontWeight: 'bold' }}>Fecha</TableCell>
                                                            <TableCell sx={{ color: '#888', fontWeight: 'bold' }}>Local</TableCell>
                                                            <TableCell sx={{ color: '#888', fontWeight: 'bold' }}>Visitante</TableCell>
                                                            <TableCell sx={{ color: '#888', fontWeight: 'bold' }}>Resultado</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {analysisData.ultimos_partidos[selectedEquipo1].map((partido, index) => {
                                                            const esLocal = partido.HomeTeam === selectedEquipo1
                                                            const esVisitante = partido.AwayTeam === selectedEquipo1
                                                            return (
                                                                <TableRow key={index}
                                                                    sx={{
                                                                        '&:hover': {
                                                                            backgroundColor: 'rgba(255, 255, 255, 0.05)'
                                                                        },
                                                                    }}>
                                                                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>{formatFecha(partido.Date)}</TableCell>
                                                                    <TableCell sx={{ color: 'white', textAlign: 'center', fontWeight: esLocal ? '700' : '400', backgroundColor: esLocal ? 'rgba(255, 235, 59, 0.3)' : 'transparent', borderRadius: esLocal ? '4px' : 'none', }}>{partido.HomeTeam}</TableCell>
                                                                    <TableCell sx={{ color: 'white', textAlign: 'center', fontWeight: esVisitante ? '700' : '400', backgroundColor: esVisitante ? 'rgba(255, 235, 59, 0.3)' : 'transparent', borderRadius: esVisitante ? '4px' : 'none', }}>{partido.AwayTeam}</TableCell>
                                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                                                                        {partido.FTHG} - {partido.FTAG}
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card
                                        sx={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: 4,
                                            overflow: 'hidden',
                                            position: 'relative',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: '4px',
                                                background: `linear-gradient(90deg, #FF4444, #FF6B6B)`
                                            }
                                        }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                                <SportsIcon sx={{ color: '#FF4444', mr: 2 }} />
                                                <Typography variant="h6" sx={{ color: 'white', fontFamily: 'cursive' }}>
                                                    🟥 Últimos 5 partidos de {selectedEquipo2}
                                                </Typography>
                                            </Box>

                                            <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell sx={{ color: '#888', fontWeight: 'bold' }}>Fecha</TableCell>
                                                            <TableCell sx={{ color: '#888', fontWeight: 'bold' }}>Local</TableCell>
                                                            <TableCell sx={{ color: '#888', fontWeight: 'bold' }}>Visitante</TableCell>
                                                            <TableCell sx={{ color: '#888', fontWeight: 'bold' }}>Resultado</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {analysisData.ultimos_partidos[selectedEquipo2].map((partido, index) => {
                                                            const esLocal = partido.HomeTeam === selectedEquipo2
                                                            const esVisitante = partido.AwayTeam === selectedEquipo2
                                                            return (
                                                                <TableRow key={index} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}>
                                                                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>{formatFecha(partido.Date)}</TableCell>
                                                                    <TableCell sx={{ color: 'white', textAlign: 'center', fontWeight: esLocal ? '700' : '400', backgroundColor: esLocal ? 'rgba(255, 235, 59, 0.3)' : 'transparent', borderRadius: esLocal ? '4px' : 'none', }}>{partido.HomeTeam}</TableCell>
                                                                    <TableCell sx={{ color: 'white', textAlign: 'center', fontWeight: esVisitante ? '700' : '400', backgroundColor: esVisitante ? 'rgba(255, 235, 59, 0.3)' : 'transparent', borderRadius: esVisitante ? '4px' : 'none', }}>{partido.AwayTeam}</TableCell>
                                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                                                                        {partido.FTHG} - {partido.FTAG}
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Goles en primer tiempo */}
                            <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center', width: '100%' }}>
                                {/* Pie Chart */}
                                <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <PieChartsOne
                                        Data={[
                                            { id: 0, label: selectedEquipo1, value: analysisData.primer_tiempo.goles_primer_tiempo.local },
                                            { id: 1, label: selectedEquipo2, value: analysisData.primer_tiempo.goles_primer_tiempo.visitante },
                                        ]}
                                        title='⚽ Goles en el Primer Tiempo'
                                    />
                                </Grid>

                                {/* Texto */}
                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-start',
                                        backgroundColor: '#202121',
                                        borderRadius: 5,
                                        padding: 3,
                                        height: '100%', // se estira con el otro grid
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Typography variant="h6" align="center" sx={{ fontWeight: 'bold', color: 'white', mb: 2 }}>
                                        📊 Ventaja en el Primer Tiempo
                                    </Typography>

                                    <Typography variant="body1" sx={{ color: 'white', mb: 1 }}>
                                        🏠 <strong>{selectedEquipo1}</strong>: se fue al descanso ganando en <strong>{analysisData.primer_tiempo.ventaja_primer_tiempo.local}</strong> de <strong>{analysisData.primer_tiempo.ventaja_primer_tiempo.total_ht}</strong> partidos.
                                    </Typography>

                                    <Typography variant="body1" sx={{ color: 'white', mb: 1 }}>
                                        🟡 Ambos equipos empataron al descanso en <strong>{analysisData.primer_tiempo.ventaja_primer_tiempo.empate_ht}</strong> de <strong>{analysisData.primer_tiempo.ventaja_primer_tiempo.total_ht}</strong> partidos.
                                    </Typography>

                                    <Typography variant="body1" sx={{ color: 'white' }}>
                                        ✈️ <strong>{selectedEquipo2}</strong>: se fue al descanso ganando en <strong>{analysisData.primer_tiempo.ventaja_primer_tiempo.visitante}</strong> de <strong>{analysisData.primer_tiempo.ventaja_primer_tiempo.total_ht}</strong> partidos.
                                    </Typography>
                                </Grid>
                            </Grid>

                            {/* direct encounters */}
                            <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center', width: '100%' }}>
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                    <Accordion
                                        sx={{
                                            width: '100%',
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: 2,
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
                                                <Typography variant="h6" sx={{ color: 'white', fontFamily: 'cursive' }}>
                                                    🟦 Todos los enfrentamientos entre {selectedEquipo1} - {selectedEquipo2}
                                                </Typography>
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                                            <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell sx={{ color: '#888', fontWeight: 'bold', textAlign: 'center' }}>Fecha</TableCell>
                                                            <TableCell sx={{ color: '#888', fontWeight: 'bold', textAlign: 'center' }}>Local</TableCell>
                                                            <TableCell sx={{ color: '#888', fontWeight: 'bold', textAlign: 'center' }}>Visitante</TableCell>
                                                            <TableCell sx={{ color: '#888', fontWeight: 'bold', textAlign: 'center' }}>Resultado</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {analysisData.enfrentamientos_directos.map((partido, index) => {
                                                            return (
                                                                <TableRow key={index}
                                                                    sx={{
                                                                        '&:hover': {
                                                                            backgroundColor: 'rgba(255, 255, 255, 0.05)'
                                                                        },
                                                                    }}>
                                                                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>{formatFecha(partido.Date)}</TableCell>
                                                                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>{partido.HomeTeam}</TableCell>
                                                                    <TableCell sx={{ color: 'white', textAlign: 'center' }}>{partido.AwayTeam}</TableCell>
                                                                    <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                                                                        {partido.FTHG} - {partido.FTAG}
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                            </Grid>

                            <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />

                            <Typography
                                variant="h4"
                                sx={{
                                    color: 'white',
                                    mb: 4,
                                    textAlign: 'center',
                                    fontFamily: 'cursive',
                                    background: 'linear-gradient(45deg, #368FF4, #17FF4D)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                📊 Análisis Probabilístico (Modelo de Poisson)
                            </Typography>

                            <Typography
                                variant="h6"
                                sx={{
                                    color: '#9E9D9D',
                                    fontStyle: 'italic',
                                    maxWidth: 700,
                                    margin: '0 auto',
                                    textAlign: 'center'
                                }}>
                                Análisis probabilístico con modelo de Poisson que incluye goles esperados, probabilidades 1X2, matriz de resultados y métricas clave del partido.
                            </Typography>

                            <Grid
                                container
                                spacing={3}
                                sx={{
                                    mb: 4,
                                    mt: 4,
                                    justifyContent: 'center',
                                    width: '100%'
                                }}
                            >
                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        minWidth: { md: 400, xs: 'auto' }
                                    }}
                                >
                                    <Card
                                        sx={{
                                            background: '#202121',
                                            backdropFilter: 'blur(10px)',
                                            border: '2px solid #368FF4',
                                            borderRadius: 4,
                                            textAlign: 'center',
                                            p: 3,
                                            height: '100%',
                                            flex: 1
                                        }}
                                    >
                                        <QueryStatsIcon sx={{ fontSize: 48, color: '#FFD700', mb: 2 }} />
                                        <Typography variant="h6" sx={{ color: 'white', mb: 2, fontFamily: 'cursive' }}>
                                            Goles Esperados
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                                            <Box>
                                                <Typography variant="h5" sx={{ color: '#368FF4' }}>
                                                    {poissonData?.goles_esperados?.local}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#888' }}>
                                                    {selectedEquipo1}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="h5" sx={{ color: '#FF4444' }}>
                                                    {poissonData?.goles_esperados?.visitante}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#888' }}>
                                                    {selectedEquipo2}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        minWidth: { md: 400, xs: 'auto' }
                                    }}
                                >
                                    <Card
                                        sx={{
                                            background: '#202121',
                                            backdropFilter: 'blur(10px)',
                                            border: '2px solid #368FF4',
                                            borderRadius: 4,
                                            textAlign: 'center',
                                            p: 3,
                                            height: '100%',
                                            flex: 1
                                        }}
                                    >
                                        <DataSaverOffIcon sx={{ fontSize: 48, color: '#FFD700', mb: 2 }} />
                                        <Typography variant="h6" sx={{ color: 'white', mb: 2, fontFamily: 'cursive' }}>
                                            Probabilidades 1X2
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Box>
                                                <Typography variant="h5" sx={{ color: '#368FF4' }}>
                                                    {poissonData?.probabilidades_1x2.local}%
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#888' }}>
                                                    {selectedEquipo1}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="h5" sx={{ color: '#368FF4' }}>
                                                    {poissonData?.probabilidades_1x2.empate}%
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#888' }}>
                                                    Empate
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="h5" sx={{ color: '#FF4444' }}>
                                                    {poissonData?.probabilidades_1x2?.visita}%
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#888' }}>
                                                    {selectedEquipo2}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        minWidth: { md: 400, xs: 'auto' }
                                    }}
                                >
                                    <Card
                                        sx={{
                                            background: '#202121',
                                            backdropFilter: 'blur(10px)',
                                            border: '2px solid #368FF4',
                                            borderRadius: 4,
                                            textAlign: 'center',
                                            p: 3,
                                            height: '100%',
                                            flex: 1,
                                            overflowX: 'auto'
                                        }}
                                    >
                                        <TableChartIcon sx={{ fontSize: 48, color: '#FFD700', mb: 2 }} />
                                        <Typography variant="h6" sx={{ color: 'white', mb: 2, fontFamily: 'cursive' }}>
                                            Matriz de Resultados Exactos
                                        </Typography>
                                        {poissonData?.matriz_scores_exactos && (
                                            <Box component="table" sx={{ borderCollapse: 'collapse', width: '100%' }}>
                                                <thead>
                                                    <tr>
                                                        <th style={{ color: '#888', padding: '4px', fontSize: 20 }}>Local \ Visita</th>
                                                        {Object.keys(poissonData.matriz_scores_exactos[0]).map((col) => (
                                                            <th key={col} style={{ color: '#888', padding: '4px', fontSize: 20 }}>{col}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Object.entries(poissonData.matriz_scores_exactos).map(([golesLocal, row]) => (
                                                        <tr key={golesLocal}>
                                                            <td style={{ color: '#368FF4', padding: '4px', fontSize: 20 }}>{golesLocal}</td>
                                                            {Object.entries(row).map(([golesVisita, prob]) => (
                                                                <td key={golesVisita} style={{ color: 'white', padding: '4px', fontSize: 20 }}>
                                                                    {prob.toFixed(1)}%
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Box>
                                        )}
                                    </Card>
                                </Grid>
                            </Grid>

                            <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />

                            <Typography
                                variant="h4"
                                sx={{
                                    color: 'white',
                                    mb: 4,
                                    textAlign: 'center',
                                    fontFamily: 'cursive',
                                    background: 'linear-gradient(45deg, #368FF4, #17FF4D)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                🎯 Predicción del Partido basada en Clustering K-Means
                            </Typography>

                            <Typography
                                variant="h6"
                                sx={{
                                    color: '#9E9D9D',
                                    fontStyle: 'italic',
                                    maxWidth: 700,
                                    margin: '0 auto',
                                    textAlign: 'center'
                                }}>
                                Descubre el resultado más probable, el rendimiento esperado y otros indicadores clave generados a partir del análisis estadístico con agrupamiento K-Means.
                            </Typography>

                            <Grid
                                container
                                spacing={3}
                                sx={{
                                    mb: 4,
                                    mt: 4,
                                    justifyContent: 'center',
                                }}
                            >
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                    <Card
                                        sx={{
                                            background: '#202121',
                                            color: 'white',
                                            p: 3
                                        }}>
                                        <h2 className="text-xl font-bold">Resumen del Partido</h2>
                                        <CardContent>
                                            <p className="text-md whitespace-pre-line">{clusterData?.descripcion_cluster_predicho}</p>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Card
                                        sx={{
                                            background: '#202121',
                                            color: 'white',
                                            p: 3
                                        }}>
                                        <PieChartsOne
                                            Data={[
                                                { id: 0, label: selectedEquipo1, value: clusterData?.prediccion?.predicciones?.prob_victoria_local },
                                                { id: 1, label: 'empate', value: clusterData?.prediccion?.predicciones?.prob_empate },
                                                { id: 2, label: selectedEquipo2, value: clusterData?.prediccion?.predicciones?.prob_victoria_visitante },
                                            ]}
                                            title='Probabilidad de Ganar FT'
                                        />
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Card
                                        sx={{
                                            background: '#202121',
                                            color: 'white',
                                            p: 3
                                        }}>
                                        <PieChartsOne
                                            Data={[
                                                { id: 0, label: selectedEquipo1, value: clusterData?.prediccion.predicciones.prob_ht_local_gana },
                                                { id: 1, label: 'empate', value: clusterData?.prediccion.predicciones.prob_ht_empate },
                                                { id: 2, label: selectedEquipo2, value: clusterData?.prediccion.predicciones.prob_ht_visitante_gana },
                                            ]}
                                            title='Probabilidad de Ganar HT'
                                        />
                                    </Card>
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        minWidth: { md: 400, xs: 'auto' }
                                    }}
                                >
                                    <Grid className="grid grid-cols-2 gap-4">
                                        <Card
                                            sx={{
                                                background: '#202121',
                                                color: 'white',
                                                p: 3
                                            }}>
                                            <CardContent>
                                                <h4 className="font-semibold">Goles Esperados FT</h4>
                                                <p>Local: {clusterData?.prediccion.predicciones.goles_esperados_local}</p>
                                                <p>Visitante: {clusterData?.prediccion.predicciones.goles_esperados_visitante}</p>
                                            </CardContent>
                                        </Card>

                                        <Card
                                            sx={{
                                                background: '#202121',
                                                color: 'white',
                                                p: 3
                                            }}>
                                            <CardContent>
                                                <h4 className="font-semibold">Goles Esperados HT</h4>
                                                <p>Local: {clusterData?.prediccion.predicciones.goles_ht_local}</p>
                                                <p>Visitante: {clusterData?.prediccion.predicciones.goles_ht_visitante}</p>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid className="grid grid-cols-2 gap-4 mt-5">
                                        <Card
                                            sx={{
                                                background: '#202121',
                                                color: 'white',
                                                p: 3
                                            }}>
                                            <div className="flex justify-center items-center">
                                                <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                                                    <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${Math.round(clusterData?.prediccion.predicciones.ambos_marcan * 100)}%` }}>
                                                        {Math.round(clusterData?.prediccion.predicciones.ambos_marcan * 100)}%
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-center mt-4">
                                                Probabilidad de ambos marcan: {Math.round(clusterData?.prediccion.predicciones.ambos_marcan * 100)}%
                                            </p>
                                        </Card>

                                        <Card
                                            sx={{
                                                background: '#202121',
                                                color: 'white',
                                                p: 3
                                            }}>
                                            <CardContent>
                                                <h4 className="font-semibold">Tiros al Arco</h4>
                                                <p>Local: {clusterData?.prediccion.predicciones.tiros_arco_local}</p>
                                                <p>Visitante: {clusterData?.prediccion.predicciones.tiros_arco_visitante}</p>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid className="grid grid-cols-2 gap-4 mt-5 mb-4">
                                        <Card
                                            sx={{
                                                background: '#202121',
                                                color: 'white',
                                                p: 3
                                            }}>
                                            <CardContent>
                                                <h4 className="font-semibold">Disciplinas Local</h4>
                                                <p>Amarillas: {clusterData?.prediccion.predicciones.amarillas_local}</p>
                                                <p>Rojas: {clusterData?.prediccion.predicciones.rojas_local}</p>
                                            </CardContent>
                                        </Card>

                                        <Card
                                            sx={{
                                                background: '#202121',
                                                color: 'white',
                                                p: 3
                                            }}>
                                            <CardContent>
                                                <h4 className="font-semibold">Disciplinas Visitante</h4>
                                                <p>Amarillas: {clusterData?.prediccion.predicciones.amarillas_visitante}</p>
                                                <p>Rojas: {clusterData?.prediccion.predicciones.rojas_visitante}</p>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Alert severity="info" variant="outlined" sx={{ color: '#fff' }}>
                                        Estas predicciones han sido generadas usando agrupamiento K-Means basado en estadísticas históricas.
                                    </Alert>
                                </Grid>
                            </Grid>
                        </Box>
                    </Fade>
                )}

                {/* No analysis message */}
                {!analysisData && !loading && (
                    <Fade in={true} timeout={1500}>
                        <Box
                            sx={{
                                textAlign: 'center',
                                py: 10,
                                background: 'rgba(255, 255, 255, 0.02)',
                                borderRadius: 4,
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                            <AnalyticsIcon
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
                                Selecciona equipos para analizar
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ color: '#888' }}>
                                Elige una liga y dos equipos para ver el análisis estadístico completo
                            </Typography>
                        </Box>
                    </Fade>
                )}

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

export default Analysis
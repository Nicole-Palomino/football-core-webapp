import { useState, useEffect } from 'react'
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
    Chip,
    Avatar,
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
    Alert
} from '@mui/material'
import {
    Analytics as AnalyticsIcon,
    ExpandMore as ExpandMoreIcon,
    Sports as SportsIcon,
    TrendingUp as TrendingUpIcon,
    Assessment as AssessmentIcon,
    Timeline as TimelineIcon,
    CompareArrows as CompareIcon,
    EmojiEvents as TrophyIcon,
    Schedule as ScheduleIcon,
    Stadium as StadiumIcon,
    Insights as InsightsIcon,
    Psychology as PsychologyIcon
} from '@mui/icons-material'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import EnConstruccion from '../components/EnConstruccion'
import { combinarAnalisisYPrediccion, getAnalyticsCluster, getCompleteAnalysis, getLigues, getPoisson, getPredictionCluster, getTeams } from '../services/functions'
import { formatFecha } from '../services/encryptionService'
import { useQuery } from '@tanstack/react-query'

const Analysis = () => {

    const [loading, setLoading] = useState(false)
    // const [ligas, setLigas] = useState([])
    const [equipos, setEquipos] = useState([])
    const [selectedLiga, setSelectedLiga] = useState('')
    const [selectedEquipo1, setSelectedEquipo1] = useState('')
    const [selectedEquipo2, setSelectedEquipo2] = useState('')
    const [analysisData, setAnalysisData] = useState(null)
    const [hoveredCard, setHoveredCard] = useState(null)
    const [poissonData, setPoissonData] = useState(null)
    const [clusterData, setClusterData] = useState(null)
    const [predictionData, setPredictionData] = useState(null)
    const [activeAnalysisType, setActiveAnalysisType] = useState('complete')

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
        if (liga) {
            fetchEquipos(liga)
        }
    }

    const fetchAnalysis = async (liga, equipo1, equipo2) => {
        if (!selectedLiga || !selectedEquipo1 || !selectedEquipo2) return
        try {
            setLoading(true)

            const response = await getCompleteAnalysis(liga, equipo1, equipo2)
            setAnalysisData(response || [])

            const poisson = await getPoisson(liga, equipo1, equipo2)
            setPoissonData(poisson || [])
            console.log(poisson)

            const clusterAnalysis = await getAnalyticsCluster(liga, equipo1, equipo2)
            console.log(clusterAnalysis)
            const clusterPrediction = await getPredictionCluster(liga, equipo1, equipo2)
            console.log(clusterPrediction)
            const combinado = combinarAnalisisYPrediccion(clusterAnalysis, clusterPrediction)
            setClusterData(combinado || [])

            console.log(combinado)
        } catch (error) {
            console.error('Error fetching analysis:', error)
        } finally {
            setLoading(false)
        }
    }

    const COLORS = ['#368FF4', '#FF4444', '#FFD700', '#4A90E2']

    const ResultPieChart = ({ data, title }) => (
        <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 4,
            height: 400
        }}>
            <CardContent>
                <Typography variant="h6" sx={{ color: 'white', textAlign: 'center', mb: 2, fontFamily: 'cursive' }}>
                    {title}
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )

    const RadarChartComponent = ({ data }) => (
        <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 4,
            height: 400
        }}>
            <CardContent>
                <Typography variant="h6" sx={{ color: 'white', textAlign: 'center', mb: 2, fontFamily: 'cursive' }}>
                    📊 Comparación Estadística
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={data}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="stat" tick={{ fill: 'white', fontSize: 12 }} />
                        <PolarRadiusAxis tick={{ fill: 'white', fontSize: 10 }} />
                        <Radar
                            name={selectedEquipo1}
                            dataKey={selectedEquipo1}
                            stroke="#368FF4"
                            fill="#368FF4"
                            fillOpacity={0.2}
                            strokeWidth={2}
                        />
                        <Radar
                            name={selectedEquipo2}
                            dataKey={selectedEquipo2}
                            stroke="#FF4444"
                            fill="#FF4444"
                            fillOpacity={0.2}
                            strokeWidth={2}
                        />
                        <Legend />
                    </RadarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )

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
                                                    borderColor: '#368FF4',
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#368FF4',
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
                                            onChange={(e) => setSelectedEquipo1(e.target.value)}
                                            label="Equipo Local"
                                            sx={{
                                                color: 'white',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#368FF4',
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#368FF4',
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
                                            {equipos.map((equipo) => (
                                                <MenuItem key={equipo} value={equipo}>
                                                    {equipo}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>


                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <FormControl
                                        fullWidth
                                        disabled={!selectedLiga}
                                        variant="outlined"
                                        sx={{
                                            minWidth: 200,
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                '& fieldset': {
                                                    borderColor: 'rgba(255, 255, 255, 0.3)', // 🔹 borde normal (blanco transparente)
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#368FF4', // 🔹 borde al hacer hover
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#368FF4', // 🔹 borde al hacer focus
                                                },
                                            },
                                        }}
                                    >
                                        <InputLabel sx={{ color: 'white' }} shrink>
                                            Equipo Visitante
                                        </InputLabel>

                                        <Select
                                            value={selectedEquipo2}
                                            onChange={(e) => setSelectedEquipo2(e.target.value)}
                                            label="Equipo Visitante"
                                            inputProps={{
                                                style: {
                                                    color: 'white',
                                                },
                                            }}
                                            IconComponent={(props) => (
                                                <svg
                                                    {...props}
                                                    className="text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            )}
                                            MenuProps={{
                                                PaperProps: {
                                                    sx: {
                                                        bgcolor: '#1f2937',
                                                        '& .MuiMenuItem-root': {
                                                            color: 'white',
                                                        },
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
                                            background: 'linear-gradient(45deg, #368FF4, #17FF4D)',
                                            color: 'black',
                                            fontWeight: 'bold',
                                            height: 56,
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #17FF4D, #368FF4)',
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
                        <Box sx={{ width: "100%", maxWidth: "100vw", px: 2 }}>
                            {/* Match Summary */}
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
                                {selectedEquipo1} vs {selectedEquipo2}
                            </Typography>

                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} md={4}>
                                    <Card
                                        onMouseEnter={() => setHoveredCard('summary')}
                                        onMouseLeave={() => setHoveredCard(null)}
                                        sx={{
                                            // height: 245,
                                            background: hoveredCard === 'summary'
                                                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 255, 136, 0.1) 100%)'
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

                                <Grid item xs={12} md={4}>
                                    <ResultPieChart
                                        data={[
                                            { name: selectedEquipo1, value: analysisData.resumen.victorias_por_equipo[selectedEquipo1] },
                                            { name: selectedEquipo2, value: analysisData.resumen.victorias_por_equipo[selectedEquipo2] },
                                            { name: 'Empates', value: analysisData.resumen.victorias_por_equipo.empates }
                                        ]}
                                        title="🏆 Resultados por Equipo"
                                    />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <ResultPieChart
                                        data={[
                                            { name: 'Local', value: analysisData.resumen.victorias_por_localia.local },
                                            { name: 'Visitante', value: analysisData.resumen.victorias_por_localia.visitante },
                                            { name: 'Empates', value: analysisData.resumen.victorias_por_localia.empates }
                                        ]}
                                        title="🏠 Resultados por Localía"
                                    />
                                </Grid>

                                {/* <Grid item xs={12} md={4}>
                                        <Card
                                            onMouseEnter={() => setHoveredCard('probability')}
                                            onMouseLeave={() => setHoveredCard(null)}
                                            sx={{
                                                background: hoveredCard === 'probability' 
                                                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 68, 68, 0.1) 100%)'
                                                    : 'rgba(255, 255, 255, 0.05)',
                                                backdropFilter: 'blur(10px)',
                                                border: hoveredCard === 'probability' 
                                                    ? '2px solid #FF4444'
                                                    : '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: 4,
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                transform: hoveredCard === 'probability' ? 'translateY(-5px)' : 'translateY(0)',
                                                textAlign: 'center',
                                                p: 3
                                            }}>
                                            <PsychologyIcon sx={{ fontSize: 48, color: '#FF4444', mb: 2 }} />
                                            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontFamily: 'cursive' }}>
                                                Mayor Probabilidad
                                            </Typography>
                                            <Typography variant="h4" sx={{ color: '#FF4444', mb: 1 }}>
                                                {Math.max(
                                                    analysisData.resumen.victorias_por_equipo.victoria_equipo1,
                                                    analysisData.resumen.probabilidades.empate,
                                                    analysisData.resumen.probabilidades.victoria_equipo2
                                                ).toFixed(1)}%
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#888' }}>
                                                {analysisData.resumen.probabilidades.victoria_equipo1 > analysisData.resumen.probabilidades.victoria_equipo2 
                                                    ? `Victoria ${selectedEquipo1}`
                                                    : analysisData.resumen.probabilidades.victoria_equipo2 > analysisData.resumen.probabilidades.empate
                                                    ? `Victoria ${selectedEquipo2}`
                                                    : 'Empate'
                                                }
                                            </Typography>
                                        </Card>
                                    </Grid> */}
                            </Grid>

                            {/* Advanced Statistics */}
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
                                                            {stat['Goles local/prom']}
                                                        </TableCell>
                                                        <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', textAlign: 'center' }}>
                                                            {stat['Goles visita/prom']}
                                                        </TableCell>
                                                        <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', textAlign: 'center' }}>
                                                            {stat['Posesión ofensiva']}
                                                        </TableCell>
                                                        <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', textAlign: 'center' }}>
                                                            {(stat['Eficiencia ofensiva'] * 100).toFixed(1)}%
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
                                    mb: 2,
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

                            {/* Recent Matches */}
                            <Grid container spacing={3} sx={{ mb: 4 }}>
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

                            {/* direct encounters */}
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                {/* <Grid item xs={12} md={12}> */}
                                <Card
                                    sx={{
                                        width: "100%", display: "block",
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
                                            background: `linear-gradient(90deg, #3643F7, #1726FF)`
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
                                    </CardContent>
                                </Card>
                                {/* </Grid> */}
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

                            <Grid container spacing={3} sx={{ mb: 4, mt: 4 }}>
                                <Grid item xs={12} md={4}>
                                    <Card
                                        onMouseEnter={() => setHoveredCard('prediction')}
                                        onMouseLeave={() => setHoveredCard(null)}
                                        sx={{
                                            background: hoveredCard === 'prediction'
                                                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 215, 0, 0.1) 100%)'
                                                : 'rgba(255, 255, 255, 0.05)',
                                            backdropFilter: 'blur(10px)',
                                            border: hoveredCard === 'prediction'
                                                ? '2px solid #FFD700'
                                                : '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: 4,
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            transform: hoveredCard === 'prediction' ? 'translateY(-5px)' : 'translateY(0)',
                                            textAlign: 'center',
                                            p: 3
                                        }}>
                                        <InsightsIcon sx={{ fontSize: 48, color: '#FFD700', mb: 2 }} />
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

                                <Grid item xs={12} md={6}>
                                    <Card
                                        onMouseEnter={() => setHoveredCard('prediction')}
                                        onMouseLeave={() => setHoveredCard(null)}
                                        sx={{
                                            background: hoveredCard === 'prediction'
                                                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 215, 0, 0.1) 100%)'
                                                : 'rgba(255, 255, 255, 0.05)',
                                            backdropFilter: 'blur(10px)',
                                            border: hoveredCard === 'prediction'
                                                ? '2px solid #FFD700'
                                                : '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: 4,
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            transform: hoveredCard === 'prediction' ? 'translateY(-5px)' : 'translateY(0)',
                                            textAlign: 'center',
                                            p: 3
                                        }}>
                                        <InsightsIcon sx={{ fontSize: 48, color: '#FFD700', mb: 2 }} />
                                        <Typography variant="h6" sx={{ color: 'white', mb: 2, fontFamily: 'cursive' }}>
                                            Probabilidades 1X2
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                                            <Box>
                                                <Typography variant="h5" sx={{ color: '#368FF4' }}>
                                                    {/* {poissonData?.probabilidades_1x2} */}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#888' }}>
                                                    {selectedEquipo1}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="h5" sx={{ color: '#368FF4' }}>
                                                    {/* {poissonData?.probabilidades_1x2} */}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#888' }}>
                                                    Empate
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="h5" sx={{ color: '#FF4444' }}>
                                                    {/* {poissonData?.probabilidades_1x2?.local} */}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#888' }}>
                                                    {selectedEquipo2}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Card>
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
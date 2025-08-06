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
    Alert,
} from '@mui/material'
import {
    Analytics as AnalyticsIcon,
    Assessment as AssessmentIcon,
} from '@mui/icons-material'
import { getLigues, getPredictionRandom, getTeams } from '../services/functions'
import { useQuery } from '@tanstack/react-query'
import PieChartsOne from '../components/Dashboard/Match/graphics/PieChartsOne'
import MatchStatisticsBarChart from '../components/Dashboard/Match/graphics/MatchStatisticsBarChart'

const Forecasts = () => {

    const [loading, setLoading] = useState(false)
    const [equipos, setEquipos] = useState([])
    const [selectedLiga, setSelectedLiga] = useState('')
    const [selectedEquipo1, setSelectedEquipo1] = useState('')
    const [selectedEquipo2, setSelectedEquipo2] = useState('')
    const [predictionData, setPredictionData] = useState(null)

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
        setPredictionData(null)
        if (liga) {
            fetchEquipos(liga)
        }
    }

    const handleEquipo1Change = (event) => {
        const equipo = event.target.value
        setSelectedEquipo1(equipo)
        setPredictionData(null)
    }

    const handleEquipo2Change = (event) => {
        const equipo = event.target.value
        setSelectedEquipo2(equipo)
        setPredictionData(null)
    }

    const fetchAnalysis = async (liga, equipo1, equipo2) => {
        if (!selectedLiga || !selectedEquipo1 || !selectedEquipo2) return
        try {
            setLoading(true)

            const response = await getPredictionRandom(liga, equipo1, equipo2)
            setPredictionData(response || [])

            console.log(response)
        } catch (error) {
            console.error('Error fetching predictiones:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box sx={{
            bgcolor: "#0a0a0a",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)"
        }}
        >
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
                                Predicciones para el partido
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
                            Modelo mixto de Random Forest para anticipar resultados, goles y eventos clave del partido
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
                                        {loading ? <CircularProgress size={24} /> : 'Predecir'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Zoom>

                {/* Predictions Results */}
                {predictionData && (
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
                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        minWidth: { md: 900, xs: 'auto' }
                                    }}
                                >
                                    <Alert severity="info" variant="outlined" sx={{ color: '#fff', marginTop: 3 }}>
                                        🔍 Estas predicciones fueron generadas usando algoritmos de Machine Learning
                                        (Random Forest de clasificación y regresión).
                                    </Alert>

                                    <Grid className="grid grid-cols-2 gap-4">
                                        <Card
                                            sx={{
                                                background: '#202121',
                                                color: 'white',
                                                p: 3
                                            }}>
                                            <CardContent>
                                                <h4 className="font-semibold">Resultado Final</h4>
                                                <p>{predictionData?.predicciones.resultado_final.descripcion}</p>
                                            </CardContent>
                                        </Card>

                                        <Card
                                            sx={{
                                                background: '#202121',
                                                color: 'white',
                                                p: 3
                                            }}>
                                            <CardContent>
                                                <h4 className="font-semibold">¿Ambos marcan FT?</h4>
                                                <p>Probabilidad: {predictionData?.predicciones.ambos_marcan.probabilidad}%</p>
                                                <p>
                                                    {predictionData?.predicciones.ambos_marcan.alta_probabilidad
                                                        ? 'Alta probabilidad ✅'
                                                        : 'Baja probabilidad ❌'}
                                                </p>
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
                                            <CardContent>
                                                <h4 className="font-semibold">Resultado Final</h4>
                                                <p>{predictionData?.predicciones.resultado_medio_tiempo.descripcion}</p>
                                            </CardContent>
                                        </Card>

                                        <Card
                                            sx={{
                                                background: '#202121',
                                                color: 'white',
                                                p: 3
                                            }}>
                                            <CardContent>
                                                <h4 className="font-semibold">¿Ambos marcan FT?</h4>
                                                <p>Probabilidad: {predictionData?.predicciones.ambos_marcan_ht.probabilidad}%</p>
                                                <p>
                                                    {predictionData?.predicciones.ambos_marcan_ht.alta_probabilidad
                                                        ? 'Alta probabilidad ✅'
                                                        : 'Baja probabilidad ❌'}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 5, background: '#202121', }}>
                                        <MatchStatisticsBarChart estadisticas_esperadas={predictionData?.predicciones.estadisticas_esperadas} />
                                    </Grid>

                                    <Grid className="grid grid-cols-2 gap-4 mt-5">
                                        <Card
                                            sx={{
                                                background: '#202121',
                                                color: 'white',
                                                p: 3
                                            }}>
                                            <CardContent>
                                                <PieChartsOne
                                                    Data={[
                                                        { id: 0, label: selectedEquipo1, value: predictionData?.predicciones.estadisticas_esperadas.goles_local },
                                                        { id: 1, label: selectedEquipo2, value: predictionData?.predicciones.estadisticas_esperadas.goles_visitante },
                                                    ]}
                                                    title='Goles de los Equipos'
                                                />
                                            </CardContent>
                                        </Card>

                                        <Card
                                            sx={{
                                                background: '#202121',
                                                color: 'white',
                                                p: 3
                                            }}>
                                            <CardContent>
                                                <PieChartsOne
                                                    Data={[
                                                        { id: 0, label: selectedEquipo1, value: predictionData?.predicciones.estadisticas_esperadas.tiros_arco_local },
                                                        { id: 1, label: selectedEquipo2, value: predictionData?.predicciones.estadisticas_esperadas.tiros_arco_visitante },
                                                    ]}
                                                    title='Tiros al Arco de los Equipos'
                                                />
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
                                            <CardContent>
                                                <PieChartsOne
                                                    Data={[
                                                        { id: 0, label: selectedEquipo1, value: predictionData?.predicciones.estadisticas_esperadas.corners_local },
                                                        { id: 1, label: selectedEquipo2, value: predictionData?.predicciones.estadisticas_esperadas.corners_visitante },
                                                    ]}
                                                    title='Corners de los Equipos'
                                                />
                                            </CardContent>
                                        </Card>

                                        <Card
                                            sx={{
                                                background: '#202121',
                                                color: 'white',
                                                p: 3
                                            }}>
                                            <CardContent>
                                                <PieChartsOne
                                                    Data={[
                                                        { id: 0, label: selectedEquipo1, value: predictionData?.predicciones.estadisticas_esperadas.amarillas_local },
                                                        { id: 1, label: selectedEquipo2, value: predictionData?.predicciones.estadisticas_esperadas.amarillas_visitante },
                                                    ]}
                                                    title='Tarjetas Amarillas de los Equipos'
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid className="grid grid-cols-1 gap-4 mt-5">
                                        <Card
                                            sx={{
                                                background: '#202121',
                                                color: 'white',
                                                p: 3
                                            }}>
                                            <CardContent>
                                                <PieChartsOne
                                                    Data={[
                                                        { id: 0, label: selectedEquipo1, value: predictionData?.predicciones.estadisticas_esperadas.rojas_local },
                                                        { id: 1, label: selectedEquipo2, value: predictionData?.predicciones.estadisticas_esperadas.rojas_visitante },
                                                    ]}
                                                    title='Tarjetas Rojas de los Equipos'
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Alert severity="info" variant="outlined" sx={{ color: '#fff', marginTop: 3 }}>
                                        🔍 Estas predicciones fueron generadas usando algoritmos de Machine Learning
                                        (Random Forest de clasificación y regresión).
                                    </Alert>
                                </Grid>
                            </Grid>
                        </Box>
                    </Fade>
                )}

                {/* No analysis message */}
                {!predictionData && !loading && (
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
            </Container>
        </Box>
    )
}

export default Forecasts
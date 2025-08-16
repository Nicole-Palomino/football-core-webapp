import { Avatar, Box, Card, CardContent, Chip, Container, Fade, Grid, IconButton, Paper, Tooltip, Typography, useTheme } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getMatcheByID } from '../../../services/api/matches'
import LoadingSpinner from '../../Loading/LoadingSpinner'
import { ArrowBack, CalendarToday, HorizontalRule, Stadium } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { formatFecha } from '../../../utils/helpers'
import TitleText from '../Details/TitleText'
import BarComparativa from './graphics/BarComparativa'
import TableChartIcon from '@mui/icons-material/TableChart'

const MatchSummary = () => {

    const theme = useTheme()
    const { id_partido } = useParams()
    const navigate = useNavigate()

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

    // Manejo de estados de carga combinados
    const isLoading = isLoadingMatch
    const isError = isErrorMatch

    if (isLoading) return <LoadingSpinner />

    if (isError) {
        return (
            <div>
                <h2>Error al cargar datos:</h2>
                {isErrorMatch && <p>Summary by ID: {errorMatch.message}</p>}
            </div>
        )
    }

    const finalMatchDataAsArray = matchData
        ? (Array.isArray(matchData) ? matchData : [matchData])
        : []
    console.log(finalMatchDataAsArray)
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
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: '100%',
                                            }}
                                        >
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
                                                                className='uppercase'
                                                                sx={{
                                                                    color: 'white',
                                                                    mb: 4,
                                                                    textAlign: 'center',
                                                                    fontFamily: 'cursive',
                                                                    background: 'linear-gradient(45deg, #201DBE, #49FD58)',
                                                                    backgroundClip: 'text',
                                                                    WebkitBackgroundClip: 'text',
                                                                    WebkitTextFillColor: 'transparent',
                                                                    fontSize: { xs: 18, md: 33 }
                                                                }}>
                                                                Resumen del Partido
                                                            </Typography>

                                                            <Grid className="grid grid-cols-1 gap-4 mt-5">
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
                                                                    }}
                                                                >
                                                                    <CardContent sx={{ p: 3, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                                                                        <TitleText
                                                                            icon={TableChartIcon}
                                                                            iconColor='#FB7452'
                                                                            title={'Resumen Final del Partido'}
                                                                        />

                                                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2, gap: 2 }}>
                                                                            <div className="bg-slate-800 p-4 rounded-lg w-full">
                                                                                <BarComparativa
                                                                                    home={partidoID?.estadisticas.HTHG}
                                                                                    away={partidoID?.estadisticas.HTAG}
                                                                                    title='Goles HT'/>
                                                                                <BarComparativa 
                                                                                    home={partidoID?.estadisticas.HS}
                                                                                    away={partidoID?.estadisticas.AS_}
                                                                                    title='Disparos'/>
                                                                                <BarComparativa 
                                                                                    home={partidoID?.estadisticas.HST}
                                                                                    away={partidoID?.estadisticas.AST}
                                                                                    title='Disparos al arco'/>
                                                                                <BarComparativa 
                                                                                    home={partidoID?.estadisticas.HF}
                                                                                    away={partidoID?.estadisticas.AF}
                                                                                    title='Faltas'/>
                                                                                <BarComparativa 
                                                                                    home={partidoID?.estadisticas.HC}
                                                                                    away={partidoID?.estadisticas.AC}
                                                                                    title='Tiros de esquina'/>
                                                                                <BarComparativa 
                                                                                    home={partidoID?.estadisticas.HY}
                                                                                    away={partidoID?.estadisticas.AY}
                                                                                    title='Tarjetas amarillas'/>
                                                                                <BarComparativa 
                                                                                    home={partidoID?.estadisticas.HR}
                                                                                    away={partidoID?.estadisticas.AR}
                                                                                    title='Tarjetas rojas'/>
                                                                            </div>
                                                                        </Box>
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Fade>
                                        </Box>
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

export default MatchSummary
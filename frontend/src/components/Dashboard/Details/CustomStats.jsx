import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Card, CardContent, Fade, Grid, Typography, useTheme } from '@mui/material'
import {
    Assessment as AssessmentIcon, ExpandMore as ExpandMoreIcon, Insights as InsightsIcon,
    TrendingUp as TrendingUpIcon, Stadium as StadiumIcon, Sports as SportsIcon,
    FormatListBulleted as FormatListBulletedIcon, Groups as GroupsIcon, ThumbsUpDown as ThumbsUpDownIcon,
    AccessTime as AccessTimeIcon
} from '@mui/icons-material'
import TotalMatch from '../Match/graphics/TotalMatch'
import PieChartsOne from '../Match/graphics/PieChartsOne'
import CardChart from '../Match/graphics/CardChart'
import CarruselSugerencias from '../Match/graphics/CarruselSugerencias'
import TablaConPaginacion from '../Match/graphics/TablaConPaginacion'
import { getCompleteAnalysis } from '../../../services/functions'
import LoadingSpinner from '../../Loading/LoadingSpinner'
import { useQuery } from '@tanstack/react-query'
import TitleText from './TitleText'
import TableConColor from '../Match/graphics/TableConColor'
import CustomAlertas from './CustomAlertas'

const CustomStats = ({ equipo_local, equipo_visita, nombre_liga }) => {

    const theme = useTheme()

    // 1. Consulta para Match Stats
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

    const isLoading = isLoadingStats
    const isError = isErrorStats

    if (isLoading) return <LoadingSpinner />

    if (isError) {
        return (
            <div>
                <h2>Error al cargar datos:</h2>
                {isErrorStats && <p>Match Stats: {errorStats.message}</p>}
            </div>
        )
    }

    const finalMatchesStats = matchesStats || []

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
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
                                <CustomAlertas
                                    title='📊 Esta sección muestra estadísticas basadas en el historial de enfrentamientos y rendimiento
                                            de los equipos, considerando también temporadas anteriores.'
                                />

                                <Grid className="grid grid-cols-1 gap-4">
                                    {/* Total de enfrentamientos */}
                                    <Card
                                        sx={{
                                            background: theme.palette.background.paper,
                                            color: theme.palette.text.primary,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                            p: 3,
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
                                                background: `linear-gradient(90deg, #5468E6, #E68A54)`
                                            }
                                        }}>
                                        <CardContent>
                                            <TitleText
                                                icon={FormatListBulletedIcon}
                                                iconColor='#5468E6'
                                                title='Historial de Enfrentamientos' />
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
                                                background: `linear-gradient(90deg, #462AD5, #63D52A)`
                                            }
                                        }}>
                                        <CardContent>
                                            <TitleText
                                                icon={GroupsIcon}
                                                iconColor='#63D52A'
                                                title='Resultados por Equipo' />
                                            <PieChartsOne
                                                Data={[
                                                    { id: 0, label: equipo_local, value: finalMatchesStats.resumen.victorias_por_equipo.local },
                                                    { id: 1, label: equipo_visita, value: finalMatchesStats.resumen.victorias_por_equipo.visitante },
                                                    { id: 2, label: 'Empates', value: finalMatchesStats.resumen.victorias_por_equipo.empates }
                                                ]}
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
                                                background: `linear-gradient(90deg, #CE4B53, #4B54CE)`
                                            }
                                        }}>
                                        <CardContent>
                                            <TitleText
                                                icon={StadiumIcon}
                                                iconColor='#CE4B53'
                                                title='Resultados por Localía' />
                                            <PieChartsOne
                                                Data={[
                                                    { label: 'Como Local', value: finalMatchesStats.resumen.victorias_por_localia.local },
                                                    { label: 'Como Visitante', value: finalMatchesStats.resumen.victorias_por_localia.visitante },
                                                    { label: 'Empates', value: finalMatchesStats.resumen.victorias_por_localia.empates }
                                                ]}
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
                                            <TitleText
                                                icon={AssessmentIcon}
                                                iconColor='#FFD700'
                                                title='Métricas por Equipo' />
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
                                                background: `linear-gradient(90deg, #EB2D38, #2D96EB)`
                                            }
                                        }}>
                                        <TitleText
                                            icon={GroupsIcon}
                                            iconColor='#2D96EB'
                                            title='Racha del Equipo Local' />
                                        <CarruselSugerencias
                                            datos={finalMatchesStats.racha_equipo_1}
                                        />
                                    </Card>

                                    <Card
                                        sx={{
                                            background: theme.palette.background.paper,
                                            color: theme.palette.text.primary,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                            p: 2,
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
                                                background: `linear-gradient(90deg, #EB832D, #2DEB83)`
                                            }
                                        }}>
                                        <TitleText
                                            icon={GroupsIcon}
                                            iconColor='#2DEB83'
                                            title='Racha del Equipo Visitante' />
                                        <CarruselSugerencias
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
                                                background: `linear-gradient(90deg, #9BF608, #08F663)`
                                            }
                                        }}>
                                        <TitleText
                                            icon={ThumbsUpDownIcon}
                                            iconColor='#2DEB83'
                                            title='Enfrentamientos directos' />
                                        <CarruselSugerencias
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
                                            <TitleText
                                                icon={SportsIcon}
                                                iconColor='#2DEB83'
                                                title={'Últimos 5 partidos de ' + equipo_local} />
                                            <TableConColor
                                                finalMatchesStats={finalMatchesStats}
                                                equipo={equipo_local} />
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
                                            <TitleText
                                                icon={SportsIcon}
                                                iconColor='#368FF4'
                                                title={'Últimos 5 partidos de ' + equipo_visita} />
                                            <TableConColor
                                                finalMatchesStats={finalMatchesStats}
                                                equipo={equipo_visita} />
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
                                                background: `linear-gradient(90deg, #FDB249, #FD49EE)`
                                            }
                                        }}>
                                        <CardContent>
                                            <TitleText
                                                icon={AccessTimeIcon}
                                                iconColor='#FDB249'
                                                title='Goles en el Primer Tiempo' />
                                            <PieChartsOne
                                                Data={[
                                                    { id: 0, label: equipo_local, value: finalMatchesStats.primer_tiempo.goles_primer_tiempo.local },
                                                    { id: 1, label: equipo_visita, value: finalMatchesStats.primer_tiempo.goles_primer_tiempo.visitante },
                                                ]}
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
                                            <TitleText
                                                icon={AccessTimeIcon}
                                                iconColor='#0AFC67'
                                                title='Ventaja Primer Tiempo' />
                                            <Typography sx={{ color: theme.palette.text.primary, mb: 1, fontSize: { xs: 16, md: 25 } }}>
                                                🏠 <strong>{equipo_local}</strong>: se fue al descanso ganando en <strong>{finalMatchesStats.primer_tiempo.ventaja_primer_tiempo.local}</strong> de <strong>{finalMatchesStats.primer_tiempo.ventaja_primer_tiempo.total_ht}</strong> partidos.
                                            </Typography>

                                            <Typography sx={{ color: theme.palette.text.primary, mb: 1, fontSize: { xs: 16, md: 25 } }}>
                                                🟡 Ambos equipos empataron al descanso en <strong>{finalMatchesStats.primer_tiempo.ventaja_primer_tiempo.empate_ht}</strong> de <strong>{finalMatchesStats.primer_tiempo.ventaja_primer_tiempo.total_ht}</strong> partidos.
                                            </Typography>

                                            <Typography sx={{ color: theme.palette.text.primary, fontSize: { xs: 16, md: 25 } }}>
                                                ✈️ <strong>{equipo_visita}</strong>: se fue al descanso ganando en <strong>{finalMatchesStats.primer_tiempo.ventaja_primer_tiempo.visitante}</strong> de <strong>{finalMatchesStats.primer_tiempo.ventaja_primer_tiempo.total_ht}</strong> partidos.
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid className="grid grid-cols-1 gap-4 mt-5 mb-5">
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
                                            <TitleText
                                                icon={InsightsIcon}
                                                iconColor='#0A24BA'
                                                title='Todos los enfrentamientos entre los equipos' />
                                            <TablaConPaginacion matches={finalMatchesStats} />
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <CustomAlertas
                                    title='📊 Esta sección muestra estadísticas basadas en el historial de enfrentamientos y rendimiento
                                            de los equipos, considerando también temporadas anteriores.'
                                />
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
    )
}

export default CustomStats
import { Box, Card, CardContent, Fade, Grid, Typography, useTheme } from '@mui/material'
import LoadingSpinner from '../../Loading/LoadingSpinner'
import { getPredictionRandom } from '../../../services/functions'
import { useQuery } from '@tanstack/react-query'
import CustomAlertas from './CustomAlertas'
import {
    Sports as SportsIcon, SportsSoccer as SportsSoccerIcon,
    FormatListBulleted as FormatListBulletedIcon, ThumbsUpDown as ThumbsUpDownIcon,
    Whatshot as WhatshotIcon, GolfCourse as GolfCourseIcon, Square as SquareIcon
} from '@mui/icons-material'
import TitleText from './TitleText'
import MatchStatisticsBarChart from '../Match/graphics/MatchStatisticsBarChart'
import PieChartsOne from '../Match/graphics/PieChartsOne'

const CustomPrediction = ({ equipo_local, equipo_visita, nombre_liga }) => {

    const theme = useTheme()

    // 1. Consulta para Match Forecasts
    const {
        data: matchesPrediction,
        isLoading: isLoadingPrediction,
        isError: isErrorPrediction,
        error: errorPrediction
    } = useQuery({
        queryKey: ["matchesPrediction", equipo_local, equipo_visita],
        queryFn: () => getPredictionRandom(nombre_liga, equipo_local, equipo_visita),
        enabled: Boolean(equipo_local && equipo_visita && nombre_liga),
        staleTime: 1000 * 60 * 15,
        cacheTime: 5 * 60 * 1000
    })

    const isLoading = isLoadingPrediction
    const isError = isErrorPrediction

    if (isLoading) return <LoadingSpinner />

    if (isError) {
        return (
            <div>
                <h2>Error al cargar datos:</h2>
                {isErrorPrediction && <p>Match Prediction: {errorPrediction.message}</p>}
            </div>
        )
    }

    const finalMatchesPrediction = matchesPrediction || []

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
            }}
        >
            {finalMatchesPrediction ? (
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
                                    title='🤖 Esta sección utiliza un modelo de aprendizaje automático de Random Forest para predecir resultados. Se entrena con el historial de partidos, estadísticas de los equipos y datos de temporadas pasadas para ofrecer predicciones de regresión (resultados numéricos) y clasificación (categorías como "ganador" o "perdedor").'
                                />

                                <Grid className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Resultado Final */}
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
                                                icon={SportsIcon}
                                                iconColor='#5468E6'
                                                title='Resultado Final' />
                                            <p className='font-bold text-xl' style={{ color: theme.palette.text.primary }}>
                                                - {finalMatchesPrediction?.predicciones.resultado_final.descripcion}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    {/* ¿Ambos marcan FT? */}
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
                                                icon={ThumbsUpDownIcon}
                                                iconColor='#5468E6'
                                                title='¿Ambos marcan FT?' />
                                            <p className='font-bold text-xl' style={{ color: theme.palette.text.primary }}>
                                                - Probabilidad: {finalMatchesPrediction?.predicciones.ambos_marcan.probabilidad}%
                                            </p>
                                            <p style={{ color: theme.palette.text.secondary }}>
                                                {finalMatchesPrediction?.predicciones.ambos_marcan.alta_probabilidad
                                                    ? 'Alta probabilidad ✅'
                                                    : 'Baja probabilidad ❌'}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Resultado Medio Tiempo */}
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
                                                background: `linear-gradient(90deg, #F36248, #F3B748)`
                                            }
                                        }}>
                                        <CardContent>
                                            <TitleText
                                                icon={SportsIcon}
                                                iconColor='#F36248'
                                                title='Resultado Medio Tiempo' />
                                            <p className='font-bold text-xl' style={{ color: theme.palette.text.primary }}>
                                                - {finalMatchesPrediction?.predicciones.resultado_medio_tiempo.descripcion}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    {/* ¿Ambos marcan HT? */}
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
                                                background: `linear-gradient(90deg, #F36248, #F3B748)`
                                            }
                                        }}>
                                        <CardContent>
                                            <TitleText
                                                icon={ThumbsUpDownIcon}
                                                iconColor='#F36248'
                                                title='¿Ambos marcan HT?' />
                                            <p className='font-bold text-xl' style={{ color: theme.palette.text.primary }}>
                                                - Probabilidad: {finalMatchesPrediction?.predicciones.ambos_marcan_ht.probabilidad}%
                                            </p>
                                            <p style={{ color: theme.palette.text.secondary }}>
                                                {finalMatchesPrediction?.predicciones.ambos_marcan_ht.alta_probabilidad
                                                    ? 'Alta probabilidad ✅'
                                                    : 'Baja probabilidad ❌'}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid className="grid grid-cols-1 gap-4 mt-5">
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
                                                background: `linear-gradient(90deg, #483ED2, #D2483E)`
                                            }
                                        }}>
                                        <CardContent>
                                            <TitleText
                                                icon={FormatListBulletedIcon}
                                                iconColor='#483ED2'
                                                title='Estadísticas para el Partido' />
                                            <MatchStatisticsBarChart estadisticas_esperadas={finalMatchesPrediction?.predicciones.estadisticas_esperadas} />
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
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
                                                background: `linear-gradient(90deg, #73D933, #D99933)`
                                            }
                                        }}>
                                        <CardContent>
                                            <TitleText
                                                icon={SportsSoccerIcon}
                                                iconColor='#D99933'
                                                title='Goles Esperados' />
                                            <PieChartsOne
                                                Data={[
                                                    { id: 0, label: equipo_local, value: finalMatchesPrediction?.predicciones.estadisticas_esperadas.goles_local },
                                                    { id: 1, label: equipo_visita, value: finalMatchesPrediction?.predicciones.estadisticas_esperadas.goles_visitante },
                                                ]}
                                            />
                                        </CardContent>
                                    </Card>

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
                                                background: `linear-gradient(90deg, #73D933, #D99933)`
                                            }
                                        }}>
                                        <CardContent>
                                            <TitleText
                                                icon={WhatshotIcon}
                                                iconColor='#D99933'
                                                title='Tiros al Arco' />
                                            <PieChartsOne
                                                Data={[
                                                    { id: 0, label: equipo_local, value: finalMatchesPrediction?.predicciones.estadisticas_esperadas.tiros_arco_local },
                                                    { id: 1, label: equipo_visita, value: finalMatchesPrediction?.predicciones.estadisticas_esperadas.tiros_arco_visitante },
                                                ]}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
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
                                                background: `linear-gradient(90deg, #1FAE7C, #AE1F50)`
                                            }
                                        }}>
                                        <CardContent>
                                            <TitleText
                                                icon={GolfCourseIcon}
                                                iconColor='#1FAE7C'
                                                title='Tiros de Esquinas' />
                                            <PieChartsOne
                                                Data={[
                                                    { id: 0, label: equipo_local, value: finalMatchesPrediction?.predicciones.estadisticas_esperadas.corners_local },
                                                    { id: 1, label: equipo_visita, value: finalMatchesPrediction?.predicciones.estadisticas_esperadas.corners_visitante },
                                                ]}
                                            />
                                        </CardContent>
                                    </Card>

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
                                                background: `linear-gradient(90deg, #1FAE7C, #AE1F50)`
                                            }
                                        }}>
                                        <CardContent>
                                            <TitleText
                                                icon={SquareIcon}
                                                iconColor='#1FAE7C'
                                                title='Tarjetas Amarillas' />
                                            <PieChartsOne
                                                Data={[
                                                    { id: 0, label: equipo_local, value: finalMatchesPrediction?.predicciones.estadisticas_esperadas.amarillas_local },
                                                    { id: 1, label: equipo_visita, value: finalMatchesPrediction?.predicciones.estadisticas_esperadas.amarillas_visitante },
                                                ]}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid className="grid grid-cols-1 gap-4 mt-5 mb-5">
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
                                                background: `linear-gradient(90deg, #EC0326, #0326EC)`
                                            }
                                        }}>
                                        <CardContent>
                                            <TitleText
                                                icon={SquareIcon}
                                                iconColor='#EC0326'
                                                title='Tarjetas Rojas' />
                                            <PieChartsOne
                                                Data={[
                                                    { id: 0, label: equipo_local, value: finalMatchesPrediction?.predicciones.estadisticas_esperadas.rojas_local },
                                                    { id: 1, label: equipo_visita, value: finalMatchesPrediction?.predicciones.estadisticas_esperadas.rojas_visitante },
                                                ]}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <CustomAlertas
                                    title='🤖 Esta sección utiliza un modelo de aprendizaje automático de Random Forest para predecir resultados. Se entrena con el historial de partidos, estadísticas de los equipos y datos de temporadas pasadas para ofrecer predicciones de regresión (resultados numéricos) y clasificación (categorías como "ganador" o "perdedor").'
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Fade>
            ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="h6" color="#888">
                        No hay predicciones disponibles
                    </Typography>
                </Box>
            )}
        </Box>
    )
}

export default CustomPrediction
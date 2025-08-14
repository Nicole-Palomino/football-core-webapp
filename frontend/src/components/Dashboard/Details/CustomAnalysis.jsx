import { Box, Card, CardContent, Fade, Grid, Typography, useTheme } from '@mui/material'
import { combinarAnalisisYPrediccion, getAnalyticsCluster, getPoisson, getPredictionCluster } from '../../../services/functions'
import LoadingSpinner from '../../Loading/LoadingSpinner'
import { useQuery } from '@tanstack/react-query'
import {
    Assessment as AssessmentIcon, DataSaverOff as DataSaverOffIcon, TableChart as TableChartIcon, 
    SportsSoccer as SportsSoccerIcon, Scoreboard as ScoreboardIcon, Whatshot as WhatshotIcon,
    Square as SquareIcon
} from '@mui/icons-material'
import TitleText from './TitleText'
import CustomAlertas from './CustomAlertas'
import EntreEquipos from './EntreEquipos'

const CustomAnalysis = ({ equipo_local, equipo_visita, nombre_liga }) => {

    const theme = useTheme()

    // 1. Consulta para Poisson
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

    // 2. Consulta para K-means
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

    const isLoading = isLoadingPoisson || isLoadingCluster
    const isError = isErrorPoisson || isErrorCluster

    if (isLoading) return <LoadingSpinner />

    if (isError) {
        return (
            <div>
                <h2>Error al cargar datos:</h2>
                {isErrorPoisson && <p>Match Poisson: {errorPoisson.message}</p>}
                {isErrorCluster && <p>Match Cluster: {errorCluster.message}</p>}
            </div>
        )
    }

    const finalMatchPoisson = matchPoisson || []
    const finalMatchCluster = clusterData || []

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
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
                                    Análisis Probabilístico (Modelo de Poisson)
                                </Typography>

                                <CustomAlertas
                                    title='📈 Este análisis ha sido desarrollado utilizando el modelo estadístico Poisson, basado en datos históricos y rendimiento de los equipos.'
                                />

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
                                                background: `linear-gradient(90deg, #4995FD, #E7AD8C)`
                                            }
                                        }}>
                                        <CardContent sx={{ p: 3, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                                            <TitleText
                                                icon={AssessmentIcon}
                                                iconColor='#4995FD'
                                                title='Goles Esperados' />
                                            <EntreEquipos
                                                equipo_local={equipo_local}
                                                equipo_visita={equipo_visita}
                                                item_local={finalMatchPoisson?.goles_esperados?.local}
                                                item_visita={finalMatchPoisson?.goles_esperados?.visitante} />
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
                                            <TitleText
                                                icon={DataSaverOffIcon}
                                                iconColor='#E17C34'
                                                title='Probabilidades 1X2' />
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
                                            <TitleText
                                                icon={TableChartIcon}
                                                iconColor='#FB7452'
                                                title='Matriz de Resultados Exactos' />
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
                                    className='uppercase'
                                    sx={{
                                        color: 'white',
                                        mb: 4,
                                        mt: 4,
                                        textAlign: 'center',
                                        fontFamily: 'cursive',
                                        background: 'linear-gradient(45deg, #201DBE, #49FD58)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        fontSize: { xs: 18, md: 33 }
                                    }}>
                                    Predicción basada en Clustering K-Means
                                </Typography>

                                <CustomAlertas
                                    title='🤖 Este análisis utiliza K-Means, un algoritmo de machine learning no supervisado, para agrupar equipos según su rendimiento histórico.'
                                />

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
                                            <TitleText
                                                icon={SportsSoccerIcon}
                                                iconColor='#D2BD04'
                                                title='Resumen del Partido' />
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
                                            <TitleText
                                                icon={SportsSoccerIcon}
                                                iconColor='#3D88EA'
                                                title='Goles Esperados FT' />
                                            <EntreEquipos
                                                equipo_local={equipo_local}
                                                equipo_visita={equipo_visita}
                                                item_local={finalMatchCluster?.prediccion.predicciones.goles_esperados_local}
                                                item_visita={finalMatchCluster?.prediccion.predicciones.goles_esperados_visitante} />
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
                                            <TitleText
                                                icon={SportsSoccerIcon}
                                                iconColor='#DD4C32'
                                                title='Goles Esperados HT' />
                                            <EntreEquipos
                                                equipo_local={equipo_local}
                                                equipo_visita={equipo_visita}
                                                item_local={finalMatchCluster?.prediccion.predicciones.goles_ht_local}
                                                item_visita={finalMatchCluster?.prediccion.predicciones.goles_ht_visitante} />
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
                                                background: `linear-gradient(90deg, #E62D58, #BB2DE6)`
                                            }
                                        }}>
                                        <CardContent sx={{ p: 3, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                                            <TitleText
                                                icon={ScoreboardIcon}
                                                iconColor='#E62D58'
                                                title='Ambos marcan' />
                                            <div className="flex justify-center items-center">
                                                <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                                                    <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${Math.round(clusterData?.prediccion.predicciones.ambos_marcan * 100)}%` }}>
                                                        {Math.round(finalMatchCluster?.prediccion.predicciones.ambos_marcan * 100)}%
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-center mt-4">
                                                Probabilidad de ambos marcan: {Math.round(finalMatchCluster?.prediccion.predicciones.ambos_marcan * 100)}%
                                            </p>
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
                                                background: `linear-gradient(90deg, #C1A066, #9F66C1)`
                                            }
                                        }}>
                                        <CardContent sx={{ p: 3, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                                            <TitleText
                                                icon={WhatshotIcon}
                                                iconColor='#9F66C1'
                                                title='Tiros al Arco' />
                                            <EntreEquipos
                                                equipo_local={equipo_local}
                                                equipo_visita={equipo_visita}
                                                item_local={finalMatchCluster?.prediccion.predicciones.tiros_arco_local}
                                                item_visita={finalMatchCluster?.prediccion.predicciones.tiros_arco_visitante} />
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
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
                                                background: `linear-gradient(90deg, #F44B75, #4B75F4)`
                                            }
                                        }}>
                                        <CardContent sx={{ p: 3, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                                            <TitleText
                                                icon={SquareIcon}
                                                iconColor='#F44B75'
                                                title='Disciplinas Local' />
                                            <EntreEquipos
                                                equipo_local='Amarillas'
                                                equipo_visita='Rojas'
                                                item_local={finalMatchCluster?.prediccion.predicciones.amarillas_local}
                                                item_visita={finalMatchCluster?.prediccion.predicciones.rojas_local} />
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
                                                background: `linear-gradient(90deg, #C6C22E, #2E7FC6)`
                                            }
                                        }}>
                                        <CardContent sx={{ p: 3, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                                            <TitleText
                                                icon={SquareIcon}
                                                iconColor='#2E7FC6'
                                                title='Disciplinas Visitante' />
                                            <EntreEquipos
                                                equipo_local='Amarillas'
                                                equipo_visita='Rojas'
                                                item_local={finalMatchCluster?.prediccion.predicciones.amarillas_visitante}
                                                item_visita={finalMatchCluster?.prediccion.predicciones.rojas_visitante} />
                                        </CardContent>
                                    </Card>
                                </Grid>
                                
                                <CustomAlertas
                                    title='🤖 Este análisis utiliza K-Means, un algoritmo de machine learning no supervisado, para agrupar equipos según su rendimiento histórico.'
                                />
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
    )
}

export default CustomAnalysis
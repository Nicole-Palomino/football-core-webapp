import { useMemo, useState } from 'react'
import { Box, CircularProgress, Grid, Tab, Tabs, Typography } from '@mui/material'
import { useAuth } from '../contexts/AuthContexts'
import { getMatchAll } from '../services/api/matches'
import MatchTabs from '../components/Dashboard/Match/MatchTabs'
import { useQuery } from '@tanstack/react-query'

const Match = () => {

    const [value, setValue] = useState(0)
    const { isAuthenticated } = useAuth()

    const seasonId = 12
    const { data = [], error, isLoading, isError } = useQuery({ 
        queryKey: ['match', seasonId], 
        queryFn: () => getMatchAll(seasonId),
        staleTime: 1000 * 60 * 15,
        cacheTime: 5 * 60 * 1000
    })

    const partidosPorJugar = useMemo(
        () => data.filter(p => p.estado.id_estado === 5),
        [data]
    )
    
    const partidosFinalizados = useMemo(
        () => data.filter(p => p.estado.id_estado === 8),
        [data]
    )

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

    if (isError) return <div>Error: {error.message}</div>

    if (!isAuthenticated) {
        return (
            <Box sx={{ textAlign: "center", color: "white", padding: "20px" }}>
                <Typography variant="h5">Debes iniciar sesión para ver los partidos</Typography>
            </Box>
        )
    }

    const handleChange = (event, newValue) => { setValue(newValue) }

    const EmptyMessage = ({ text }) => (
        <Box
            sx={{
            color: "white",
            textAlign: "center",
            padding: "40px",
            fontStyle: "italic",
            fontSize: "18px",
            }}>
            {text}
        </Box>
    )

    return (
        <Box sx={{ flexGrow: 1, backgroundColor: "#0e0f0f" }}>
            <Grid container
                sx={{
                    backgroundColor: "#0e0f0f",
                    minHeight: "100vh",
                    paddingTop: "20px",
                    justifyContent: "center",
                    alignItems: "flex-start",
                }}>
                <Grid item xs={12} md sx={{ display: { xs: "none", md: "block" } }} className="text-white"></Grid>

                {/* contenido principal */}
                <Grid
                    item
                    xs={12}
                    md={7}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        maxHeight: "100%",
                        height: "100%",
                        overflow: "hidden",
                    }}>
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: "800px",
                            backgroundColor: "#0e0f0f",
                            height: "100%",
                            minHeight: "100%",
                            minWidth: "800px",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
                            borderRadius: "10px",
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                        }}>
                        {/* Tabs */}
                        <Tabs
                        value={value}
                        onChange={handleChange}
                        centered
                        variant="fullWidth"
                        sx={{
                            "& .MuiTabs-indicator": { backgroundColor: "#368FF4" },
                            "& .MuiTab-root": { color: "white", fontFamily: "cursive" },
                            backgroundColor: "#202121",
                            borderRadius: "10px 10px 0 0",
                            "& .MuiTab-root.Mui-selected": { color: "#368FF4" },
                        }}>
                            <Tab label="Próximos Partidos" />
                            <Tab label="Partidos Finalizados" />
                        </Tabs>

                        <Box sx={{ flex: 1, overflowY: "visible" }}>
                            {value === 0 ? (
                                partidosPorJugar.length > 0 ? (
                                    <MatchTabs match={partidosPorJugar} />
                                ) : (
                                    <EmptyMessage text="No hay partidos por jugar." />
                                )
                            ) : partidosFinalizados.length > 0 ? (
                                    <MatchTabs match={partidosFinalizados} />
                            ) : (
                                    <EmptyMessage text="No hay partidos finalizados." />
                            )}
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12}md sx={{ display: { xs: "none", md: "block" } }} className="text-white"></Grid>
            </Grid>
        </Box>
    )
}

export default Match
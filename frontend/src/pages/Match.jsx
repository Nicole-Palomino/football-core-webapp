import { useEffect, useMemo, useState } from 'react'
import { Box, CircularProgress, Grid, Tab, Tabs, Typography } from '@mui/material'
import { useAuth } from '../contexts/AuthContexts'
import { getMatchAll } from '../services/matches'
import MatchTabs from '../components/MatchTabs'

const Match = () => {

    const [match, setMatch] = useState([])
    const [value, setValue] = useState(0)
    const [loading, setLoading] = useState(true)
    const { isAuthenticated } = useAuth()

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true)

            try {
                const matchesData = await getMatchAll(12)
                setMatch(matchesData || [])
            } catch (error) {
                console.error("Error al obtener partidos por temporada:", error)
            } finally {
                setLoading(false)
            }
        }

        if (isAuthenticated) {
            fetchMatches()
        }
    }, [isAuthenticated])

    if (!isAuthenticated) {
        return (
            <Box sx={{ textAlign: "center", color: "white", padding: "20px" }}>
                <Typography variant="h5">Debes iniciar sesión para ver los partidos</Typography>
            </Box>
        )
    }

    const handleChange = (event, newValue) => { setValue(newValue) }

    const partidosPorJugar = useMemo(
        () => match.filter(p => p.estado.id_estado === 5), 
        [match]
    )
    
    const partidosFinalizados = useMemo(
        () => match.filter(p => p.estado.id_estado === 8),
        [match]
    )

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

    if (loading) {
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
        );
    }

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
                            "& .MuiTabs-indicator": { backgroundColor: "#00FF88" },
                            "& .MuiTab-root": { color: "white", fontFamily: "cursive" },
                            backgroundColor: "#202121",
                            borderRadius: "10px 10px 0 0",
                            "& .MuiTab-root.Mui-selected": { color: "#00FF88" },
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
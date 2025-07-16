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
                const matchesData = await getMatchAll(12);
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
        );
    }

    const handleChange = (event, newValue) => { setValue(newValue) }

    const partidosPorJugar = useMemo(
        () => match.filter(p => p.id_estado === 5), 
        [match]
    )

    const partidosFinalizados = useMemo(
        () => match.filter(p => p.id_estado === 8),
        [match]
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
        <Box sx={{ flexGrow: 1, backgroundColor: "#001F3F" }}>
            <Grid container>
                <Grid item xs={12} md sx={{ display: { xs: "none", md: "block" } }} className="text-white"></Grid>

                <Grid item xs={12} md={7}>
                    {match.length > 0 && (
                        <Box sx={{ width: "100%", marginTop: "20px" }}>
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                centered
                                variant="fullWidth"
                                sx={{
                                    "& .MuiTabs-indicator": { backgroundColor: "#00FF88" },
                                    "& .MuiTab-root": { color: "white", fontFamily: "cursive" },
                                    backgroundColor: "#002855",
                                    borderRadius: "10px 10px 0 0",
                                    "& .MuiTab-root.Mui-selected": { color: "#00FF88" },
                                }}>
                                <Tab label="Próximos Partidos" />
                                <Tab label="Partidos Finalizados" />
                            </Tabs>

                            { value === 0 && (
                                <>
                                    <MatchTabs match={partidosPorJugar} />
                                </>
                            )}

                            {value === 1 && <MatchTabs match={partidosFinalizados}/>}
                        </Box>
                    )}
                </Grid>

                <Grid item xs={12}md sx={{ display: { xs: "none", md: "block" } }} className="text-white"></Grid>
            </Grid>
        </Box>
    )
}

export default Match
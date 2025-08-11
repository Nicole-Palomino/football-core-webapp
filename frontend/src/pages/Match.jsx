import { useState } from 'react'
import { Box, Grid, Tab, Tabs, useTheme } from '@mui/material'
import { useAuth } from '../contexts/AuthContexts'
import MatchTabs from '../components/Dashboard/Match/MatchTabs'
import LoadingSpinner from '../components/Loading/LoadingSpinner'
import EmptyMessage from '../utils/empty'
import { useEstadoMatches, usePartidosFinalizados, usePartidosPorJugar } from '../contexts/MatchesContext'

const Match = () => {

    const [value, setValue] = useState(0)
    const { isAuthenticated } = useAuth()
    const theme = useTheme()

    const partidosPorJugar = usePartidosPorJugar()
    const partidosFinalizados = usePartidosFinalizados()
    const { isLoading, isError, error } = useEstadoMatches()

    if (isLoading) return <LoadingSpinner />
    if (isError) return <div>Error: {error.message}</div>

    if (!isAuthenticated) {
        return <EmptyMessage text="Inicia sesión para ver partidos" />
    }

    const handleChange = (event, newValue) => { setValue(newValue) }

    return (
        <Box sx={{ flexGrow: 1, backgroundColor: theme.palette.primary.dark }}>
            <Grid container
                sx={{
                    backgroundColor: theme.palette.background.default,
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
                        boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: "20px",
                    }}>
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: "800px",
                            height: "100%",
                            minHeight: "100%",
                            minWidth: { xs: "100%", md: "800px" }
                        }}>
                        {/* Tabs */}
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            centered
                            variant="fullWidth"
                            sx={{
                                "& .MuiTabs-indicator": { backgroundColor: theme.palette.primary.dark },
                                "& .MuiTab-root": { color: theme.palette.text.primary, fontFamily: 'cursive' },
                                borderRadius: "10px 10px 0 0",
                                "& .MuiTab-root.Mui-selected": { color: theme.palette.text.primary },
                            }}>
                            <Tab label="Próximos Partidos" />
                            <Tab label="Partidos Finalizados" />
                        </Tabs>

                        <Box sx={{ flex: 1, overflowY: "visible" }}>
                            {value === 0 ? (
                                partidosPorJugar.length > 0 ? (
                                    <MatchTabs type="por-jugar" />
                                ) : (
                                    <EmptyMessage text="No hay partidos por jugar." />
                                )
                            ) : partidosFinalizados.length > 0 ? (
                                <MatchTabs type="finalizados" />
                            ) : (
                                <EmptyMessage text="No hay partidos finalizados." />
                            )}
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12} md sx={{ display: { xs: "none", md: "block" } }} className="text-white"></Grid>
            </Grid>
        </Box>
    )
}

export default Match
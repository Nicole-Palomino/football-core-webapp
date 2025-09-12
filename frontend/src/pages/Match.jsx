import { useState } from 'react'
import { Box, Grid, Tab, Tabs } from '@mui/material'
import { useAuth } from '../contexts/AuthContexts'
import { useThemeMode } from '../contexts/ThemeContext'
import MatchTabs from '../components/Dashboard/Match/MatchTabs'
import LoadingSpinner from '../components/Loading/LoadingSpinner'
import EmptyMessage from '../utils/empty'
import { useEstadoMatches, usePartidosFinalizados, usePartidosPorJugar } from '../contexts/MatchesContext'

const Match = () => {

    const [value, setValue] = useState(0)
    const { isAuthenticated } = useAuth()
    const { currentTheme } = useThemeMode()

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
        <Box className={`flex-1 ${currentTheme.accent}`}>
            <Grid container
                className={`min-h-screen pt-5 justify-center items-start ${currentTheme.background}`}>
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
                        backgroundColor: currentTheme.background,
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
                                "& .MuiTabs-indicator": { backgroundColor: currentTheme.accent },
                                "& .MuiTab-root": { color: currentTheme.text, fontFamily: 'cursive' },
                                borderRadius: "10px 10px 0 0",
                                "& .MuiTab-root.Mui-selected": { color: currentTheme.text },
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
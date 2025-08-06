import { Avatar, Box, Chip, Grid, List, ListItem, Paper, Typography, useMediaQuery } from '@mui/material'
import { formatFecha } from '../../../utils/helpers'
import { CalendarToday, EmojiEvents, SportsSoccer, Timeline } from '@mui/icons-material'
import { motion } from 'framer-motion'

const ListMatch = ({ matches = [] }) => {
    const isMobile = useMediaQuery("(max-width:600px)")

    const getMatchResult = (localGoals, awayGoals) => {
        if (localGoals === undefined || awayGoals === undefined) return 'pending'
        if (localGoals > awayGoals) return 'local'
        if (awayGoals > localGoals) return 'away'
        return 'draw'
    }

    const getResultColor = (result) => {
        switch (result) {
            case 'local': return '#00FF00'
            case 'away': return '#DE4B4B'
            case 'draw': return '#FFD93D'
            default: return '#888'
        }
    }

    const getResultIcon = (result) => {
        switch (result) {
            case 'local': return '🏠'
            case 'away': return '✈️'
            case 'draw': return '🤝'
            default: return '⏱️'
        }
    }

    if (matches.length === 0) {
        return (
            <Box sx={{
                textAlign: 'center',
                py: 6,
                bgcolor: 'rgba(255,255,255,0.05)',
                borderRadius: 2
            }}>
                <Timeline sx={{ fontSize: 48, color: '#666', mb: 2 }} />
                <Typography variant="h6" color="#888">
                    No hay historial de enfrentamientos
                </Typography>
                <Typography variant="body2" color="#666" mt={1}>
                    Estos equipos no se han enfrentado recientemente
                </Typography>
            </Box>
        )
    }

    return (
        <List sx={{ width: "100%", padding: "20px" }}>
            {/* Header de estadísticas rápidas */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#368FF4', mb: 2, gap: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <EmojiEvents sx={{ color: '#368FF4' }} />
                    Últimos {matches.length} Enfrentamientos
                </Typography>

                {/* Estadísticas rápidas */}
                <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    sx={{ mb: 2 }}
                >
                    {[
                        { label: "De Local", color: "#00FF00", bg: "rgba(0,255,0,0.1)", border: "rgba(0,255,0,0.3)", value: matches.filter(m => getMatchResult(m.FTHG, m.FTAG) === 'local').length },
                        { label: "Empates", color: "#FFD93D", bg: "rgba(255,211,61,0.1)", border: "rgba(255,211,61,0.3)", value: matches.filter(m => getMatchResult(m.FTHG, m.FTAG) === 'draw').length },
                        { label: "De Visitante", color: "#FF6B6B", bg: "rgba(255,107,107,0.1)", border: "rgba(255,107,107,0.3)", value: matches.filter(m => getMatchResult(m.FTHG, m.FTAG) === 'away').length }
                    ].map((stat, i) => (
                        <Grid item key={i} xs={12} sm="auto">
                            <Paper sx={{
                                width: 120,
                                height: 80,
                                p: 1.5,
                                bgcolor: stat.bg,
                                border: `1px solid ${stat.border}`,
                                textAlign: 'center',
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <Typography variant="h4" sx={{ color: stat.color }}>
                                    {stat.value}
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'white' }}>
                                    {stat.label}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Lista de partidos */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {matches.map((item, index) => {
                    const result = getMatchResult(item.FTHG, item.FTAG)
                    const resultColor = getResultColor(result)
                    const resultIcon = getResultIcon(result)

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Paper
                                elevation={4}
                                sx={{
                                    bgcolor: '#242424',
                                    border: `2px solid ${resultColor}20`,
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    position: 'relative',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 8px 25px ${resultColor}30`
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {/* Indicador de resultado lateral */}
                                <Box sx={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: 5,
                                    bgcolor: resultColor
                                }} />

                                <Box sx={{ p: isMobile ? 2 : 3 }}>
                                    {/* Header con fecha y resultado */}
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 2
                                    }}>
                                        <Chip
                                            icon={<CalendarToday />}
                                            label={formatFecha(item.Date)}
                                            size="small"
                                            sx={{
                                                fontSize: '18px',
                                                padding: '10px',
                                                bgcolor: 'rgba(255,255,255,0.1)',
                                                color: 'white',
                                                '& .MuiChip-icon': { color: '#368FF4' }
                                            }}
                                        />

                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            bgcolor: `${resultColor}20`,
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: 2
                                        }}>
                                            <Typography variant="body2" sx={{ color: resultColor }}>
                                                {resultIcon}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: resultColor, fontWeight: 'bold', fontSize: '16px' }}>
                                                {result === 'local' ? 'Victoria Local' :
                                                    result === 'away' ? 'Victoria Visitante' :
                                                        result === 'draw' ? 'Empate' : 'Pendiente'}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Equipos y marcador */}
                                    <Grid container spacing={2} alignItems="center">
                                        {/* Equipo Local */}
                                        <Grid item xs={5}>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1.5,
                                                p: 1.5,
                                                bgcolor: result === 'local' ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.05)',
                                                borderRadius: 2,
                                                border: result === 'local' ? '1px solid rgba(0,255,136,0.3)' : '1px solid transparent'
                                            }}>
                                                <Avatar
                                                    sx={{
                                                        width: isMobile ? 30 : 40,
                                                        height: isMobile ? 30 : 40,
                                                        bgcolor: '#1976d2', // color de fondo opcional
                                                        fontSize: isMobile ? 14 : 18,
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    {item.HomeTeam?.[0] ?? 'E'} {/* Usa la primera letra o 'E' por defecto */}
                                                </Avatar>
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography
                                                        variant={isMobile ? "body2" : "body1"}
                                                        sx={{
                                                            color: result === 'local' ? '#00FF88' : 'white',
                                                            fontWeight: result === 'local' ? 'bold' : 'normal',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {item.HomeTeam}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#888' }}>
                                                        Local
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>

                                        {/* Marcador Central */}
                                        <Grid item xs={2}>
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: 0.5
                                            }}>
                                                <SportsSoccer sx={{ color: resultColor, fontSize: 20 }} />
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    bgcolor: 'rgba(255,255,255,0.1)',
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: 1
                                                }}>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            color: result === 'local' ? '#00FF88' : 'white',
                                                            fontWeight: 'bold',
                                                            fontSize: isMobile ? '1rem' : '1.25rem'
                                                        }}
                                                    >
                                                        {item.FTHG ?? "-"}
                                                    </Typography>
                                                    <Typography sx={{ color: '#888', mx: 0.5 }}>-</Typography>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            color: result === 'away' ? '#FF6B6B' : 'white',
                                                            fontWeight: 'bold',
                                                            fontSize: isMobile ? '1rem' : '1.25rem'
                                                        }}
                                                    >
                                                        {item.FTAG ?? "-"}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>

                                        {/* Equipo Visitante */}
                                        <Grid item xs={5}>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1.5,
                                                p: 1.5,
                                                bgcolor: result === 'away' ? 'rgba(255,107,107,0.1)' : 'rgba(255,255,255,0.05)',
                                                borderRadius: 2,
                                                border: result === 'away' ? '1px solid rgba(255,107,107,0.3)' : '1px solid transparent'
                                            }}>
                                                <Avatar
                                                    sx={{
                                                        width: isMobile ? 30 : 40,
                                                        height: isMobile ? 30 : 40,
                                                        bgcolor: '#d32f2f', // puedes elegir cualquier color de fondo
                                                        fontSize: isMobile ? 14 : 18,
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    {item.AwayTeam?.[0] ?? 'E'}
                                                </Avatar>
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography
                                                        variant={isMobile ? "body2" : "body1"}
                                                        sx={{
                                                            color: result === 'away' ? '#FF6B6B' : 'white',
                                                            fontWeight: result === 'away' ? 'bold' : 'normal',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {item.AwayTeam}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#888' }}>
                                                        Visitante
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Paper>
                        </motion.div>
                    )
                })}
            </Box>
        </List>
    )
}

export default ListMatch
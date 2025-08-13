import { Avatar, Box, Chip, Grid, List, ListItem, Paper, Typography, useMediaQuery, useTheme } from '@mui/material'
import { formatFecha } from '../../../utils/helpers'
import { CalendarToday, EmojiEvents, SportsSoccer, Timeline } from '@mui/icons-material'
import { motion } from 'framer-motion'

const ListMatch = ({ matches = [], match }) => {
    const isMobile = useMediaQuery("(max-width:600px)")
    const theme = useTheme()

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
        <List sx={{ width: "100%", padding: "10px" }}>
            {/* Header de estadísticas rápidas */}
            <Box sx={{ mb: 2 }}>
                <Typography sx={{ color: theme.palette.primary.main, mb: 2, gap: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: { xs: 18, md: 36 } }}>
                    <EmojiEvents sx={{ color: theme.palette.primary.main }} />
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
                        { label: "De Local", color: theme.custom.rojo, bg: theme.custom.rojo + '2A', border: theme.custom.rojo + '6A', value: matches.filter(m => getMatchResult(m.FTHG, m.FTAG) === 'local').length },
                        { label: "Empates", color: theme.custom.naranja, bg: theme.custom.naranja + '2A', border: theme.custom.naranja + '6A', value: matches.filter(m => getMatchResult(m.FTHG, m.FTAG) === 'draw').length },
                        { label: "De Visitante", color: theme.custom.azulHover, bg: theme.custom.azulHover + '2A', border: theme.custom.azulHover + '6A', value: matches.filter(m => getMatchResult(m.FTHG, m.FTAG) === 'away').length }
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
                                <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
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
                    const isLocal = item.HomeTeam === match[0].equipo_local.nombre_equipo
                    const isAway = item.AwayTeam === match[0].equipo_visita.nombre_equipo

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
                                    bgcolor: theme.palette.background.default,
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
                                        mb: 2,
                                        flexWrap: 'wrap',
                                        gap: 1,
                                        [theme.breakpoints.down("sm")]: {
                                            flexDirection: "column",
                                            alignItems: "flex-start"
                                        }
                                    }}>
                                        <Chip
                                            icon={<CalendarToday />}
                                            label={formatFecha(item.Date)}
                                            size="small"
                                            sx={{
                                                fontSize: { xs: '14px', sm: '18px' },
                                                padding: { xs: '6px', sm: '10px' },
                                                bgcolor: theme.palette.background.paper,
                                                color: theme.palette.text.primary,
                                                '& .MuiChip-icon': { color: theme.palette.text.primary }
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
                                    <Grid container spacing={2} alignItems="center" sx={{ [theme.breakpoints.down("sm")]: { flexDirection: "column" } }}>
                                        {/* Equipo Local */}
                                        <Grid item xs={12} sm={5}>
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
                                                    alt={isLocal ? match[0].equipo_local.nombre_equipo : match[0].equipo_visita.nombre_equipo}
                                                    src={isLocal ? match[0].equipo_local.logo : match[0].equipo_visita.logo}
                                                    sx={{ width: 30, height: 30, "& img": { objectFit: "contain" } }}
                                                />
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography
                                                        variant={isMobile ? "body2" : "body1"}
                                                        sx={{
                                                            color: result === 'local' ? theme.palette.text.secondary : theme.palette.text.primary,
                                                            fontWeight: result === 'local' ? 'bold' : 'normal',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {item.HomeTeam}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                                        Local
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>

                                        {/* Marcador Central */}
                                        <Grid item xs={12} sm={2}>
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
                                                    bgcolor: theme.custom.naranja + '4A',
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: 1
                                                }}>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            color: result === 'local' ? theme.palette.text.primary : theme.palette.text.secondary,
                                                            fontWeight: 'bold',
                                                            fontSize: isMobile ? '1rem' : '1.25rem'
                                                        }}
                                                    >
                                                        {item.FTHG ?? "-"}
                                                    </Typography>
                                                    <Typography sx={{ color: theme.palette.text.primary, mx: 0.5 }}>-</Typography>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            color: result === 'away' ? theme.palette.text.primary : theme.palette.text.secondary,
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
                                        <Grid item xs={12} sm={5}>
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
                                                    alt={isAway ? match[0].equipo_visita.nombre_equipo : match[0].equipo_local.nombre_equipo}
                                                    src={isAway ? match[0].equipo_visita.logo : match[0].equipo_local.logo}
                                                    sx={{ width: 30, height: 30, "& img": { objectFit: "contain" } }}
                                                />
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography
                                                        variant={isMobile ? "body2" : "body1"}
                                                        sx={{
                                                            color: result === 'away' ? theme.palette.text.secondary : theme.palette.text.primary,
                                                            fontWeight: result === 'away' ? 'bold' : 'normal',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {item.AwayTeam}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
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
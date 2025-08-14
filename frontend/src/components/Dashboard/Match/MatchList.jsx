import { List, ListItem, Grid, Box, Typography, IconButton, Tooltip, Avatar, useTheme } from "@mui/material"
import InfoOutlined from "@mui/icons-material/InfoOutlined"
import FavoriteStar from '../Favorites/FavoriteStar'
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'
import { useFavoritos } from '../../../hooks/FavoritosContext'
import { formatFecha } from '../../../utils/helpers'
import { useNavigate } from 'react-router-dom'
import LoadingFavorite from "../../Loading/LoadingFavorite"
import React from "react"

const MatchList = React.memo(({ partidos, type }) => {
    const { loadingFavoritos } = useFavoritos()
    const navigate = useNavigate()
    const theme = useTheme()

    const onInfoClick = (team1_id, team2_id, partido_id) => {
        navigate(`/dashboard/${partido_id}`, {
            state: {
                equipo_local: team1_id,
                equipo_visita: team2_id
            }
        })
    }

    const onPrediccionClick = (team1_id, team2_id, partido_id) => {
        navigate(`/dashboard/predicciones/${partido_id}`, {
            state: {
                equipo_local: team1_id,
                equipo_visita: team2_id
            }
        })
    }

    const onResumenClick = (partido_id) => {
        navigate(`/resumen/${partido_id}`)
    }

    const onImagenesClick = (partido_id) => {
        navigate(`/imagenes/${partido_id}`)
    }

    if (loadingFavoritos) {
        <LoadingFavorite />
    }

    return (
        <List sx={{ color: theme.palette.text.primary }}>
            {partidos.map((partido) => (
                <ListItem
                    key={partido.id_partido}
                    sx={{
                        fontFamily: "cursive",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                        py: 1
                    }}
                >
                    {/* Equipos */}
                    <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        wrap="nowrap"
                        sx={{ flex: 1, minWidth: 0 }}
                    >
                        <Grid item xs="auto">
                            <FavoriteStar partidoId={partido.id_partido} />
                        </Grid>

                        <Grid
                            item
                            xs
                            sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}
                        >
                            {/* Local */}
                            <Box sx={{
                                display: "grid",
                                gridTemplateColumns: "auto 1fr auto",
                                alignItems: "center",
                                gap: 1
                            }}>
                                <Avatar alt={partido.equipo_local.nombre_equipo} src={partido.equipo_local.logo} sx={{ width: 30, height: 30, "& img": { objectFit: "contain" } }} />
                                <Typography noWrap sx={{ fontSize: { xs: "12px", sm: "13px" }, fontWeight: 500 }}>
                                    {partido.equipo_local.nombre_equipo}
                                </Typography>
                                <Typography noWrap sx={{ fontWeight: "bold", textAlign: "right", fontSize: { xs: "12px", sm: "13px" }, minWidth: "28px" }}>
                                    {partido.estadisticas?.FTHG ?? " "}
                                </Typography>
                            </Box>

                            {/* Visitante */}
                            <Box sx={{
                                display: "grid",
                                gridTemplateColumns: "auto 1fr auto",
                                alignItems: "center",
                                gap: 1
                            }}>
                                <Avatar alt={partido.equipo_visita.nombre_equipo} src={partido.equipo_visita.logo} sx={{ width: 30, height: 30, "& img": { objectFit: "contain" } }} />
                                <Typography noWrap sx={{ fontSize: { xs: "12px", sm: "13px" }, fontWeight: 500 }}>
                                    {partido.equipo_visita.nombre_equipo}
                                </Typography>
                                <Typography noWrap sx={{ fontWeight: "bold", textAlign: "right", fontSize: { xs: "12px", sm: "13px" }, minWidth: "28px" }}>
                                    {partido.estadisticas?.FTAG ?? " "}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Fecha + acciones */}
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                fontSize: { xs: "11px", sm: "12px" },
                                color: theme.palette.text.secondary,
                                textAlign: "right"
                            }}
                        >
                            {formatFecha(partido.dia)}
                        </Typography>

                        {/* Íconos dinámicos */}
                        <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                            {type === "por-jugar" ? (
                                <>
                                    <Tooltip title="Análisis">
                                        <IconButton size="small" onClick={() => onInfoClick(
                                            partido.equipo_local.nombre_equipo,
                                            partido.equipo_visita.nombre_equipo,
                                            partido.id_partido
                                        )}>
                                            <InfoOutlined sx={{ color: theme.palette.text.primary }} />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Predicciones">
                                        <IconButton size="small" onClick={() => onPrediccionClick(
                                            partido.equipo_local.nombre_equipo,
                                            partido.equipo_visita.nombre_equipo,
                                            partido.id_partido
                                        )}>
                                            <TipsAndUpdatesIcon sx={{ color: theme.custom.amarillo }} />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            ) : (
                                <>
                                    <Tooltip title="Resumen">
                                        <IconButton size="small" onClick={() => onResumenClick(partido.id_partido)}>
                                            📄
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Imágenes">
                                        <IconButton size="small" onClick={() => onImagenesClick(partido.id_partido)}>
                                            🖼️
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )}
                        </Box>
                    </Box>
                </ListItem>
            ))}
        </List>
    )
})

export default MatchList
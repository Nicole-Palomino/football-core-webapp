import { List, ListItem, Grid, Box, Typography, IconButton, Tooltip, CircularProgress, Avatar } from "@mui/material"
import InfoOutlined from "@mui/icons-material/InfoOutlined"
import FavoriteStar from '../Favorites/FavoriteStar'
import { useFavoritos } from '../../../hooks/FavoritosContext'
import { formatFecha } from '../../../utils/helpers'
import { useNavigate } from 'react-router-dom'

const MatchList = ({ partidos }) => {
    const { loadingFavoritos } = useFavoritos()
    const navigate = useNavigate()

    const onInfoClick = (team1_id, team2_id, partido_id) => {
        navigate(`/dashboard/${partido_id}`, {
            state: {
                equipo_local: team1_id,
                equipo_visita: team2_id
            }
        })
    }

    if (loadingFavoritos) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <div>
            <List sx={{ color: "white" }}>
                {partidos.map((partido, index) => {
                    return (
                        <ListItem key={partido.id_partido}
                            alignItems="center"
                            sx={{ borderBottom: "1px solid #E0E0E0", fontFamily: "cursive" }}>
                            <Grid container alignItems="center" spacing={2} justifyContent="space-between" sx={{ display: "flex", flexWrap: "nowrap" }}>
                                <Grid item xs="auto" sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                                    <FavoriteStar
                                        partidoId={partido.id_partido}
                                    />
                                </Grid>

                                {/* Equipos */}
                                <Grid item xs={7} sm={5} sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 1, textAlign: "left" }}>
                                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center",width: "100%" }}>
                                        <Avatar alt={partido.equipo_local.nombre_equipo} src={partido.equipo_local.logo}
                                            sx={{ 
                                                width: 30, 
                                                height: 30, 
                                                marginRight: 3, 
                                                // backgroundColor: '#f5f5dc', 
                                                '& img': {
                                                    objectFit: 'contain'
                                                }
                                            }} />
                                        <Typography noWrap sx={{ minWidth: "106px", fontSize: '13px', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {partido.equipo_local.nombre_equipo}
                                        </Typography>
                                        <Typography noWrap sx={{ fontWeight: 'bold', textAlign: 'right', fontSize: '13px', minWidth: "28px",  }}>
                                            {partido.estadisticas?.FTHG ?? " "}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center",width: "100%" }}>
                                        <Avatar alt={partido.equipo_visita.nombre_equipo} src={partido.equipo_visita.logo}
                                            sx={{ 
                                                width: 30, 
                                                height: 30, 
                                                marginRight: 3, 
                                                // backgroundColor: '#f5f5dc', 
                                                '& img': {
                                                    objectFit: 'contain'
                                                }
                                            }} />
                                        <Typography noWrap sx={{ minWidth: "106px", fontSize: '13px', overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {partido.equipo_visita.nombre_equipo}
                                        </Typography>
                                        <Typography noWrap sx={{ fontWeight: 'bold', textAlign: 'right', fontSize: '13px', minWidth: "28px" }}>
                                            {partido.estadisticas?.FTAG ?? " "}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={4} sm={3} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                                    <Typography variant="body1" sx={{ color: "white", fontSize: "11px", textAlign: "center", mb: 1 }}>
                                        {formatFecha(partido.dia)}
                                    </Typography>

                                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                                        <Tooltip title="Info">
                                            <IconButton onClick={() => onInfoClick(partido.equipo_local.nombre_equipo, partido.equipo_visita.nombre_equipo, partido.id_partido)}>
                                                <InfoOutlined sx={{ color: "white" }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Grid>
                            </Grid>
                        </ListItem>
                    )
                })}
            </List>
        </div>
    )
}

export default MatchList
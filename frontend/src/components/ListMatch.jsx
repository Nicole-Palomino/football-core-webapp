import { Box, Grid, List, ListItem, Typography, useMediaQuery } from '@mui/material'
import { formatFecha } from '../services/encryptionService'

const ListMatch = ({ matches = [] }) => {
    const isMobile = useMediaQuery("(max-width:600px)")

    return (
        <List sx={{ width: "100%" }}>
            { matches.length > 0 ? (
                matches.map((item, index) => (
                    <ListItem
                        key={index}
                        alignItems="center"
                        sx={{
                            borderBottom: "1px solid #E0E0E0",
                            fontFamily: "cursive",
                            padding: isMobile ? "8px" : "16px",
                        }}>
                            <Grid 
                                container
                                alignItems="center"
                                spacing={2}
                                justifyContent="space-between"
                                sx={{ flexWrap: isMobile ? "wrap" : "nowrap" }}>
                                    {/* Fecha y Botones */}
                                    <Grid
                                        item xs={12} sm={12} md={5}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 1,
                                            marginTop: isMobile ? "8px" : "0",
                                        }}>
                                        <Typography variant="body1" sx={{ color: "white", fontSize: isMobile ? "13x" : "18px", textAlign: "center" }}>
                                            {formatFecha(item.dia)}
                                        </Typography>
                                    </Grid>

                                    {/* Equipos */}
                                    <Grid
                                        item
                                        xs={12} sm={12} md={7}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: isMobile ? "center" : "stretch",
                                            gap: 1,
                                            textAlign: isMobile ? "left" : "left",
                                        }}>
                                            <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center", width: "100%" }}>
                                                <Typography
                                                    noWrap
                                                    sx={{
                                                        // minWidth: isMobile ? "80px" : "106px",
                                                        fontSize: isMobile ? "14px" : "15px",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        color: "white",
                                                    }}>
                                                    {item.equipo_local.nombre_equipo}
                                                </Typography>
                                                <img alt="Avatar" src={item.logo_local} style={{ width: 20, height: 20, minWidth: "20px" }} />
                                                <Typography noWrap sx={{ fontWeight: "bold", textAlign: "right", fontSize: "17px", minWidth: "28px", color: "white" }}>
                                                    {item.estadisticas?.FTHG ?? " "}
                                                </Typography>
                                            </Box>

                                            {/* Equipo Visitante */}
                                            <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center", width: "100%" }}>
                                                <Typography
                                                    noWrap
                                                    sx={{
                                                        // minWidth: isMobile ? "80px" : "106px",
                                                        fontSize: isMobile ? "14px" : "15px",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        color: "white",
                                                    }}>
                                                    {item.equipo_visita.nombre_equipo}
                                                </Typography>
                                                <img alt="Avatar" src={item.logo_visita} style={{ width: 20, height: 20, minWidth: "20px" }} />
                                                <Typography noWrap sx={{ fontWeight: "bold", textAlign: "right", fontSize: "17px", minWidth: "28px", color: "white" }}>
                                                    {item.estadisticas?.FTAG ?? " "}
                                                </Typography>
                                            </Box>
                                    </Grid>
                            </Grid>
                    </ListItem> 
                ))
            ) : (
                <p>No hay partidos</p>
            )}
        </List>
    )
}

export default ListMatch
import { Accordion, AccordionSummary, AccordionDetails, Avatar, Typography, useTheme } from "@mui/material"
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp"
import MatchList from "./MatchList"
import { useMemo } from "react"

const MatchAccordion = ({ data, type }) => {

    const theme = useTheme()

    const partidosPorLiga = useMemo(() => {
        const grouped = data.reduce((acc, partido) => {
            const key = partido.liga.id_liga
            if (!acc[key]) {
                acc[key] = {
                    nombre_liga: partido.liga.nombre_liga,
                    logo_liga: partido.liga.imagen_pais,
                    partidos: [],
                }
            }
            acc[key].partidos.push(partido)
            return acc
        }, {})
        return grouped
    }, [data])

    const ligas = useMemo(() => Object.entries(partidosPorLiga), [partidosPorLiga])

    return (
        <>
            {ligas.map(([ligaId, { nombre_liga, logo_liga, partidos }]) => (
                <Accordion key={ligaId} defaultExpanded sx={{ boxShadow: theme.palette.primary.dark }}>
                    <AccordionSummary
                        expandIcon={<KeyboardArrowUp sx={{ color: theme.palette.text.primary }} />}
                        sx={{
                            backgroundColor: theme.palette.background.paper,
                            color: theme.palette.text.primary,
                            "& .MuiAccordionSummary-content": { alignItems: "center" },
                            borderBottom: 1,
                        }}>
                        <Avatar alt={nombre_liga} src={logo_liga}
                            sx={{
                                width: 40,
                                height: 40,
                                marginRight: 3,
                                backgroundColor: theme.palette.divider.secondary,
                                '& img': {
                                    objectFit: 'contain'
                                }
                            }} />
                        <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>{nombre_liga}</Typography>
                    </AccordionSummary>

                    <AccordionDetails sx={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}>
                        <MatchList partidos={partidos} type={type} />
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    )
}

export default MatchAccordion
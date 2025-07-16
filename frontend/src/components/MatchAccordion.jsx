import { Accordion, AccordionSummary, AccordionDetails, Avatar, Typography } from "@mui/material"
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp"
import MatchList from "./MatchList"

const MatchAccordion = ({ data }) => {

    const partidosPorLiga = data.reduce((acc, partido) => {
        if (!acc[partido.liga.nombre_liga]) {
            acc[partido.liga.nombre_liga] = {
                logo_liga: partido.liga.imagen_pais,
                partidos: [],
            }
        }
        acc[partido.liga.nombre_liga].partidos.push(partido)
        return acc
    }, {})

    return (
        <>
            {Object.entries(partidosPorLiga).map(([liga, ligaData], index) => (
                <Accordion key={index} defaultExpanded sx={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)" }}>
                    <AccordionSummary
                        expandIcon={<KeyboardArrowUp sx={{ color: "white" }} />}
                        sx={{
                            backgroundColor: "#002855",
                            color: "white",
                            "& .MuiAccordionSummary-content": { alignItems: "center" },
                        }}>
                        <Avatar alt={liga} src={ligaData.logo_liga} style={{ width: 30, height: 30, marginRight: 10 }} />
                        <Typography sx={{ fontWeight: "bold", fontSize: "15px" }}>{liga}</Typography>
                    </AccordionSummary>

                    <AccordionDetails sx={{ backgroundColor: "#123456", color: "white" }}>
                        <MatchList partidos={ligaData.partidos} />
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    )
}

export default MatchAccordion
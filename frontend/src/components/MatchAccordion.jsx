import { Accordion, AccordionSummary, AccordionDetails, Avatar, Typography } from "@mui/material"
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp"
import MatchList from "./MatchList"

const MatchAccordion = ({ data }) => {

    const partidosPorLiga = data.reduce((acc, partido) => {
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

    return (
        <>
            {Object.entries(partidosPorLiga).map(([liga, ligaData], index) => (
                <Accordion key={index} defaultExpanded sx={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)" }}>
                    <AccordionSummary
                        expandIcon={<KeyboardArrowUp sx={{ color: "white" }} />}
                        sx={{
                            backgroundColor: "#202121",
                            color: "white",
                            "& .MuiAccordionSummary-content": { alignItems: "center" },
                            borderBottom: 1,
                        }}>
                        <Avatar alt={ligaData.nombre_liga} src={ligaData.logo_liga} 
                            sx={{ 
                                width: 35, 
                                height: 35, 
                                marginRight: 3, 
                                backgroundColor: '#f5f5dc', 
                                '& img': {
                                    objectFit: 'contain'
                                }
                            }} />
                        <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>{ligaData.nombre_liga}</Typography>
                    </AccordionSummary>

                    <AccordionDetails sx={{ backgroundColor: "#202121", color: "white" }}>
                        <MatchList partidos={ligaData.partidos} />
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    )
}

export default MatchAccordion
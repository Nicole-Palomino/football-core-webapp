import { Typography, Accordion, AccordionSummary, AccordionDetails, Avatar } from '@mui/material';
import { useThemeMode } from '../../../contexts/ThemeContext';
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp"
import MatchList from "./MatchList"
import { useMemo } from "react"

const MatchAccordion = ({ data, type }) => {

    const { currentTheme } = useThemeMode();

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
                <Accordion key={ligaId} defaultExpanded className={`rounded-lg mb-2.5 shadow-md ${currentTheme.background} ${currentTheme.text}`}
sx={{
    '&:before': {
        display: 'none',
    },
}}>
                    <AccordionSummary
                        expandIcon={<KeyboardArrowUp className={currentTheme.text} />}
                        className={`rounded-lg transition-colors duration-300 ${currentTheme.sidebar}`}>
                        <div className="flex items-center">
                            <Avatar alt={nombre_liga} src={logo_liga}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    marginRight: 3,
                                    backgroundColor: 'transparent',
                                    '& img': {
                                        objectFit: 'contain'
                                    }
                                }} />
                            <Typography className={`font-bold text-lg ${currentTheme.text}`}>{nombre_liga}</Typography>
                        </div>
                    </AccordionSummary>

                    <AccordionDetails className={`rounded-b-lg p-4 ${currentTheme.background}`}>
                        <MatchList partidos={partidos} type={type} />
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    )
}

export default MatchAccordion
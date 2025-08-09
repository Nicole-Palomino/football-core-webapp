import React, { useMemo, useState } from 'react'
import { Box, Tabs, Tab } from "@mui/material"
import MatchAccordion from './MatchAccordion'
import { formatFecha } from '../../../utils/helpers'

const MatchTabs = ({ match }) => {
    // const { partidosPorJugar, partidosFinalizados } = useMatches()
    const [value, setValue] = useState(0)
    const handleChange = (event, newValue) => { setValue(newValue) }

    const fechasUnicas = useMemo(() => [...new Set(match.map((p) => formatFecha(p.dia)))], [match])
    
    return (
        <Box sx={{ width: "100%", marginBottom: '50px' }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", backgroundColor: "#202121" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile 
                    sx={{
                        "& .MuiTabs-indicator": { backgroundColor: "#368FF4" },
                        "& .MuiTab-root": { color: "white", fontFamily: "cursive" },
                        "& .MuiTab-root.Mui-selected": { color: "#368FF4" },
                        "& .MuiTabs-scrollButtons.Mui-disabled": { opacity: 0.3 },
                        "& .MuiButtonBase-root.MuiTabs-scrollButtons": { color: "#368FF4" }
                    }}>
                    {fechasUnicas.map((dia, index) => (
                        <Tab key={dia} label={dia} sx={{ flexShrink: 0 }} /> 
                    ))}
                </Tabs>
            </Box>

            {fechasUnicas.map((dia, index) => (
                <Box key={index}>
                    {value === index && (
                        <MatchAccordion data={match.filter(p => formatFecha(p.dia) === dia)} />
                    )}
                </Box>
            ))}
        </Box>
    )
}

export default React.memo(MatchTabs)
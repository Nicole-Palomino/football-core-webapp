import { useMemo, useState } from 'react'
import { Box, Tabs, Tab } from "@mui/material"
import { formatFecha } from '../services/encryptionService'
import MatchAccordion from './MatchAccordion'

const MatchTabs = ({ match }) => {
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
                        "& .MuiTabs-indicator": { backgroundColor: "#00FF88" },
                        "& .MuiTab-root": { color: "white", fontFamily: "cursive" },
                        "& .MuiTab-root.Mui-selected": { color: "#00FF88" },
                        "& .MuiTabs-scrollButtons.Mui-disabled": { opacity: 0.3 },
                        "& .MuiButtonBase-root.MuiTabs-scrollButtons": { color: "#00FF88" }
                    }}>
                    {fechasUnicas.map((dia, index) => (
                        <Tab key={index} label={dia} sx={{ flexShrink: 0 }} /> 
                    ))}
                </Tabs>
            </Box>

            {fechasUnicas.map((dia, index) => (
                <Box key={index} hidden={value !== index}>
                    <MatchAccordion data={match.filter((p) => formatFecha(p.dia) === dia)} />
                </Box>
            ))}
        </Box>
    )
}

export default MatchTabs
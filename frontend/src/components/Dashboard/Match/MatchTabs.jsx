import React, { useCallback, useMemo, useState } from 'react'
import { Box, Tabs, Tab, useTheme, useMediaQuery } from "@mui/material"
import MatchAccordion from './MatchAccordion'
import { formatFecha } from '../../../utils/helpers'
import { usePartidosFinalizados, usePartidosPorJugar } from '../../../contexts/MatchesContext'

const MatchTabs = ({ type }) => {
    const matches = type === "por-jugar" ? usePartidosPorJugar() : usePartidosFinalizados()

    const theme = useTheme()
    const [value, setValue] = useState(0)
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const handleChange = useCallback((_, newValue) => setValue(newValue), [])

    const fechasUnicas = useMemo(() => [...new Set(matches.map((p) => formatFecha(p.dia)))], [matches])

    const partidosPorFecha = useMemo(() => {
        const grouped = {};
        matches.forEach((p) => {
            const fecha = formatFecha(p.dia)
            if (!grouped[fecha]) grouped[fecha] = []
            grouped[fecha].push(p)
        })
        return grouped
    }, [matches])

    return (
        <Box sx={{ width: "100%", marginBottom: '50px' }}>
            <Box sx={{ borderBottom: 1, borderColor: theme.palette.primary.dark, backgroundColor: theme.palette.background.default }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{
                        "& .MuiTabs-indicator": { backgroundColor: theme.palette.background.default },
                        "& .MuiTab-root": { color: theme.palette.text.primary, fontFamily: "cursive" },
                        "& .MuiTab-root.Mui-selected": { color: theme.palette.primary.main },
                        "& .MuiTabs-scrollButtons.Mui-disabled": { opacity: 0.3 },
                        "& .MuiButtonBase-root.MuiTabs-scrollButtons": { color: theme.palette.primary.main }
                    }}>
                    {fechasUnicas.map((dia) => (
                        <Tab key={dia} label={dia} sx={{ flexShrink: 0 }} />
                    ))}
                </Tabs>
            </Box>

            {fechasUnicas[value] && (
                <MatchAccordion 
                    data={partidosPorFecha[fechasUnicas[value]]}
                    type={type} />
            )}
        </Box>
    )
}

export default React.memo(MatchTabs)
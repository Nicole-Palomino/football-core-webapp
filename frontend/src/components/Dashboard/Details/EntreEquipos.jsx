import { Box, Typography, useTheme } from '@mui/material'
import React from 'react'

const EntreEquipos = ({ equipo_local, equipo_visita, item_local, item_visita }) => {
    const theme = useTheme()

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Box>
                <Typography variant="h4" sx={{ color: '#368FF4', textAlign: 'center', fontWeight: 600 }}>
                    {item_local}
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                    {equipo_local}
                </Typography>
            </Box>
            <Box>
                <Typography variant="h4" sx={{ color: '#FF4444', textAlign: 'center', fontWeight: 600 }}>
                    {item_visita}
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                    {equipo_visita}
                </Typography>
            </Box>
        </Box>
    )
}

export default EntreEquipos
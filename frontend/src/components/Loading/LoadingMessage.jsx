import { Box, Fade, Typography, useTheme } from '@mui/material'
import { Analytics as AnalyticsIcon } from '@mui/icons-material'

const LoadingMessage = () => {
    const theme = useTheme()

    return (
        <Fade in={true} timeout={1500}>
            <Box
                sx={{
                    textAlign: 'center',
                    py: 10,
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.text.secondary}`
                }}>
                <AnalyticsIcon
                    sx={{
                        fontSize: 100,
                        color: '#333',
                        mb: 3,
                        opacity: 0.5
                    }}
                />
                <Typography
                    variant="h4"
                    sx={{
                        color: '#666',
                        mb: 2,
                        fontFamily: 'cursive'
                    }}>
                    Selecciona equipos para analizar
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ color: '#888' }}>
                    Elige una liga y dos equipos para ver el análisis estadístico completo
                </Typography>
            </Box>
        </Fade>
    )
}

export default LoadingMessage
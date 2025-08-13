import { EmojiEvents as TrophyIcon, } from '@mui/icons-material'
import { Box, Typography, useTheme } from '@mui/material'
import { FaFutbol } from 'react-icons/fa'

const TotalMatch = ({ totalMatches }) => {
    const theme = useTheme()

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',  
                justifyContent: 'center', 
                textAlign: 'center',
                p: 2
            }}
        >
            <TrophyIcon
                style={{
                    color: '#FFD700',
                    marginBottom: theme.spacing(1),
                    width: 'auto',
                }}
                // Tamaño dinámico con breakpoints
                sx={{
                    fontSize: { xs: 50, md: 60 }, 
                }}
            />
            <Typography
                variant="h3"
                sx={{
                    color: theme.palette.primary.dark,
                    mb: 1
                }}
            >
                {totalMatches}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    color: theme.palette.text.primary
                }}
            >
                Partidos totales
            </Typography>
        </Box>
    )
}

export default TotalMatch
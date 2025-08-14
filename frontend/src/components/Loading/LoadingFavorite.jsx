import { Box, CircularProgress, Typography } from '@mui/material'

const LoadingFavorite = () => {
    return (
        <Box sx={{
            bgcolor: "#0a0a0a",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)"
        }}>
            <Box sx={{ position: 'relative', mb: 4 }}>
                <CircularProgress
                    size={80}
                    sx={{
                        color: '#368FF4',
                        filter: 'drop-shadow(0 0 20px #368FF4)'
                    }}
                />
                <FavoriteIcon
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: '#FF1717',
                        fontSize: 30
                    }}
                />
            </Box>
            <Typography
                variant="h6"
                sx={{
                    color: '#368FF4',
                    fontFamily: 'cursive',
                    textShadow: '0 0 10px #368FF4'
                }}>
                Cargando tus partidos favoritos...
            </Typography>
        </Box>
    )
}

export default LoadingFavorite
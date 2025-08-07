import { CircularProgress, Typography, useTheme } from '@mui/material'

const LoadingSpinner = () => {
    const theme = useTheme()

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                width: "100%",
            }}
        >
            <CircularProgress size={80} sx={{ color: '#228B22' }} />
            <Typography mt={2} variant="h6" sx={{ color: '#228B22' }}>
                Cargando datos...
            </Typography>
        </Box>
    )
}

export default LoadingSpinner
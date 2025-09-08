import { Box, CircularProgress, Typography, useTheme } from '@mui/material'

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
            <CircularProgress size={80} sx={{ color: theme.palette.primary.main }} />
            <Typography mt={2} variant="h6" sx={{ color: theme.palette.primary.main }}>
                Cargando datos...
            </Typography>
        </Box>
    )
}

export default LoadingSpinner
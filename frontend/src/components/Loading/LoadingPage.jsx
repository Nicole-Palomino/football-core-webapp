import { Box, CircularProgress, Typography, useTheme } from '@mui/material'

const LoadingPage = () => {
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
                backgroundColor: theme.palette.background.default,
            }}
        >
            <CircularProgress size={80} sx={{ color: theme.palette.primary.main }} />
            <Typography mt={2} variant="h6" sx={{ color: theme.palette.text.primary }}>
                BIENVENIDOS A FOOTBALL CORE
            </Typography>
        </Box>
    )
}

export default LoadingPage
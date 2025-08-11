import { Box, CircularProgress } from '@mui/material'

const LoadingFavorite = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
        </Box>
    )
}

export default LoadingFavorite
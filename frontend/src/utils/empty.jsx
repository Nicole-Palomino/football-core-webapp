import { Box, Typography } from '@mui/material'

const EmptyMessage = ({ text }) => {
    return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
                {text}
            </Typography>
        </Box>
    )
}

export default EmptyMessage
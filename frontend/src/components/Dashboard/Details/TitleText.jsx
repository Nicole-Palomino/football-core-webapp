import { Box, Typography, useTheme } from '@mui/material'

const TitleText = ({ icon: Icon, iconColor, title }) => {
    const theme = useTheme()

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
            <Icon sx={{ color: iconColor, mr: 2, fontSize: { xs: 24, sm: 27 } }} />
            <Typography className='uppercase' sx={{ color: theme.palette.text.primary, fontFamily: 'cursive', fontSize: { xs: '0.7rem', sm: '1.5rem' } }}>
                {title}
            </Typography>
        </Box>
    )
}

export default TitleText
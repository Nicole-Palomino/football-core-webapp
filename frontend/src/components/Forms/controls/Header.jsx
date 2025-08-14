import { Box, Fade, Typography, useTheme } from '@mui/material'

const Header = ({ title, subtitle }) => {

    const theme = useTheme()

    return (
        <Fade in={true} timeout={1000}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <Typography
                        variant="h2"
                        sx={{
                            color: 'white',
                            fontFamily: 'cursive',
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #02C268, #368FF4)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 0 30px rgba(30, 212, 100, 0.5)'
                        }}>
                        {title}
                    </Typography>
                </Box>

                <Typography
                    variant="h6"
                    sx={{
                        color: theme.palette.text.secondary,
                        fontStyle: 'italic',
                        maxWidth: 600,
                        margin: '0 auto'
                    }}>
                    {subtitle}
                </Typography>
            </Box>
        </Fade>
    )
}

export default Header
import { Alert, useTheme } from '@mui/material'

const CustomAlertas = ({ title }) => {
    const theme = useTheme()

    return (
        <Alert severity="info" variant="filled" sx={{ mb: 2, backgroundColor: theme.palette.primary.dark, color: theme.custom.blanco, fontWeight: 900 }}>
            {title}
        </Alert>
    )
}

export default CustomAlertas
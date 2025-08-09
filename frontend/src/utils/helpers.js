import { Box, Typography } from "@mui/material"

export const formatFecha = (fecha) => {
    const [year, month, day] = fecha.split("-") // Dividimos "2025-02-12"
    return `${day}-${month}-${year.slice(-2)}` // Retornamos "12-02-25"
}

export const formatFechaHora = (fechaIso) => {
    const fechaObj = new Date(fechaIso)
    const day = String(fechaObj.getDate()).padStart(2, "0")
    const month = String(fechaObj.getMonth() + 1).padStart(2, "0")
    const year = String(fechaObj.getFullYear()).slice(-2)
    const hours = String(fechaObj.getHours()).padStart(2, "0")
    const minutes = String(fechaObj.getMinutes()).padStart(2, "0")
    return `${day}-${month}-${year} ${hours}:${minutes}`
}

export const EmptyMessage = ({ text }) => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
            {text}
        </Typography>
    </Box>
)
import { Button } from '@mui/material'

const ButtonDownload = ({ url, filename }) => {
    const handleDownload = async () => {
        try {
            const response = await fetch(url, { mode: "cors" })
            const blob = await response.blob()
            const link = document.createElement("a")
            link.href = URL.createObjectURL(blob)
            link.download = filename
            link.click()
            URL.revokeObjectURL(link.href)
        } catch (error) {
            console.error("Error al descargar la imagen:", error)
        }
    }

    return (
        <Button
            variant="contained"
            sx={{
                mt: 2,
                background: "#FB7452",
                color: "#fff",
                fontSize: {
                    xs: "0.8rem", // móviles
                    sm: "0.9rem", // tablets
                    md: "1rem",   // pantallas medianas
                    lg: "1.1rem"  // pantallas grandes
                },
                padding: {
                    xs: "6px 12px",
                    sm: "8px 16px",
                    md: "10px 20px",
                    lg: "12px 24px"
                }
            }}
            className="uppercase"
            onClick={handleDownload}
        >
            Descargar Imagen
        </Button>
    )
}

export default ButtonDownload
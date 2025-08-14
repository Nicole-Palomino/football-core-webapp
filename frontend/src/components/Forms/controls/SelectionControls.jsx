import { Button, Card, CardContent, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, useTheme, Zoom } from '@mui/material'
import {
    Assessment as AssessmentIcon,
} from '@mui/icons-material'

const SelectionControls = ({ selectedLiga, handleLigaChange, selectedEquipo1, handleEquipo1Change, selectedEquipo2, handleEquipo2Change, handleShowAnalysis, ligas, equipos, loading }) => {
    const theme = useTheme()

    return (
        <Zoom in={true} timeout={800}>
            <Card
                sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    mb: 4,
                    overflow: 'hidden',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, #368FF4, #2765AB)`
                    }
                }}>
                <CardContent sx={{ p: 4 }}>
                    <Grid container spacing={3} alignItems="center" justifyContent="center"
                        sx={{
                            width: '100%',
                            textAlign: { xs: 'center', md: 'left' }
                        }}>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth sx={{ minWidth: 200 }} variant="outlined">
                                <InputLabel sx={{ color: theme.palette.text.primary }}>
                                    LIGA
                                </InputLabel>
                                <Select
                                    value={selectedLiga}
                                    onChange={handleLigaChange}
                                    label="Liga"
                                    sx={{
                                        color: theme.palette.text.primary,
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: theme.palette.text.secondary,
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: theme.palette.text.primary,
                                        },
                                        '& .MuiSvgIcon-root': {
                                            color: theme.palette.text.primary, // ícono del dropdown
                                        },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                bgcolor: theme.palette.primary.dark, // fondo oscuro del menú
                                                color: theme.custom.blanco,      // texto blanco
                                            },
                                        },
                                    }}
                                >
                                    {ligas.map((liga) => (
                                        <MenuItem key={liga.id} value={liga.id}>
                                            {liga.logo} {liga.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth sx={{ minWidth: 200 }} variant="outlined">
                                <InputLabel sx={{ color: theme.palette.text.primary }}>
                                    EQUIPO LOCAL
                                </InputLabel>
                                <Select
                                    value={selectedEquipo1}
                                    onChange={handleEquipo1Change}
                                    label="Equipo Local"
                                    sx={{
                                        color: theme.palette.text.primary,
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: theme.palette.text.secondary,
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: theme.palette.text.primary,
                                        },
                                        '& .MuiSvgIcon-root': {
                                            color: theme.palette.text.primary, // color del ícono de flecha desplegable
                                        },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            style: { maxHeight: 200 },
                                            sx: {
                                                bgcolor: theme.palette.primary.dark, // fondo oscuro del menú
                                                color: theme.custom.blanco,    // texto blanco en las opciones
                                            },
                                        },
                                    }}
                                >
                                    {equipos.length === 0 ? (
                                        <MenuItem disabled>No hay equipos disponibles</MenuItem>
                                    ) : (
                                        equipos.map((equipo) => (
                                            <MenuItem key={equipo} value={equipo}>
                                                {equipo}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth sx={{ minWidth: 200 }} variant="outlined">
                                <InputLabel sx={{ color: theme.palette.text.primary }}>
                                    EQUIPO VISITANTE
                                </InputLabel>
                                <Select
                                    value={selectedEquipo2}
                                    onChange={handleEquipo2Change}
                                    label="Equipo Visitante"
                                    sx={{
                                        color: theme.palette.text.primary,
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: theme.palette.text.secondary,
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: theme.palette.text.primary,
                                        },
                                        '& .MuiSvgIcon-root': {
                                            color: theme.palette.text.primary, // color del ícono de flecha desplegable
                                        },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            style: { maxHeight: 200 },
                                            sx: {
                                                bgcolor: theme.palette.primary.dark, // fondo oscuro del menú
                                                color: theme.custom.blanco,     // texto blanco en las opciones
                                            },
                                        },
                                    }}
                                >
                                    {equipos
                                        .filter((equipo) => equipo !== selectedEquipo1)
                                        .map((equipo) => (
                                            <MenuItem key={equipo} value={equipo}>
                                                {equipo}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleShowAnalysis}
                                disabled={!selectedLiga || !selectedEquipo1 || !selectedEquipo2 || loading}
                                sx={{
                                    background: theme.custom.azul,
                                    color: theme.custom.blanco,
                                    fontWeight: 'bold',
                                    minWidth: 200,
                                    height: 56,
                                    '&:hover': {
                                        background: theme.custom.azulHover,
                                    },
                                    '&:disabled': {
                                        background: theme.palette.text.secondary,
                                        color: theme.custom.blanco,
                                    }
                                }}
                                startIcon={<AssessmentIcon />}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Analizar'}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Zoom>
    )
}

export default SelectionControls
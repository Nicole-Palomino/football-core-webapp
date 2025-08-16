import { Box, Card, CardContent, Dialog, DialogContent, Fade, Grid, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { getResumenesByPartido } from '../../../services/api/summaries'
import LoadingSpinner from '../../Loading/LoadingSpinner'
import CustomAlertas from './CustomAlertas'
import TitleText from './TitleText'
import ButtonDownload from '../../Buttons/ButtonDownload'
import { useQuery } from '@tanstack/react-query'
import TableChartIcon from '@mui/icons-material/TableChart'

const CustomImage = ({ id_partido }) => {

    const theme = useTheme()
    const [open, setOpen] = useState(false)
    const [openImage, setOpenImage] = useState(null)

    const {
        data: matchImage,
        isLoading: isLoadingImage,
        isError: isErrorImage,
        error: errorImage
    } = useQuery({
        queryKey: ["matchImage", id_partido],
        queryFn: () => getResumenesByPartido(id_partido),
        staleTime: 1000 * 60 * 15,
        cacheTime: 5 * 60 * 1000
    })

    // Manejo de estados de carga combinados
    const isLoading = isLoadingImage
    const isError = isErrorImage

    if (isLoading) return <LoadingSpinner />

    if (isError) {
        return (
            <div>
                <h2>Error al cargar datos:</h2>
                {isErrorImage && <p>Summary by ID: {errorImage.message}</p>}
            </div>
        )
    }

    const finalMatchesSummaries = matchImage || []

    const handleOpen = (url) => {
        setOpen(true)
        setOpenImage(url)
    }

    const handleClose = () => {
        setOpen(false)
        setOpenImage(null)
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
            }}
        >
            {finalMatchesSummaries ? (
                <Fade in={true} timeout={1200}>
                    <Box sx={{ width: "100%", mx: "auto", maxWidth: "1400px" }}>
                        <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center', width: '100%' }}>
                            <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    minWidth: { md: 1000, xs: 'auto' }
                                }}
                            >
                                <Typography
                                    className='uppercase'
                                    sx={{
                                        color: 'white',
                                        mb: 4,
                                        textAlign: 'center',
                                        fontFamily: 'cursive',
                                        background: 'linear-gradient(45deg, #201DBE, #49FD58)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        fontSize: { xs: 18, md: 33 }
                                    }}>
                                    Resumen Estadístico
                                </Typography>

                                <CustomAlertas
                                    title='Este tipo de visualización facilita comprender qué equipo dominó más en ataque, cómo se distribuyeron los tiros a portería y el impacto de las transiciones en el desarrollo del partido.'
                                />

                                <Grid className="grid grid-cols-1 gap-4 mt-5">
                                    <Card
                                        key={finalMatchesSummaries[0]?.id_resumen}
                                        sx={{
                                            width: '100%',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: 1,
                                            overflow: 'hidden',
                                            position: 'relative',
                                            mt: 2,
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: '4px',
                                                background: `linear-gradient(90deg, #FB7452, #D9FB52)`
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ p: 3, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                                            <TitleText
                                                icon={TableChartIcon}
                                                iconColor='#FB7452'
                                                title={'Resumen Estadístico'}
                                            />

                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                                                {finalMatchesSummaries.map((resumen, index) => (
                                                    <Box key={resumen.id_resumen} sx={{ mb: 4, textAlign: 'center' }}>
                                                        {/* Imagen del resumen */}
                                                        <img
                                                            src={resumen.url_imagen}
                                                            alt={resumen.nombre}
                                                            style={{ maxWidth: "100%", borderRadius: "8px", cursor: "pointer" }}
                                                            onClick={() => handleOpen(resumen.url_imagen)}
                                                        />

                                                        {/* Dialog para la imagen grande */}
                                                        <Dialog open={open && openImage === resumen.url_imagen} onClose={handleClose} maxWidth="lg">
                                                            <DialogContent sx={{ p: 0 }}>
                                                                <img
                                                                    src={resumen.url_imagen}
                                                                    alt={resumen.nombre}
                                                                    style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                                                                />
                                                            </DialogContent>
                                                        </Dialog>

                                                        {/* Fecha del resumen */}
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ mt: 1, fontStyle: 'italic', color: theme.palette.text.secondary }}
                                                        >
                                                            Creado: {new Date(resumen.created_at).toLocaleDateString()}
                                                        </Typography>

                                                        {/* Botón de descarga */}
                                                        <ButtonDownload
                                                            url={resumen.url_imagen}
                                                            filename={`dashboard_${resumen.id_partido}.png`}
                                                        />
                                                    </Box>
                                                ))}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Fade>
            ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="h6" color="#888">
                        No hay Resumen estadístico
                    </Typography>
                </Box>
            )}
        </Box>
    )
}

export default CustomImage
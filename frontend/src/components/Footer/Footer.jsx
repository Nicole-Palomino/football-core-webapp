import { motion } from "framer-motion"
import { FaTiktok } from "react-icons/fa"
import { useForm, ValidationError } from '@formspree/react'
import { useEffect, useRef } from 'react'
import { Link } from "react-router-dom"
import { Box, Button, Container, TextField, Typography, useMediaQuery, useTheme } from "@mui/material"

const Footer = () => {

    const [state, handleSubmit] = useForm("xeqynqwa")
    const emailRef = useRef(null)
    const theme = useTheme()
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"))

    useEffect(() => {
        if (state.succeeded) {
            Swal.fire({
                icon: "success",
                title: "¡Gracias!",
                text: "Te has suscrito con éxito.",
                confirmButtonColor: "#228B22",
                confirmButtonText: "Aceptar",
            })

            // Limpia el campo del email
            if (emailRef.current) {
                emailRef.current.value = ""
            }
        }
    }, [state.succeeded])


    return (
        <Box
            component="footer"
            sx={{
                py: theme.spacing(8),
                backgroundColor: theme.palette.primary.dark,
                color: theme.palette.primary.contrastText,
                mt: theme.spacing(6),
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
            >
                <Container maxWidth="lg">
                    <Box
                        display="grid"
                        gridTemplateColumns={{
                            xs: "1fr",
                            md: "1fr 1fr",
                            lg: "1fr 1fr 1fr",
                        }}
                        gap={isMdUp ? theme.spacing(6) : theme.spacing(4)}
                    >
                        {/* Logo + descripción */}
                        <Box maxWidth={300}>
                            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                <Box component="span" sx={{ color: theme.palette.primary.light }}>F</Box>
                                OOT
                                <Box component="span" sx={{ color: theme.palette.primary.light }}>B</Box>
                                ALL{" "}
                                <Box component="span" sx={{ color: theme.palette.primary.light }}>C</Box>
                                ORE
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    mt: theme.spacing(2),
                                    fontFamily: theme.typography.fontFamily,
                                }}
                            >
                                FOOTBALL CORE: La plataforma esencial para el aficionado al fútbol que busca analizar y comprender el deporte desde un enfoque estadístico. Accede a datos históricos, pronósticos y resúmenes personalizados para profundizar en el rendimiento de tus equipos favoritos.
                            </Typography>
                        </Box>

                        {/* Servicios y Enlaces */}
                        <Box
                            display="grid"
                            gridTemplateColumns="1fr 1fr"
                            gap={theme.spacing(4)}
                        >
                            <Box>
                                <Typography variant="h6">SERVICIOS</Typography>
                                <Box component="ul" sx={{ mt: 2, p: 0, listStyle: "none" }}>
                                    {["Análisis comparativo", "Pronóstico del partido", "Resúmenes estadísticos", "Soporte técnico"].map((item, index) => (
                                        <Box
                                            key={index}
                                            component="li"
                                            sx={{
                                                cursor: "pointer",
                                                "&:hover": { color: theme.palette.primary.light },
                                                transition: "color 0.2s ease",
                                                mb: 1,
                                            }}
                                        >
                                            {item}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>

                            <Box>
                                <Typography variant="h6">ENLACES</Typography>
                                <Box component="ul" sx={{ mt: 2, p: 0, listStyle: "none" }}>
                                    {[
                                        { text: "Inicio", to: "/" },
                                        { text: "Servicios", to: "/services" },
                                        { text: "Sobre nosotros", to: "/about-us" },
                                        { text: "Contacto", to: "/contact" },
                                    ].map((link, index) => (
                                        <Box
                                            key={index}
                                            component="li"
                                            sx={{
                                                cursor: "pointer",
                                                "& a": {
                                                    textDecoration: "none",
                                                    color: theme.palette.primary.contrastText,
                                                    "&:hover": { color: theme.palette.primary.light },
                                                },
                                                mb: 1,
                                            }}
                                        >
                                            <Link to={link.to}>{link.text}</Link>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Box>

                        {/* Suscripción */}
                        <Box maxWidth={300}>
                            <Typography variant="h6">SUSCRÍBETE</Typography>
                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                sx={{
                                    display: "flex",
                                    mt: theme.spacing(2),
                                }}
                            >
                                <TextField
                                    inputRef={emailRef}
                                    type="email"
                                    name="email"
                                    placeholder="Ingresa tu correo electrónico"
                                    required
                                    fullWidth
                                    size="small"
                                    sx={{
                                        backgroundColor: theme.palette.background.paper,
                                        borderTopLeftRadius: theme.shape.borderRadius,
                                        borderBottomLeftRadius: theme.shape.borderRadius,
                                    }}
                                />
                                <ValidationError
                                    prefix="Email"
                                    field="email"
                                    errors={state.errors}
                                />
                                <Button
                                    type="submit"
                                    disabled={state.submitting}
                                    sx={{
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.primary.contrastText,
                                        borderTopRightRadius: theme.shape.borderRadius,
                                        borderBottomRightRadius: theme.shape.borderRadius,
                                        "&:hover": {
                                            backgroundColor: theme.palette.primary.dark,
                                        },
                                    }}
                                >
                                    Ir
                                </Button>
                            </Box>

                            {/* Redes sociales */}
                            <Box display="flex" gap={2} mt={2}>
                                <a
                                    href="https://www.tiktok.com/@fooball_core"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ display: "inline-flex", alignItems: "center" }}
                                >
                                    <FaTiktok
                                        style={{
                                            cursor: "pointer",
                                            color: theme.palette.primary.contrastText,
                                            fontSize: 20,
                                            transition: "color 0.2s ease, transform 0.2s ease",
                                        }}
                                        onMouseOver={(e) => (e.target.style.color = theme.palette.primary.light)}
                                        onMouseOut={(e) => (e.target.style.color = theme.palette.primary.contrastText)}
                                    />
                                </a>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </motion.div>
        </Box>
    )
}

export default Footer
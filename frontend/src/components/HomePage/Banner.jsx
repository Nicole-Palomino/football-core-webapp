import { motion } from "framer-motion"
import { TbDeviceAnalytics, TbSoccerField } from 'react-icons/tb'
import { PiSoccerBallFill } from 'react-icons/pi'
import { FadeUp } from '../../utils/transitions'
import BannerPng from '../../assets/data-football.png'
import { useMediaQuery, useTheme } from "@mui/material"

const Banner = () => {
    const theme = useTheme()

    // Detectar breakpoints
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"))

    return (
        <section
            style={{
                padding: isMobile ? "1rem" : "2rem", // padding dinámico
                backgroundColor: theme.palette.background.default
            }}
        >
            <div
                className="container grid grid-cols-1 md:grid-cols-2 gap-8"
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                }}
            >
                {/* Imagen del banner */}
                <div className="flex justify-center items-center">
                    <motion.img
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        src={BannerPng}
                        alt="Estadísticas de fútbol"
                        style={{
                            width: isMobile ? "300px" : isTablet ? "450px" : "500px",
                            maxWidth: "100%",
                            objectFit: "cover"
                        }}
                        className="drop-shadow-lg dark:drop-shadow-[1px_1px_15px_#368FF4]"
                    />
                </div>
                
                {/* Texto y tarjetas */}
                <div className="flex flex-col justify-center">
                    <div className="text-center md:text-left space-y-12">
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            style={{
                                color: theme.palette.text.primary,
                                fontSize: isMobile ? "1.25rem" : "1.75rem",
                                fontFamily: theme.typography.fontFamily,
                                fontWeight: "bold",
                                lineHeight: 1.3
                            }}
                        >
                            Descubre las estadísticas y predicciones de tus equipos favoritos. ¡Haz que tus decisiones sean ganadoras!
                        </motion.h1>

                        <div className="flex flex-col gap-6">
                            {[
                                { icon: <TbSoccerField className="text-3xl" />, text: "17,000+ Partidos" },
                                { icon: <TbDeviceAnalytics className="text-3xl" />, text: "Estadísticas detalladas" },
                                { icon: <PiSoccerBallFill className="text-3xl" />, text: "Pronósticos" }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    variants={FadeUp(0.2 * (i + 1))}
                                    initial="initial"
                                    whileInView="animate"
                                    viewport={{ once: true }}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "1rem",
                                        padding: "1.5rem",
                                        borderRadius: theme.shape.borderRadius,
                                        backgroundColor: theme.custom.azulHover,
                                        color: theme.palette.primary.contrastText,
                                        transition: "background 0.3s, box-shadow 0.3s",
                                        cursor: "pointer"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = theme.custom.azulHover;
                                        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.2)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = theme.palette.primary.main;
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    {item.icon}
                                    <p style={{
                                        fontSize: isMobile ? "1rem" : "1.125rem",
                                        margin: 0
                                    }}>{item.text}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Banner
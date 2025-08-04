import { motion } from "framer-motion"
import { TbDeviceAnalytics, TbSoccerField } from 'react-icons/tb'
import { PiSoccerBallFill } from 'react-icons/pi'
import { FadeUp } from '../../utils/transitions'
import BannerPng from '../../assets/data-football.png'

const Banner = () => {
    return (
        <section>
            <div className="container py-14 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-8 space-y-6 md:space-y-0">
                {/* Imagen del banner */}
                <div className="flex justify-center items-center">
                    <motion.img
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        src={BannerPng}
                        alt=""
                        className="w-[500px] md:max-w-[600px] object-cover heropng"
                    />
                </div>

                <div className="flex flex-col justify-center">
                    <div className="text-center md:text-left space-y-12">
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-2xl md:text-3xl font-bold font-subtitle text-white !leading-snug">
                                Descubre las estadísticas y predicciones de tus equipos favoritos. ¡Haz que tus decisiones sean ganadoras!
                        </motion.h1>

                        <div className="flex flex-col gap-6">
                            <motion.div
                                variants={FadeUp(0.2)}
                                initial="initial"
                                whileInView={"animate"}
                                viewport={{ once: true }}
                                className="flex items-center gap-4 p-6 bg-target rounded-2xl text-white hover:bg-navbar hover:text-white duration-300 hover:shadow-2xl">
                                    <TbSoccerField className="text-3xl" />
                                    <p className="text-lg">17,000+ Partidos</p>
                            </motion.div>

                            <motion.div
                                variants={FadeUp(0.4)}
                                initial="initial"
                                whileInView={"animate"}
                                viewport={{ once: true }}
                                className="flex items-center gap-4 p-6 bg-target rounded-2xl text-white hover:bg-navbar hover:text-white duration-300 hover:shadow-2xl">
                                    <TbDeviceAnalytics className="text-3xl" />
                                    <p className="text-lg">Estadísticas detalladas</p>
                            </motion.div>

                            <motion.div
                                variants={FadeUp(0.6)}
                                initial="initial"
                                whileInView={"animate"}
                                viewport={{ once: true }}
                                className="flex items-center gap-4 p-6 bg-target rounded-2xl text-white hover:bg-navbar hover:text-white duration-300 hover:shadow-2xl">
                                    <PiSoccerBallFill className="text-3xl" />
                                    <p className="text-lg">Pronósticos</p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Banner
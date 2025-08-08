import { color, motion } from 'framer-motion'
import { IoIosArrowRoundForward } from 'react-icons/io'
import { Link } from 'react-router-dom'
import { FadeUp } from '../../utils/transitions'
import HeroPng from '../../assets/hero.png'
import { useTheme } from '@mui/material'

const Hero = () => {
    const theme = useTheme()

    return (
        <section className="overflow-hidden relative">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 min-h-[650px] gap-10 items-center">
                {/* TEXT */}
                <div className="flex flex-col justify-center py-14 md:py-0 relative">
                    <div className="text-center md:text-left space-y-10 lg:max-w-[500px]">
                        <motion.h1
                            variants={FadeUp(0.6)}
                            initial="initial"
                            animate="animate"
                            className="text-3xl sm:text-4xl lg:text-5xl font-title leading-snug"
                            style={{ color: theme.palette.text.primary }}>
                            Convierte tu pasión por el{' '}
                            <span style={{ color: theme.palette.primary.main }}>fútbol</span>{' '}
                            en conocimiento con <span style={{ color: theme.palette.primary.main }}>análisis</span>{' '} 
                            visuales, datos y estadísticas impactantes.
                        </motion.h1>

                        <motion.div
                            variants={FadeUp(0.8)}
                            initial="initial"
                            animate="animate"
                            className="flex justify-center md:justify-start"
                        >
                            <Link
                                to="/get-started"
                                className="relative overflow-hidden px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
                                style={{
                                    background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                    color: theme.palette.text.primary
                                }}
                            >
                                Comenzar
                                <IoIosArrowRoundForward className="text-3xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-rotate-45" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
                
                {/* IMAGE */}
                <div className="hidden md:flex justify-center items-center">
                    <motion.img
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
                        src={HeroPng}
                        alt="Ilustración de fútbol"
                        className="w-full max-w-md xl:max-w-xl relative drop-shadow-lg dark:drop-shadow-[1px_1px_15px_#368FF4]"
                    />
                </div>
            </div>
        </section>
    )
}

export default Hero
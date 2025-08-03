import { motion } from 'framer-motion'
import { IoIosArrowRoundForward } from 'react-icons/io'
import { Link } from 'react-router-dom'
import { FadeUp } from '../../utils/transitions'
import HeroPng from '../../assets/hero.png'

const Hero = () => {
    return (
        <section className="overflow-hidden relative">
            <div className="container grid grid-cols-1 md:grid-cols-2 min-h-[650px]">
                <div className="flex flex-col justify-center py-14 md:py-0 relative">
                    <div className="text-center md:text-left space-y-10 lg:max-w-[400px]">
                        <motion.h1 
                            variants={FadeUp(0.6)}
                            initial="initial"
                            animate="animate"
                            className="text-3xl lg:text-5xl font-title !leading-snug text-white">
                                Potencia tu pasión por el <span className='text-blue-500'>fútbol</span> con datos y estadísticas precisas.
                        </motion.h1>

                        <motion.div 
                            variants={FadeUp(0.8)}
                            initial="initial"
                            animate="animate"
                            className="flex justify-center md:justify-start"
                        >
                            <Link 
                                to="/dashboard" 
                                className="inline-flex items-center gap-2 px-8 py-4 text-xl font-bold rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl group"
                            >
                                Comenzar
                                <IoIosArrowRoundForward className="text-3xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-rotate-45" />
                            </Link>
                        </motion.div>
                    </div>
                </div>

                <div className="hidden md:flex justify-center items-center">
                    <motion.img 
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
                        src={HeroPng} 
                        alt=""
                        className="w-full max-w-[400px] xl:max-w-[550px] relative drop-shadow-2xl" />
                </div>
            </div>
        </section>
    )
}

export default Hero
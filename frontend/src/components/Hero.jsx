import { motion } from 'framer-motion'
import { IoIosArrowRoundForward } from 'react-icons/io'
import { Link } from 'react-router-dom'
import { FadeUp } from '../utils/transitions'
import HeroPng from '../assets/hero.png'

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
                                Potencia tu pasión por el <span className='text-green-500'>fútbol</span> con datos y estadísticas precisas.
                        </motion.h1>

                        <motion.div 
                            variants={FadeUp(0.8)}
                            initial="initial"
                            animate="animate"
                            className='flex justify-center md:justify-start mx-auto md:mx-0 bg-green-600 w-[150px] p-3 rounded-xl text-white hover:bg-green-700'>
                                <Link to='/dashboard' className='font-subtitle flex items-center gap-2 group text-xl font-semibold'>
                                    Comenzar
                                    <IoIosArrowRoundForward className='text-2xl group-hover:translate-x-2 group-hover:-rotate-45 duration-300'/>
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
                        className='w-[400px] xl:w-[500px] relative drop-shadow' />
                </div>
            </div>
        </section>
    )
}

export default Hero
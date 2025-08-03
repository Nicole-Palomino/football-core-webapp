import { SlideLeft } from '../../utils/transitions' 
import { ServicesData } from '../../utils/navbarData' 
import { motion } from "framer-motion"

const Services = () => {
    return (
        <section className='bg-navbar'>
            <div className="container pb-14 pt-16">
                <h1 className='text-5xl text-left pb-10 text-white'>
                    Servicios que ofrecemos
                </h1>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                    {
                        ServicesData.map((service) => (
                            <motion.div 
                                variants={SlideLeft(service.delay)}
                                initial="initial"
                                whileInView={"animate"}
                                viewport={{ once: true }}
                                className='bg-target rounded-2xl flex flex-col gap-4 items-center justify-center p-4 py-7 text-white hover:bg-background hover:scale-110 duration-300 hover:shadow-2xl hover:text-dark'>
                                <div className="text-7xl mb-4">
                                    <service.icon />
                                </div>
                                <h1 className='text-lg text-center px-3'>
                                    {service.title}
                                </h1>
                            </motion.div>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default Services
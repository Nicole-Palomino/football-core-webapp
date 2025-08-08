import { letterAnimation, SlideLeft } from '../../utils/transitions'
import { ServicesData } from '../../utils/navbarUtils'
import { motion } from "framer-motion"
import { useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'

const Services = () => {
    const theme = useTheme()
    const title = "Servicios que ofrecemos"

    return (
        <section
            className="w-full overflow-hidden"
            style={{ backgroundColor: theme.palette.background.default }}
        >
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                {/* Split Text Title */}
                <motion.h1
                    className="text-xl sm:text-3xl md:text-5xl font-title font-bold uppercase text-left pb-10 flex flex-wrap"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {title.split('').map((char, i) => (
                        <motion.span
                            key={i}
                            custom={i}
                            variants={letterAnimation(0.05)}
                            style={{ color: theme.palette.text.primary }}
                        >
                            {char === ' ' ? '\u00A0' : char}
                        </motion.span>
                    ))}
                </motion.h1>

                {/* Services Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                    {
                        ServicesData.map((service, index) => (
                            <motion.div
                                key={index}
                                variants={SlideLeft(service.delay)}
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true }}
                                className="rounded-2xl flex flex-col gap-4 items-center justify-center p-4 py-7 transition-all duration-300 hover:scale-105 hover:shadow-2xl text-center"
                                style={{
                                    backgroundColor: theme.custom.azulHover,
                                    color: theme.palette.text.primary,
                                    border: `1px solid ${theme.palette.divider}`,
                                }}
                            >
                                <div className="mb-4">
                                    {React.createElement(service.icon, {
                                        className: "w-12 h-12 md:w-14 md:h-14",
                                        style: { color: theme.palette.primary.contrastText },
                                    })}
                                </div>
                                <h1
                                    className="text-base sm:text-lg font-subtitle px-2"
                                    style={{ color: theme.palette.primary.contrastText }}
                                >
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
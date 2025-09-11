import { EyeIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useState } from 'react'
import { motion } from 'framer-motion'
import { stats, tabs, team, timeline, values } from '../../utils/navbarUtils';
import NavbarClient from '../Navbar/NavbarClient';
import { useTheme } from '@mui/material';
import { letterAnimation } from '../../utils/transitions';
import { useThemeMode } from '../../contexts/ThemeContext';

const AboutUs = () => {
    const [activeTab, setActiveTab] = useState('mission')
    const { currentTheme } = useThemeMode()
    const title = "Sobre Nosotros"

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    return (
        <section className={`relative w-full min-h-screen overflow-x-hidden ${currentTheme.background} transition-colors duration-300`}>
            <NavbarClient />

            <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="text-center mb-16 mt-10">
                    <motion.h2
                        className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-6 ${currentTheme.text}`}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        style={{
                            textShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
                        }}
                    >
                        {title.split('').map((char, i) => (
                            <motion.span
                                key={i}
                                custom={i}
                                variants={letterAnimation(0.05)}
                                className="inline-block"
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </motion.span>
                        ))}
                    </motion.h2>
                    
                    <motion.p
                        className={`text-lg sm:text-xl max-w-4xl mx-auto leading-relaxed ${currentTheme.textSecondary}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Somos un equipo apasionado por la ciencia de datos, desarrollo de aplicaciones y análisis deportivo
                        que creemos en el poder de la inteligencia artificial para revolucionar el análisis futbolístico.
                    </motion.p>

                    {/* Decorative line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        viewport={{ once: true }}
                        className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-8 rounded-full"
                    ></motion.div>
                </div>

                {/* Stats Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className={`group ${currentTheme.card} rounded-2xl p-4 sm:p-6 lg:p-8 ${currentTheme.shadow} ${currentTheme.border} border transition-all duration-500 relative overflow-hidden`}
                        >
                            {/* Background gradient on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                            
                            <div className="relative z-10">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div className={`text-2xl sm:text-3xl font-bold mb-2 text-center ${currentTheme.text} group-hover:text-blue-600 transition-colors duration-300`}>
                                    {stat.number}
                                </div>
                                <div className={`text-xs sm:text-sm text-center ${currentTheme.textSecondary} leading-relaxed`}>
                                    {stat.label}
                                </div>
                            </div>
                            
                            {/* Accent dot */}
                            <div className="absolute top-3 right-3 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-40 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Mission, Vision, Values Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-20"
                >
                    {/* Tab Navigation */}
                    <div className="flex justify-center mb-8">
                        <div className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-2 ${currentTheme.shadow} overflow-x-auto`}>
                            <div className="flex gap-2 min-w-max">
                                {tabs.map((tab) => (
                                    <motion.button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                                            activeTab === tab.id
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                                : `${currentTheme.textSecondary} ${currentTheme.hover}`
                                        }`}
                                    >
                                        <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span className="text-sm sm:text-base">{tab.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="max-w-5xl mx-auto"
                    >
                        {activeTab === 'mission' && (
                            <div className={`${currentTheme.card} rounded-3xl p-6 sm:p-8 text-center ${currentTheme.shadow} ${currentTheme.border} border relative overflow-hidden`}>
                                {/* Background decoration */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
                                
                                <div className="relative z-10">
                                    <SparklesIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-6 text-blue-600" />
                                    <h3 className={`text-2xl sm:text-3xl font-bold mb-6 ${currentTheme.text}`}>Nuestra Misión</h3>
                                    <p className={`text-lg sm:text-xl leading-relaxed ${currentTheme.textSecondary}`}>
                                        Democratizar el análisis futbolístico avanzado, poniendo el poder del análisis de datos
                                        y los algoritmos de machine learning al alcance de analistas, periodistas y
                                        fanáticos apasionados en todo el mundo.
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'vision' && (
                            <div className={`${currentTheme.card} rounded-3xl p-6 sm:p-8 text-center ${currentTheme.shadow} ${currentTheme.border} border relative overflow-hidden`}>
                                {/* Background decoration */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-2xl"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-cyan-400/10 rounded-full blur-2xl"></div>
                                
                                <div className="relative z-10">
                                    <EyeIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-6 text-purple-600" />
                                    <h3 className={`text-2xl sm:text-3xl font-bold mb-6 ${currentTheme.text}`}>Nuestra Visión</h3>
                                    <p className={`text-lg sm:text-xl leading-relaxed ${currentTheme.textSecondary}`}>
                                        Ser la plataforma líder mundial en análisis deportivo inteligente, transformando la manera
                                        en que se entiende, analiza y disfruta el fútbol mediante tecnología de vanguardia y
                                        insights precisos basados en datos.
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'values' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {values.map((value, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        whileHover={{ scale: 1.03, y: -5 }}
                                        className={`group ${currentTheme.card} rounded-3xl p-6 sm:p-8 ${currentTheme.shadow} ${currentTheme.border} border relative overflow-hidden transition-all duration-300`}
                                    >
                                        {/* Background gradient on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                                        
                                        <div className="relative z-10">
                                            <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                                <value.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                            </div>
                                            <h4 className={`text-xl sm:text-2xl font-bold mb-4 ${currentTheme.text} group-hover:text-blue-600 transition-colors duration-300`}>
                                                {value.title}
                                            </h4>
                                            <p className={`text-base sm:text-lg leading-relaxed ${currentTheme.textSecondary}`}>
                                                {value.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </motion.div>

                {/* Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-20"
                >
                    <div className="text-center mb-12">
                        <h3 className={`text-2xl sm:text-3xl font-bold mb-4 ${currentTheme.text}`}>Nuestra Historia</h3>
                        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="relative">
                        {/* Timeline Line - Hidden on mobile */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-cyan-500 rounded-full hidden lg:block"></div>

                        <div className="space-y-8 sm:space-y-12">
                            {timeline.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className={`flex flex-col lg:flex-row items-center ${
                                        index % 2 !== 0 ? 'lg:flex-row-reverse' : ''
                                    }`}
                                >
                                    {/* Content */}
                                    <div className={`w-full lg:w-1/2 ${
                                        index % 2 === 0 ? 'lg:pr-8 lg:text-right' : 'lg:pl-8 lg:text-left'
                                    } text-center lg:text-inherit mb-6 lg:mb-0`}>
                                        <div className={`group ${currentTheme.card} rounded-2xl p-6 sm:p-8 ${currentTheme.shadow} ${currentTheme.border} border transition-all duration-500 relative overflow-hidden ${currentTheme.hover}`}>
                                            {/* Background gradient on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                                            
                                            <div className="relative z-10">
                                                <div className="text-xl sm:text-2xl font-bold mb-3 text-blue-600 group-hover:text-purple-600 transition-colors duration-300">
                                                    {item.year}
                                                </div>
                                                <h4 className={`text-lg sm:text-xl font-bold mb-3 ${currentTheme.text}`}>
                                                    {item.title}
                                                </h4>
                                                <p className={`${currentTheme.textSecondary} leading-relaxed`}>
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timeline Node */}
                                    <div className="relative z-10 mb-6 lg:mb-0">
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300`}
                                        >
                                            <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                        </motion.div>
                                    </div>

                                    {/* Empty space for desktop layout */}
                                    <div className="hidden lg:block lg:w-1/2"></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Team Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="text-center mb-12">
                        <h3 className={`text-2xl sm:text-3xl font-bold mb-4 ${currentTheme.text}`}>Nuestro Equipo</h3>
                        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {team.slice(0, 3).map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05, y: -10, rotateY: 5 }}
                                className={`group ${currentTheme.card} rounded-3xl p-6 sm:p-8 text-center ${currentTheme.shadow} ${currentTheme.border} border transition-all duration-500 relative overflow-hidden`}
                            >
                                {/* Background decoration */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                <div className="relative z-10">
                                    <div className="text-4xl sm:text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                        {member.image}
                                    </div>
                                    <h4 className={`text-lg sm:text-xl font-bold mb-2 ${currentTheme.text} group-hover:text-blue-600 transition-colors duration-300`}>
                                        {member.name}
                                    </h4>
                                    <div className={`text-sm font-medium bg-gradient-to-r ${member.color} bg-clip-text text-transparent mb-4`}>
                                        {member.role}
                                    </div>
                                    <p className={`text-sm mb-6 leading-relaxed ${currentTheme.textSecondary}`}>
                                        {member.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {member.skills.map((skill, skillIndex) => (
                                            <span
                                                key={skillIndex}
                                                className="px-3 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-600 text-xs rounded-full backdrop-blur-sm hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default AboutUs
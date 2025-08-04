import { EyeIcon, RocketLaunchIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useState } from 'react'
import { motion } from 'framer-motion'
import { stats, tabs, team, timeline, values } from '../../utils/navbarUtils';
import NavbarClient from '../Navbar/NavbarClient';

const AboutUs = () => {
    const [activeTab, setActiveTab] = useState('mission')

    return (
        <section className="relative w-full h-screen overflow-x-auto scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-transparent">
            <NavbarClient />

            <div className="max-w-7xl mx-auto relative z-10 p-5">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20 mt-10"
                >
                    <motion.h2
                        className="text-4xl md:text-5xl lg:text-6xl font-bold t-stroke t-shadow mb-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Sobre Nosotros
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Somos un equipo apasionado por la ciencia de datos, desarrollo de aplicaciones y análisis deportivo
                        que creemos en el poder de la inteligencia artificial para revolucionar el análisis futbolístico.
                    </motion.p>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center group hover:border-gray-600/50 transition-all duration-300"
                        >
                            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                            <div className="text-gray-400 text-sm">{stat.label}</div>
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
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-2 flex space-x-2">
                            {tabs.map((tab) => (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === tab.id
                                        ? 'bg-blue-500 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                        }`}
                                >
                                    <tab.icon className="w-5 h-5" />
                                    {tab.label}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="max-w-4xl mx-auto"
                    >
                        {activeTab === 'mission' && (
                            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 text-center">
                                <SparklesIcon className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                                <h3 className="text-3xl font-bold text-white mb-6">Nuestra Misión</h3>
                                <p className="text-xl text-gray-300 leading-relaxed">
                                    Democratizar el análisis futbolístico avanzado, poniendo el poder del análisis de datos
                                    y los algoritmos de machine learning al alcance de analistas, periodistas y
                                    fanáticos apasionados en todo el mundo.
                                </p>
                            </div>
                        )}

                        {activeTab === 'vision' && (
                            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 text-center">
                                <EyeIcon className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                                <h3 className="text-3xl font-bold text-white mb-6">Nuestra Visión</h3>
                                <p className="text-xl text-gray-300 leading-relaxed">
                                    Ser la plataforma líder mundial en análisis deportivo inteligente, transformando la manera
                                    en que se entiende, analiza y disfruta el fútbol mediante tecnología de vanguardia y
                                    insights precisos basados en datos.
                                </p>
                            </div>
                        )}

                        {activeTab === 'values' && (
                            <div className="grid md:grid-cols-2 gap-6">
                                {values.map((value, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        whileHover={{ scale: 1.03 }}
                                        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 group hover:border-gray-600/50 transition-all duration-300"
                                    >
                                        <div className={`w-12 h-12 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            <value.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-3">{value.title}</h4>
                                        <p className="text-gray-400 leading-relaxed">{value.description}</p>
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
                    <h3 className="text-3xl font-bold text-white text-center mb-12">Nuestra Historia</h3>
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-cyan-500 rounded-full"></div>

                        <div className="space-y-12">
                            {timeline.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                                >
                                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 group hover:border-gray-600/50 transition-all duration-300">
                                            <div className="text-2xl font-bold text-blue-400 mb-2">{item.year}</div>
                                            <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                                            <p className="text-gray-400">{item.description}</p>
                                        </div>
                                    </div>

                                    {/* Timeline Node */}
                                    <div className="relative z-10">
                                        <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center shadow-lg`}>
                                            <item.icon className="w-8 h-8 text-white" />
                                        </div>
                                    </div>

                                    <div className="w-1/2"></div>
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
                    <h3 className="text-3xl font-bold text-white text-center mb-12">Nuestro Equipo</h3>
                    <div className="mx-auto max-w-5xl mb-16">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {team.slice(0, 3).map((member, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05, rotateY: 5 }}
                                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center group hover:border-gray-600/50 transition-all duration-300"
                                >
                                    <div className="text-6xl mb-4">{member.image}</div>
                                    <h4 className="text-xl font-bold text-white mb-1">{member.name}</h4>
                                    <div className={`text-sm font-medium bg-gradient-to-r ${member.color} bg-clip-text text-transparent mb-3`}>
                                        {member.role}
                                    </div>
                                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">{member.description}</p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {member.skills.map((skill, skillIndex) => (
                                            <span
                                                key={skillIndex}
                                                className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-lg"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* CTA Section */}
                {/* <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center mt-20"
                >
                    <h3 className="text-3xl font-bold text-white mb-6">¿Quieres ser parte de nuestra historia?</h3>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Únete a nuestra comunidad de analistas, desarrolladores y fanáticos del fútbol que están
                        revolucionando el deporte con inteligencia artificial.
                    </p>
                    <motion.button
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-2xl relative overflow-hidden group"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <RocketLaunchIcon className="w-5 h-5" />
                            Únete a Nosotros
                        </span>
                        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </motion.button>
                </motion.div> */}
            </div>
        </section>
    )
}

export default AboutUs
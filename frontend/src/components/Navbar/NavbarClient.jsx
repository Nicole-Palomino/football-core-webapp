import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const NavbarClient = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className='shadow-2xl relative z-50 bg-black/20 backdrop-blur-md border-b border-blue-800'>
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:p-6 lg:px-8">
                {/* Logo */}
                <div className="flex lg:flex-1">
                    <Link to='/' className='flex items-center space-x-2'>
                        <h1 className='text-2xl md:text-3xl text-white font-bold'>
                            <span className='text-blue-500'>F</span>OOT<span className='text-blue-500'>B</span>ALL <span className='text-blue-500'>C</span>ORE
                        </h1>
                    </Link>
                </div>

                {/* Botón menú móvil */}
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="relative inline-flex items-center justify-center rounded-md p-2.5 text-white hover:bg-gray-800/50 transition-colors duration-200"
                    >
                        <span className="sr-only">Abrir menú principal</span>
                        <motion.div
                            animate={mobileMenuOpen ? "open" : "closed"}
                            className="w-6 h-6 relative"
                        >
                            <motion.span
                                variants={{
                                    closed: { rotate: 0, y: 0 },
                                    open: { rotate: 45, y: 8 }
                                }}
                                className="absolute w-6 h-0.5 bg-white rounded-full transform origin-center transition-all duration-300"
                                style={{ top: 6 }}
                            />
                            <motion.span
                                variants={{
                                    closed: { opacity: 1 },
                                    open: { opacity: 0 }
                                }}
                                className="absolute w-6 h-0.5 bg-white rounded-full transition-all duration-300"
                                style={{ top: 12 }}
                            />
                            <motion.span
                                variants={{
                                    closed: { rotate: 0, y: 0 },
                                    open: { rotate: -45, y: -8 }
                                }}
                                className="absolute w-6 h-0.5 bg-white rounded-full transform origin-center transition-all duration-300"
                                style={{ top: 18 }}
                            />
                        </motion.div>
                    </button>
                </div>

                {/* Menú desktop */}
                <div className="hidden lg:flex lg:gap-x-8">
                    <Link to="/services" className="text-lg font-medium text-white hover:text-blue-400 transition-colors duration-300 relative group">
                        SERVICIOS
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <Link to="/about-us" className="text-lg font-medium text-white hover:text-blue-400 transition-colors duration-300 relative group">
                        SOBRE NOSOTROS
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <Link to="/contact" className="text-lg font-medium text-white hover:text-blue-400 transition-colors duration-300 relative group">
                        CONTACTO
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                </div>

                {/* Botón CTA desktop */}
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <button className="relative overflow-hidden bg-gradient-to-r cursor-pointer from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
                        <span className="relative z-10">
                            <Link to="/get-started">Comenzar</Link>
                        </span>
                        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </button>
                </div>
            </nav>

            {/* Menú móvil overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: mobileMenuOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className={`fixed inset-0 z-40 lg:hidden ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                />

                {/* Panel del menú */}
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: mobileMenuOpen ? "0%" : "100%" }}
                    transition={{ type: "tween", duration: 0.3 }}
                    className="absolute right-0 top-0 h-full w-full max-w-sm bg-gradient-to-br from-gray-900 via-gray-800 to-black border-l border-gray-700 shadow-2xl"
                >
                    {/* Header del menú móvil */}
                    <div className="flex items-center justify-between p-6">
                        <Link to="/" className='flex items-center space-x-2'>
                            <h1 className='text-2xl text-white font-bold'>
                                <span className='text-blue-500'>F</span>OOT<span className='text-blue-500'>B</span>ALL <span className='text-blue-500'>C</span>ORE
                            </h1>
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="rounded-md p-2.5 text-white hover:bg-gray-800/50 transition-colors duration-200"
                        >
                            <span className="sr-only">Cerrar menú</span>
                            <div className="w-6 h-6 relative">
                                <span className="absolute w-6 h-0.5 bg-white rounded-full transform rotate-45" style={{ top: 12 }} />
                                <span className="absolute w-6 h-0.5 bg-white rounded-full transform -rotate-45" style={{ top: 12 }} />
                            </div>
                        </button>
                    </div>

                    {/* Contenido del menú */}
                    <div className="px-6 py-6 space-y-2 bg-black">
                        {/* Enlaces principales */}
                        <div className="space-y-1">
                            <motion.a
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: mobileMenuOpen ? 1 : 0, x: mobileMenuOpen ? 0 : 20 }}
                                transition={{ delay: 0.1 }}
                                href="/services"
                                className="group flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-white hover:bg-gray-800/50 transition-all duration-200"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <div className="w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                SERVICIOS
                            </motion.a>

                            <motion.a
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: mobileMenuOpen ? 1 : 0, x: mobileMenuOpen ? 0 : 20 }}
                                transition={{ delay: 0.2 }}
                                href="/about-us"
                                className="group flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-white hover:bg-gray-800/50 transition-all duration-200"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <div className="w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                SOBRE NOSOTROS
                            </motion.a>

                            <motion.a
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: mobileMenuOpen ? 1 : 0, x: mobileMenuOpen ? 0 : 20 }}
                                transition={{ delay: 0.4 }}
                                href="/contact"
                                className="group flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-white hover:bg-gray-800/50 transition-all duration-200"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <div className="w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                CONTACTO
                            </motion.a>
                        </div>

                        {/* Separador */}
                        <div className="my-6 border-t border-gray-700" />

                        {/* Botón CTA móvil */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: mobileMenuOpen ? 1 : 0, y: mobileMenuOpen ? 0 : 20 }}
                            transition={{ delay: 0.5 }}
                            className="pt-4"
                        >
                            <button
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Link to="/get-started">Comenzar Gratis</Link>
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </header>
    )
}

export default NavbarClient
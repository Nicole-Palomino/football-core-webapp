import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import ThemeToggleButton from '../Buttons/ThemeToggleButton'
import { useThemeMode } from '../../contexts/ThemeContext'

const NavbarClient = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { currentTheme } = useThemeMode()

    const navLinks = [
        { to: '/services', label: 'SERVICIOS' },
        { to: '/about-us', label: 'SOBRE NOSOTROS' },
        { to: '/contact', label: 'CONTACTO' },
    ]

    return (
        <header className={`shadow-2xl relative z-50 ${currentTheme.background} ${currentTheme.border} border-b backdrop-blur-md sticky top-0`}>
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:p-6 lg:px-8">
                {/* Logo */}
                <div className="flex lg:flex-1">
                    <Link to='/' className='flex items-center space-x-2 group'>
                        <motion.h1 
                            whileHover={{ scale: 1.05 }}
                            className={`text-2xl md:text-3xl font-bold transition-all duration-300 ${currentTheme.text}`}
                        >
                            <span className={`${currentTheme.accent}`}>F</span>OOT
                            <span className={`${currentTheme.accent}`}>B</span>ALL
                            <span className={`${currentTheme.accent}`}> C</span>ORE
                        </motion.h1>
                    </Link>
                </div>

                {/* Botón menú móvil */}
                <div className="flex lg:hidden">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className={`relative inline-flex items-center justify-center rounded-md p-2.5 transition-all duration-200 ${currentTheme.hover} ${currentTheme.text}`}
                    >
                        <motion.div
                            animate={mobileMenuOpen ? "open" : "closed"}
                            className="w-6 h-6 relative"
                        >
                            <motion.span
                                variants={{
                                    closed: { rotate: 0, y: 0 },
                                    open: { rotate: 45, y: 8 }
                                }}
                                className={`absolute w-6 h-0.5 rounded-full transform origin-center ${currentTheme.text} bg-current`}
                                style={{ top: 6 }}
                            />
                            <motion.span
                                variants={{
                                    closed: { opacity: 1 },
                                    open: { opacity: 0 }
                                }}
                                className={`absolute w-6 h-0.5 rounded-full ${currentTheme.text} bg-current`}
                                style={{ top: 12 }}
                            />
                            <motion.span
                                variants={{
                                    closed: { rotate: 0, y: 0 },
                                    open: { rotate: -45, y: -8 }
                                }}
                                className={`absolute w-6 h-0.5 rounded-full transform origin-center ${currentTheme.text} bg-current`}
                                style={{ top: 18 }}
                            />
                        </motion.div>
                    </motion.button>
                </div>

                {/* Menú desktop */}
                <div className="hidden lg:flex lg:gap-x-8">
                    {navLinks.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`text-lg font-medium transition-all duration-300 relative group px-3 py-2 rounded-lg ${currentTheme.text} ${currentTheme.hover}`}
                        >
                            {label}
                            <span className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 group-hover:w-3/4 transition-all duration-300 ${currentTheme.accent.replace('text-', 'bg-')}`} />
                        </Link>
                    ))}
                </div>

                {/* Botón CTA desktop */}
                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4">
                    <ThemeToggleButton />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            to="/get-started"
                            className="relative overflow-hidden px-6 py-3 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl"
                        >
                            <span className="relative z-10">Comenzar</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </Link>
                    </motion.div>
                </div>
            </nav>

            {/* Menú móvil */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        {/* Panel del menú */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className={`fixed right-0 top-0 h-full w-full max-w-sm shadow-2xl z-50 ${currentTheme.background} ${currentTheme.border} border-l backdrop-blur-md`}
                        >
                            {/* Header del menú móvil */}
                            <div className={`flex items-center justify-between p-6 ${currentTheme.border} border-b`}>
                                <Link to="/" className='flex items-center space-x-2 group'>
                                    <motion.h1 
                                        whileHover={{ scale: 1.05 }}
                                        className={`text-2xl font-bold transition-all duration-300 ${currentTheme.text}`}
                                    >
                                        <span className={`${currentTheme.accent}`}>F</span>OOT
                                        <span className={`${currentTheme.accent}`}>B</span>ALL
                                        <span className={`${currentTheme.accent}`}> C</span>ORE
                                    </motion.h1>
                                </Link>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`rounded-md p-2.5 transition-all duration-200 ${currentTheme.hover} ${currentTheme.text}`}
                                >
                                    <div className="w-6 h-6 relative">
                                        <span className={`absolute w-6 h-0.5 rounded-full transform rotate-45 ${currentTheme.textSecondary} bg-current`} style={{ top: 12 }} />
                                        <span className={`absolute w-6 h-0.5 rounded-full transform -rotate-45 ${currentTheme.textSecondary} bg-current`} style={{ top: 12 }} />
                                    </div>
                                </motion.button>
                            </div>

                            {/* Contenido del menú */}
                            <div className={`px-6 py-6 space-y-2 ${currentTheme.background}`}>
                                {navLinks.map(({ to, label }, i) => (
                                    <motion.div
                                        key={to}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: mobileMenuOpen ? 1 : 0, x: mobileMenuOpen ? 0 : 20 }}
                                        transition={{ delay: 0.1 * (i + 1) }}
                                    >
                                        <Link
                                            to={to}
                                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 group ${currentTheme.text} ${currentTheme.hover}`}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.2 }}
                                                className={`w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${currentTheme.accent.replace('text-', 'bg-')}`}
                                            />
                                            {label}
                                        </Link>
                                    </motion.div>
                                ))}

                                {/* Separador */}
                                <div className={`my-6 border-t ${currentTheme.border}`} />

                                {/* Botón de cambio de tema */}
                                <div className="px-2 flex justify-start">
                                    <ThemeToggleButton />
                                </div>

                                {/* Botón CTA móvil */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: mobileMenuOpen ? 1 : 0, y: mobileMenuOpen ? 0 : 20 }}
                                    transition={{ delay: 0.5 }}
                                    className="pt-4"
                                >
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Link
                                            to="/get-started"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full block text-center px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl"
                                        >
                                            Comenzar Gratis
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    )
}

export default NavbarClient
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTheme } from '@mui/material'
import ThemeToggleButton from '../Buttons/ThemeToggleButton'

const NavbarClient = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const theme = useTheme()

    return (
        <header
            className='shadow-2xl relative z-50'
            style={{
                backgroundColor: theme.palette.background.paper,
                borderBottom: `1px solid ${theme.palette.primary.dark}`,
                backdropFilter: 'blur(8px)'
            }}
        >
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:p-6 lg:px-8">
                {/* Logo */}
                <div className="flex lg:flex-1">
                    <Link to='/' className='flex items-center space-x-2'>
                        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: theme.palette.text.primary }}>
                            <span style={{ color: theme.palette.primary.main }}>F</span>OOT
                            <span style={{ color: theme.palette.primary.main }}>B</span>ALL
                            <span style={{ color: theme.palette.primary.main }}> C</span>ORE
                        </h1>
                    </Link>
                </div>

                {/* Botón menú móvil */}
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="relative inline-flex items-center justify-center rounded-md p-2.5 hover:bg-opacity-50 transition-colors duration-200"
                        style={{ color: theme.palette.text.primary }}
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
                                className="absolute w-6 h-0.5 rounded-full transform origin-center"
                                style={{ top: 6, backgroundColor: theme.palette.text.primary }}
                            />
                            <motion.span
                                variants={{
                                    closed: { opacity: 1 },
                                    open: { opacity: 0 }
                                }}
                                className="absolute w-6 h-0.5 rounded-full"
                                style={{ top: 12, backgroundColor: theme.palette.text.primary }}
                            />
                            <motion.span
                                variants={{
                                    closed: { rotate: 0, y: 0 },
                                    open: { rotate: -45, y: -8 }
                                }}
                                className="absolute w-6 h-0.5 rounded-full transform origin-center"
                                style={{ top: 18, backgroundColor: theme.palette.text.primary }}
                            />
                        </motion.div>
                    </button>
                </div>

                {/* Menú desktop */}
                <div className="hidden lg:flex lg:gap-x-8">
                    {[
                        { to: '/services', label: 'SERVICIOS' },
                        { to: '/about-us', label: 'SOBRE NOSOTROS' },
                        { to: '/contact', label: 'CONTACTO' },
                    ].map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className="text-lg font-medium transition-colors duration-300 relative group"
                            style={{ color: theme.palette.text.primary }}
                        >
                            {label}
                            <span
                                className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                                style={{ backgroundColor: theme.palette.primary.main }}
                            />
                        </Link>
                    ))}
                </div>

                {/* Botón CTA desktop */}
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <ThemeToggleButton />
                    <Link
                        to="/get-started"
                        className="relative overflow-hidden px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                        style={{
                            background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                            color: theme.custom.blanco
                        }}
                    >
                        Comenzar
                    </Link>
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
                    className="absolute inset-0"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                        backgroundColor: '#00000099',
                        backdropFilter: 'blur(4px)',
                    }}
                />

                {/* Panel del menú */}
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: mobileMenuOpen ? "0%" : "100%" }}
                    transition={{ type: "tween", duration: 0.3 }}
                    className="fixed right-0 top-0 h-auto w-full max-w-sm shadow-2xl z-50"
                    style={{
                        backgroundColor: theme.palette.background.default,
                        borderLeft: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    {/* Header del menú móvil */}
                    <div className="flex items-center justify-between p-6">
                        <Link to="/" className='flex items-center space-x-2'>
                            <h1 className="text-2xl font-bold" style={{ color: theme.palette.text.primary }}>
                                <span style={{ color: theme.palette.primary.main }}>F</span>OOT
                                <span style={{ color: theme.palette.primary.main }}>B</span>ALL
                                <span style={{ color: theme.palette.primary.main }}> C</span>ORE
                            </h1>
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="rounded-md p-2.5 transition-colors duration-200"
                        >
                            <div className="w-6 h-6 relative">
                                <span
                                    className="absolute w-6 h-0.5 rounded-full transform rotate-45"
                                    style={{ top: 12, backgroundColor: theme.palette.text.primary }}
                                />
                                <span
                                    className="absolute w-6 h-0.5 rounded-full transform -rotate-45"
                                    style={{ top: 12, backgroundColor: theme.palette.text.primary }}
                                />
                            </div>
                        </button>
                    </div>

                    {/* Contenido del menú */}
                    <div className="px-6 py-6 space-y-2">
                        {[
                            { to: '/services', label: 'SERVICIOS' },
                            { to: '/about-us', label: 'SOBRE NOSOTROS' },
                            { to: '/contact', label: 'CONTACTO' },
                        ].map(({ to, label }, i) => (
                            <motion.a
                                key={to}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: mobileMenuOpen ? 1 : 0, x: mobileMenuOpen ? 0 : 20 }}
                                transition={{ delay: 0.1 * (i + 1) }}
                                href={to}
                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 group"
                                style={{ color: theme.palette.text.primary }}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <div
                                    className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ backgroundColor: theme.palette.primary.main }}
                                />
                                {label}
                            </motion.a>
                        ))}

                        {/* Separador */}
                        <div className="my-6 border-t" style={{ borderColor: theme.palette.divider }} />

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
                            <Link
                                to="/get-started"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full block text-center text-white px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                                style={{
                                    background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                }}
                            >
                                Comenzar Gratis
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </header>
    )
}

export default NavbarClient
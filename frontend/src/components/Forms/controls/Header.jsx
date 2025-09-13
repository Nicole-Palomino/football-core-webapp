import { Box, Fade, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { useThemeMode } from '../../../contexts/ThemeContext'

const Header = ({ title, subtitle }) => {

    const { currentTheme } = useThemeMode()

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-8"
        >
            {/* Title with animated gradient */}
            <div className="relative mb-4">
                <motion.h1
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
                    style={{
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        textShadow: '0 0 40px rgba(34, 197, 94, 0.3)'
                    }}
                >
                    {title}
                </motion.h1>

                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-blue-500/20 to-purple-600/20 blur-3xl -z-10 animate-pulse"></div>
            </div>

            {/* Subtitle with fade-in animation */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative"
            >
                <p className={`${currentTheme.textSecondary} text-lg md:text-xl font-medium italic max-w-2xl mx-auto px-4`}>
                    {subtitle}
                </p>

                {/* Decorative elements */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '4rem' }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mt-4"
                ></motion.div>
            </motion.div>

            {/* Optional floating particles effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        y: [-20, 20, -20],
                        x: [-10, 10, -10],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full blur-sm"
                ></motion.div>

                <motion.div
                    animate={{
                        y: [20, -20, 20],
                        x: [10, -10, 10],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-emerald-400/40 rounded-full blur-sm"
                ></motion.div>

                <motion.div
                    animate={{
                        y: [-15, 15, -15],
                        x: [15, -15, 15],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-purple-400/50 rounded-full blur-sm"
                ></motion.div>
            </div>
        </motion.div>
    )
}

export default Header
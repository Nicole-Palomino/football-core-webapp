import { EmojiEvents as TrophyIcon, } from '@mui/icons-material'
import { FaFutbol } from 'react-icons/fa'
import { useThemeMode } from '../../../../contexts/ThemeContext'

const TotalMatch = ({ totalMatches }) => {
    const { currentTheme } = useThemeMode()

    return (
        <div className="flex flex-col items-center justify-center text-center p-4 relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105">
            {/* Fondo con efecto de gradiente */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-blue-500/5 opacity-50 z-0"></div>
            
            {/* Círculo decorativo */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-yellow-400/10 z-0"></div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-blue-400/10 z-0"></div>
            
            {/* Contenido */}
            <div className="relative z-10">
                <TrophyIcon
                    className="text-5xl md:text-6xl mb-2 transform transition-transform duration-300 hover:rotate-12"
                    style={{
                        color: '#FFD700',
                        filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))'
                    }}
                />
                
                <div className="relative">
                    <h2 
                        className="text-4xl md:text-5xl font-bold mb-1"
                        style={{ color: currentTheme.primary }}
                    >
                        {totalMatches}
                    </h2>
                    <div className="absolute -inset-1 bg-yellow-400/20 blur-sm rounded-full -z-10"></div>
                </div>
                
                <p 
                    className="text-sm font-medium mt-2"
                    style={{ color: currentTheme.text }}
                >
                    Partidos totales
                </p>
                
                {/* Pequeños íconos decorativos */}
                <div className="absolute top-0 left-0 text-yellow-500/30 text-xs">
                    <FaFutbol />
                </div>
                <div className="absolute bottom-0 right-0 text-yellow-500/30 text-xs">
                    <FaFutbol />
                </div>
            </div>
        </div>
    )
}

export default TotalMatch
import { ChartBarIcon } from '@heroicons/react/24/outline'
import { useThemeMode } from '../../contexts/ThemeContext'

const LoadingMessage = () => {
    const { currentTheme } = useThemeMode()

    return (
        <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-12 text-center`}>
            <div className="animate-bounce mb-6">
                <ChartBarIcon className="w-24 h-24 text-gray-400 mx-auto opacity-50" />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-4">
                Selecciona equipos para analizar
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
                Elige una liga y dos equipos para ver el análisis estadístico completo
            </p>
        </div>
    )
}

export default LoadingMessage
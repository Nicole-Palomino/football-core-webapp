import { useThemeMode } from '../../contexts/ThemeContext'

const LoadingSpinner = () => {
    const { currentTheme } = useThemeMode()

    return (
        <div className={`${currentTheme.background} min-h-screen flex flex-col items-center justify-center`}>
            <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <h3 className={`${currentTheme.text} text-xl font-semibold mt-6 animate-pulse`}>
                Cargando datos...
            </h3>
        </div>
    )
}

export default LoadingSpinner
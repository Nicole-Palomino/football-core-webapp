import { useThemeMode } from '../../contexts/ThemeContext'

const LoadingPage = () => {
    const { currentTheme } = useThemeMode()

    return (
        <div className={`${currentTheme.background} min-h-screen flex flex-col items-center justify-center`}>
            <div className="relative mb-8">
                <div className="w-24 h-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full animate-pulse"></div>
                </div>
            </div>
            <h1 className={`${currentTheme.text} text-2xl font-bold tracking-wider animate-pulse`}>
                BIENVENIDOS A FOOTBALL CORE
            </h1>
            <div className="mt-4 flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
        </div>
    )
}

export default LoadingPage
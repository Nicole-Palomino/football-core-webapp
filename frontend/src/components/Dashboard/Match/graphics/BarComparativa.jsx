import { useThemeMode } from "../../../../contexts/ThemeContext"

const BarComparativa = ({ home, away, title }) => {
    const { currentTheme } = useThemeMode()

    const homeValue = home
    const awayValue = away
    const homeTeam = "Local"
    const awayTeam = "Visitante"

    const homeColor = currentTheme.custom?.rojo || '#e53935'
    const awayColor = currentTheme.custom?.blanco || '#ffffff'

    const total = homeValue + awayValue
    const homePercentage = total > 0 ? (homeValue / total) * 100 : 50
    const awayPercentage = total > 0 ? (awayValue / total) * 100 : 50

    return (
        <>
            {/* Header con valores */}
            <div className="flex justify-between items-center mb-3">
                <span className={`font-semibold text-lg ${currentTheme.text}`}>
                    {homeValue}
                </span>
                <div className="text-center">
                    <span className={`text-md font-medium ${currentTheme.text}`}>
                        {title}
                    </span>
                </div>
                <span className={`font-semibold text-lg ${currentTheme.text}`}>
                    {awayValue}
                </span>
            </div>

            {/* Barra de progreso */}
            <div className={`w-full h-2 ${currentTheme.borderLight} rounded-full overflow-hidden`}>
                <div className="flex h-full">
                    {/* Sección local */}
                    <div
                        className="h-full transition-all duration-500 ease-in-out"
                        style={{
                            width: `${homePercentage}%`,
                            backgroundColor: homeColor,
                        }}
                    />
                    {/* Sección visitante */}
                    <div
                        className="h-full transition-all duration-500 ease-in-out"
                        style={{
                            width: `${awayPercentage}%`,
                            backgroundColor: awayColor,
                            border: currentTheme.palette.mode === 'light' ? '1px solid #374151' : 'none',
                        }}
                    />
                </div>
            </div>

            {/* Información adicional */}
            <div className={`flex justify-between text-xs mt-2 mb-2 ${currentTheme.textSecondary}`}>
                <span>{homeTeam}</span>
                <span>{awayTeam}</span>
            </div>
        </>
    )
}

export default BarComparativa
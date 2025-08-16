const BarComparativa = ({ home, away, title }) => {
    const homeValue = home
    const awayValue = away
    const homeTeam = "Local"
    const awayTeam = "Visitante"
    const homeColor = "#e53935"
    const awayColor = "#ffffff"

    const total = homeValue + awayValue
    const homePercentage = (homeValue / total) * 100
    const awayPercentage = (awayValue / total) * 100

    return (
        <>
            {/* Header con valores */}
            <div className="flex justify-between items-center mb-3">
                <span className="text-white font-semibold text-lg">
                    {homeValue}
                </span>
                <div className="text-center">
                    <span className="text-white text-md font-medium">
                        {title}
                    </span>
                </div>
                <span className="text-white font-semibold text-lg">
                    {awayValue}
                </span>
            </div>

            {/* Barra de progreso */}
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="flex h-full">
                    {/* Sección local (azul) */}
                    <div
                        className="h-full transition-all duration-500 ease-in-out"
                        style={{
                            width: `${homePercentage}%`,
                            backgroundColor: homeColor
                        }}
                    />
                    {/* Sección visitante (blanca) */}
                    <div
                        className="h-full transition-all duration-500 ease-in-out"
                        style={{
                            width: `${awayPercentage}%`,
                            backgroundColor: awayColor,
                            border: awayColor === '#ffffff' ? '1px solid #374151' : 'none'
                        }}
                    />
                </div>
            </div>

            {/* Información adicional (opcional) */}
            <div className="flex justify-between text-xs text-gray-400 mt-2 mb-2">
                <span>{homeTeam}</span>
                <span>{awayTeam}</span>
            </div>
        </>
    )
}

export default BarComparativa
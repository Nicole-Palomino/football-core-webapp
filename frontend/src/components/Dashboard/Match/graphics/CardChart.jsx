import { useThemeMode } from "../../../../contexts/ThemeContext"

const CardChart = ({ stats }) => {
  const { currentTheme } = useThemeMode()

  return (
    <div className="text-center mt-5">
      <h2 className={`text-xl font-bold mb-2 ${currentTheme.text}`}>Estadísticas del {stats.Equipo}</h2>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {/* <!-- Posesión Ofensiva --> */}
        <div
          className={`flex-1 min-w-[140px] p-4 rounded-xl ${currentTheme.border} ${currentTheme.card} shadow-md transition-all duration-300 hover:shadow-lg`}
        >
          <div className={`text-2xl font-bold ${currentTheme.text}`}>{stats.Posesión_ofensiva}</div>
          <div className={`text-xs ${currentTheme.textSecondary}`}>Posesión Ofensiva</div>
        </div>

        {/* <!-- Eficiencia Ofensiva --> */}
        <div
          className={`flex-1 min-w-[140px] p-4 rounded-xl ${currentTheme.border} ${currentTheme.card} shadow-md transition-all duration-300 hover:shadow-lg`}
        >
          <div className={`text-2xl font-bold ${currentTheme.text}`}>{stats.Eficiencia_ofensiva}</div>
          <div className={`text-xs ${currentTheme.textSecondary}`}>Eficiencia Ofensiva</div>
        </div>

        {/* <!-- Indisciplina --> */}
        <div
          className={`flex-1 min-w-[140px] p-4 rounded-xl ${currentTheme.border} ${currentTheme.card} shadow-md transition-all duration-300 hover:shadow-lg`}
        >
          <div className={`text-2xl font-bold ${currentTheme.text}`}>{stats.Indisciplina}</div>
          <div className={`text-xs ${currentTheme.textSecondary}`}>Indisciplina</div>
        </div>

        {/* <!-- Goles local/promedio --> */}
        <div
          className={`flex-1 min-w-[140px] p-4 rounded-xl ${currentTheme.border} ${currentTheme.card} shadow-md transition-all duration-300 hover:shadow-lg`}
        >
          <div className={`text-2xl font-bold ${currentTheme.text}`}>{stats.Goles_local_prom}</div>
          <div className={`text-xs ${currentTheme.textSecondary}`}>Goles local/promedio</div>
        </div>

        {/* <!-- Goles visita/promedio --> */}
        <div
          className={`flex-1 min-w-[140px] p-4 rounded-xl ${currentTheme.border} ${currentTheme.card} shadow-md transition-all duration-300 hover:shadow-lg`}
        >
          <div className={`text-2xl font-bold ${currentTheme.text}`}>{stats.Goles_visita_prom}</div>
          <div className={`text-xs ${currentTheme.textSecondary}`}>Goles visita/promedio</div>
        </div>
      </div>
    </div>
  )
}

export default CardChart
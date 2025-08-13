import { useTheme } from "@mui/material"

const CardChart = ({ stats }) => {
  const theme = useTheme()

  return (
    <div className="text-center mt-5">
      <h2 className="text-xl font-bold mb-2" style={{ color: theme.palette.text.primary }}>Estadísticas del {stats.Equipo}</h2>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {/* <!-- Posesión Ofensiva --> */}
        <div
          className="flex-1 min-w-[140px] p-4 rounded-xl border"
          style={{
            backgroundColor: theme.custom.azul + '1A', // Ejemplo con transparencia (hex 1A ~ 10%)
            borderColor: theme.custom.azul + '33',     // Ejemplo borde con opacidad
            color: theme.custom.azul,
          }}
        >
          <div className="text-2xl font-bold" style={{ color: theme.palette.text.primary }}>{stats.Posesión_ofensiva}</div>
          <div className="text-xs" style={{ color: theme.palette.text.secondary }}>Posesión Ofensiva</div>
        </div>

        {/* <!-- Eficiencia Ofensiva --> */}
        <div
          className="flex-1 min-w-[140px] p-4 rounded-xl border"
          style={{
            backgroundColor: theme.custom.rojo + '1A', // Ejemplo con transparencia (hex 1A ~ 10%)
            borderColor: theme.custom.rojo + '33',     // Ejemplo borde con opacidad
            color: theme.custom.rojo,
          }}
        >
          <div className="text-2xl font-bold" style={{ color: theme.palette.text.primary }}>{stats.Eficiencia_ofensiva}</div>
          <div className="text-xs" style={{ color: theme.palette.text.secondary }}>Eficiencia Ofensiva</div>
        </div>

        {/* <!-- Indisciplina --> */}
        <div
          className="flex-1 min-w-[140px] p-4 rounded-xl border"
          style={{
            backgroundColor: theme.custom.azulHover + '1A', // Ejemplo con transparencia (hex 1A ~ 10%)
            borderColor: theme.custom.azulHover + '33',     // Ejemplo borde con opacidad
            color: theme.custom.azulHover,
          }}
        >
          <div className="text-2xl font-bold" style={{ color: theme.palette.text.primary }}>{stats.Indisciplina}</div>
          <div className="text-xs" style={{ color: theme.palette.text.secondary }}>Indisciplina</div>
        </div>

        {/* <!-- Goles local/promedio --> */}
        <div
          className="flex-1 min-w-[140px] p-4 rounded-xl border"
          style={{
            backgroundColor: theme.custom.naranja + '1A', // Ejemplo con transparencia (hex 1A ~ 10%)
            borderColor: theme.custom.naranja + '33',     // Ejemplo borde con opacidad
            color: theme.custom.naranja,
          }}
        >
          <div className="text-2xl font-bold" style={{ color: theme.palette.text.primary }}>{stats.Goles_local_prom}</div>
          <div className="text-xs" style={{ color: theme.palette.text.secondary }}>Goles local/promedio</div>
        </div>

        {/* <!-- Estado --> */}
        <div
          className="flex-1 min-w-[140px] p-4 rounded-xl border"
          style={{
            backgroundColor: theme.custom.morado + '1A', // Ejemplo con transparencia (hex 1A ~ 10%)
            borderColor: theme.custom.morado + '33',     // Ejemplo borde con opacidad
            color: theme.custom.morado,
          }}
        >
          <div className="text-2xl font-bold" style={{ color: theme.palette.text.primary }}>{stats.Goles_visita_prom}</div>
          <div className="text-xs" style={{ color: theme.palette.text.secondary }}>Goles visita/promedio</div>
        </div>
      </div>
    </div>
  )
}

export default CardChart
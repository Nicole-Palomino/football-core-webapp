import React from 'react'

const CardChart = ({ stats }) => {
  return (
    <div class="bg-target rounded-2xl p-6 text-center shadow-lg justify-center items-center w-fit inline-flex flex-col">
      <h2 class="text-white text-xl font-bold mb-2">Estadísticas Avanzadas del {stats.Equipo}</h2>

      <div class="mt-6 flex flex-wrap justify-center gap-4">
        {/* <!-- Estado --> */}
        <div class="flex-1 min-w-[140px] p-4 bg-[rgba(246,107,98,0.1)] border border-[rgba(246,107,98,0.2)] rounded-xl">
          <div class="text-[#F66231] text-2xl font-bold">{stats.Posesión_ofensiva}</div>
          <div class="text-xs text-gray-400">Posesión Ofensiva</div>
        </div>

        {/* <!-- Estado --> */}
        <div class="flex-1 min-w-[140px] p-4 bg-[rgba(246,49,98,0.1)] border border-[rgba(246,49,98,0.2)] rounded-xl">
          <div class="text-[#F63162] text-2xl font-bold">{stats.Eficiencia_ofensiva}</div>
          <div class="text-xs text-gray-400">Eficiencia Ofensiva</div>
        </div>

        {/* <!-- Estado --> */}
        <div class="flex-1 min-w-[140px] p-4 bg-[rgba(49,197,246,0.1)] border border-[rgba(49,197,246,0.2)] rounded-xl">
          <div class="text-[#31C5F6] text-2xl font-bold">{stats.Indisciplina}</div>
          <div class="text-xs text-gray-400">Indisciplina</div>
        </div>

        {/* <!-- Estado --> */}
        <div class="flex-1 min-w-[140px] p-4 bg-[rgba(246,197,49,0.1)] border border-[rgba(246,197,49,0.2)] rounded-xl">
          <div class="text-[#F6C531] text-2xl font-bold">{stats.Goles_local_prom}</div>
          <div class="text-xs text-gray-400">Goles local/promedio</div>
        </div>

        {/* <!-- Estado --> */}
        <div class="flex-1 min-w-[140px] p-4 bg-[rgba(197,246,49,0.1)] border border-[rgba(197,246,49,0.2)] rounded-xl">
          <div class="text-[#C5F631] text-2xl font-bold">{stats.Goles_visita_prom}</div>
          <div class="text-xs text-gray-400">Goles visita/promedio</div>
        </div>
      </div>
    </div>
  )
}

export default CardChart
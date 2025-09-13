import { useState } from 'react'
import { useThemeMode } from '../../../../contexts/ThemeContext'
import { formatFecha } from '../../../../utils/helpers'

const TablaConPaginacion = ({ matches }) => {

    const datos = matches.enfrentamientos_directos || []
    const { currentTheme } = useThemeMode()
    const itemsPorPagina = 10

    const [paginaActual, setPaginaActual] = useState(1)

    // Calcular rangos
    const indiceInicio = (paginaActual - 1) * itemsPorPagina
    const indiceFinal = indiceInicio + itemsPorPagina
    const datosPagina = datos.slice(indiceInicio, indiceFinal)

    const totalPaginas = Math.ceil(datos.length / itemsPorPagina)

    const irPagina = (num) => {
        if (num >= 1 && num <= totalPaginas) {
            setPaginaActual(num)
        }
    };

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg transition-all duration-300">
            <table className={`w-full text-sm text-left rtl:text-right ${currentTheme.textSecondary}`}>
                <thead className={`text-xs uppercase text-center ${currentTheme.tableHeader}`}>
                    <tr>
                        <th scope="col" className="px-1 py-2 font-bold whitespace-nowrap">Fecha</th>
                        <th scope="col" className="px-1 py-2 font-bold whitespace-nowrap">Local</th>
                        <th scope="col" className="px-1 py-2 font-bold whitespace-nowrap">Visitante</th>
                        <th scope="col" className="px-1 py-2 font-bold whitespace-nowrap">Resultado</th>
                    </tr>
                </thead>
                <tbody>
                    {datosPagina.map((partido, index) => (
                        <tr
                            key={index}
                            className={`border-b ${index % 2 === 0 ? currentTheme.tableRow : currentTheme.tableRowAlt} ${currentTheme.border}`}
                        >
                            <td className={`px-1 py-2 text-center whitespace-nowrap ${currentTheme.text}`}>
                                {formatFecha(partido.Date)}
                            </td>
                            <td className={`px-1 py-2 text-center whitespace-nowrap ${currentTheme.text}`}>
                                {partido.HomeTeam}
                            </td>
                            <td className={`px-1 py-2 text-center whitespace-nowrap ${currentTheme.text}`}>
                                {partido.AwayTeam}
                            </td>
                            <td className={`px-1 py-2 text-center font-bold whitespace-nowrap ${currentTheme.text}`}>
                                {partido.FTHG} - {partido.FTAG}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* PAGINACIÓN */}
            <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4">
                <span className={`text-sm font-normal mb-4 md:mb-0 block w-full md:inline md:w-auto ${currentTheme.textSecondary}`}>
                    Mostrando{" "}
                    <span className={`font-semibold ${currentTheme.text}`}>
                        {indiceInicio + 1}-{Math.min(indiceFinal, datos.length)}
                    </span>{" "}
                    de{" "}
                    <span className={`font-semibold ${currentTheme.text}`}>
                        {datos.length}
                    </span>
                </span>

                <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                    <li>
                        <button
                            onClick={() => irPagina(paginaActual - 1)}
                            disabled={paginaActual === 1}
                            className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight border disabled:opacity-50 cursor-pointer ${currentTheme.border} ${currentTheme.card} ${currentTheme.text}`}
                        >
                            Previous
                        </button>
                    </li>

                    {Array.from({ length: totalPaginas }, (_, i) => (
                        <li key={i}>
                            <button
                                onClick={() => irPagina(i + 1)}
                                className={`flex items-center justify-center px-3 h-8 border cursor-pointer ${currentTheme.border} ${paginaActual === i + 1
                                        ? "text-blue-600 bg-blue-50 dark:bg-blue-900"
                                        : `${currentTheme.card} ${currentTheme.textSecondary} hover:${currentTheme.text}`
                                    }`}
                            >
                                {i + 1}
                            </button>
                        </li>
                    ))}

                    <li>
                        <button
                            onClick={() => irPagina(paginaActual + 1)}
                            disabled={paginaActual === totalPaginas}
                            className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight border disabled:opacity-50 cursor-pointer ${currentTheme.border} ${currentTheme.card} ${currentTheme.text}`}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default TablaConPaginacion
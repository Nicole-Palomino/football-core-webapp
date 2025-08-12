import { useTheme } from '@mui/material'
import { useState } from 'react'

const TablaConPaginacion = ({ matches }) => {

    const datos = matches.enfrentamientos_directos || []
    const theme = useTheme()
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
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table
                className="w-full text-sm text-left rtl:text-right"
                style={{ color: theme.palette.text.secondary }}
            >
                <thead
                    className="text-xs uppercase"
                    style={{
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        textAlign: "center",
                    }}
                >
                    <tr>
                        <th scope="col" className="px-1 py-2 font-bold whitespace-nowrap">
                            Fecha
                        </th>
                        <th scope="col" className="px-1 py-2 font-bold whitespace-nowrap">
                            Local
                        </th>
                        <th scope="col" className="px-1 py-2 font-bold whitespace-nowrap">
                            Visitante
                        </th>
                        <th scope="col" className="px-1 py-2 font-bold whitespace-nowrap">
                            Resultado
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {datosPagina.map((partido, index) => (
                        <tr
                            key={index}
                            className="border-b"
                            style={{
                                backgroundColor:
                                    index % 2 === 0
                                        ? theme.palette.background.paper
                                        : theme.palette.background.default,
                                borderColor: theme.palette.divider.primary,
                            }}
                        >
                            <td
                                className="px-1 py-2 text-center whitespace-nowrap"
                                style={{ color: theme.palette.text.primary }}
                            >
                                {partido.Date}
                            </td>
                            <td
                                className="px-1 py-2 text-center whitespace-nowrap"
                                style={{ color: theme.palette.text.primary }}
                            >
                                {partido.HomeTeam}
                            </td>
                            <td
                                className="px-1 py-2 text-center whitespace-nowrap"
                                style={{ color: theme.palette.text.primary }}
                            >
                                {partido.AwayTeam}
                            </td>
                            <td
                                className="px-1 py-2 text-center font-bold whitespace-nowrap"
                                style={{ color: theme.palette.text.primary }}
                            >
                                {partido.FTHG} - {partido.FTAG}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* PAGINACIÓN */}
            <nav
                className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
                aria-label="Table navigation"
            >
                <span className="text-sm font-normal mb-4 md:mb-0 block w-full md:inline md:w-auto" style={{ color: theme.palette.text.secondary}}>
                    Mostrando{" "}
                    <span className="font-semibold" style={{ color: theme.palette.text.primary }}>
                        {indiceInicio + 1}-{Math.min(indiceFinal, datos.length)}
                    </span>{" "}
                    de{" "}
                    <span className="font-semibold" style={{ color: theme.palette.text.primary }}>
                        {datos.length}
                    </span>
                </span>

                <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                    <li>
                        <button
                            onClick={() => irPagina(paginaActual - 1)}
                            disabled={paginaActual === 1}
                            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight border hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                            style={{ color: theme.palette.text.primary, backgroundColor: theme.palette.primary.contrastText }}
                        >
                            Previous
                        </button>
                    </li>

                    {Array.from({ length: totalPaginas }, (_, i) => (
                        <li key={i}>
                            <button
                                onClick={() => irPagina(i + 1)}
                                className={`flex items-center justify-center px-3 h-8 border cursor-pointer ${paginaActual === i + 1
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-gray-500 bg-white hover:bg-gray-100"
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
                            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight border hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                            style={{ color: theme.palette.text.primary, backgroundColor: theme.palette.primary.contrastText }}
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
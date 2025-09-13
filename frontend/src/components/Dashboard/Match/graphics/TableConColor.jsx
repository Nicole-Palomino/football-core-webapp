import React from 'react'
import { formatFecha } from '../../../../utils/helpers'
import { useThemeMode } from '../../../../contexts/ThemeContext'

const TableConColor = ({ finalMatchesStats = [], equipo }) => {
    const { currentTheme } = useThemeMode()

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg transition-all duration-300">
            <table
                className={`w-full text-sm text-left rtl:text-right ${currentTheme.textSecondary}`}
            >
                <thead className={`text-xs uppercase text-center ${currentTheme.tableHeader}`}>
                    <tr>
                        <th scope="col" className="px-1 py-2 font-bold whitespace-nowrap">Fecha</th>
                        <th scope="col" className="px-1 py-2 font-bold whitespace-nowrap">Local</th>
                        <th scope="col" className="px-1 py-2 font-bold whitespace-nowrap">Visitante</th>
                        <th scope="col" className="px-1 py-2 font-bold whitespace-nowrap">Resultado</th>
                    </tr>
                </thead>
                <tbody>
                    {finalMatchesStats.ultimos_partidos[equipo].map((partido, index) => {
                        const esLocal = partido.HomeTeam === equipo
                        const esVisitante = partido.AwayTeam === equipo

                        return (
                            <tr
                                key={index}
                                className={`border-b ${index % 2 === 0 ? currentTheme.tableRow : currentTheme.tableRowAlt} ${currentTheme.border}`}
                            >
                                <td
                                    className={`px-1 py-2 text-center whitespace-nowrap ${currentTheme.accentLight}`}
                                >
                                    {formatFecha(partido.Date)}
                                </td>
                                <td
                                    className={`px-1 py-2 text-center whitespace-nowrap ${esLocal ? `font-bold ${currentTheme.accentLight}` : currentTheme.text
                                        }`}
                                >
                                    {partido.HomeTeam}
                                </td>
                                <td
                                    className={`px-1 py-2 text-center whitespace-nowrap ${esVisitante ? `font-bold ${currentTheme.accentLight}` : currentTheme.text
                                        }`}
                                >
                                    {partido.AwayTeam}
                                </td>
                                <td
                                    className={`px-1 py-2 text-center font-bold whitespace-nowrap ${currentTheme.text}`}
                                >
                                    {partido.FTHG} - {partido.FTAG}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default TableConColor
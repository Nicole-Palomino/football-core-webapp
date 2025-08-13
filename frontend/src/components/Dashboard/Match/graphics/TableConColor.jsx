import { useTheme } from '@mui/material'
import React from 'react'
import { formatFecha } from '../../../../utils/helpers'

const TableConColor = ({ finalMatchesStats=[], equipo }) => {
    const theme = useTheme()

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
                        textAlign: 'center'
                    }}
                >
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
                                className="border-b"
                                style={{
                                    backgroundColor: index % 2 === 0
                                        ? theme.palette.background.paper
                                        : theme.palette.background.default,
                                    borderColor: theme.palette.divider.primary
                                }}
                            >
                                <td
                                    className="px-1 py-2 text-center whitespace-nowrap"
                                    style={{ color: theme.palette.text.primary }}
                                >
                                    {formatFecha(partido.Date)}
                                </td>
                                <td
                                    className="px-1 py-2 text-center whitespace-nowrap"
                                    style={{
                                        fontWeight: esLocal ? '700' : '400',
                                        backgroundColor: esLocal
                                            ? theme.custom.amarillo
                                            : 'transparent',
                                        color: esLocal
                                            ? '#000'
                                            : theme.palette.text.primary,
                                    }}
                                >
                                    {partido.HomeTeam}
                                </td>
                                <td
                                    className="px-1 py-2 text-center whitespace-nowrap"
                                    style={{
                                        fontWeight: esVisitante ? '700' : '400',
                                        backgroundColor: esVisitante
                                            ? theme.custom.amarillo
                                            : 'transparent',
                                        color: esVisitante
                                            ? '#000'
                                            : theme.palette.text.primary,
                                    }}
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
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default TableConColor
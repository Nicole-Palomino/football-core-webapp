import PieArcLabel from './PieArcLabel'

const PieCharts = ({ stats, equipo1, equipo2 }) => {
    const victoriasPorEquipoData = [
        { id: 0, value: stats.victorias_por_equipo.local, label: equipo1 },
        { id: 1, value: stats.victorias_por_equipo.empates, label: 'Empates' },
        { id: 2, value: stats.victorias_por_equipo.visitante, label: equipo2 },
    ];

    const victoriasPorLocaliaData = [
        { id: 0, value: stats.victorias_por_localia.local, label: 'De Local' },
        { id: 1, value: stats.victorias_por_localia.empates, label: 'Empates' },
        { id: 2, value: stats.victorias_por_localia.visitante, label: 'De Visitante' },
    ];

    return (
        <div className="flex flex-col md:flex-row justify-center items-start w-full gap-6 bg-target rounded-lg p-6 shadow-lg">
            <PieArcLabel data={victoriasPorEquipoData} title="Victorias Por Equipo" />
            <PieArcLabel data={victoriasPorLocaliaData} title="Victorias Por Localía" />
        </div>
    )
}

export default PieCharts

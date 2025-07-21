import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts"

const PieCharts = ({ stats }) => {
    const data = [
        { name: "Local", value: stats.victorias_local },
        { name: "Empates", value: stats.empates },
        { name: "Visitante", value: stats.victorias_visitante },
    ]

    const mediodata = [
        { name: "Local", value: stats.victorias_ht_local },
        { name: "Empates", value: stats.empates_ht },
        { name: "Visitante", value: stats.victorias_ht_visitante },
    ]

    const COLORS = ["#16a34a", "#6b7280", "#dc2626"]

    return (
        <div className="flex flex-wrap justify-center items-start w-full gap-6 bg-target rounded-lg shadow-lg">
            <div className="w-full sm:w-1/2 flex justify-center">
                <div className="flex flex-col items-center max-w-[300px] w-full">
                    <h3 className="text-center text-white mb-2 uppercase font-bold text-md">Victorias en tiempo completo</h3>
                    <PieChart width={300} height={250}>
                        <Pie
                            data={data}
                            cx={150}
                            cy={100}
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                const radius = innerRadius + (outerRadius - innerRadius) / 2;
                                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                return (
                                    <text
                                        x={x}
                                        y={y}
                                        fill="white"
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        fontSize={14}
                                        >
                                        {`${(percent * 100).toFixed(0)}%`}
                                    </text>
                                )
                            }}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>

                <div className="flex flex-col items-center">
                    <h3 className="text-center text-white mb-2 uppercase font-bold text-md">Victorias en medio tiempo</h3>
                    <PieChart width={300} height={250}>
                        <Pie
                            data={mediodata}
                            cx={150}
                            cy={100}
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                const radius = innerRadius + (outerRadius - innerRadius) / 2;
                                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                return (
                                    <text
                                        x={x}
                                        y={y}
                                        fill="white"
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        fontSize={14}
                                        >
                                        {`${(percent * 100).toFixed(0)}%`}
                                    </text>
                                )
                            }}
                        >
                            {mediodata.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>
            </div>
        </div>

    )
}

export default PieCharts
import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

const PieArcLabel = ({ data, title }) => {
    return (
        <div className="flex flex-col items-center w-full md:w-1/2">
            <h3 className="text-center text-white mb-2 uppercase font-bold text-md">
                {title}
            </h3>
            <PieChart
                series={[
                    {
                        data: data,
                        arcLabel: (item) => `${item.value}`,
                        arcLabelMinAngle: 35,
                        arcLabelRadius: '60%',
                    },
                ]}
                width={300}
                height={300}
                legend={{ hidden: false }}
                sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                        fontWeight: 'bold',
                        fill: '#fff', // ✅ Etiquetas dentro del gráfico en blanco
                        fontSize: 20,
                    },
                    '& .MuiChartsLegend-root .MuiTypography-root': {
                        color: '#fff', // ✅ Leyenda externa en blanco
                    },
                }}
            />
        </div>
    );
};

export default PieArcLabel;

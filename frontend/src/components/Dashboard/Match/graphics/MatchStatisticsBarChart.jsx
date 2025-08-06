import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';

// Un formateador simple para mostrar números con un decimal
const valueFormatter = (value) => {
    return value ? Math.abs(value).toFixed(1) : '';
};

// Una función para formatear las etiquetas del eje X
const xAxisFormatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
});
const xAxisValueFormatter = (value) => {
    return xAxisFormatter.format(Math.abs(value));
};

const MatchStatisticsBarChart = ({ estadisticas_esperadas }) => {
    if (!estadisticas_esperadas) {
        return <Typography variant="h6" component="span" textAlign="center">Datos no disponibles</Typography>;
    }

    // Separar los datos del equipo local y visitante y crear las etiquetas
    const stats = {};
    const local = [];
    const visitante = [];

    for (const key in estadisticas_esperadas) {
        if (key.includes('_local')) {
            const statName = key.replace('_local', '');
            stats[statName] = {
                local: estadisticas_esperadas[key],
                label: statName.charAt(0).toUpperCase() + statName.slice(1).replace('_', ' '),
            };
        }
    }

    for (const key in estadisticas_esperadas) {
        if (key.includes('_visitante')) {
            const statName = key.replace('_visitante', '');
            if (stats[statName]) {
                stats[statName].visitante = estadisticas_esperadas[key];
            }
        }
    }

    const labels = Object.values(stats).map(item => item.label);
    const localData = Object.values(stats).map(item => -item.local); // Negativo para el efecto pirámide
    const visitanteData = Object.values(stats).map(item => item.visitante);

    // Ajustar el límite del dominio del eje X para que sea simétrico
    const domainLimit = (min, max) => {
        const extremum = Math.max(-min, max);
        return { min: -extremum * 1.1, max: extremum * 1.1 };
    };

    return (
        <Stack width="100%" sx={{ mx: [0, 4] }}>
            <Typography variant="h6" component="span" textAlign="center" sx={{ color: 'white' }}>
                Estadísticas del Partido
            </Typography>
            <BarChart
                height={500}
                layout="horizontal"
                margin={{ right: 0, left: 0 }}
                series={[
                    {
                        data: localData,
                        label: 'Local',
                        type: 'bar',
                        valueFormatter,
                        stack: 'stack',
                        color: '#3498db'
                    },
                    {
                        data: visitanteData,
                        label: 'Visitante',
                        type: 'bar',
                        valueFormatter,
                        stack: 'stack',
                        color: '#e74c3c'
                    },
                ]}
                yAxis={[
                    {
                        data: labels,
                        width: 150,
                        disableLine: true,
                        disableTicks: true,
                        label: 'Estadísticas',
                        tickLabelStyle: { fill: '#fff' },
                        labelStyle: { fill: '#fff' },
                    },
                ]}
                xAxis={[
                    {
                        valueFormatter: xAxisValueFormatter,
                        disableLine: true,
                        disableTicks: true,
                        domainLimit: domainLimit,
                        label: 'Valores',
                        tickLabelStyle: { fill: '#fff' },
                        labelStyle: { fill: '#fff' },
                    },
                ]}
                grid={{ horizontal: true, vertical: true }}
                sx={{
                    // Estilo de las líneas de la cuadrícula
                    '& .MuiChartsGrid-line': {
                        stroke: '#ADACAC',
                    },
                    // Estilo de las líneas y ticks de los ejes
                    '& .MuiChartsAxis-line': {
                        stroke: '#ADACAC',
                    },
                    '& .MuiChartsAxis-tick': {
                        stroke: '#ADACAC',
                    },
                    // Estilo del texto de las etiquetas de los ticks (los números)
                    '& .MuiChartsAxis-tickLabel': {
                        fill: '#ADACAC',
                    },
                    // Estilo del título del eje
                    '& .MuiChartsAxis-label': {
                        fill: '#ADACAC',
                    },
                    // Estilo de la leyenda
                    '& .MuiChartsLegend-label': {
                        fill: '#ADACAC',
                        color: '#ADACAC',
                    },
                }}
            />
        </Stack>
    );
}

export default MatchStatisticsBarChart
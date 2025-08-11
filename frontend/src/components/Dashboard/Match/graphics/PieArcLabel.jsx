import { Box, useTheme } from '@mui/material'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart'

const PieArcLabel = ({ data, title }) => {

    const theme = useTheme()

    return (
        <Box sx={{ maxWidth: 400, width: '100%', aspectRatio: '1 / 1', mx: 'auto', }}>
            <h3 className="text-center mb-4 uppercase font-bold text-md" style={{ color: theme.palette.text.primary }}>
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
                width={400}
                height={400}
                legend={{ hidden: false }}
                sx={{
                    padding: {xs: 2, md: 1},
                    [`& .${pieArcLabelClasses.root}`]: {
                        fontWeight: 'bold',
                        fill: theme.palette.primary.contrastText,
                        fontSize: 22,
                    },
                    '& .MuiChartsLegend-label': {
                        fill: theme.palette.text.primary,
                        color: theme.palette.primary.primary,
                    },
                    '& .MuiChartsLegend-root': {
                        color: theme.palette.text.primary,
                    },
                }}
            />
        </Box>
    );
};

export default PieArcLabel;

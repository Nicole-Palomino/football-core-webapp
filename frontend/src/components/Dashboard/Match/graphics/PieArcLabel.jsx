import { Box, useMediaQuery, useTheme } from '@mui/material'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart'

const PieArcLabel = ({ data, title }) => {

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    return (
        <Box sx={{ width: '100%', mx: 'auto' }}>
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
                width={isMobile ? 250 : 300}
                height={isMobile ? 300 : 300}
                slotProps={{
                    legend: {
                        position: isMobile ? 'bottom' : 'right', 
                        direction: isMobile ? 'row' : 'column',  
                    },
                }}
                sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                        fontWeight: 'bold',
                        fill: theme.palette.text.main,
                        fontSize: isMobile ? 14 : 22,
                    },
                    '& .MuiChartsLegend-label': {
                        fill: theme.palette.text.primary,
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

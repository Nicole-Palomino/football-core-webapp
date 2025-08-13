import { Box, useMediaQuery, useTheme } from '@mui/material'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart'

const PieArcLabel = ({ data }) => {

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    return (
        <Box sx={{ width: '100%', mx: 'auto' }}>
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
                        fill: theme.custom.blanco,
                        fontSize: isMobile ? 14 : 25,
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

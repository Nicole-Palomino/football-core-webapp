import { Box, Grid, Tab, Tabs } from '@mui/material'
import ListMatch from './ListMatch'

const H2HTabPanel = ({ h2hMatches }) => {
    return (
        <Grid item xs={12} md={12}>
            { h2hMatches.length > 0 ? (
                <div className="bg-target rounded-lg shadow-lg">
                    <Box sx={{ width: "100%" }}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <ListMatch matches={h2hMatches}/>                            
                        </Box>
                    </Box>
                </div>
            ): (
                <p>No hay datos disponibles.</p>
            )}
        </Grid>
    )
}

export default H2HTabPanel
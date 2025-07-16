import { useEffect, useState } from 'react'
import { Box, Grid, useMediaQuery } from '@mui/material'
import { Outlet, useLocation } from 'react-router-dom'
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined'
import SaveIcon from '@mui/icons-material/Save'
import PrintIcon from '@mui/icons-material/Print'
import ShareIcon from '@mui/icons-material/Share'
import NavbarUsers from '../components/NavbarUsers'

const Dashboard = () => {
    const [open, setOpen] = useState(false)
    const location = useLocation()

    return (
        <Grid container spacing={0} 
            sx={{ 
                backgroundColor: "#001F3F", 
                minHeight: "100vh",  
                height: "100vh", 
                width: "100%",
                margin: 0,
                padding: 0,
                display: "flex",
                flexWrap: "nowrap",  
                overflow: "hidden",
            }}>
                <Grid item xs={12} md sx={{ display: { xs: "none", md: "block" } }}></Grid>

                {/* seccion principal */}
                <Grid item xs={12} md={10} sx={{ minHeight: '100vh', height: '100%', display: 'flex', flexDirection: 'column', overflowY: "auto", }}>
                    <NavbarUsers />
                    <Box sx={{ flexGrow: 1 }}>
                        <Outlet />
                    </Box>
                </Grid>

                <Grid item xs={12} md sx={{ display: { xs: "none", md: "block" } }}></Grid>
        </Grid>
    )
}

export default Dashboard
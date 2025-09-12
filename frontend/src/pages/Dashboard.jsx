import { Box, Grid } from '@mui/material'
import { Outlet } from 'react-router-dom'
import NavbarUsers from '../components/Navbar/NavbarUsers'
import { useThemeMode } from '../contexts/ThemeContext'

const Dashboard = () => {
    const { currentTheme } = useThemeMode()

    return (
        <Grid container spacing={0} 
            className={`${currentTheme.background}`}
            sx={{ 
                minHeight: "100vh",
                height: "100vh",
                width: "100%",
                margin: 0,
                padding: 0,
                display: "flex",
                justifyContent: "center", 
                overflow: "hidden",
            }}>
                <Grid item xs={12} md sx={{ display: { xs: "none", md: "block" } }}></Grid>

                {/* seccion principal */}
                <Grid item xs={12} md={10} 
                    sx={{ 
                        minHeight: '100vh', 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        overflowY: "auto", 
                        maxWidth: "1200px",
                        width: "100%",
                    }}>
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
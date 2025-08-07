import { lazy } from 'react'
import { useAuth } from '../contexts/AuthContexts'
import { Navigate } from 'react-router-dom'
import { useTheme } from '@mui/material'

const NavbarClient = lazy(() => import('../components/Navbar/NavbarClient'))
const Hero = lazy(() => import('../components/HomePage/Hero'))
const Services = lazy(() => import('../components/HomePage/Services'))
const Banner = lazy(() => import('../components/HomePage/Banner'))
const Footer = lazy(() => import('../components/Footer/Footer'))

const HomePage = () => {
    const { isAuthenticated } = useAuth()
    const theme = useTheme()

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />
    }

    return (
        <div
            style={{ backgroundColor: theme.palette.background.default }}
            className="w-full h-screen overflow-x-auto scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-transparent"
        >
            <NavbarClient />
            <Hero />
            <Services />
            <Banner />
            <Footer />
        </div>
    )
}

export default HomePage
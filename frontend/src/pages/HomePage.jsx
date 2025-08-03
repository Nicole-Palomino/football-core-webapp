import { useAuth } from '../contexts/AuthContexts'
import { Navigate } from 'react-router-dom'
import NavbarClient from '../components/Navbar/NavbarClient'
import Hero from '../components/Sections/Hero'
import Services from '../components/Sections/Services'
import Banner from '../components/Sections/Banner'
import Footer from '../components/Footer/Footer'


const HomePage = () => {
    const { isAuthenticated } = useAuth()

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />
    }

    return (
        <div className="w-full h-screen bg-background overflow-x-auto scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-transparent">
            <NavbarClient />
            <Hero />
            <Services />
            <Banner />
            <Footer />
        </div>
    )
}

export default HomePage
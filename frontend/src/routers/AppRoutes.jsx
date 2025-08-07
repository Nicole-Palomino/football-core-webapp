import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import PublicRoute from './PublicRoute'
import { FavoritosProvider } from '../hooks/FavoritosContext'
import PrivateRoute from './PrivateRoute'
import LoadingPage from '../components/Loading/LoadingPage'

const HomePage = lazy(() => import('../pages/HomePage'))
const Services = lazy(() => import('../components/Header/Services'))
const Contact = lazy(() => import('../components/Header/Contact'))
const AboutUs = lazy(() => import('../components/Header/AboutUs'))
const Form = lazy(() => import('../pages/Form'))
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'))
const ResetPassword = lazy(() => import('../pages/ResetPassword'))
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Match = lazy(() => import('../pages/Match'))
const MatchDetail = lazy(() => import('../components/Dashboard/Match/MatchDetail'))
const Favorite = lazy(() => import('../pages/Favorite'))
const Analysis = lazy(() => import('../pages/Analysis'))
const Forecasts = lazy(() => import('../pages/Forecasts'))
const PageProfile = lazy(() => import('../pages/PageProfile'))
const PageSettings = lazy(() => import('../pages/PageSettings'))

const AppRoutes = () => {
    return (
        <Suspense fallback={<LoadingPage />}>
            <Routes>
                {/* Rutas públicas */}
                <Route path="*" element={<div>404 - Página no encontrada</div>} />
                <Route path='/' element={<HomePage />} />
                <Route path='/services' element={<Services />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/about-us' element={<AboutUs />} />
                <Route path='/get-started' element={<PublicRoute><Form /></PublicRoute>} />
                <Route path='/forgot-password' element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                <Route path='/reset-password' element={<PublicRoute><ResetPassword /></PublicRoute>} />

                {/* Rutas privadas con layout de Dashboard */}
                <Route path='/dashboard' element={
                    <FavoritosProvider>
                        <PrivateRoute><Dashboard /></PrivateRoute>
                    </FavoritosProvider>
                }>
                    <Route index element={<Match />} />
                    <Route path=':id_partido' element={<MatchDetail />} />
                    <Route path='favorites' element={<Favorite />} />
                    <Route path='analysis' element={<Analysis />} />
                    <Route path='forecasts' element={<Forecasts />} />
                    <Route path='profile' element={<PageProfile />} />
                    <Route path='settings' element={<PageSettings />} />
                </Route>
            </Routes>
        </Suspense>
    )
}

export default AppRoutes
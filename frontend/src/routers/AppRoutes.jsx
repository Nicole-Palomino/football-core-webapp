import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import PublicRoute from './PublicRoute'
import { FavoritosProvider } from '../hooks/FavoritosContext'
import PrivateRoute from './PrivateRoute'
import LoadingPage from '../components/Loading/LoadingPage'
import { MatchesProvider } from '../contexts/MatchesContext'
import MatchImage from '../components/Dashboard/Match/MatchImage'

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
const MatchPrediction = lazy(() => import('../components/Dashboard/Match/MatchPrediction'))
const Favorite = lazy(() => import('../pages/Favorite'))
const Analysis = lazy(() => import('../pages/Analysis'))
const Forecasts = lazy(() => import('../pages/Forecasts'))
const PageProfile = lazy(() => import('../pages/PageProfile'))
const PageSettings = lazy(() => import('../pages/PageSettings'))

const AppRoutes = () => {

    useEffect(() => {
        import('../components/Header/Services')
        import('../components/Header/AboutUs')
        import('../components/Header/Contact')
    }, [])

    return (
        <Routes>
            {/* Rutas públicas */}
            <Route path="*" element={<div>404 - Página no encontrada</div>} />
            <Route path='/' element={<Suspense fallback={<LoadingPage />}><HomePage /> </Suspense>} />
            <Route path='/services' element={<Services />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/about-us' element={<AboutUs />} />
            <Route path='/get-started' element={<PublicRoute><Suspense fallback={<LoadingPage />}><Form /></Suspense></PublicRoute>} />
            <Route path='/forgot-password' element={<PublicRoute><Suspense fallback={<LoadingPage />}><ForgotPassword /></Suspense></PublicRoute>} />
            <Route path='/reset-password' element={<PublicRoute><Suspense fallback={<LoadingPage />}><ResetPassword /></Suspense></PublicRoute>} />

            {/* Rutas privadas con layout de Dashboard */}
            <Route path='/dashboard' element={
                <FavoritosProvider>
                    <MatchesProvider>
                        <PrivateRoute>
                            <Suspense fallback={<LoadingPage />}>
                                <Dashboard />
                            </Suspense>
                        </PrivateRoute>
                    </MatchesProvider>
                </FavoritosProvider>
            }>
                <Route index element={
                    <Match />
                } />
                <Route path=':id_partido' element={<Suspense fallback={<LoadingPage />}><MatchDetail /> </Suspense>} />
                <Route path='predicciones/:id_partido' element={<Suspense fallback={<LoadingPage />}><MatchPrediction /> </Suspense>} />
                <Route path='imagenes/:id_partido' element={<Suspense fallback={<LoadingPage />}><MatchImage /> </Suspense>} />
                <Route path='favorites' element={<Suspense fallback={<LoadingPage />}> <Favorite /> </Suspense>} />
                <Route path='analysis' element={<Suspense fallback={<LoadingPage />}> <Analysis /> </Suspense>} />
                <Route path='forecasts' element={<Suspense fallback={<LoadingPage />}> <Forecasts /> </Suspense>} />
                <Route path='profile' element={<Suspense fallback={<LoadingPage />}><PageProfile /> </Suspense>} />
                <Route path='settings' element={<Suspense fallback={<LoadingPage />}><PageSettings /> </Suspense>} />
            </Route>
        </Routes>
    )
}

export default AppRoutes
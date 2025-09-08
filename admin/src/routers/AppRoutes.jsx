import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import LoadingPage from '../components/Loading/LoadingPage'
import Dashboard from '../pages/Dashboard'
import PrivateRoute from './PrivateRoute'

const HomePage = lazy(() => import('../pages/HomePage'))

const AppRoutes = () => {
    return (
        <Routes>
            {/* Rutas públicas */}
            <Route
                path="/"
                element={
                    <Suspense fallback={<LoadingPage />}>
                        <HomePage />
                    </Suspense>
                }
            />

            {/* Rutas privadas */}
            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <Suspense fallback={<LoadingPage />}>
                            <Dashboard />
                        </Suspense>
                    </PrivateRoute>
                }/>
            
            <Route path="*" element={<div>404 - Página no encontrada</div>} />
        </Routes>
    )
}

export default AppRoutes
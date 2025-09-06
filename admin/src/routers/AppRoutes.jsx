import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import LoadingPage from '../components/Loading/LoadingPage'

const HomePage = lazy(() => import('../pages/HomePage'))

const AppRoutes = () => {
    return (
        <Routes>
            {/* Rutas públicas */}
            <Route path="*" element={<div>404 - Página no encontrada</div>} />
            <Route path='/' element={<Suspense fallback={<LoadingPage />}><HomePage /> </Suspense>} />
        </Routes>
    )
}

export default AppRoutes
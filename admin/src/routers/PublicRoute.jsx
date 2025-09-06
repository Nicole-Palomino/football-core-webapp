import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContexts'

const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return null
    }
    // Si el usuario está autenticado, redirige al dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />
    }

    // Si no está autenticado, renderiza la ruta pública
    return children
}

export default PublicRoute
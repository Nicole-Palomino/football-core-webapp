import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContexts'

const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuth()

    // Si el usuario está autenticado, redirige al dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" />
    }

    // Si no está autenticado, renderiza la ruta pública
    return children
}

export default PublicRoute
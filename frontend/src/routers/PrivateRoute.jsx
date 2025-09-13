import { Navigate } from "react-router-dom"
import { useAuth } from '../contexts/AuthContexts'

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading, user } = useAuth()

    if (loading) {
        return <div>Cargando...</div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/get-started" replace />
    }

    return children
}

export default PrivateRoute
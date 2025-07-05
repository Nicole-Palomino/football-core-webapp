import { Navigate } from "react-router-dom"
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '../contexts/AuthContexts'

const isTokenValid = (token) => {
    try {
        const decoded = jwtDecode(token)
        const currentTime = Date.now() / 1000
        return decoded.exp > currentTime
    } catch (error) {
        return false
    }
}

const PrivateRoute = ({ children }) => {
    const { authToken, loading } = useAuth()

    if (loading) {
        return <div>Cargando ...</div>
    }

    if (!authToken || !isTokenValid(authToken)) {
        return <Navigate to="/get-started" />
    }

    return children
}

export default PrivateRoute
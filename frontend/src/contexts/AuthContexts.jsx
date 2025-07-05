import { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode"
import { getToken, setToken, removeToken } from "../services/auth"

const AuthContext = createContext()

const isTokenValid = (token) => {
    try {
        const decoded = jwtDecode(token)
        const currentTime = Date.now() / 1000
        return decoded.exp > currentTime
    } catch (error) {
        return false
    }
}

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const token = getToken()
        if (token && isTokenValid(token)) {
            setAuthToken(token)
            setIsAuthenticated(true)
        } else {
            removeToken()
            setIsAuthenticated(false)
        }
        setLoading(false)
    }, [])

    const login = (token) => {
        setToken(token)
        setAuthToken(token)
        setIsAuthenticated(true)
    }

    const logout = () => {
        removeToken()
        setAuthToken(null)
        setIsAuthenticated(false)
    }

    if (loading) {
        // Puedes mostrar un indicador de carga mientras se valida el token
        return <div>Loading...</div>
    }

    return (
        <AuthContext.Provider value={{ authToken, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider")
    }
    return context
}
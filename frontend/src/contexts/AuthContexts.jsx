import { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode"
import { getToken, setToken, removeToken, setStoredUser, getStoredUser, removeStoredUser } from "../services/auth"

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
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const token = getToken()
        if (token && isTokenValid(token)) {
            setAuthToken(token)
            setIsAuthenticated(true)
            setUser(getStoredUser())
        } else {
            removeToken()
            removeStoredUser()
            setIsAuthenticated(false)
            setUser(null)
        }
        setLoading(false)
    }, [])

    const login = (token) => {
        const decodedUser = jwtDecode(token)
        setToken(token)
        setAuthToken(token)
        setStoredUser(decodedUser)
        setUser(decodedUser)
        setIsAuthenticated(true)
    }

    const logout = () => {
        removeToken()
        removeStoredUser()
        setAuthToken(null)
        setUser(null)
        setIsAuthenticated(false)
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <AuthContext.Provider value={{ authToken, user, login, logout, isAuthenticated }}>
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
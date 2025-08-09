import { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode"
import { getToken, setToken, removeToken, setStoredUser, getStoredUser, removeStoredUser } from "../services/auth"
import axiosInstance from '../services/axiosConfig'

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

    const fetchUserFromAPI = async (token) => {
        try {
            const { data } = await axiosInstance.get("/users/me/", {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUser(data)
            setStoredUser(data)
            setIsAuthenticated(true)
        } catch (error) {
            console.error("Error obteniendo usuario:", error)
            logout()
        }
    }

    useEffect(() => {
        const token = getToken()
        const storedUser = getStoredUser()

        if (token && isTokenValid(token)) {
            setAuthToken(token)
            if (storedUser) {
                setUser(storedUser) // Carga rápida desde localStorage
            }
            fetchUserFromAPI(token) // Actualiza datos desde backend
        } else {
            logout()
        }
        setLoading(false)
    }, [])

    const login = async (token) => {
        setToken(token)
        setAuthToken(token)
        await fetchUserFromAPI(token)
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
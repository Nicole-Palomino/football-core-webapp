import { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode"
import { getToken, setToken, removeToken, setStoredUser, getStoredUser, removeStoredUser } from "../services/auth"
import axiosInstance from '../services/axiosConfig'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

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

const fetchUser = async (token) => {
    const { data } = await axiosInstance.get("/users/me/", {
        headers: { Authorization: `Bearer ${token}` }
    })
    return data
}

export const AuthProvider = ({ children }) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const [authToken, setAuthToken] = useState(() => {
        const token = getToken()
        return (token && isTokenValid(token)) ? token : null
    })

    const { data: user, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: () => fetchUser(authToken),
        enabled: !!authToken,
        initialData: getStoredUser(),
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: true,
        retry: false,
        onSuccess: (data) => {
            setStoredUser(data)
        },
        onError: (err) => {
            console.error("Error al obtener usuario:", err)
            if (err.response?.status === 401) {
                logout()
            }
        },
    })

    useEffect(() => {
        if (authToken) {
            queryClient.invalidateQueries({ queryKey: ['user'] })
        }
    }, [authToken, queryClient])

    /* -------------------------------
       Sincronizar refresh con AuthContext
    -------------------------------- */
    useEffect(() => {
        // interceptor para cuando axios refresque el token
        const interceptor = axiosInstance.interceptors.response.use(
            (res) => res,
            async (error) => {
                const originalRequest = error.config
                if (
                    error.response?.status === 401 &&
                    originalRequest._retry
                ) {
                    // ⚠️ refresh ya falló → cerrar sesión
                    logout()
                }
                return Promise.reject(error)
            }
        )

        return () => {
            axiosInstance.interceptors.response.eject(interceptor)
        }
    }, [])

    // Login → guarda token y refresca usuario
    const login = async (token) => {
        setToken(token)
        setAuthToken(token)
        const userData = await fetchUser(token)
        queryClient.setQueryData(['user'], userData)
        setStoredUser(userData)
    }

    // Logout → limpia todo
    const logout = async () => {
        try {
            await axiosInstance.post("/logout", null, { withCredentials: true })
        } catch (error) {
            console.error("Error al cerrar sesión en backend:", error)
        }

        removeToken()
        removeStoredUser()
        setAuthToken(null)
        queryClient.removeQueries({ queryKey: ['user'] })

        navigate('/get-started')
    }

    if (isLoading && authToken) {
        return <div>Cargando usuario...</div>
    }

    const isAuthenticated = !!authToken

    const value = {
        authToken,
        user,
        login,
        logout,
        isAuthenticated,
        loading: isLoading,
    }

    return (
        <AuthContext.Provider value={value}>
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
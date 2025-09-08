import { useAuth } from '../contexts/AuthContexts'
import AdminPanel from './AdminPanel'

const Dashboard = () => {

    const { user, loading, isAuthenticated } = useAuth()

    if (loading && isAuthenticated) {
        return <div>Cargando usuario...</div>
    }

    if (!user) {
        return <div>No se encontró información del usuario.</div>
    }

    return (
        <div className="h-screen w-full">
            {user.roles?.includes("Administrador") && (
                <AdminPanel />
            )}

            {user.roles?.includes("Usuario") && (
                <p>Este es contenido normal para usuarios.</p>
            )}
        </div>
    )
}

export default Dashboard
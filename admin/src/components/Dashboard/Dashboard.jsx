import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import {
    Users, Users2, Trophy, BarChart3
} from 'lucide-react'
import LoadingSpinner from '../Loading/LoadingSpinner'
import { useStats } from '../../hooks/useStats'
import { useThemeMode } from '../../contexts/ThemeContext'

const Dashboard = () => {
    const { currentTheme } = useThemeMode()
    const contentClasses = `p-6 ${currentTheme.text}`

    const { users, teams, leagues, matches, userStats, isLoading, isError } = useStats()
    console.log(userStats)
    if (isLoading) {
        return (
            <LoadingSpinner />
        )
    }

    return (
        <div className={contentClasses}>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className={`${currentTheme.sidebar} p-6 rounded-lg shadow-sm ${currentTheme.border} border`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`${currentTheme.textSecondary} text-sm`}>Total Usuarios</p>
                            <p className="text-2xl font-bold">
                                {isError ? "—" : users ?? 0}
                            </p>
                        </div>
                        <Users className="h-8 w-8 text-blue-500" />
                    </div>
                </div>
                <div className={`${currentTheme.sidebar} p-6 rounded-lg shadow-sm ${currentTheme.border} border`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`${currentTheme.textSecondary} text-sm`}>Total Equipos</p>
                            <p className="text-2xl font-bold">
                                {isError ? "—" : teams ?? 0}
                            </p>
                        </div>
                        <Users2 className="h-8 w-8 text-green-500" />
                    </div>
                </div>
                <div className={`${currentTheme.sidebar} p-6 rounded-lg shadow-sm ${currentTheme.border} border`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`${currentTheme.textSecondary} text-sm`}>Total Partidos</p>
                            <p className="text-2xl font-bold">
                                {isError ? "—" : matches ?? 0}
                            </p>
                        </div>
                        <Trophy className="h-8 w-8 text-yellow-500" />
                    </div>
                </div>
                <div className={`${currentTheme.sidebar} p-6 rounded-lg shadow-sm ${currentTheme.border} border`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`${currentTheme.textSecondary} text-sm`}>Total Ligas</p>
                            <p className="text-2xl font-bold">
                                {isError ? "—" : leagues ?? 0}
                            </p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-purple-500" />
                    </div>
                </div>
            </div>

            <div className={`${currentTheme.sidebar} p-6 rounded-lg shadow-sm ${currentTheme.border} border mt-8`}>
                <h2 className="text-xl font-semibold mb-4">Usuarios registrados por día</h2>
                <div className="w-full h-80">
                    <ResponsiveContainer>
                    <LineChart data={Array.isArray(userStats) ? userStats : []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="fecha" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="cantidad" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
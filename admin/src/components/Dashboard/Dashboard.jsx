import { useState } from 'react'
import {
    Users, Users2, Trophy, BarChart3
} from 'lucide-react'
import { darkTheme, lightTheme } from '../../utils/themes'
import LoadingSpinner from '../Loading/LoadingSpinner'
import { useStats } from '../../hooks/useStats'
import { useThemeMode } from '../../contexts/ThemeContext'

const Dashboard = () => {
    const { currentTheme } = useThemeMode()
    const contentClasses = `p-6 ${currentTheme.text}`

    const { users, teams, leagues, matches, isLoading, isError } = useStats()

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
            <div className={`${currentTheme.sidebar} p-6 rounded-lg shadow-sm ${currentTheme.border} border`}>
                <h2 className="text-xl font-semibold mb-4">Actividad Reciente</h2>
                <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Nuevo usuario registrado: Juan Pérez</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Partido programado: Equipo A vs Equipo B</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Reporte generado: Estadísticas mensuales</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
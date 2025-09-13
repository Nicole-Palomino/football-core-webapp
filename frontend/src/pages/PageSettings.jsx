import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
    Cog6ToothIcon,
    ChartBarIcon,
    UserCircleIcon,
    CircleStackIcon,
    CpuChipIcon,
    TrashIcon,
    ArrowPathIcon,
    BoltIcon,
    ChartPieIcon,
    SparklesIcon,
    ChartBarSquareIcon
} from '@heroicons/react/24/outline'
import { useThemeMode } from '../contexts/ThemeContext'

const PageSettings = () => {
    const navigate = useNavigate()
    const { currentTheme } = useThemeMode()

    // Estados para información real del sistema
    const [systemInfo, setSystemInfo] = useState({
        cacheSize: 0,
        storageUsed: 0,
        totalStorage: 0,
        tempFiles: 0,
        sessionTime: '0m',
        lastClearTime: null
    })

    const [isClearing, setIsClearing] = useState(false)
    const [sessionStart] = useState(Date.now())

    const getStorageInfo = async () => {
        try {
            if ('storage' in navigator && 'estimate' in navigator.storage) {
                const estimate = await navigator.storage.estimate()
                const usedMB = (estimate.usage || 0) / (1024 * 1024)
                const totalMB = (estimate.quota || 0) / (1024 * 1024)
                return { storageUsed: usedMB, totalStorage: totalMB }
            }
        } catch (error) {
            console.warn('No se pudo obtener información de almacenamiento:', error)
        }
        return { storageUsed: 0, totalStorage: 1024 }
    }

    const getCacheSize = () => {
        let totalSize = 0
        try {
            if (localStorage) {
                totalSize += JSON.stringify(localStorage).length
            }
            if (sessionStorage) {
                totalSize += JSON.stringify(sessionStorage).length
            }
            totalSize += document.cookie.length
        } catch (error) {
            console.warn('Error calculando cache:', error)
        }
        return totalSize / (1024 * 1024)
    }

    const getTempFilesCount = () => {
        try {
            let tempCount = 0
            tempCount += document.querySelectorAll('img').length
            tempCount += document.querySelectorAll('script[src]').length
            tempCount += document.querySelectorAll('link[rel="stylesheet"]').length
            return tempCount
        } catch (error) {
            return 0
        }
    }

    const getSessionTime = () => {
        const now = Date.now()
        const sessionDuration = now - sessionStart
        const minutes = Math.floor(sessionDuration / (1000 * 60))
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = minutes % 60

        if (hours > 0) {
            return `${hours}h ${remainingMinutes}m`
        } else {
            return `${remainingMinutes}m`
        }
    }

    const clearCache = async () => {
        setIsClearing(true)
        try {
            // Clear localStorage cache items
            Object.keys(localStorage).forEach(key => {
                if (key.includes('cache') || key.includes('temp') || key.includes('tmp')) {
                    localStorage.removeItem(key)
                }
            })

            // Clear sessionStorage cache items
            Object.keys(sessionStorage).forEach(key => {
                if (key.includes('cache') || key.includes('temp') || key.includes('tmp')) {
                    sessionStorage.removeItem(key)
                }
            })

            // Clear Cache API
            if ('caches' in window) {
                const cacheNames = await caches.keys()
                await Promise.all(cacheNames.map(name => caches.delete(name)))
            }

            const now = new Date().toLocaleString()
            localStorage.setItem('lastCacheClean', now)

            setTimeout(() => {
                refreshData()
                setIsClearing(false)
            }, 1000)

        } catch (error) {
            console.error('Error limpiando cache:', error)
            setIsClearing(false)
        }
    }

    const refreshData = async () => {
        try {
            const storageInfo = await getStorageInfo()
            const cacheSize = getCacheSize()
            const tempFiles = getTempFilesCount()
            const sessionTime = getSessionTime()
            const lastClearTime = localStorage.getItem('lastCacheClean')

            setSystemInfo({
                cacheSize,
                storageUsed: storageInfo.storageUsed,
                totalStorage: storageInfo.totalStorage,
                tempFiles,
                sessionTime,
                lastClearTime
            })
        } catch (error) {
            console.error('Error actualizando datos:', error)
        }
    }

    useEffect(() => {
        refreshData()
    }, [])

    const storagePercentage = systemInfo.totalStorage > 0
        ? (systemInfo.storageUsed / systemInfo.totalStorage) * 100
        : 0

    return (
        <div className={`min-h-screen ${currentTheme.background} pb-24`}>
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-6 mb-6`}
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-xl">
                                <Cog6ToothIcon className="w-10 h-10 text-blue-500" />
                            </div>
                            <div>
                                <h1 className={`${currentTheme.text} text-2xl sm:text-3xl font-bold`}>
                                    Configuración del Sistema
                                </h1>
                                <p className={`${currentTheme.textSecondary} text-sm`}>
                                    Información y limpieza del sistema
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/dashboard')}
                                className="p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500/20 transition-colors"
                                title="Dashboard"
                            >
                                <ChartBarIcon className="w-5 h-5" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/dashboard/profile')}
                                className="p-3 bg-yellow-500/10 text-yellow-500 rounded-xl hover:bg-yellow-500/20 transition-colors"
                                title="Mi Perfil"
                            >
                                <UserCircleIcon className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Storage Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className={`${currentTheme.card} ${currentTheme.border} border rounded-xl overflow-hidden relative`}
                    >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <CircleStackIcon className="w-7 h-7 text-blue-500" />
                                <h3 className={`${currentTheme.text} text-lg font-semibold`}>
                                    Almacenamiento
                                </h3>
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className={`${currentTheme.textSecondary} text-sm`}>
                                        Espacio usado
                                    </span>
                                    <span className="text-blue-500 font-semibold text-sm">
                                        {systemInfo.storageUsed.toFixed(1)} / {systemInfo.totalStorage} MB
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${storagePercentage > 80 ? 'bg-red-500' : 'bg-blue-500'
                                            }`}
                                        style={{ width: `${storagePercentage.toFixed(1)}%` }}
                                    ></div>
                                </div>
                                <p className={`${currentTheme.textSecondary} text-xs mt-1`}>
                                    {storagePercentage.toFixed(1)}% utilizado
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-500/10 rounded-xl text-center">
                                    <ChartPieIcon className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                    <div className="text-blue-500 font-bold text-lg">
                                        {systemInfo.cacheSize.toFixed(1)} MB
                                    </div>
                                    <div className={`${currentTheme.textSecondary} text-xs`}>
                                        Cache
                                    </div>
                                </div>

                                <div className="p-4 bg-orange-500/10 rounded-xl text-center">
                                    <ChartBarSquareIcon className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                                    <div className="text-orange-500 font-bold text-lg">
                                        {systemInfo.tempFiles}
                                    </div>
                                    <div className={`${currentTheme.textSecondary} text-xs`}>
                                        Archivos temp.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* System Status Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className={`${currentTheme.card} ${currentTheme.border} border rounded-xl overflow-hidden relative`}
                    >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <BoltIcon className="w-7 h-7 text-green-500" />
                                <h3 className={`${currentTheme.text} text-lg font-semibold`}>
                                    Estado del Sistema
                                </h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-xl">
                                    <CpuChipIcon className="w-6 h-6 text-green-500" />
                                    <div>
                                        <div className={`${currentTheme.text} font-semibold`}>
                                            Tiempo de sesión
                                        </div>
                                        <div className="text-green-500 text-sm">
                                            {systemInfo.sessionTime}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className={`${currentTheme.text} text-sm`}>
                                            Sistema funcionando correctamente
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* System Cleanup Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={`${currentTheme.card} ${currentTheme.border} border rounded-xl overflow-hidden relative mt-6`}
                >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <SparklesIcon className="w-7 h-7 text-red-500" />
                            <h3 className={`${currentTheme.text} text-lg font-semibold`}>
                                Limpieza del Sistema
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={clearCache}
                                disabled={isClearing}
                                className={`p-4 border-2 border-red-500/20 text-red-500 rounded-xl hover:bg-red-500/10 transition-all duration-200 flex items-center gap-3 ${isClearing ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isClearing ? (
                                    <div className="w-5 h-5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                                ) : (
                                    <TrashIcon className="w-5 h-5" />
                                )}
                                <span className="font-semibold">
                                    {isClearing ? 'Limpiando...' : 'Limpiar Cache'}
                                </span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={refreshData}
                                className="p-4 border-2 border-blue-500/20 text-blue-500 rounded-xl hover:bg-blue-500/10 transition-all duration-200 flex items-center gap-3"
                            >
                                <ArrowPathIcon className="w-5 h-5" />
                                <span className="font-semibold">Actualizar Datos</span>
                            </motion.button>

                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center">
                                <div className={`${currentTheme.text} text-sm`}>
                                    {systemInfo.lastClearTime
                                        ? `Última limpieza: ${systemInfo.lastClearTime}`
                                        : 'No se ha realizado limpieza'
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default PageSettings
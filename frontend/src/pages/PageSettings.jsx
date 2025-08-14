import { useState, useEffect } from 'react'
import {
    Box, Card, CardContent, Container, Typography, Grid,
    IconButton, Button, Tooltip, useTheme, LinearProgress, Alert
} from '@mui/material'
import {
    Settings as SettingsIcon, Dashboard as DashboardIcon, AccountCircle as AccountIcon, Storage as StorageIcon,
    Memory as MemoryIcon, Delete as DeleteIcon, Refresh as RefreshIcon, Speed as SpeedIcon, DataUsage as DataUsageIcon,
    ClearAll as ClearAllIcon, Assessment as AssessmentIcon
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const PageSettings = () => {
    const theme = useTheme()
    const navigate = useNavigate()

    // Estados para información real del sistema
    const [systemInfo, setSystemInfo] = useState({
        cacheSize: 0, // MB
        storageUsed: 0, // MB
        totalStorage: 0, // MB
        tempFiles: 0,
        sessionTime: '0m',
        lastClearTime: null
    })

    const [isClearing, setIsClearing] = useState(false)
    const [sessionStart] = useState(Date.now())

    // Función para obtener información real del almacenamiento
    const getStorageInfo = async () => {
        try {
            if ('storage' in navigator && 'estimate' in navigator.storage) {
                const estimate = await navigator.storage.estimate()
                const usedMB = (estimate.usage || 0) / (1024 * 1024)
                const totalMB = (estimate.quota || 0) / (1024 * 1024)

                return {
                    storageUsed: usedMB,
                    totalStorage: totalMB
                }
            }
        } catch (error) {
            console.warn('No se pudo obtener información de almacenamiento:', error)
        }

        // Fallback si no está disponible
        return {
            storageUsed: 0,
            totalStorage: 1024 // 1GB por defecto
        }
    }

    // Función para calcular el tamaño del cache
    const getCacheSize = () => {
        let totalSize = 0

        try {
            // LocalStorage
            if (localStorage) {
                const localStorageSize = JSON.stringify(localStorage).length
                totalSize += localStorageSize
            }

            // SessionStorage
            if (sessionStorage) {
                const sessionStorageSize = JSON.stringify(sessionStorage).length
                totalSize += sessionStorageSize
            }

            // Cookies
            const cookieSize = document.cookie.length
            totalSize += cookieSize

        } catch (error) {
            console.warn('Error calculando cache:', error)
        }

        return totalSize / (1024 * 1024) // Convertir a MB
    }

    // Función para contar archivos temporales (aproximación basada en elementos del DOM y cache)
    const getTempFilesCount = () => {
        try {
            let tempCount = 0

            // Contar elementos img cacheados
            const images = document.querySelectorAll('img')
            tempCount += images.length

            // Contar elementos de script externos
            const scripts = document.querySelectorAll('script[src]')
            tempCount += scripts.length

            // Contar hojas de estilo externas
            const styles = document.querySelectorAll('link[rel="stylesheet"]')
            tempCount += styles.length

            return tempCount
        } catch (error) {
            return 0
        }
    }

    // Función para calcular tiempo de sesión
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

    // Función para limpiar caché real
    const clearCache = async () => {
        setIsClearing(true)

        try {
            // Limpiar localStorage
            const localStorageKeys = Object.keys(localStorage)
            localStorageKeys.forEach(key => {
                // Solo limpiar caches, no datos importantes como tokens
                if (key.includes('cache') || key.includes('temp') || key.includes('tmp')) {
                    localStorage.removeItem(key)
                }
            })

            // Limpiar sessionStorage
            const sessionKeys = Object.keys(sessionStorage)
            sessionKeys.forEach(key => {
                if (key.includes('cache') || key.includes('temp') || key.includes('tmp')) {
                    sessionStorage.removeItem(key)
                }
            })

            // Limpiar Cache API si está disponible
            if ('caches' in window) {
                const cacheNames = await caches.keys()
                await Promise.all(
                    cacheNames.map(name => caches.delete(name))
                )
            }

            // Forzar garbage collection si está disponible (solo en desarrollo)
            if (window.gc) {
                window.gc()
            }

            // Actualizar timestamp de última limpieza
            const now = new Date().toLocaleString()
            localStorage.setItem('lastCacheClean', now)

            // Actualizar datos después de limpiar
            setTimeout(() => {
                refreshData()
                setIsClearing(false)
            }, 1000)

        } catch (error) {
            console.error('Error limpiando cache:', error)
            setIsClearing(false)
        }
    }

    // Función para refrescar datos reales
    const refreshData = async () => {
        try {
            const storageInfo = await getStorageInfo()
            const cacheSize = getCacheSize()
            const tempFiles = getTempFilesCount()
            const sessionTime = getSessionTime()
            const lastClearTime = localStorage.getItem('lastCacheClean')

            setSystemInfo({
                cacheSize: cacheSize,
                storageUsed: storageInfo.storageUsed,
                totalStorage: storageInfo.totalStorage,
                tempFiles: tempFiles,
                sessionTime: sessionTime,
                lastClearTime: lastClearTime
            })
        } catch (error) {
            console.error('Error actualizando datos:', error)
        }
    }

    // Cargar datos reales al montar el componente
    useEffect(() => {
        refreshData()
    }, [])

    // Calcular porcentaje de almacenamiento usado
    const storagePercentage = systemInfo.totalStorage > 0
        ? (systemInfo.storageUsed / systemInfo.totalStorage) * 100 // sin toFixed aquí
        : 0

    return (
        <Box sx={{
            minHeight: "100vh",
            background: theme.palette.background.default,
            mb: 6
        }}>
            <Container maxWidth="lg" sx={{ py: { xs: 1, md: 2 } }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        mb: 4,
                        p: 2,
                        bgcolor: theme.palette.background.default,
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.text.secondary}`,
                        gap: { xs: 2, sm: 0 }
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <SettingsIcon sx={{ color: theme.palette.primary.main, fontSize: 40 }} />
                            <Box>
                                <Typography variant="h4" sx={{
                                    color: theme.palette.text.primary,
                                    fontWeight: 'bold',
                                    fontSize: { xs: '1.5rem', sm: '2rem' }
                                }}>
                                    Configuración del Sistema
                                </Typography>
                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                    Información y limpieza del sistema
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Dashboard" arrow>
                                <IconButton
                                    onClick={() => navigate('/dashboard')}
                                    sx={{
                                        color: '#368FF4',
                                        bgcolor: 'rgba(54,143,244,0.1)',
                                        '&:hover': {
                                            bgcolor: 'rgba(54,143,244,0.2)',
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                >
                                    <DashboardIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Mi Perfil" arrow>
                                <IconButton
                                    onClick={() => navigate('/dashboard/profile')}
                                    sx={{
                                        color: '#FFD700',
                                        bgcolor: 'rgba(255,215,0,0.1)',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,215,0,0.2)',
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                >
                                    <AccountIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                </motion.div>

                <Grid container spacing={3}>
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: { md: '100%', xs: '100%' }
                        }}
                    >
                        <Grid className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Card sx={{
                                    backgroundColor: theme.palette.background.default,
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    position: 'relative',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '4px',
                                        background: 'linear-gradient(90deg, #368FF4, #1755FF)'
                                    }
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <StorageIcon sx={{ color: '#368FF4', mr: 2, fontSize: 28 }} />
                                            <Typography variant="h6" sx={{
                                                color: theme.palette.text.primary,
                                                fontWeight: 'bold'
                                            }}>
                                                Almacenamiento
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 3 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                    Espacio usado
                                                </Typography>
                                                <Typography variant="body2" sx={{
                                                    color: theme.palette.primary.main,
                                                    fontWeight: 'bold'
                                                }}>
                                                    {systemInfo.storageUsed.toFixed(1)} / {systemInfo.totalStorage} MB
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={Number(storagePercentage.toFixed(1))}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    bgcolor: 'rgba(255,255,255,0.1)',
                                                    '& .MuiLinearProgress-bar': {
                                                        bgcolor: storagePercentage > 80 ? '#FF4444' : '#368FF4',
                                                        borderRadius: 4
                                                    }
                                                }}
                                            />
                                            <Typography variant="caption" sx={{
                                                color: theme.palette.text.secondary,
                                                display: 'block',
                                                mt: 1
                                            }}>
                                                {storagePercentage.toFixed(1)}% utilizado
                                            </Typography>
                                        </Box>

                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Box sx={{
                                                    p: 2,
                                                    bgcolor: 'rgba(54,143,244,0.1)',
                                                    borderRadius: 2,
                                                    textAlign: 'center'
                                                }}>
                                                    <DataUsageIcon sx={{ color: '#368FF4', mb: 1 }} />
                                                    <Typography variant="h6" sx={{
                                                        color: '#368FF4',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {systemInfo.cacheSize.toFixed(1)} MB
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                                        Cache
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Box sx={{
                                                    p: 2,
                                                    bgcolor: 'rgba(255,152,0,0.1)',
                                                    borderRadius: 2,
                                                    textAlign: 'center'
                                                }}>
                                                    <AssessmentIcon sx={{ color: '#FF9800', mb: 1 }} />
                                                    <Typography variant="h6" sx={{
                                                        color: '#FF9800',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {systemInfo.tempFiles}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                                        Archivos temp.
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                            >
                                <Card sx={{
                                    backgroundColor: theme.palette.background.default,
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    position: 'relative',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '4px',
                                        background: 'linear-gradient(90deg, #4CAF50, #2E7D32)'
                                    }
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <SpeedIcon sx={{ color: '#4CAF50', mr: 2, fontSize: 28 }} />
                                            <Typography variant="h6" sx={{
                                                color: theme.palette.text.primary,
                                                fontWeight: 'bold'
                                            }}>
                                                Estado del Sistema
                                            </Typography>
                                        </Box>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    p: 2,
                                                    bgcolor: 'rgba(76,175,80,0.1)',
                                                    borderRadius: 2,
                                                    mb: 2
                                                }}>
                                                    <MemoryIcon sx={{ color: '#4CAF50', mr: 2 }} />
                                                    <Box>
                                                        <Typography variant="body1" sx={{
                                                            color: theme.palette.text.primary,
                                                            fontWeight: 'bold'
                                                        }}>
                                                            Tiempo de sesión
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: '#4CAF50' }}>
                                                            {systemInfo.sessionTime}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Alert
                                                    severity="success"
                                                    sx={{
                                                        bgcolor: 'rgba(76,175,80,0.1)',
                                                        border: '1px solid rgba(76,175,80,0.3)',
                                                        color: theme.palette.text.primary,
                                                        '& .MuiAlert-icon': {
                                                            color: '#4CAF50'
                                                        }
                                                    }}
                                                >
                                                    Sistema funcionando correctamente
                                                </Alert>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>

                        <Grid className="grid grid-cols-1 gap-4 mt-5">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <Card sx={{
                                    backgroundColor: theme.palette.background.default,
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    position: 'relative',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '4px',
                                        background: 'linear-gradient(90deg, #FF6B6B, #FF4444)'
                                    }
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <ClearAllIcon sx={{ color: '#FF6B6B', mr: 2, fontSize: 28 }} />
                                            <Typography variant="h6" sx={{
                                                color: theme.palette.text.primary,
                                                fontWeight: 'bold'
                                            }}>
                                                Limpieza del Sistema
                                            </Typography>
                                        </Box>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    startIcon={isClearing ? <LinearProgress sx={{ width: 20, height: 20 }} /> : <DeleteIcon />}
                                                    onClick={clearCache}
                                                    disabled={isClearing}
                                                    sx={{
                                                        color: '#FF6B6B',
                                                        borderColor: '#FF6B6B',
                                                        '&:hover': {
                                                            bgcolor: 'rgba(255,107,107,0.1)',
                                                            borderColor: '#FF6B6B',
                                                        },
                                                        '&:disabled': {
                                                            color: 'rgba(255,107,107,0.5)',
                                                            borderColor: 'rgba(255,107,107,0.3)',
                                                        },
                                                        py: 1.5
                                                    }}
                                                >
                                                    {isClearing ? 'Limpiando...' : 'Limpiar Cache'}
                                                </Button>
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={4}>
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    startIcon={<RefreshIcon />}
                                                    onClick={refreshData}
                                                    sx={{
                                                        color: '#368FF4',
                                                        borderColor: '#368FF4',
                                                        '&:hover': {
                                                            bgcolor: 'rgba(54,143,244,0.1)',
                                                            borderColor: '#368FF4',
                                                        },
                                                        py: 1.5
                                                    }}
                                                >
                                                    Actualizar Datos
                                                </Button>
                                            </Grid>

                                            <Grid item xs={12} sm={12} md={4}>
                                                <Alert
                                                    severity="info"
                                                    sx={{
                                                        bgcolor: 'rgba(54,143,244,0.1)',
                                                        border: '1px solid rgba(54,143,244,0.3)',
                                                        color: theme.palette.text.primary,
                                                        '& .MuiAlert-icon': {
                                                            color: '#368FF4'
                                                        },
                                                        height: '100%',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    {systemInfo.lastClearTime
                                                        ? `Última limpieza: ${systemInfo.lastClearTime}`
                                                        : 'No se ha realizado limpieza'
                                                    }
                                                </Alert>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default PageSettings
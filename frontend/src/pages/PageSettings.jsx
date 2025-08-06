import { useState, useEffect } from 'react'
import { 
    Box, 
    Card, 
    CardContent, 
    Container, 
    Typography, 
    Grid, 
    Switch,
    Slider,
    Button,
    Select,
    MenuItem,
    IconButton,
    Tooltip,
    Alert,
    Snackbar,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material'
import {
    Settings as SettingsIcon,
    Palette as PaletteIcon,
    Notifications as NotificationsIcon,
    VolumeUp as VolumeUpIcon,
    Language as LanguageIcon,
    Accessibility as AccessibilityIcon,
    Security as SecurityIcon,
    Storage as StorageIcon,
    Speed as SpeedIcon,
    Brightness4 as Brightness4Icon,
    Brightness7 as Brightness7Icon,
    ExpandMore as ExpandMoreIcon,
    RestoreFromTrash as RestoreFromTrashIcon,
    Save as SaveIcon,
    Refresh as RefreshIcon,
    Dashboard as DashboardIcon,
    Person as PersonIcon,
    ArrowBack as ArrowBackIcon,
    Info as InfoIcon,
    Warning as WarningIcon,
    Vibration as VibrationIcon,
    Mouse as MouseIcon,
    Keyboard as KeyboardIcon,
    ScreenRotation as ScreenRotationIcon,
    Fullscreen as FullscreenIcon,
    Timer as TimerIcon,
    Animation as AnimationIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const PageSettings = () => {
    const navigate = useNavigate()
    const [hoveredCard, setHoveredCard] = useState(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const [hasChanges, setHasChanges] = useState(false)

    // Estados para las configuraciones
    const [settings, setSettings] = useState({
        // Configuraciones de Interfaz
        theme: localStorage.getItem('theme') || 'dark',
        language: localStorage.getItem('language') || 'es',
        fontSize: parseInt(localStorage.getItem('fontSize')) || 16,
        animationsEnabled: localStorage.getItem('animationsEnabled') !== 'false',
        compactMode: localStorage.getItem('compactMode') === 'true',
        highContrast: localStorage.getItem('highContrast') === 'true',
        
        // Configuraciones de Notificaciones
        notificationsEnabled: localStorage.getItem('notificationsEnabled') !== 'false',
        soundEnabled: localStorage.getItem('soundEnabled') !== 'false',
        vibrationEnabled: localStorage.getItem('vibrationEnabled') !== 'false',
        desktopNotifications: localStorage.getItem('desktopNotifications') === 'true',
        emailNotifications: localStorage.getItem('emailNotifications') !== 'false',
        
        // Configuraciones de Audio
        masterVolume: parseInt(localStorage.getItem('masterVolume')) || 70,
        notificationVolume: parseInt(localStorage.getItem('notificationVolume')) || 50,
        
        // Configuraciones de Rendimiento
        autoRefresh: localStorage.getItem('autoRefresh') !== 'false',
        refreshInterval: parseInt(localStorage.getItem('refreshInterval')) || 30,
        loadImages: localStorage.getItem('loadImages') !== 'false',
        preloadData: localStorage.getItem('preloadData') === 'true',
        
        // Configuraciones de Privacidad
        shareAnalytics: localStorage.getItem('shareAnalytics') === 'true',
        showOnlineStatus: localStorage.getItem('showOnlineStatus') !== 'false',
        allowCookies: localStorage.getItem('allowCookies') !== 'false',
        
        // Configuraciones de Accesibilidad
        screenReader: localStorage.getItem('screenReader') === 'true',
        keyboardNavigation: localStorage.getItem('keyboardNavigation') === 'true',
        focusIndicators: localStorage.getItem('focusIndicators') !== 'false',
        reducedMotion: localStorage.getItem('reducedMotion') === 'true'
    })

    // Detectar cambios en la configuración
    useEffect(() => {
        const defaultSettings = {
            theme: 'dark',
            language: 'es',
            fontSize: 16,
            animationsEnabled: true,
            compactMode: false,
            highContrast: false,
            notificationsEnabled: true,
            soundEnabled: true,
            vibrationEnabled: false,
            desktopNotifications: false,
            emailNotifications: true,
            masterVolume: 70,
            notificationVolume: 50,
            autoRefresh: true,
            refreshInterval: 30,
            loadImages: true,
            preloadData: false,
            shareAnalytics: false,
            showOnlineStatus: true,
            allowCookies: true,
            screenReader: false,
            keyboardNavigation: true,
            focusIndicators: true,
            reducedMotion: false
        }

        const hasChanged = Object.keys(settings).some(key => 
            settings[key] !== defaultSettings[key]
        )
        setHasChanges(hasChanged)
    }, [settings])

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const saveSettings = () => {
        Object.keys(settings).forEach(key => {
            localStorage.setItem(key, settings[key].toString())
        })
        
        setSnackbar({
            open: true,
            message: '¡Configuraciones guardadas exitosamente!',
            severity: 'success'
        })
        setHasChanges(false)
    }

    const resetSettings = () => {
        const defaultSettings = {
            theme: 'dark',
            language: 'es',
            fontSize: 16,
            animationsEnabled: true,
            compactMode: false,
            highContrast: false,
            notificationsEnabled: true,
            soundEnabled: true,
            vibrationEnabled: false,
            desktopNotifications: false,
            emailNotifications: true,
            masterVolume: 70,
            notificationVolume: 50,
            autoRefresh: true,
            refreshInterval: 30,
            loadImages: true,
            preloadData: false,
            shareAnalytics: false,
            showOnlineStatus: true,
            allowCookies: true,
            screenReader: false,
            keyboardNavigation: true,
            focusIndicators: true,
            reducedMotion: false
        }

        setSettings(defaultSettings)
        setSnackbar({
            open: true,
            message: 'Configuraciones restablecidas a valores por defecto',
            severity: 'info'
        })
    }

    const clearCache = () => {
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name)
                })
            })
        }
        
        setSnackbar({
            open: true,
            message: 'Caché del navegador limpiada exitosamente',
            severity: 'success'
        })
    }

    const getStorageUsage = () => {
        let total = 0
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length
            }
        }
        return (total / 1024).toFixed(2) // KB
    }

    const settingSections = [
        {
            id: 'interface',
            title: 'Interfaz y Apariencia',
            icon: PaletteIcon,
            color: '#368FF4',
            settings: [
                {
                    key: 'theme',
                    label: 'Tema de la aplicación',
                    type: 'select',
                    options: [
                        { value: 'dark', label: 'Oscuro' },
                        { value: 'light', label: 'Claro' },
                        { value: 'auto', label: 'Automático' }
                    ],
                    icon: settings.theme === 'dark' ? Brightness4Icon : Brightness7Icon
                },
                {
                    key: 'fontSize',
                    label: `Tamaño de fuente: ${settings.fontSize}px`,
                    type: 'slider',
                    min: 12,
                    max: 24,
                    icon: LanguageIcon
                },
                {
                    key: 'animationsEnabled',
                    label: 'Habilitar animaciones',
                    type: 'switch',
                    icon: AnimationIcon
                },
                {
                    key: 'compactMode',
                    label: 'Modo compacto',
                    type: 'switch',
                    icon: ScreenRotationIcon
                },
                {
                    key: 'highContrast',
                    label: 'Alto contraste',
                    type: 'switch',
                    icon: AccessibilityIcon
                }
            ]
        },
        {
            id: 'notifications',
            title: 'Notificaciones',
            icon: NotificationsIcon,
            color: '#FFD700',
            settings: [
                {
                    key: 'notificationsEnabled',
                    label: 'Habilitar notificaciones',
                    type: 'switch',
                    icon: NotificationsIcon
                },
                {
                    key: 'soundEnabled',
                    label: 'Sonidos de notificación',
                    type: 'switch',
                    icon: VolumeUpIcon
                },
                {
                    key: 'vibrationEnabled',
                    label: 'Vibración (móvil)',
                    type: 'switch',
                    icon: VibrationIcon
                },
                {
                    key: 'desktopNotifications',
                    label: 'Notificaciones del navegador',
                    type: 'switch',
                    icon: InfoIcon
                },
                {
                    key: 'emailNotifications',
                    label: 'Notificaciones por email',
                    type: 'switch',
                    icon: InfoIcon
                }
            ]
        },
        {
            id: 'audio',
            title: 'Audio',
            icon: VolumeUpIcon,
            color: '#FF6B6B',
            settings: [
                {
                    key: 'masterVolume',
                    label: `Volumen general: ${settings.masterVolume}%`,
                    type: 'slider',
                    min: 0,
                    max: 100,
                    icon: VolumeUpIcon
                },
                {
                    key: 'notificationVolume',
                    label: `Volumen de notificaciones: ${settings.notificationVolume}%`,
                    type: 'slider',
                    min: 0,
                    max: 100,
                    icon: NotificationsIcon
                }
            ]
        },
        {
            id: 'performance',
            title: 'Rendimiento',
            icon: SpeedIcon,
            color: '#8A2BE2',
            settings: [
                {
                    key: 'autoRefresh',
                    label: 'Actualización automática',
                    type: 'switch',
                    icon: RefreshIcon
                },
                {
                    key: 'refreshInterval',
                    label: `Intervalo de actualización: ${settings.refreshInterval}s`,
                    type: 'slider',
                    min: 10,
                    max: 300,
                    icon: TimerIcon
                },
                {
                    key: 'loadImages',
                    label: 'Cargar imágenes automáticamente',
                    type: 'switch',
                    icon: InfoIcon
                },
                {
                    key: 'preloadData',
                    label: 'Precargar datos',
                    type: 'switch',
                    icon: StorageIcon
                }
            ]
        },
        {
            id: 'privacy',
            title: 'Privacidad',
            icon: SecurityIcon,
            color: '#FF4444',
            settings: [
                {
                    key: 'shareAnalytics',
                    label: 'Compartir datos de análisis',
                    type: 'switch',
                    icon: SecurityIcon
                },
                {
                    key: 'showOnlineStatus',
                    label: 'Mostrar estado en línea',
                    type: 'switch',
                    icon: PersonIcon
                },
                {
                    key: 'allowCookies',
                    label: 'Permitir cookies',
                    type: 'switch',
                    icon: StorageIcon
                }
            ]
        },
        {
            id: 'accessibility',
            title: 'Accesibilidad',
            icon: AccessibilityIcon,
            color: '#00BCD4',
            settings: [
                {
                    key: 'screenReader',
                    label: 'Soporte para lectores de pantalla',
                    type: 'switch',
                    icon: AccessibilityIcon
                },
                {
                    key: 'keyboardNavigation',
                    label: 'Navegación por teclado',
                    type: 'switch',
                    icon: KeyboardIcon
                },
                {
                    key: 'focusIndicators',
                    label: 'Indicadores de enfoque',
                    type: 'switch',
                    icon: MouseIcon
                },
                {
                    key: 'reducedMotion',
                    label: 'Reducir movimiento',
                    type: 'switch',
                    icon: AnimationIcon
                }
            ]
        }
    ]

    const renderSettingControl = (setting) => {
        const IconComponent = setting.icon

        switch (setting.type) {
            case 'switch':
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconComponent sx={{ color: '#368FF4', fontSize: 20 }} />
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ color: 'white', fontWeight: '500' }}>
                                {setting.label}
                            </Typography>
                        </Box>
                        <Switch
                            checked={settings[setting.key]}
                            onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#368FF4',
                                    '&:hover': {
                                        backgroundColor: 'rgba(54,143,244,0.08)',
                                    },
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#368FF4',
                                },
                                '& .MuiSwitch-track': {
                                    backgroundColor: '#555'
                                }
                            }}
                        />
                    </Box>
                )

            case 'slider':
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconComponent sx={{ color: '#368FF4', fontSize: 20 }} />
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ color: 'white', fontWeight: '500', mb: 1 }}>
                                {setting.label}
                            </Typography>
                            <Slider
                                value={settings[setting.key]}
                                onChange={(e, value) => handleSettingChange(setting.key, value)}
                                min={setting.min}
                                max={setting.max}
                                sx={{
                                    color: '#368FF4',
                                    '& .MuiSlider-thumb': {
                                        backgroundColor: '#368FF4',
                                        '&:hover': {
                                            boxShadow: '0 0 0 8px rgba(54,143,244,0.16)'
                                        }
                                    },
                                    '& .MuiSlider-track': {
                                        backgroundColor: '#368FF4'
                                    },
                                    '& .MuiSlider-rail': {
                                        backgroundColor: '#555'
                                    }
                                }}
                            />
                        </Box>
                    </Box>
                )

            case 'select':
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconComponent sx={{ color: '#368FF4', fontSize: 20 }} />
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ color: 'white', fontWeight: '500', mb: 1 }}>
                                {setting.label}
                            </Typography>
                            <Select
                                value={settings[setting.key]}
                                onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                                fullWidth
                                size="small"
                                sx={{
                                    color: 'white',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#555'
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#368FF4'
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#368FF4'
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: 'white'
                                    }
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            bgcolor: '#1a1a1a',
                                            border: '1px solid #333'
                                        }
                                    }
                                }}
                            >
                                {setting.options.map(option => (
                                    <MenuItem 
                                        key={option.value} 
                                        value={option.value}
                                        sx={{ color: 'white' }}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                    </Box>
                )

            default:
                return null
        }
    }

    return (
        <Box sx={{ 
            bgcolor: "#0a0a0a", 
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)"
        }}>
            <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 4,
                        p: 2,
                        bgcolor: 'rgba(255,255,255,0.05)',
                        borderRadius: 3,
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconButton 
                                onClick={() => navigate(-1)}
                                sx={{ 
                                    color: '#368FF4',
                                    bgcolor: 'rgba(54,143,244,0.1)',
                                    '&:hover': { 
                                        bgcolor: 'rgba(54,143,244,0.2)',
                                        transform: 'scale(1.1)'
                                    }
                                }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                            <SettingsIcon sx={{ color: '#368FF4', fontSize: 40 }} />
                            <Box>
                                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                                    Configuraciones
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#888' }}>
                                    Personaliza tu experiencia
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {hasChanges && (
                                <Tooltip title="Hay cambios sin guardar" arrow>
                                    <Chip 
                                        label="Cambios pendientes"
                                        icon={<WarningIcon />}
                                        sx={{
                                            bgcolor: 'rgba(255,215,0,0.1)',
                                            color: '#FFD700',
                                            border: '1px solid rgba(255,215,0,0.3)'
                                        }}
                                    />
                                </Tooltip>
                            )}

                            <Tooltip title="Restablecer configuraciones" arrow>
                                <IconButton 
                                    onClick={resetSettings}
                                    sx={{ 
                                        color: '#FF6B6B',
                                        bgcolor: 'rgba(255,107,107,0.1)',
                                        '&:hover': { 
                                            bgcolor: 'rgba(255,107,107,0.2)',
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                >
                                    <RestoreFromTrashIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Guardar configuraciones" arrow>
                                <IconButton 
                                    onClick={saveSettings}
                                    disabled={!hasChanges}
                                    sx={{ 
                                        color: hasChanges ? '#4CAF50' : '#666',
                                        bgcolor: hasChanges ? 'rgba(76,175,80,0.1)' : 'rgba(102,102,102,0.1)',
                                        '&:hover': hasChanges ? { 
                                            bgcolor: 'rgba(76,175,80,0.2)',
                                            transform: 'scale(1.1)'
                                        } : {}
                                    }}
                                >
                                    <SaveIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                </motion.div>

                <Grid container spacing={4}>
                    {/* Configuraciones principales */}
                    <Grid item xs={12} lg={9}>
                        <Grid container spacing={3}>
                            {settingSections.map((section, index) => {
                                const IconComponent = section.icon
                                return (
                                    <Grid item xs={12} key={section.id}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: index * 0.1 }}
                                        >
                                            <Accordion
                                                defaultExpanded={index === 0}
                                                sx={{
                                                    bgcolor: '#1a1a1a',
                                                    border: '1px solid #333',
                                                    borderRadius: 3,
                                                    '&:before': { display: 'none' },
                                                    '&.Mui-expanded': {
                                                        border: `2px solid ${section.color}`,
                                                        boxShadow: `0 10px 30px ${section.color}20`
                                                    }
                                                }}
                                            >
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                                                    sx={{
                                                        bgcolor: `${section.color}10`,
                                                        borderBottom: '1px solid #333',
                                                        '&.Mui-expanded': {
                                                            minHeight: 64
                                                        },
                                                        '& .MuiAccordionSummary-content': {
                                                            alignItems: 'center'
                                                        }
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <IconComponent sx={{ color: section.color, fontSize: 28 }} />
                                                        <Typography variant="h6" sx={{ 
                                                            color: 'white', 
                                                            fontWeight: 'bold' 
                                                        }}>
                                                            {section.title}
                                                        </Typography>
                                                        <Chip 
                                                            label={section.settings.length}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: `${section.color}30`,
                                                                color: section.color,
                                                                fontWeight: 'bold'
                                                            }}
                                                        />
                                                    </Box>
                                                </AccordionSummary>
                                                
                                                <AccordionDetails sx={{ p: 3 }}>
                                                    <Grid container spacing={3}>
                                                        {section.settings.map(setting => (
                                                            <Grid item xs={12} key={setting.key}>
                                                                <Card sx={{
                                                                    bgcolor: 'rgba(255,255,255,0.02)',
                                                                    border: '1px solid rgba(255,255,255,0.08)',
                                                                    borderRadius: 2,
                                                                    transition: 'all 0.3s ease',
                                                                    '&:hover': {
                                                                        bgcolor: 'rgba(255,255,255,0.05)',
                                                                        border: `1px solid ${section.color}50`
                                                                    }
                                                                }}>
                                                                    <CardContent sx={{ p: 2 }}>
                                                                        {renderSettingControl(setting)}
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>
                                                        ))}
                                                    </Grid>
                                                </AccordionDetails>
                                            </Accordion>
                                        </motion.div>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Grid>

                    {/* Panel lateral con información del sistema */}
                    <Grid item xs={12} lg={3}>
                        <Grid container spacing={3}>
                            {/* Información del sistema */}
                            <Grid item xs={12}>
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <Card sx={{
                                        bgcolor: '#1a1a1a',
                                        border: '1px solid #333',
                                        borderRadius: 4,
                                        position: 'relative',
                                        overflow: 'hidden',
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
                                            <Typography variant="h6" sx={{ 
                                                color: 'white', 
                                                mb: 3, 
                                                fontWeight: 'bold',
                                                textAlign: 'center'
                                            }}>
                                                Información del Sistema
                                            </Typography>
                                            
                                            <List sx={{ p: 0 }}>
                                                <ListItem sx={{ px: 0 }}>
                                                    <ListItemIcon>
                                                        <StorageIcon sx={{ color: '#368FF4' }} />
                                                    </ListItemIcon>
                                                    <ListItemText 
                                                        primary="Almacenamiento usado"
                                                        secondary={`${getStorageUsage()} KB`}
                                                        primaryTypographyProps={{ color: 'white', fontSize: '0.9rem' }}
                                                        secondaryTypographyProps={{ color: '#888' }}
                                                    />
                                                </ListItem>

                                                <ListItem sx={{ px: 0 }}>
                                                    <ListItemIcon>
                                                        <LanguageIcon sx={{ color: '#FFD700' }} />
                                                    </ListItemIcon>
                                                    <ListItemText 
                                                        primary="Idioma del navegador"
                                                        secondary={navigator.language || 'No disponible'}
                                                        primaryTypographyProps={{ color: 'white', fontSize: '0.9rem' }}
                                                        secondaryTypographyProps={{ color: '#888' }}
                                                    />
                                                </ListItem>

                                                <ListItem sx={{ px: 0 }}>
                                                    <ListItemIcon>
                                                        <InfoIcon sx={{ color: '#FF6B6B' }} />
                                                    </ListItemIcon>
                                                    <ListItemText 
                                                        primary="Resolución de pantalla"
                                                        secondary={`${window.screen.width}x${window.screen.height}`}
                                                        primaryTypographyProps={{ color: 'white', fontSize: '0.9rem' }}
                                                        secondaryTypographyProps={{ color: '#888' }}
                                                    />
                                                </ListItem>
                                            </List>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>

                            {/* Acciones rápidas */}
                            <Grid item xs={12}>
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    <Card sx={{
                                        bgcolor: '#1a1a1a',
                                        border: '1px solid #333',
                                        borderRadius: 4,
                                        position: 'relative',
                                        overflow: 'hidden',
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
                                            <Typography variant="h6" sx={{ 
                                                color: 'white', 
                                                mb: 3, 
                                                fontWeight: 'bold',
                                                textAlign: 'center'
                                            }}>
                                                Acciones Rápidas
                                            </Typography>
                                            
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Button
                                                        fullWidth
                                                        startIcon={<RestoreFromTrashIcon />}
                                                        onClick={clearCache}
                                                        sx={{
                                                            color: '#FF6B6B',
                                                            bgcolor: 'rgba(255,107,107,0.1)',
                                                            border: '1px solid rgba(255,107,107,0.3)',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(255,107,107,0.2)',
                                                                transform: 'translateY(-2px)'
                                                            },
                                                            py: 1.5,
                                                            justifyContent: 'flex-start'
                                                        }}
                                                    >
                                                        Limpiar Caché
                                                    </Button>
                                                </Grid>
                                                
                                                <Grid item xs={12}>
                                                    <Button
                                                        fullWidth
                                                        startIcon={<RefreshIcon />}
                                                        onClick={() => window.location.reload()}
                                                        sx={{
                                                            color: '#368FF4',
                                                            bgcolor: 'rgba(54,143,244,0.1)',
                                                            border: '1px solid rgba(54,143,244,0.3)',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(54,143,244,0.2)',
                                                                transform: 'translateY(-2px)'
                                                            },
                                                            py: 1.5,
                                                            justifyContent: 'flex-start'
                                                        }}
                                                    >
                                                        Recargar App
                                                    </Button>
                                                </Grid>
                                                
                                                <Grid item xs={12}>
                                                    <Button
                                                        fullWidth
                                                        startIcon={<FullscreenIcon />}
                                                        onClick={() => {
                                                            if (document.documentElement.requestFullscreen) {
                                                                document.documentElement.requestFullscreen()
                                                            }
                                                        }}
                                                        sx={{
                                                            color: '#FFD700',
                                                            bgcolor: 'rgba(255,215,0,0.1)',
                                                            border: '1px solid rgba(255,215,0,0.3)',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(255,215,0,0.2)',
                                                                transform: 'translateY(-2px)'
                                                            },
                                                            py: 1.5,
                                                            justifyContent: 'flex-start'
                                                        }}
                                                    >
                                                        Pantalla Completa
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>

                            {/* Estado de configuraciones */}
                            <Grid item xs={12}>
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                >
                                    <Card sx={{
                                        bgcolor: '#1a1a1a',
                                        border: '1px solid #333',
                                        borderRadius: 4,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: 'linear-gradient(90deg, #8A2BE2, #9932CC)'
                                        }
                                    }}>
                                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                            <Typography variant="h6" sx={{ 
                                                color: 'white', 
                                                mb: 2, 
                                                fontWeight: 'bold'
                                            }}>
                                                Estado de Configuraciones
                                            </Typography>
                                            
                                            {hasChanges ? (
                                                <Alert 
                                                    severity="warning" 
                                                    sx={{ 
                                                        bgcolor: 'rgba(255,215,0,0.1)', 
                                                        border: '1px solid rgba(255,215,0,0.3)',
                                                        color: '#FFD700',
                                                        '& .MuiAlert-icon': {
                                                            color: '#FFD700'
                                                        },
                                                        mb: 2
                                                    }}
                                                >
                                                    Tienes cambios sin guardar
                                                </Alert>
                                            ) : (
                                                <Alert 
                                                    severity="success" 
                                                    sx={{ 
                                                        bgcolor: 'rgba(76,175,80,0.1)', 
                                                        border: '1px solid rgba(76,175,80,0.3)',
                                                        color: '#4CAF50',
                                                        '& .MuiAlert-icon': {
                                                            color: '#4CAF50'
                                                        },
                                                        mb: 2
                                                    }}
                                                >
                                                    Todas las configuraciones están guardadas
                                                </Alert>
                                            )}

                                            <Box sx={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-around',
                                                mt: 2
                                            }}>
                                                <Box sx={{ textAlign: 'center' }}>
                                                    <Typography variant="h5" sx={{ 
                                                        color: '#368FF4', 
                                                        fontWeight: 'bold' 
                                                    }}>
                                                        {settingSections.reduce((total, section) => total + section.settings.length, 0)}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#888' }}>
                                                        Configuraciones
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ textAlign: 'center' }}>
                                                    <Typography variant="h5" sx={{ 
                                                        color: '#FFD700', 
                                                        fontWeight: 'bold' 
                                                    }}>
                                                        {settingSections.length}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#888' }}>
                                                        Categorías
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>

                            {/* Navegación rápida */}
                            <Grid item xs={12}>
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                >
                                    <Card sx={{
                                        bgcolor: '#1a1a1a',
                                        border: '1px solid #333',
                                        borderRadius: 4,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: 'linear-gradient(90deg, #00BCD4, #26C6DA)'
                                        }
                                    }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Typography variant="h6" sx={{ 
                                                color: 'white', 
                                                mb: 3, 
                                                fontWeight: 'bold',
                                                textAlign: 'center'
                                            }}>
                                                Navegación Rápida
                                            </Typography>
                                            
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Button
                                                        fullWidth
                                                        startIcon={<DashboardIcon />}
                                                        onClick={() => navigate('/dashboard')}
                                                        sx={{
                                                            color: '#368FF4',
                                                            bgcolor: 'rgba(54,143,244,0.1)',
                                                            border: '1px solid rgba(54,143,244,0.3)',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(54,143,244,0.2)',
                                                                transform: 'translateY(-2px)'
                                                            },
                                                            py: 1.5,
                                                            justifyContent: 'flex-start'
                                                        }}
                                                    >
                                                        Dashboard
                                                    </Button>
                                                </Grid>
                                                
                                                <Grid item xs={12}>
                                                    <Button
                                                        fullWidth
                                                        startIcon={<PersonIcon />}
                                                        onClick={() => navigate('/profile')}
                                                        sx={{
                                                            color: '#8A2BE2',
                                                            bgcolor: 'rgba(138,43,226,0.1)',
                                                            border: '1px solid rgba(138,43,226,0.3)',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(138,43,226,0.2)',
                                                                transform: 'translateY(-2px)'
                                                            },
                                                            py: 1.5,
                                                            justifyContent: 'flex-start'
                                                        }}
                                                    >
                                                        Mi Perfil
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Botones de acción flotantes */}
                <Box sx={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    zIndex: 1000
                }}>
                    {hasChanges && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Tooltip title="Guardar todos los cambios" arrow placement="left">
                                <Button
                                    variant="contained"
                                    onClick={saveSettings}
                                    startIcon={<SaveIcon />}
                                    sx={{
                                        bgcolor: '#4CAF50',
                                        '&:hover': {
                                            bgcolor: '#45a049',
                                            transform: 'scale(1.05)'
                                        },
                                        boxShadow: '0 8px 25px rgba(76,175,80,0.3)',
                                        borderRadius: 8,
                                        px: 3,
                                        py: 1.5,
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Guardar Cambios
                                </Button>
                            </Tooltip>
                        </motion.div>
                    )}
                </Box>
            </Container>

            {/* Snackbar para notificaciones */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{
                        bgcolor: snackbar.severity === 'success' 
                            ? '#1a5d1a' 
                            : snackbar.severity === 'error'
                            ? '#5d1a1a'
                            : snackbar.severity === 'warning'
                            ? '#5d4e1a'
                            : '#1a4d5d',
                        color: 'white',
                        '& .MuiAlert-icon': {
                            color: snackbar.severity === 'success' 
                                ? '#4caf50' 
                                : snackbar.severity === 'error'
                                ? '#f44336'
                                : snackbar.severity === 'warning'
                                ? '#ff9800'
                                : '#2196f3'
                        }
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default PageSettings
import { createTheme } from '@mui/material/styles'

const azulPrincipal = '#368FF4'
const azulHover = '#2d7fd3'
const azulClaro = '#5aaeff'
const azulOscuro = '#256eb5'
const rojo = '#e53935'
const amarillo = '#ffeb3b'
const morado = '#8E26DE'
const naranja = '#ffa726'
const white = '#ffffff'

export const lightTheme = createTheme({
    // Fondos principales
    background: 'bg-gray-50',
    sidebar: 'bg-white',
    modal: 'bg-white',
    navbar: 'bg-white/95',
    card: 'bg-white',
    
    // Textos
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    textMuted: 'text-gray-500',
    textInverse: 'text-white',
    
    // Bordes
    border: 'border-gray-200',
    borderLight: 'border-gray-100',
    borderStrong: 'border-gray-300',
    
    // Inputs y formularios
    input: 'bg-white text-gray-900',
    inputFocus: 'focus:ring-blue-500 focus:border-blue-500',
    inputDisabled: 'bg-gray-50 text-gray-400',
    
    // Estados hover y focus
    hover: 'hover:bg-gray-100',
    hoverStrong: 'hover:bg-gray-200',
    active: 'active:bg-gray-200',
    
    // Botones primarios
    buttonPrimary: 'bg-gradient-to-r from-blue-600 to-indigo-600',
    buttonPrimaryHover: 'hover:from-blue-700 hover:to-indigo-700',
    buttonPrimaryText: 'text-white',
    
    // Botones secundarios
    buttonSecondary: 'bg-gray-200 text-gray-900',
    buttonSecondaryHover: 'hover:bg-gray-300',
    
    // Botones de peligro
    buttonDanger: 'bg-red-600 text-white',
    buttonDangerHover: 'hover:bg-red-700',
    
    // Botones de éxito
    buttonSuccess: 'bg-green-600 text-white',
    buttonSuccessHover: 'hover:bg-green-700',
    
    // Colores de acento
    accent: 'text-blue-600',
    accentBg: 'bg-blue-600',
    accentLight: 'bg-blue-100 text-blue-800',
    
    // Colores de estado
    success: 'text-green-600',
    successBg: 'bg-green-100 text-green-800',
    error: 'text-red-600',
    errorBg: 'bg-red-100 text-red-800',
    warning: 'text-yellow-600',
    warningBg: 'bg-yellow-100 text-yellow-800',
    info: 'text-blue-600',
    infoBg: 'bg-blue-100 text-blue-800',
    
    // Overlays y backdrops
    backdrop: 'bg-black/50 backdrop-blur-sm',
    overlay: 'bg-white/80 backdrop-blur-md',
    
    // Sombras
    shadow: 'shadow-lg',
    shadowStrong: 'shadow-xl',
    shadowSoft: 'shadow-sm',
    
    // Scrollbar personalizada
    scrollbar: 'scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300',
    
    // Divisores
    divider: 'border-gray-200',
    
    // Gradientes especiales
    gradientPrimary: 'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600',
    gradientSecondary: 'bg-gradient-to-r from-gray-100 to-gray-200',
    
    // Estados específicos para componentes
    tableHeader: 'bg-gray-50 text-gray-700',
    tableRow: 'hover:bg-gray-50',
    tableRowAlt: 'bg-gray-25',
    
    // Navegación
    navLink: 'text-gray-700 hover:text-blue-600',
    navLinkActive: 'text-blue-600 bg-blue-50',
    
    // Badges y etiquetas
    badgeDefault: 'bg-gray-100 text-gray-800',
    badgePrimary: 'bg-blue-100 text-blue-800',
    badgeSuccess: 'bg-green-100 text-green-800',
    badgeWarning: 'bg-yellow-100 text-yellow-800',
    badgeError: 'bg-red-100 text-red-800',
    palette: {
        mode: 'light',
        primary: {
            main: azulPrincipal,
            light: azulClaro,
            dark: azulOscuro,
            contrastText: '#ffffff',
        },
        secondary: {
            main: white,
        },
        error: {
            main: rojo
        },
        warning: {
            main: amarillo,
        },
        info: {
            main: naranja,
        },
        background: {
            default: '#f5f5f5',
            paper: white,
        },
        text: {
            primary: '#000000',
            secondary: '#5D626B'
        },
        divider: {
            primary: '#e0e0e0',
            secondary: '#f5f5dc'
        },
    },
    typography: {
        fontFamily: '"Comic Neue", "Monomaniac One", "Roboto", "Arial", sans-serif',
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
    shape: {
        borderRadius: 12,
    },
    custom: {
        azul: azulPrincipal,
        azulHover: azulHover,
        rojo: rojo,
        amarillo: amarillo,
        naranja: naranja,
        blanco: white,
        morado: morado
    },
})

export const darkTheme = createTheme({
    // Fondos principales
    background: 'bg-gray-900',
    sidebar: 'bg-gray-800',
    modal: 'bg-gray-800',
    navbar: 'bg-gray-900/95',
    card: 'bg-gray-800',
    
    // Textos
    text: 'text-gray-100',
    textSecondary: 'text-gray-300',
    textMuted: 'text-gray-400',
    textInverse: 'text-gray-900',
    
    // Bordes
    border: 'border-gray-700',
    borderLight: 'border-gray-800',
    borderStrong: 'border-gray-600',
    
    // Inputs y formularios
    input: 'bg-gray-700 text-gray-100 placeholder-gray-400',
    inputFocus: 'focus:ring-blue-400 focus:border-blue-400',
    inputDisabled: 'bg-gray-800 text-gray-500',
    
    // Estados hover y focus
    hover: 'hover:bg-gray-700',
    hoverStrong: 'hover:bg-gray-600',
    active: 'active:bg-gray-600',
    
    // Botones primarios
    buttonPrimary: 'bg-gradient-to-r from-blue-600 to-indigo-600',
    buttonPrimaryHover: 'hover:from-blue-500 hover:to-indigo-500',
    buttonPrimaryText: 'text-white',
    
    // Botones secundarios
    buttonSecondary: 'bg-gray-700 text-gray-100',
    buttonSecondaryHover: 'hover:bg-gray-600',
    
    // Botones de peligro
    buttonDanger: 'bg-red-600 text-white',
    buttonDangerHover: 'hover:bg-red-500',
    
    // Botones de éxito
    buttonSuccess: 'bg-green-600 text-white',
    buttonSuccessHover: 'hover:bg-green-500',
    
    // Colores de acento
    accent: 'text-blue-400',
    accentBg: 'bg-blue-600',
    accentLight: 'bg-blue-900 text-blue-200',
    
    // Colores de estado
    success: 'text-green-400',
    successBg: 'bg-green-900 text-green-200',
    error: 'text-red-400',
    errorBg: 'bg-red-900 text-red-200',
    warning: 'text-yellow-400',
    warningBg: 'bg-yellow-900 text-yellow-200',
    info: 'text-blue-400',
    infoBg: 'bg-blue-900 text-blue-200',
    
    // Overlays y backdrops
    backdrop: 'bg-black/70 backdrop-blur-sm',
    overlay: 'bg-gray-900/80 backdrop-blur-md',
    
    // Sombras
    shadow: 'shadow-lg shadow-black/20',
    shadowStrong: 'shadow-xl shadow-black/30',
    shadowSoft: 'shadow-sm shadow-black/10',
    
    // Scrollbar personalizada
    scrollbar: 'scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600',
    
    // Divisores
    divider: 'border-gray-700',
    
    // Gradientes especiales
    gradientPrimary: 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700',
    gradientSecondary: 'bg-gradient-to-r from-gray-800 to-gray-700',
    
    // Estados específicos para componentes
    tableHeader: 'bg-gray-800 text-gray-200',
    tableRow: 'hover:bg-gray-700',
    tableRowAlt: 'bg-gray-850',
    
    // Navegación
    navLink: 'text-gray-300 hover:text-blue-400',
    navLinkActive: 'text-blue-400 bg-blue-900/30',
    
    // Badges y etiquetas
    badgeDefault: 'bg-gray-700 text-gray-200',
    badgePrimary: 'bg-blue-900 text-blue-200',
    badgeSuccess: 'bg-green-900 text-green-200',
    badgeWarning: 'bg-yellow-900 text-yellow-200',
    badgeError: 'bg-red-900 text-red-200',
    palette: {
        mode: 'dark',
        primary: {
            main: azulClaro,
            light: '#6ec6ff',
            dark: '#005cb2',
            contrastText: '#000000',
        },
        secondary: {
            main: '#121212',
        },
        error: {
            main: '#ef5350',
        },
        warning: {
            main: '#ffb74d',
        },
        info: {
            main: '#fff176',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        text: {
            primary: white,
            secondary: '#99a1af'
        },
        divider: {
            primary: '#2c2c2c',
            secondary: '#f5f5dc'
        },
    },
    typography: {
        fontFamily: '"Comic Neue", "Monomaniac One", "Roboto", "Arial", sans-serif',
    },
    shape: {
        borderRadius: 12,
    },
    custom: {
        azul: azulPrincipal,
        azulHover: azulHover,
        rojo: rojo,
        amarillo: amarillo,
        naranja: naranja,
        blanco: white,
        morado: morado
    },
})
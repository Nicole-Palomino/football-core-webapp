import { createTheme } from '@mui/material/styles'

const azulPrincipal = '#368FF4'
const azulHover = '#2d7fd3'
const azulClaro = '#5aaeff'
const azulOscuro = '#256eb5'
const rojo = '#e53935'
const amarillo = '#ffeb3b'
const naranja = '#ffa726'

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: azulPrincipal,
            light: azulClaro,
            dark: azulOscuro,
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#ffffff',
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
            paper: '#ffffff',
        },
        text: {
            primary: '#000000',
        },
        divider: {
            primary: '#e0e0e0'
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
    },
})

export const darkTheme = createTheme({
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
            primary: '#ffffff',
        },
        divider: {
            primary: '#2c2c2c'
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
    },
})
import { createTheme } from '@mui/material/styles'

export const lightTheme = createTheme({
    bg: 'bg-gray-50',
    sidebar: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-200',
    hover: 'hover:bg-gray-100',
    input: 'bg-white border-gray-300 text-gray-900',
    modal: 'bg-white',
    active: 'bg-blue-50 text-blue-600 border-r-2 border-blue-600',
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
})

export const darkTheme = createTheme({
    bg: 'bg-gray-900',
    sidebar: 'bg-gray-800',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    border: 'border-gray-700',
    hover: 'hover:bg-gray-700',
    input: 'bg-gray-700 border-gray-600 text-white',
    modal: 'bg-gray-800',
    active: 'bg-blue-900 text-blue-300 border-r-2 border-blue-400',
    typography: {
        fontFamily: '"Comic Neue", "Monomaniac One", "Roboto", "Arial", sans-serif',
    },
    shape: {
        borderRadius: 12,
    },
})
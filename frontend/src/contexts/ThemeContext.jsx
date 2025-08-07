import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { darkTheme, lightTheme } from '../utils/themes'
import { CssBaseline } from '@mui/material'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(() => {
        return localStorage.getItem('theme') || 'light'
    })

    useEffect(() => {
        localStorage.setItem('theme', mode)
    }, [mode])

    const toggleTheme = () => {
        setMode((prev) => (prev === 'light' ? 'dark' : 'light'))
    }

    const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode])

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    )
}

export const useThemeMode = () => useContext(ThemeContext)
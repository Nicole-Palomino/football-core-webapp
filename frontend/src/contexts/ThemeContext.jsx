import { createContext, useContext, useState } from 'react'
import { darkTheme, lightTheme } from '../utils/themes'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false)
    const currentTheme = darkMode ? darkTheme : lightTheme

    return (
        <ThemeContext.Provider value={{ darkMode, setDarkMode, currentTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useThemeMode = () => useContext(ThemeContext)
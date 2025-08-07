import IconButton from '@mui/material/IconButton'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useThemeMode } from '../../contexts/ThemeContext'

const ThemeToggleButton = () => {
    const { mode, toggleTheme } = useThemeMode()

    return (
        <IconButton onClick={toggleTheme} color="inherit" sx={{ marginRight: 3 }}>
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
    )
}

export default ThemeToggleButton

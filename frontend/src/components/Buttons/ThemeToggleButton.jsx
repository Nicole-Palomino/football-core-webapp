import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useThemeMode } from '../../contexts/ThemeContext'

const ThemeToggleButton = () => {
    const { setDarkMode, darkMode } = useThemeMode()

    return (
        <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition-colors duration-300 ${darkMode ? 'text-yellow-400 hover:bg-yellow-500/20' : 'text-gray-600 hover:bg-gray-200'} mr-3`}
        >
            {darkMode ? (
                <Brightness7Icon className="w-6 h-6" />
            ) : (
                <Brightness4Icon className="w-6 h-6" />
            )}
        </button>
    )
}

export default ThemeToggleButton

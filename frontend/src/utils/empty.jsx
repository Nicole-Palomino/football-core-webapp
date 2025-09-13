import { useThemeMode } from '../contexts/ThemeContext'

const EmptyMessage = ({ text }) => {
    const { currentTheme } = useThemeMode()

    return (
        <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-8 text-center`}>
            <div className="w-16 h-16 bg-gray-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-2 border-gray-400 border-dashed rounded-full"></div>
            </div>
            <h3 className={`${currentTheme.textSecondary} text-lg font-medium`}>
                {text}
            </h3>
        </div>
    )
}

export default EmptyMessage
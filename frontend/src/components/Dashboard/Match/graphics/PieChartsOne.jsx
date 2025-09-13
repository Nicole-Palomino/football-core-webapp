import PieArcLabel from './PieArcLabel'
import { useThemeMode } from '../../../../contexts/ThemeContext'

const PieChartsOne = ({ Data }) => {
    const { currentTheme } = useThemeMode()
    
    return (
        <div className={`rounded-lg transition-all duration-300 hover:shadow-lg ${currentTheme.card}`}>
            <PieArcLabel data={Data} />
        </div>
    )
}

export default PieChartsOne
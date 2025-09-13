import { Outlet } from 'react-router-dom'
import NavbarUsers from '../components/Navbar/NavbarUsers'
import { useThemeMode } from '../contexts/ThemeContext'

const Dashboard = () => {
    const { currentTheme } = useThemeMode()

    return (
        <div className={`flex justify-center w-full min-h-screen h-screen m-0 p-0 overflow-hidden ${currentTheme.background}`}>
            <div className="hidden md:block"></div>

            {/* seccion principal */}
            <div className="flex flex-col w-full md:w-10/12 max-w-[1200px] min-h-screen h-full overflow-y-auto">
                <NavbarUsers />
                <div className="flex-grow">
                    <Outlet />
                </div>
            </div>

            <div className="hidden md:block"></div>
        </div>
    )
}

export default Dashboard
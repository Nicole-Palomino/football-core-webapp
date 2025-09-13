import { useState } from 'react'
import { useThemeMode } from '../../../../contexts/ThemeContext'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const CarruselSugerencias = ({ datos }) => {
    const [indice, setIndice] = useState(0)
    const { currentTheme } = useThemeMode()

    const siguiente = () => {
        setIndice((prev) => (prev + 1) % datos.length)
    }

    const anterior = () => {
        setIndice((prev) => (prev - 1 + datos.length) % datos.length)
    }

    return (
        <div className="w-full max-w-xl mx-auto p-2 flex flex-col justify-between min-h-[200px]">
            <p className={`text-lg text-center mb-2 ${currentTheme.text}`}>{datos[indice]}</p>

            <div className="flex justify-between gap-4 mt-auto">
                <button
                    onClick={anterior}
                    className={`p-2 rounded-lg cursor-pointer ${currentTheme.buttonSecondary} ${currentTheme.buttonSecondaryHover} transition-colors duration-200`}
                    aria-label="Anterior"
                >
                    <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                    onClick={siguiente}
                    className={`p-2 rounded-lg cursor-pointer ${currentTheme.buttonSecondary} ${currentTheme.buttonSecondaryHover} transition-colors duration-200`}
                    aria-label="Siguiente"
                >
                    <ChevronRightIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    )
}

export default CarruselSugerencias
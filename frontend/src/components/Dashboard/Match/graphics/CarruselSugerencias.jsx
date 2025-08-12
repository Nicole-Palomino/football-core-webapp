import { useTheme } from '@mui/material'
import { useState } from 'react'

const CarruselSugerencias = ({ title, datos }) => {
    const [indice, setIndice] = useState(0)
    const theme = useTheme()

    const siguiente = () => {
        setIndice((prev) => (prev + 1) % datos.length)
    }

    const anterior = () => {
        setIndice((prev) => (prev - 1 + datos.length) % datos.length)
    }

    return (
        <div className="w-full max-w-xl mx-auto p-2 flex flex-col justify-between min-h-[200px]">
            <p className='text-xl font-bold mb-4 uppercase' style={{ color: theme.palette.text.primary, textAlign: 'center' }}>{title}</p>
            <p className="text-lg text-center mb-2">{datos[indice]}</p>

            <div className="flex justify-between gap-4 mt-auto">
                <button
                    onClick={anterior}
                    className="px-4 py-2 rounded-lg cursor-pointer"
                    style={{
                        backgroundColor: theme.custom.azul,
                        color: theme.palette.primary.contrastText,
                    }}
                >
                    ◀
                </button>
                <button
                    onClick={siguiente}
                    className="px-4 py-2 rounded-lg cursor-pointer"
                    style={{
                        backgroundColor: theme.custom.azul,
                        color: theme.palette.primary.contrastText,
                    }}
                >
                    ►
                </button>
            </div>
        </div>
    )
}

export default CarruselSugerencias
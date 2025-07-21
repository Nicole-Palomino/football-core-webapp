import { FaFutbol } from 'react-icons/fa'

const TotalMatch = ({ totalMatches }) => {
    return (
        <div className="flex flex-col items-center justify-center bg-target p-5 rounded-lg shadow-lg">
            <p className="mt-2 text-white text-lg font-bold uppercase">Total de Enfrentamientos</p>
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-blue-600 text-white">
                {/* Icono de Cancha */}
                <FaFutbol className="absolute w-12 h-12 opacity-30" />
                {/* Número en el centro */}
                <span className="text-2xl font-extrabold font-subtitle">{totalMatches}</span>
            </div>
        </div>
    )
}

export default TotalMatch
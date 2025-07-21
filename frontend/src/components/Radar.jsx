const Barra = ({ label, localValue, visitanteValue, localName, visitanteName }) => {

    return (
        <div className="bg-target p-5 rounded-lg shadow-lg">
            <p className='text-white font-bold mb-2 uppercase text-center'>{label}</p>
            <div className="mb-2">
                <span className="font-semibold uppercase text-white">{localName}</span>
                <div className="w-full h-4 rounded relative">
                    <div className="bg-green-500 h-6 rounded text-white text-md flex items-center justify-end pr-2 font-bold"
                        style={{ width: `${(localValue / (localValue + visitanteValue)) * 100}%` }}> {localValue}</div>
                </div>
            </div>
            <div className='mb-2'>
                <span className="font-semibold uppercase text-white">{visitanteName}</span>
                <div className="w-full h-4 rounded">
                    <div className="bg-red-500 h-6 rounded text-white text-md flex items-center justify-end pr-2 font-bold"
                        style={{ width: `${(visitanteValue / (localValue + visitanteValue)) * 100}%` }}>{visitanteValue}</div>
                </div>
            </div>
        </div>
    )
}

export default Barra
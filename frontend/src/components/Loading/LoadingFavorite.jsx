import { HeartIcon } from '@heroicons/react/24/solid'

const LoadingFavorite = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
            <div className="text-center">
                <div className="relative mb-8">
                    <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <HeartIcon className="w-8 h-8 text-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold text-blue-500 mb-2 animate-pulse">
                    Cargando tus partidos favoritos...
                </h3>
                <div className="flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
            </div>
        </div>
    )
}

export default LoadingFavorite
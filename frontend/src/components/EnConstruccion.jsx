import { motion } from 'framer-motion'
import { FaTools } from 'react-icons/fa'

const EnConstruccion = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-background to-target text-white">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center">
                    <FaTools className="text-6xl text-yellow-400 animate-bounce" />
                    <h1 className="text-4xl font-bold mt-4">¡Estamos Trabajando en Ello! 🚀</h1>
                    <p className="mt-2 text-lg text-gray-300 max-w-md">
                        Nuestra plataforma está en construcción. Pronto traeremos algo increíble para ti. ¡Vuelve pronto!
                    </p>
            </motion.div>
        </div>
    )
}

export default EnConstruccion
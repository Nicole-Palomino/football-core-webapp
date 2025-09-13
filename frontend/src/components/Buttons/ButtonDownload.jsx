import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const ButtonDownload = ({ url, filename }) => {
    const handleDownload = async () => {
        try {
            const response = await fetch(url, { mode: "cors" })
            const blob = await response.blob()
            const link = document.createElement("a")
            link.href = URL.createObjectURL(blob)
            link.download = filename
            link.click()
            URL.revokeObjectURL(link.href)
        } catch (error) {
            console.error("Error al descargar la imagen:", error)
        }
    }

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center gap-2 shadow-lg"
        >
            <ArrowDownTrayIcon className="w-5 h-5" />
            DESCARGAR IMAGEN
        </motion.button>
    )
}

export default ButtonDownload
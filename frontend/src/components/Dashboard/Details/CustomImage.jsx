import { useState } from 'react'
import LoadingSpinner from '../../Loading/LoadingSpinner'
import CustomAlertas from './CustomAlertas'
import ButtonDownload from '../../Buttons/ButtonDownload'
import { ChartBarIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeMode } from '../../../contexts/ThemeContext'
import { useImages } from '../../../hooks/useImage'

const CustomImage = ({ id_partido }) => {

    const { currentTheme } = useThemeMode()
    const [openImage, setOpenImage] = useState(null)

    const { matchImage, isLoading, isError, error } = useImages(id_partido)

    if (isLoading) return <LoadingSpinner />

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-6 max-w-md w-full text-center`}>
                    <h2 className={`${currentTheme.text} text-lg font-bold mb-4`}>Error al cargar datos</h2>
                    {isError && <p className={`${currentTheme.textSecondary} text-sm`}>Summary by ID: {error.message}</p>}
                </div>
            </div>
        )
    }

    const finalMatchesSummaries = matchImage || []

    const handleOpen = (url, title) => {
        setOpenImage({url, title})
    }

    const handleClose = () => {
        setOpenImage(null)
    }

    return (
        <div className="flex justify-center items-center w-full">
            {finalMatchesSummaries.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 }}
                    className="w-full mx-auto max-w-6xl"
                >
                    <div className="w-full flex justify-center">
                        <div className="w-full md:w-4/5 lg:w-3/5 flex flex-col">
                            {/* Título principal */}
                            <div className="text-center mb-8">
                                <h2 className="text-lg md:text-3xl font-bold uppercase bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent mb-6">
                                    Resumen Estadístico
                                </h2>
                                <CustomAlertas
                                    title='Este tipo de visualización facilita comprender qué equipo dominó más en ataque, cómo se distribuyeron los tiros a portería y el impacto de las transiciones en el desarrollo del partido.'
                                />
                            </div>

                            {finalMatchesSummaries.map((resumen, index) => {
                                // Creamos un arreglo con las tres imágenes disponibles
                                const images = [
                                    { url: resumen.url_imagen, label: "Dashboard" },
                                    { url: resumen.url_mvp, label: "MVP" },
                                    { url: resumen.url_shotmap, label: "Shotmap" }
                                ]

                                return (
                                    <motion.div
                                        key={resumen.id_resumen}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: index * 0.2 }}
                                        className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl bg-opacity-50 mt-6 relative`}
                                    >
                                        {/* Barra superior */}
                                        <div className="h-1 bg-gradient-to-r from-orange-500 to-yellow-400"></div>

                                        <div className="p-6">
                                            {/* Header */}
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2 rounded-xl bg-orange-500/20">
                                                    <ChartBarIcon className="w-6 h-6 text-orange-500" />
                                                </div>
                                                <h3 className={`${currentTheme.text} text-xl font-bold`}>
                                                    {resumen.nombre}
                                                </h3>
                                            </div>

                                            {/* Iteramos sobre cada imagen */}
                                            <div className="space-y-10">
                                                {images.map((img, i) => (
                                                    img.url && (
                                                        <motion.div
                                                            key={i}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            className="text-center"
                                                        >
                                                            <div
                                                                className="relative group cursor-pointer rounded-xl overflow-hidden shadow-lg"
                                                                onClick={() => handleOpen(img.url, img.label)}
                                                            >
                                                                <img
                                                                    src={img.url}
                                                                    alt={img.label}
                                                                    className="w-full h-auto rounded-xl transition-transform duration-300 group-hover:brightness-110"
                                                                />
                                                                {/* Overlay on hover */}
                                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                                                                    <span className="text-white font-semibold text-sm bg-black/50 px-4 py-2 rounded-lg">
                                                                        Click para ampliar
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Footer */}
                                                            <div className="mt-4 space-y-2">
                                                                <p className={`${currentTheme.textSecondary} text-sm italic`}>
                                                                    {img.label} • Creado: {new Date(resumen.created_at).toLocaleDateString('es-ES')}
                                                                </p>
                                                                <div className="flex justify-center">
                                                                    <ButtonDownload
                                                                        url={img.url}
                                                                        filename={`${img.label}_${resumen.id_partido}.png`}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                    <div className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-8 max-w-md mx-auto`}>
                        <ChartBarIcon className={`w-16 h-16 ${currentTheme.textSecondary} mx-auto mb-4`} />
                        <h3 className={`${currentTheme.text} text-xl font-semibold mb-2`}>
                            No hay datos disponibles
                        </h3>
                        <p className={`${currentTheme.textSecondary}`}>
                            No hay resumen estadístico disponible para este partido
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Modal para imagen ampliada */}
            <AnimatePresence>
                {openImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-2 md:p-4"
                        onClick={handleClose}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3, type: "spring", damping: 25 }}
                            className="relative w-full h-full max-w-7xl max-h-[95vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4 px-2">
                                <h3 className="text-white font-bold text-lg md:text-xl truncate flex-1">
                                    {openImage.title}
                                </h3>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleClose}
                                    className="p-2 ml-4 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors flex-shrink-0"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </motion.button>
                            </div>

                            <div className="flex-1 overflow-auto rounded-xl bg-white/5 backdrop-blur-sm border border-white/20">
                                <div className="min-h-full flex items-center justify-center p-4">
                                    <motion.img
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: 0.1 }}
                                        src={openImage.url}
                                        alt={`${openImage.title} ampliado`}
                                        className="max-w-full h-auto rounded-lg shadow-2xl"
                                        style={{ maxHeight: 'none', objectFit: 'contain' }}
                                    />
                                </div>
                            </div>

                            <div className="mt-4 text-center">
                                <p className="text-white/70 text-sm">
                                    Usa scroll para ver la imagen completa • Click fuera para cerrar
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CustomImage
import { useRef } from "react"
import { useThemeMode } from "../contexts/ThemeContext"
import { jsPDF } from "jspdf"
import domtoimage from 'dom-to-image-more'

export const useDownloadStats = () => {
    const { currentTheme } = useThemeMode()
    const statsRef = useRef(null)

    const downloadAsPNG = async (local, visita) => {
        if (!statsRef.current) return
        
        try {
            const dataUrl = await domtoimage.toPng(statsRef.current, {
                quality: 1,
                pixelRatio: 2,
                bgcolor: currentTheme.background,
                style: { transform: 'scale(1)', transformOrigin: 'top left' },
                filter: (node) =>
                    !(node.tagName === 'BUTTON' && node.classList.contains('download-button'))
            })

            const link = document.createElement('a')
            link.download = `estadisticas-${local}-vs-${visita}.png`
            link.href = dataUrl
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error('Error downloading PNG:', error)
        }
    }

    const downloadAsPDF = async (local, visita) => {
        if (!statsRef.current) return

        try {
            const rect = statsRef.current.getBoundingClientRect()
            const dataUrl = await domtoimage.toPng(statsRef.current, {
                quality: 1,
                pixelRatio: 3,
                bgcolor: currentTheme.background,
                width: rect.width,
                height: rect.height,
                style: { transform: 'scale(1)', transformOrigin: 'top left' },
                filter: (node) =>
                    !(node.tagName === 'BUTTON' && node.classList.contains('download-button'))
            })

            const img = new Image()
            img.onload = () => {
                const imgWidth = img.width
                const imgHeight = img.height
                const orientation = imgWidth > imgHeight ? 'l' : 'p'

                const pdf = new jsPDF(orientation, 'mm', 'a4')
                const pageWidth = pdf.internal.pageSize.getWidth()
                const pageHeight = pdf.internal.pageSize.getHeight()
                const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight)
                const finalWidth = imgWidth * ratio
                const finalHeight = imgHeight * ratio
                const x = (pageWidth - finalWidth) / 2
                const y = (pageHeight - finalHeight) / 2

                pdf.addImage(dataUrl, 'PNG', x, y, finalWidth, finalHeight, '', 'FAST')
                pdf.save(`estadisticas-${local}-vs-${visita}.pdf`)
            }

            img.src = dataUrl
        } catch (error) {
            console.error('Error downloading PDF:', error)
        }
    }

    return { statsRef, downloadAsPNG, downloadAsPDF }
}
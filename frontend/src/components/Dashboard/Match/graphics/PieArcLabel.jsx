import { useEffect, useRef } from 'react'
import { useThemeMode } from '../../../../contexts/ThemeContext'
import Chart from 'chart.js/auto'

const PieArcLabel = ({ data }) => {
    const { currentTheme } = useThemeMode()
    const chartRef = useRef(null)
    const chartInstance = useRef(null)
    const isMobile = window.innerWidth < 640

    useEffect(() => {
        // Destruir el gráfico anterior si existe
        if (chartInstance.current) {
            chartInstance.current.destroy()
        }

        // Crear nuevo gráfico
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d')
            
            // Extraer datos para Chart.js
            const labels = data.map(item => item.label)
            const values = data.map(item => item.value)
            
            // Generar colores dinámicos
            const colors = [
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(255, 159, 64, 0.8)',
                'rgba(255, 99, 132, 0.8)'
            ]
            
            // Crear gráfico
            chartInstance.current = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: colors.slice(0, data.length),
                        borderColor: colors.map(color => color.replace('0.8', '1')),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: isMobile ? 'bottom' : 'right',
                            labels: {
                                color: currentTheme.text.includes('text-gray-900') ? '#1f2937' : '#f9fafb',
                                font: {
                                    size: isMobile ? 12 : 14
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: currentTheme.card.includes('bg-white') ? 'rgba(255, 255, 255, 0.9)' : 'rgba(31, 41, 55, 0.9)',
                            titleColor: currentTheme.text.includes('text-gray-900') ? '#1f2937' : '#f9fafb',
                            bodyColor: currentTheme.text.includes('text-gray-900') ? '#1f2937' : '#f9fafb',
                            borderColor: currentTheme.border.includes('border-gray-200') ? '#e5e7eb' : '#374151',
                            borderWidth: 1,
                            padding: 10,
                            displayColors: true,
                            usePointStyle: true,
                        }
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    }
                }
            })
        }
        
        // Limpiar al desmontar
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy()
            }
        }
    }, [data, currentTheme])

    return (
        <div className="w-full mx-auto">
            <div className="relative" style={{ height: isMobile ? '300px' : '300px' }}>
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    )
}

export default PieArcLabel;

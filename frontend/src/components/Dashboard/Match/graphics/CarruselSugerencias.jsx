import React, { useState, useEffect } from 'react'

const CarruselSugerencias = ({ title, datos, autoSlide = false, interval = 5000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    // Efecto para el auto-deslizamiento
    useEffect(() => {
        if (!autoSlide) return;

        const slideInterval = setInterval(nextSlide, interval)
        return () => clearInterval(slideInterval)
    }, [currentIndex, autoSlide, interval])

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? datos.length - 1 : prev - 1))
    }

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === datos.length - 1 ? 0 : prev + 1))
    }

    if (!datos || datos.length === 0) {
        return null
    }

    // Estilos principales del carrusel
    const carouselStyles = {
        maxWidth: '100%',
        width: '100%',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '12px',
        background: '#151616',
        padding: '20px',
        boxSizing: 'border-box',
        color: 'inherit',
        '@media (min-width: 768px)': {
            maxWidth: '700px',
        }
    }

    // Contenedor de las diapositivas
    const containerStyles = {
        display: 'flex',
        transition: 'transform 0.5s ease-in-out',
        transform: `translateX(-${currentIndex * 100}%)`,
        width: `${datos.length * 100}%`,
    }

    // Estilos de cada diapositiva
    const itemStyles = {
        minWidth: '100%',
        boxSizing: 'border-box',
        padding: '0 10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }

    // Estilos del contenido dentro de la diapositiva
    const contentStyles = {
        background: '#282c34',
        borderRadius: '10px',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '1.2rem',
        padding: '20px',
        textAlign: 'center',
        wordWrap: 'break-word',
        maxWidth: '100%',
    }

    // Estilos de los botones de navegación
    const buttonStyles = {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'rgba(255, 255, 255, 0.2)',
        border: 'none',
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        cursor: 'pointer',
        color: 'white',
        fontSize: '24px',
        lineHeight: '30px',
        textAlign: 'center',
        userSelect: 'none',
        zIndex: 10,
    }

    // Estilos de los puntos de navegación
    const dotContainerStyles = {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '15px',
        gap: '8px',
    }

    const dotStyles = (isActive) => ({
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: isActive ? '#fff' : 'rgba(255, 255, 255, 0.3)',
        cursor: 'pointer',
        transition: 'background 0.3s ease',
    })

    return (
        <div style={carouselStyles} role="region" aria-label={title}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{title}</h2>

            <div style={containerStyles} aria-live="polite">
                {datos.map((item, idx) => (
                    <div
                        key={idx}
                        style={itemStyles}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${idx + 1} de ${datos.length}`}
                    >
                        <div style={contentStyles}>
                            {item}
                        </div>
                    </div>
                ))}
            </div>

            {/* Controles */}
            {datos.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        aria-label="Diapositiva anterior"
                        style={{ ...buttonStyles, left: '10px' }}
                    >
                        ‹
                    </button>

                    <button
                        onClick={nextSlide}
                        aria-label="Diapositiva siguiente"
                        style={{ ...buttonStyles, right: '10px' }}
                    >
                        ›
                    </button>

                    {/* Puntos de navegación */}
                    <div style={dotContainerStyles}>
                        {datos.map((_, idx) => (
                            <div
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                style={dotStyles(idx === currentIndex)}
                                aria-label={`Ir a la diapositiva ${idx + 1}`}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        setCurrentIndex(idx)
                                    }
                                }}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default CarruselSugerencias
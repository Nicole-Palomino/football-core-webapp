import React from 'react'
import Slider from 'react-slick'

const CarruselSugerencias = ({ title, datos }) => {
    const CustomNextArrow = (props) => {
        const { className, onClick } = props
        return (
            <div
                className={className}
                onClick={onClick}
                style={{
                    right: '2px',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: 30,
                    height: 30,
                }}
            />
        )
    }

    const CustomPrevArrow = (props) => {
        const { className, onClick } = props
        return (
            <div
                className={className}
                onClick={onClick}
                style={{
                    left: '2px',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: 30,
                    height: 30,
                }}
            />
        )
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
    }

    return (
        <div
            className="slider-container bg-target p-5 rounded-lg shadow-lg relative text-xl"
            style={{ maxWidth: 700, margin: '0 auto', color: 'white' }}
        >
            <h2 className='text-center'>{title}</h2>
            <Slider {...settings}>
                {datos.map((item, idx) => (
                    <div key={idx} className='p-5'>
                        <div
                            style={{
                                background: '#151616',
                                padding: '20px',
                                borderRadius: '10px',
                                minHeight: '100px',
                            }}
                        >
                            {item}
                        </div>
                    </div>
                ))}
            </Slider>

            <style>{`
                .slider-container .slick-dots {
                    position: absolute;
                    bottom: 10px;
                    left: 0;
                    right: 0;
                    display: flex !important;
                    justify-content: center;
                }

                .slider-container .slick-dots li button:before {
                    font-size: 10px;
                    color: white;
                    opacity: 0.5;
                }

                .slider-container .slick-dots li.slick-active button:before {
                    color: white;
                    opacity: 1;
                }
            `}</style>
        </div>
    )
}

export default CarruselSugerencias
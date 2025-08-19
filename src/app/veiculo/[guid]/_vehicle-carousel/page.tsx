'use client'

import React, { useRef, useState, useEffect } from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import ScrollContainer from 'react-indiana-drag-scroll'

const images = [
    'https://cotac.com.br/blog/wp-content/uploads/2024/09/carros-da-chevrolet.jpg',
    'https://blog.autocompara.com.br/wp-content/uploads/2024/06/carros-esportivos.jpeg',
    'https://forbes.com.br/wp-content/uploads/2020/08/Neg%C3%B3cios-CarrosdeLuxo-180820-Divulga%C3%A7%C3%A3o9-1.jpg',
    'https://cdn.motor1.com/images/mgl/8ANEqW/240:0:1440:1080/carros-mais-baratos-2024---fiat-mobi.webp',
    'https://www.kovi.com.br/hubfs/AnyConv.com__Os%20melhores%20carros%20para%20motoristas%20iniciantes.webp',
    'https://t.ctcdn.com.br/SorSJSoTOjwxL_oijkXTNu4HfYQ=/640x360/smart/i956025.jpeg',
    'https://forbes.com.br/wp-content/uploads/2020/08/Neg%C3%B3cios-CarrosdeLuxo-180820-Divulga%C3%A7%C3%A3o9-1.jpg',
    'https://forbes.com.br/wp-content/uploads/2020/08/Neg%C3%B3cios-CarrosdeLuxo-180820-Divulga%C3%A7%C3%A3o9-1.jpg',
    'https://forbes.com.br/wp-content/uploads/2020/08/Neg%C3%B3cios-CarrosdeLuxo-180820-Divulga%C3%A7%C3%A3o9-1.jpg',
]

const VehicleCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const scrollRef = useRef<HTMLDivElement>(null)

    const [showLeftArrow, setShowLeftArrow] = useState(false)
    const [showRightArrow, setShowRightArrow] = useState(false)

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    }

    const scrollLeft = () => {
        scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' })
    }

    const scrollRight = () => {
        scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })
    }

    const checkScrollPosition = () => {
        const el = scrollRef.current
        if (!el) return

        const atStart = el.scrollLeft <= 0
        const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1

        setShowLeftArrow(!atStart)
        setShowRightArrow(!atEnd)
    }

    useEffect(() => {
        const el = scrollRef.current
        if (!el) return

        const thumbnail = el.children[currentIndex] as HTMLElement
        if (!thumbnail) return

        const thumbnailLeft = thumbnail.offsetLeft
        const thumbnailRight = thumbnailLeft + thumbnail.offsetWidth

        const visibleStart = el.scrollLeft
        const visibleEnd = visibleStart + el.clientWidth

        if (thumbnailLeft < visibleStart) {
            el.scrollTo({ left: thumbnailLeft, behavior: 'smooth' })
        } else if (thumbnailRight > visibleEnd) {
            el.scrollTo({ left: thumbnailRight - el.clientWidth, behavior: 'smooth' })
        }
    }, [currentIndex])

    useEffect(() => {
        const el = scrollRef.current
        if (!el) return

        checkScrollPosition()

        el.addEventListener('scroll', checkScrollPosition)
        window.addEventListener('resize', checkScrollPosition)

        return () => {
            el.removeEventListener('scroll', checkScrollPosition)
            window.removeEventListener('resize', checkScrollPosition)
        }
    }, [])

    return (
        <div className={styles.carousel}>
            <div className={styles.mainImageContainer}>
                {currentIndex !== 0 &&
                    (<Image
                        onClick={prevImage}
                        src={'/assets/svg/arrow-left-bold.svg'}
                        width={35}
                        height={35}
                        alt='arrow-left'
                        className={styles.arrowLeft}
                    />
                    )}
                <Zoom>
                    <img
                        className={styles.mainImage}
                        src={images[currentIndex]}
                        alt="Vehicle"
                        width={600}
                        height={400}
                    />
                </Zoom>
                {images.length > 1 &&
                    (<Image
                        onClick={nextImage}
                        src={'/assets/svg/arrow-right-bold.svg'}
                        width={35}
                        height={35}
                        alt='arrow-right'
                        className={styles.arrowRight}
                    />
                    )}
            </div>

            <div className={styles.thumbnailContent}>
                {showLeftArrow && (
                    <Image
                        onClick={scrollLeft}
                        src={'/assets/svg/arrow-left-bold.svg'}
                        width={25}
                        height={25}
                        alt='arrow-left'
                        className={`${styles.arrowLeft} ${styles.arrowSmall}`}
                    />
                )}

                <ScrollContainer
                    className={styles.thumbnailContainer}
                    innerRef={scrollRef}
                >
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className={currentIndex === index ? styles.activeThumbnail : ''}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </ScrollContainer>

                {showRightArrow && (
                    <Image
                        onClick={scrollRight}
                        src={'/assets/svg/arrow-right-bold.svg'}
                        width={25}
                        height={25}
                        alt='arrow-right'
                        className={`${styles.arrowRight} ${styles.arrowSmall}`}
                    />
                )}
            </div>
        </div>
    )
}

export default VehicleCarousel

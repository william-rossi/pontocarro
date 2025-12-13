'use client'

import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import { getVehicleImages } from '@/services/vehicles'
import VehicleCarouselSkeleton from './vehicle-carousel-skeleton'

import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Thumbs, Zoom } from 'swiper/modules'

import Lightbox from 'yet-another-react-lightbox'
import ZoomPlugin from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import 'swiper/css/zoom'

interface VehicleCarouselProps {
    vehicleId: string
}

const VehicleCarousel = ({ vehicleId }: VehicleCarouselProps) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)
    const [mainSwiper, setMainSwiper] = useState<any>(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [lightboxOpen, setLightboxOpen] = useState(false) // Estado para controlar o Lightbox

    // Estados para controlar a visibilidade das setas das miniaturas
    const [showThumbnailLeftArrow, setShowThumbnailLeftArrow] = useState(false)
    const [showThumbnailRightArrow, setShowThumbnailRightArrow] = useState(false)

    const [images, setImages] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Efeitos de carregamento de imagens (MANTIDO)
    useEffect(() => {
        const fetchImages = async () => {
            try {
                setLoading(true)
                setError(null)
                const fetchedImages = await getVehicleImages(vehicleId)
                setImages(fetchedImages.map(img => img.imageUrl))
            } catch (err: unknown) {
                setError((err instanceof Error) ? err.message : "An unexpected error occurred.")
            } finally {
                setLoading(false)
            }
        }

        if (vehicleId) {
            fetchImages()
        }
    }, [vehicleId])

    // Efeito para sincronizar o scroll das miniaturas com a imagem principal
    useEffect(() => {
        if (thumbsSwiper && currentIndex !== undefined) {
            thumbsSwiper.slideTo(currentIndex, 500) // Slide to current index with a duration
        }
    }, [currentIndex, thumbsSwiper])

    // Função para checar a posição de scroll das miniaturas e controlar a visibilidade das setas
    const checkThumbnailScrollPosition = (swiperInstance: any) => {
        if (!swiperInstance) return

        // Swiper possui propriedades para verificar o estado dos botões de navegação
        setShowThumbnailLeftArrow(!swiperInstance.isBeginning)
        setShowThumbnailRightArrow(!swiperInstance.isEnd)
    }

    if (loading) {
        return <VehicleCarouselSkeleton />
    }

    if (error) {
        return <div className={styles.carousel}><p className={styles.error}>Erro ao carregar imagens: {error}</p></div>
    }

    if (images.length === 0) {
        return <div className={styles.carousel}><p>Nenhuma imagem disponível.</p></div>
    }

    return (
        <div className={styles.carousel}>
            {/* --------------------------- SWIPER PRINCIPAL --------------------------- */}
            <Swiper
                key={images.length} // Add key to force re-initialization on image count change
                onSwiper={setMainSwiper}
                style={{
                    // @ts-ignore
                    '--swiper-navigation-color': '#fff',
                    '--swiper-pagination-color': '#fff',
                }}
                zoom={true}
                {...(images.length > 1 && {
                    navigation: {
                        nextEl: `.${styles.mainImageButtonNext}`,
                        prevEl: `.${styles.mainImageButtonPrev}`,
                    }
                })}
                // Sincroniza o Swiper principal com as miniaturas
                {...(thumbsSwiper && { thumbs: { swiper: thumbsSwiper } })}
                modules={[FreeMode, Navigation, Thumbs, Zoom]}
                className={styles.mainImageSwiper}
                onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
            >
                <Image
                    width={32}
                    height={32}
                    src={'/assets/svg/fullscreen-white.svg'}
                    alt='Fullscreen'
                    className={styles.fullscreenIcon}
                    onClick={() => setLightboxOpen(true)} // Abre o lightbox
                />
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <div className="swiper-zoom-container">
                            <img
                                src={image}
                                alt={`Vehicle image ${index + 1}`}
                                className={styles.mainImage}
                            />
                        </div>
                    </SwiperSlide>
                ))}

                {/* Botões de Navegação Principal */}
                {images.length > 1 && (
                    <>
                        <div className={`${styles.mainImageButtonPrev} ${currentIndex < 1 ? styles.mainImageButtonPrevDisabled : ''}`}>
                            <Image
                                src={'/assets/svg/arrow-left-bold.svg'}
                                width={30}
                                height={30}
                                alt='arrow-left'
                            />
                        </div>
                        <div className={`${styles.mainImageButtonNext} ${(currentIndex + 1) >= images.length ? styles.mainImageButtonNextDisabled : ''}`}>
                            <Image
                                src={'/assets/svg/arrow-right-bold.svg'}
                                width={30}
                                height={30}
                                alt='arrow-right'
                            />
                        </div>
                    </>
                )}
            </Swiper>

            {/* --------------------------- SWIPER THUMBNAIL --------------------------- */}
            <Swiper
                onSwiper={(swiper) => {
                    setThumbsSwiper(swiper)
                    // Inicializa a visibilidade das setas
                    checkThumbnailScrollPosition(swiper)
                }}
                onSlideChange={(swiper) => checkThumbnailScrollPosition(swiper)} // Atualiza na mudança de slide
                onResize={(swiper) => checkThumbnailScrollPosition(swiper)} // Atualiza no resize
                spaceBetween={10}
                // Definimos 4 como base, e o CSS garante o tamanho fixo
                slidesPerView={'auto'} // Alterado para 'auto' para melhor ajuste
                // Breakpoints para ajustar o número de miniaturas em telas maiores
                breakpoints={{
                    // Remove breakpoints específicos de slidesPerView para usar 'auto'
                    // Eles ainda podem ser usados para spaceBetween ou outras configurações
                    640: {
                        spaceBetween: 10,
                    },
                    1024: {
                        spaceBetween: 10,
                    },
                }}
                freeMode={true}
                watchSlidesProgress={true}
                centeredSlides={false} // Centraliza a slide ativa
                modules={[FreeMode, Navigation, Thumbs]}
                className={styles.thumbnailSwiper}
                navigation={{
                    nextEl: `.${styles.thumbnailButtonNext}`,
                    prevEl: `.${styles.thumbnailButtonPrev}`,
                }}
            >
                {images.map((image, index) => (
                    <SwiperSlide
                        key={index}
                        // Adicionando um className para fins de debug e garantir especificidade no CSS
                        className={`${styles.thumbnailSlide} ${currentIndex === index ? styles.activeThumbnail : ''}`}
                    >
                        {/* Removido o onClick manual: o módulo Thumbs garante que o clique funcione */}
                        <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            onClick={() => {
                                if (mainSwiper) {
                                    mainSwiper.slideTo(index)
                                }
                            }}
                        />
                    </SwiperSlide>
                ))}
                {/* Botões de Navegação Thumbnail - Renderiza se houver mais de 4 para a navegação ser relevante */}
                {images.length > 4 && (
                    <>
                        <div className={`${styles.thumbnailButtonPrev} ${!showThumbnailLeftArrow ? styles.thumbnailButtonPrevDisabled : ''}`}>
                            <Image
                                src={'/assets/svg/arrow-left-bold.svg'}
                                width={25}
                                height={25}
                                alt='arrow-left-thumbnail'
                            />
                        </div>
                        <div className={`${styles.thumbnailButtonNext} ${!showThumbnailRightArrow ? styles.thumbnailButtonNextDisabled : ''}`}>
                            <Image
                                src={'/assets/svg/arrow-right-bold.svg'}
                                width={25}
                                height={25}
                                alt='arrow-right-thumbnail'
                            />
                        </div>
                    </>
                )}
            </Swiper>

            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={images.map(image => ({ src: image }))}
                index={currentIndex}
                plugins={[ZoomPlugin]}
            />
        </div>
    )
}

export default VehicleCarousel
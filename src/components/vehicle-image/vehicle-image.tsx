import React, { useState } from 'react'
import Image from 'next/image'

const FALLBACK_IMAGE_URL = '/assets/images/default-vehicle-image.jpg';

interface VehicleImageProps {
    src?: string
    alt: string
    sizes?: string
    className?: string
    onClick?(): void
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export default function VehicleImage({
    src,
    alt,
    sizes = "(max-width: 768px) 100vw, 33vw",
    className,
    onClick
}: VehicleImageProps) {

    const [imgSrc, setImgSrc] = useState<string | null>(null);

    if (!imgSrc && src && API_BASE_URL) {
        setImgSrc(`${API_BASE_URL}${src}`);
    }

    const finalSrc = imgSrc || FALLBACK_IMAGE_URL;

    const handleError = () => {
        if (imgSrc !== FALLBACK_IMAGE_URL) {
            setImgSrc(FALLBACK_IMAGE_URL);
        }
    };

    if (!imgSrc || imgSrc === FALLBACK_IMAGE_URL) {
        return (
            <Image
                src={FALLBACK_IMAGE_URL}
                alt={`Imagem de ${alt} não carregada`}
                fill
                sizes={sizes}
                style={{ objectFit: 'cover' }}
                className={className ?? ''}
                onClick={onClick && onClick}
            />
        );
    }

    return (
        <Image
            src={finalSrc}
            alt={alt}
            fill
            sizes={sizes}
            priority
            style={{ objectFit: 'cover' }}
            onError={handleError}
            className={className ?? ''}
            onClick={onClick && onClick}
        // placeholder='blur'
        // blurDataURL={finalSrc}
        />
    )
}
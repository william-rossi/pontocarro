'use client'

import React from 'react'
import styles from './skeleton.module.css'

export default function VehicleCarouselSkeleton() {
    return (
        <div className={styles.carouselSkeleton}>
            <div className={styles.mainImageSkeleton}></div>
            <div className={styles.thumbnailContainerSkeleton}>
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className={styles.thumbnailSkeleton}></div>
                ))}
            </div>
        </div>
    )
}

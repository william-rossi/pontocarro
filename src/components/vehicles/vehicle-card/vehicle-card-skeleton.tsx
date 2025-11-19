'use client'

import React from 'react'
import styles from './skeleton.module.css'

export default function VehicleCardSkeleton() {
    return (
        <div className={`${styles.skeletonContainer} ${styles.loading}`}>
            <div className={styles.skeletonImageArea}></div>
            <div className={styles.skeletonDescriptionArea}>
                <div className={styles.skeletonVehicleName}></div>
                <div className={styles.skeletonResources}>
                    <div className={styles.skeletonResource}></div>
                    <div className={styles.skeletonResource}></div>
                    <div className={styles.skeletonResource}></div>
                    <div className={styles.skeletonResource}></div>
                </div>
                <div className={styles.skeletonBottomResources}>
                    <div className={styles.skeletonCity}></div>
                    <div className={styles.skeletonType}></div>
                </div>
            </div>
        </div>
    )
}

'use client'

import React from 'react'
import styles from './meus-veiculos-skeleton.module.css'

export default function MeusVeiculosSkeleton() {
    return (
        <div className={styles.skeletonGrid}>
            {[...Array(6)].map((_, index) => (
                <div key={index} className={`${styles.skeletonCard} ${styles.loading}`}>
                    <div className={styles.skeletonImageArea}></div>
                    <div className={styles.skeletonDescriptionArea}>
                        <div className={styles.skeletonLine}></div> {/* Title */}
                        <div className={styles.skeletonLine}></div> {/* Price */}
                        <div className={styles.skeletonLine}></div> {/* City, Date */}
                        <div className={styles.skeletonLine}></div> {/* Mileage */}
                        <div className={styles.skeletonLine}></div> {/* Fuel */}
                        <div className={styles.skeletonLine}></div> {/* Transmission */}
                        <div className={styles.skeletonLine}></div> {/* BodyType */}
                        <div className={styles.skeletonLine}></div> {/* Visualizar */}
                        <div className={styles.skeletonLine}></div> {/* Editar */}
                        <div className={styles.skeletonLine}></div> {/* Excluir */}
                    </div>
                </div>
            ))}
        </div>
    )
}

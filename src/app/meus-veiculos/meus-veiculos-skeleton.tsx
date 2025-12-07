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
                        <div className={styles.skeletonLine}></div> {/* Título */}
                        <div className={styles.skeletonLine}></div> {/* Preço */}
                        <div className={styles.skeletonLine}></div> {/* Cidade, Data */}
                        <div className={styles.skeletonLine}></div> {/* Quilometragem */}
                        <div className={styles.skeletonLine}></div> {/* Combustível */}
                        <div className={styles.skeletonLine}></div> {/* Câmbio */}
                        <div className={styles.skeletonLine}></div> {/* Tipo de Carroceria */}
                        <div className={styles.skeletonLine}></div> {/* Botão Visualizar */}
                        <div className={styles.skeletonLine}></div> {/* Botão Editar */}
                        <div className={styles.skeletonLine}></div> {/* Botão Excluir */}
                    </div>
                </div>
            ))}
        </div>
    )
}

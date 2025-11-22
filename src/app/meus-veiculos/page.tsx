import React from 'react'
import styles from './styles.module.css'
import BackButtonAnnounce from '@/components/back-button-announce/back-button-announce'

export default function MeusVeiculos() {
    return (
        <section className={styles.container}>
            <BackButtonAnnounce />
        </section>
    )
}

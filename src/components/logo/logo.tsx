import React from 'react'
import styles from './styles.module.css'
import Link from 'next/link'

export default function Logo() {
    return (
        <Link href={'/'} className={styles.logoArea}>
            <div className={styles.dot} />
            <span>CARRO</span>
        </Link>
    )
}

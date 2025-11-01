import React from 'react'
import styles from './styles.module.css'

interface ErrorPageProps {
    message: string
}

export default function ErrorPage({ message }: ErrorPageProps) {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Ocorreu um erro!</h1>
            <p className={styles.message}>{message}</p>
        </div>
    )
}

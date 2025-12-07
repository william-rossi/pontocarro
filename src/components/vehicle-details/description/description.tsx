import React from 'react'
import styles from './styles.module.css'

interface DescriptionProps {
    description: string
}

export default function Description({ description }: DescriptionProps) {
    return (
        <div className={styles.container}>
            <h3>Descrição</h3>
            <p>{description}</p>
        </div>
    )
}

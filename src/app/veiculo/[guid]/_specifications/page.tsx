import React from 'react'
import styles from './styles.module.css'
import Image from 'next/image'

interface SpecificationsProps {
    features?: string[]
}

export default function Specifications({ features }: SpecificationsProps) {
    if (!features)
        return null

    return (
        <div className={styles.container}>
            <h3>Características</h3>
            <div className={styles.resources}>
                {features.map((feature, index) => (
                    <div className={styles.resource} key={index}>
                        <Image src={'/assets/svg/check.svg'} width={19} height={19} alt='' />
                        <span>{feature.charAt(0).toUpperCase() + feature.slice(1)}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

import React from 'react'
import styles from './styles.module.css'
import Image from 'next/image'

export default function Specifications() {
    const resources = [
        {
            id: 1,
            name: 'Câmera de Ré',
        },
        {
            id: 2,
            name: 'Bluetooth',
        },
        {
            id: 3,
            name: 'Controle de Velocidade',
        },
        {
            id: 4,
            name: 'Vidros Elétricos',
        }
    ]

    return (
        <div className={styles.container}>
            <h3>Características</h3>
            <div className={styles.resources}>
                {resources.map((item, index) => (
                    <div className={styles.resource} key={index}>
                        <Image src={'/assets/svg/check.svg'} width={19} height={19} alt='' />
                        <span>{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

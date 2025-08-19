import Input from '@/components/input/input'
import React from 'react'
import styles from './styles.module.css'
import Image from 'next/image'

export default function VehicleFilter() {
    return (
        <div className={styles.container}>
            <div className={styles.inputArea}>
                <Input
                    placeholder="Busca por marca, modelo, cor, localização..."
                    startIcon="/assets/svg/magnifying-glass.svg"
                    className={styles.input}
                    iconSize={23}
                />
                <div className={styles.filterBtn}>
                    <Image src={'/assets/svg/filter.svg'} alt='filter' width={21} height={21} />
                    <span>Filtros</span>
                </div>
            </div>
        </div>
    )
}

import React from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import ContactButton from '../_contact-button/page'

export default function VehicleBasic() {


    return (
        <div className={styles.container}>
            <div className={styles.name}>
                <h1>2020 Volkswagen Gol 1.6</h1>
                <div className={styles.city}>
                    <Image src={'/assets/svg/location.svg'} width={18} height={18} alt='' />
                    <span>São Paulo, SP</span>
                </div>
            </div>
            <span className={styles.price}>R$ 52.000</span>
            <div className={styles.resources}>
                <div className={styles.resource}>
                    <div className={styles.resourceTitle}>
                        <Image src={'/assets/svg/speedometer.svg'} width={18} height={18} alt='' />
                        <span>Quilometragem</span>
                    </div>
                    <b>35.000 km</b>
                </div>
                <div className={styles.resource}>
                    <div className={styles.resourceTitle}>
                        <Image src={'/assets/svg/fuel.svg'} width={18} height={18} alt='' />
                        <span>Combustível</span>
                    </div>
                    <b>Flex</b>
                </div>
                <div className={styles.resource}>
                    <div className={styles.resourceTitle}>
                        <Image src={'/assets/svg/paint.svg'} width={18} height={18} alt='' />
                        <span>Câmbio</span>
                    </div>
                    <b>Manual</b>
                </div>
                <div className={styles.resource}>
                    <div className={styles.resourceTitle}>
                        <Image src={'/assets/svg/paint.svg'} width={18} height={18} alt='' />
                        <span>Tipo</span>
                    </div>
                    <b>Hatch</b>
                </div>
            </div>
            <ContactButton />
        </div>
    )
}

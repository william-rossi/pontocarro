import React from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import Link from 'next/link'

export default function VehicleCard() {
    return (
        <Link href={'/veiculo/guid'} className={styles.container}>
            <div className={styles.imageArea}>
                <img src={'https://images.pexels.com/photos/544542/pexels-photo-544542.jpeg?auto=compress&cs=tinysrgb&w=800'} alt='image' />
                <label>R$ 52.000</label>
            </div>
            <div className={styles.descriptionArea}>
                <div className={styles.vehicleName}>
                    <h3>Honda Civic</h3>
                    <span className={styles.year}>2020</span>
                </div>
                <div className={styles.resources}>
                    <div className={styles.resource}>
                        <Image src={'/assets/svg/speedometer.svg'} width={17} height={17} alt='' />
                        <span>20.000 km</span>
                    </div>
                    <div className={styles.resource}>
                        <Image src={'/assets/svg/fuel.svg'} width={17} height={17} alt='' />
                        <span>Flex</span>
                    </div>
                    <div className={styles.resource}>
                        <Image src={'/assets/svg/schedule.svg'} width={17} height={17} alt='' />
                        <span>Manual</span>
                    </div>
                    <div className={styles.resource}>
                        <Image src={'/assets/svg/paint.svg'} width={17} height={17} alt='' />
                        <span>Azul</span>
                    </div>
                </div>
                <div className={styles.bottomResources}>
                    <div className={styles.city}>
                        <Image src={'/assets/svg/location.svg'} width={17} height={17} alt='' />
                        <span>São Paulo, SP</span>
                    </div>
                    <span className={styles.type}>Sedan</span>
                </div>
            </div>
        </Link>
    )
}

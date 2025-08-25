import React from 'react'
import styles from './styles.module.css'
import VehicleBasic from './_vehicle-basic/page'
import Description from './_description/page'
import Specifications from './_specifications/page'
import VehicleCarousel from './_vehicle-vehicle-carousel/page'
import BackButtonAnnounce from '@/components/back-button-announce/back-button-announce'

export default function Veiculo() {
    return (
        <section className={styles.container}>
            <BackButtonAnnounce />
            <div className={styles.content}>
                <div className={styles.division}>
                    <div className={styles.carousel}>
                        <VehicleCarousel />
                    </div>
                    <div className={styles.infos}>
                        <VehicleBasic />
                    </div>
                </div>
                <div className={styles.divisor} />
                <div className={styles.division}>
                    <div className={styles.description}>
                        <Description />
                    </div>
                    <div className={styles.specifications}>
                        <Specifications />
                    </div>
                </div>
            </div>
        </section>
    )
}

import React from 'react'
import styles from './styles.module.css'
import Back from './_back/page'
import VehicleCarousel from './_vehicle-carousel/page'
import VehicleBasic from './_vehicle-basic/page'
import Description from './_description/page'
import Specifications from './_specifications/page'

export default function Veiculo() {
    return (
        <section className={styles.container}>
            <Back />
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

import React from 'react'
import styles from './styles.module.css'
import VehicleBasic from './_vehicle-basic/page'
import Description from './_description/page'
import Specifications from './_specifications/page'
import BackButtonAnnounce from '@/components/back-button-announce/back-button-announce'
import { getVehicleById } from '@/services/vehicles'
import ErrorPage from './_error-page/page'
import { Vehicle } from '@/types/vehicles'
import VehicleCarousel from './_vehicle-carousel/page'

export default async function Veiculo({ params }: { params: Promise<{ guid: string }> }) {
    const { guid } = await params

    let vehicle: Vehicle | undefined

    try {
        vehicle = await getVehicleById(guid)
    }
    catch (error: any) {
        return <ErrorPage message={error.message} />
    }

    if (!vehicle)
        return <ErrorPage message="Veículo não encontrado." />

    return (
        <section className={styles.container}>
            <BackButtonAnnounce />
            <div className={styles.content}>
                <div className={styles.division}>
                    <div className={styles.carousel}>
                        <VehicleCarousel vehicleId={vehicle._id} />
                    </div>
                    <div className={styles.infos}>
                        <VehicleBasic vehicle={vehicle} />
                    </div>
                </div>
                <div className={styles.divisor} />
                <div className={styles.division}>
                    <div className={styles.description}>
                        <Description description={vehicle.description} />
                    </div>
                    <div className={styles.specifications}>
                        <Specifications features={vehicle.features} />
                    </div>
                </div>
            </div>
        </section>
    )
}

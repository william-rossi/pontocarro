'use client'

import React from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { VehicleSummary } from '@/types/vehicles'
import { formatPrice, formatMileage } from '@/services/utils'

interface VehicleCardProps {
    vehicle: VehicleSummary
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
    const imageUrl = vehicle.firstImageUrl || 'https://via.placeholder.com/150' // Usa `firstImageUrl` da propriedade ou um placeholder

    return (
        <Link href={`/veiculo/${vehicle._id}`} className={styles.container}>
            <div className={styles.imageArea}>
                <img src={imageUrl} alt={vehicle.title} />
                <span>{formatPrice(vehicle.price)}</span>
            </div>
            <div className={styles.descriptionArea}>
                <div className={styles.vehicleName}>
                    <h3>{`${vehicle.brand} ${vehicle.vehicleModel}`}</h3>
                    <span className={styles.year}>{vehicle.year}</span>
                </div>
                <div className={styles.resources}>
                    <div className={styles.resource}>
                        <Image src={'/assets/svg/speedometer.svg'} width={17} height={17} alt='' />
                        <span>{`${formatMileage(vehicle.mileage)} km`}</span>
                    </div>
                    <div className={styles.resource}>
                        <Image src={'/assets/svg/fuel.svg'} width={17} height={17} alt='' />
                        <span>{vehicle.fuel}</span>
                    </div>
                    <div className={styles.resource}>
                        <Image src={'/assets/svg/schedule.svg'} width={17} height={17} alt='' />
                        <span>{vehicle.transmission}</span>
                    </div>
                    <div className={styles.resource}>
                        <Image src={'/assets/svg/paint.svg'} width={17} height={17} alt='' />
                        <span>{vehicle.color}</span>
                    </div>
                </div>
                <div className={styles.bottomResources}>
                    <div className={styles.city}>
                        <Image src={'/assets/svg/location.svg'} width={17} height={17} alt='' />
                        <span>{`${vehicle.city}, ${vehicle.state}`}</span>
                    </div>
                    <span className={styles.type}>{vehicle.bodyType}</span>
                </div>
            </div>
        </Link>
    )
}

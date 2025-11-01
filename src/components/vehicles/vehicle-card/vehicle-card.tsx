'use client'

import React from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { Vehicle } from '@/types/vehicles'
import { formatPrice } from '@/services/utils'
import { getFirstImageByVehicleId } from '@/services/vehicles'

interface VehicleCardProps {
    vehicle: Vehicle
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
    const imageUrl = vehicle.firstImageUrl || 'https://via.placeholder.com/150' // Use firstImageUrl from prop

    return (
        <Link href={`/veiculo/${vehicle._id}`} className={styles.container}>
            <div className={styles.imageArea}>
                <img src={imageUrl} alt={vehicle.title} />
                <label>{formatPrice(vehicle.price)}</label>
            </div>
            <div className={styles.descriptionArea}>
                <div className={styles.vehicleName}>
                    <h3>{`${vehicle.brand} ${vehicle.vehicleModel}`}</h3>
                    <span className={styles.year}>{vehicle.year}</span>
                </div>
                <div className={styles.resources}>
                    <div className={styles.resource}>
                        <Image src={'/assets/svg/speedometer.svg'} width={17} height={17} alt='' />
                        <span>{`${vehicle.mileage} km`}</span>
                    </div>
                    <div className={styles.resource}>
                        <Image src={'/assets/svg/fuel.svg'} width={17} height={17} alt='' />
                        <span>{vehicle.fuel}</span>
                    </div>
                    <div className={styles.resource}>
                        <Image src={'/assets/svg/schedule.svg'} width={17} height={17} alt='' />
                        <span>{vehicle.exchange}</span>
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

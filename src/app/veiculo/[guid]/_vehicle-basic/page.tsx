import React from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import ContactButton from '../_contact-button/page'
import { Vehicle } from '@/types/vehicles'
import { formatMileage, formatPrice } from '@/services/utils'

interface VehicleBasicProps {
    vehicle: Vehicle
}

export default function VehicleBasic({ vehicle }: VehicleBasicProps) {
    return (
        <div className={styles.container}>
            <div className={styles.name}>
                <h1>{`${vehicle.year} ${vehicle.title}`}</h1>
                <div className={styles.city}>
                    <Image src={'/assets/svg/location.svg'} width={18} height={18} alt='' />
                    <span>{`${vehicle.city}, ${vehicle.state}`}</span>
                </div>
            </div>
            <span className={styles.price}>{formatPrice(vehicle.price)}</span>
            <div className={styles.resources}>
                <div className={styles.resource}>
                    <div className={styles.resourceTitle}>
                        <Image src={'/assets/svg/speedometer.svg'} width={18} height={18} alt='' />
                        <span>Quilometragem</span>
                    </div>
                    <b>{formatMileage(vehicle.mileage)} km</b>
                </div>
                <div className={styles.resource}>
                    <div className={styles.resourceTitle}>
                        <Image src={'/assets/svg/fuel.svg'} width={18} height={18} alt='' />
                        <span>Combustível</span>
                    </div>
                    <b>{vehicle.fuel}</b>
                </div>
                <div className={styles.resource}>
                    <div className={styles.resourceTitle}>
                        <Image src={'/assets/svg/paint.svg'} width={18} height={18} alt='' />
                        <span>Câmbio</span>
                    </div>
                    <b>{vehicle.engine} {vehicle.transmission}</b>
                </div>
                <div className={styles.resource}>
                    <div className={styles.resourceTitle}>
                        <Image src={'/assets/svg/paint.svg'} width={18} height={18} alt='' />
                        <span>Tipo</span>
                    </div>
                    <b>{vehicle.bodyType}</b>
                </div>
            </div>
            <ContactButton
                vehicle={vehicle}
            />
        </div>
    )
}

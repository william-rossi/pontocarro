import React from 'react'
import styles from './styles.module.css'
import VehicleCard from './vehicle-card/vehicle-card'
import VehicleFilter from './vehicle-filter/vehicle-filter'

export default function Vehicles() {
    return (
        <section className={styles.container}>
            <VehicleFilter />
            <span className={styles.foundVehicles}>6 veículos encontrados</span>
            <div className={styles.vehiclesList}>
                <VehicleCard />
                <VehicleCard />
                <VehicleCard />
                <VehicleCard />
                <VehicleCard />
                <VehicleCard />
            </div>
        </section>
    )
}

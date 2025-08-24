import React from 'react'
import styles from './styles.module.css'
import VehicleVehicle from './vehicle-vehicle/vehicle-vehicle'
import VehicleFilter from './vehicle-filter/vehicle-filter'

export default function Vehicles() {
    return (
        <section className={styles.container}>
            <VehicleFilter />
            <span className={styles.foundVehicles}>6 vehicles encontrados</span>
            <div className={styles.vehiclesList}>
                <VehicleVehicle />
                <VehicleVehicle />
                <VehicleVehicle />
                <VehicleVehicle />
                <VehicleVehicle />
                <VehicleVehicle />
            </div>
        </section>
    )
}

'use client'

import React from 'react'
import styles from './styles.module.css'
import VehicleFilter from './vehicle-filter/vehicle-filter'
import { useEffect, useState } from 'react'
import { getVehicles, searchVehicles, VehicleFilter as VehicleFilterType } from '@/services/vehicles'
import { Vehicle } from '@/types/vehicles'
import VehicleCard from './vehicle-card/vehicle-card'

export default function Vehicles() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalVehicles, setTotalVehicles] = useState(0)
    const [currentFilters, setCurrentFilters] = useState<VehicleFilterType>({})
    const [showFilterOptions, setShowFilterOptions] = useState(false)
    const vehiclesPerPage = 6

    useEffect(() => {
        const fetchVehicles = async () => {
            setLoading(true)
            setError(null)
            try {
                let responseData: { vehicles: Vehicle[], currentPage: number, totalPages: number, totalVehicles: number }
                if (Object.keys(currentFilters).some(key => currentFilters[key as keyof VehicleFilterType] !== undefined && currentFilters[key as keyof VehicleFilterType] !== '')) {
                    const filtersWithPageAndLimit = {
                        ...currentFilters,
                        page: currentPage,
                        limit: vehiclesPerPage,
                    }
                    responseData = await searchVehicles(filtersWithPageAndLimit)
                } else {
                    responseData = await getVehicles(currentPage, vehiclesPerPage)
                }
                setVehicles(responseData.vehicles)
                setCurrentPage(responseData.currentPage)
                setTotalPages(responseData.totalPages)
                setTotalVehicles(responseData.totalVehicles)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchVehicles()
    }, [currentPage, currentFilters])

    const handleFilterChange = (filters: VehicleFilterType) => {
        setCurrentFilters(filters)
        setCurrentPage(1)
    }

    const handleApplyFilters = (filters: VehicleFilterType) => {
        setCurrentFilters(filters)
        setCurrentPage(1)
        setShowFilterOptions(false) // Hide filters after applying
    }

    const handleClearFilters = () => {
        setCurrentFilters({})
        setCurrentPage(1)
        setShowFilterOptions(false) // Hide filters after clearing
    }

    const toggleFilterOptions = () => {
        setShowFilterOptions(prev => !prev)
    }

    if (loading) {
        return <section className={styles.container}><p>Carregando veículos...</p></section>
    }

    if (error) {
        return <section className={styles.container}><p className={styles.error}>Erro ao carregar veículos: {error}</p></section>
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1)
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1)
        }
    }

    // Remove displayVehicles slice as pagination is now handled by the API

    return (
        <section className={styles.container}>
            <VehicleFilter
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                showFilterOptions={showFilterOptions}
                toggleFilterOptions={toggleFilterOptions}
            />
            <span className={styles.foundVehicles}>{totalVehicles} vehicles encontrados</span>
            <div className={styles.vehiclesList}>
                {vehicles.length > 0 ? (
                    vehicles.map(vehicle => (
                        <VehicleCard key={vehicle._id} vehicle={vehicle} />
                    ))
                ) : (
                    <p>Nenhum veículo encontrado com os filtros aplicados.</p>
                )}
            </div>
            <div className={styles.pagination}>
                <button onClick={handlePrevPage} disabled={currentPage === 1}>Anterior</button>
                <span>Página {currentPage} de {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>Próxima</button>
            </div>
        </section>
    )
}

'use client'

import React from 'react'
import styles from './styles.module.css'
import VehicleFilter from './vehicle-filter/vehicle-filter'
import { useEffect, useState } from 'react'
import { getVehicles, searchVehicles, VehicleFilter as VehicleFilterType } from '@/services/vehicles'
import { Vehicle } from '@/types/vehicles'
import VehicleCard from './vehicle-card/vehicle-card'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Vehicles() {
    const router = useRouter()
    const searchParams = useSearchParams()

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
        const pageFromUrl = Number(searchParams.get('page')) || 1
        const limitFromUrl = Number(searchParams.get('limit')) || vehiclesPerPage
        const filtersFromUrl: VehicleFilterType = {}
        searchParams.forEach((value, key) => {
            if (key !== 'page' && key !== 'limit') {
                (filtersFromUrl as any)[key] = value
            }
        })

        const filtersChanged = JSON.stringify(filtersFromUrl) !== JSON.stringify(currentFilters)
        const pageChanged = pageFromUrl !== currentPage

        if (pageChanged) {
            setCurrentPage(pageFromUrl)
        }
        if (filtersChanged) {
            setCurrentFilters(filtersFromUrl)
        }
    }, [searchParams]) // Removed currentPage, currentFilters, vehiclesPerPage from dependencies

    useEffect(() => {
        const fetchVehicles = async () => {
            setLoading(true)
            setError(null)
            try {
                let responseData: { vehicles: Vehicle[], currentPage: number, totalPages: number, totalVehicles: number }
                const filtersToSend = { ...currentFilters, page: currentPage, limit: vehiclesPerPage }

                if (Object.keys(currentFilters).some(key => currentFilters[key as keyof VehicleFilterType] !== undefined && currentFilters[key as keyof VehicleFilterType] !== '')) {
                    responseData = await searchVehicles(filtersToSend)
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
    }, [currentPage, currentFilters, vehiclesPerPage])

    const updateUrl = (page: number, filters: VehicleFilterType) => {
        const newSearchParams = new URLSearchParams()
        newSearchParams.set('page', page.toString())
        newSearchParams.set('limit', vehiclesPerPage.toString())
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                newSearchParams.set(key, String(value))
            }
        })
        router.push(`?${newSearchParams.toString()}`)
    }

    const handleApplyFilters = (filters: VehicleFilterType) => {
        setCurrentFilters(filters)
        setCurrentPage(1)
        setShowFilterOptions(false)
        updateUrl(1, filters)
    }

    const handleClearFilters = () => {
        setCurrentFilters({})
        setCurrentPage(1)
        setShowFilterOptions(false)
        updateUrl(1, {})
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
            const newPage = currentPage + 1
            setCurrentPage(newPage)
            updateUrl(newPage, currentFilters)
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1
            setCurrentPage(newPage)
            updateUrl(newPage, currentFilters)
        }
    }

    return (
        <section className={styles.container}>
            <VehicleFilter
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                showFilterOptions={showFilterOptions}
                toggleFilterOptions={toggleFilterOptions}
            />
            {
                totalVehicles > 1
                    ?
                    <span className={styles.foundVehicles}>{totalVehicles} veículos encontrados</span>
                    :
                    <span className={styles.foundVehicles}>{totalVehicles} veículo encontrado</span>
            }
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

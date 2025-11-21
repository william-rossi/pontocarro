'use client'

import React, { useCallback, useEffect, useState } from 'react'
import styles from './styles.module.css'
import VehicleFilter from './vehicle-filter/vehicle-filter'
import { getVehicles, searchVehicles, VehicleFilter as VehicleFilterType } from '@/services/vehicles'
import { VehicleSummary } from '@/types/vehicles'
import VehicleCard from './vehicle-card/vehicle-card'
import VehicleCardSkeleton from './vehicle-card/vehicle-card-skeleton'
import Button from '../button/button'
import { locations } from '@/app/constants/locations'

export default function Vehicles() {
    const [vehicles, setVehicles] = useState<VehicleSummary[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalVehicles, setTotalVehicles] = useState(0)
    const [currentFilters, setCurrentFilters] = useState<VehicleFilterType>({})
    const [showFilterOptions, setShowFilterOptions] = useState(false)
    const vehiclesPerPage = 12
    const [userLocation, setUserLocation] = useState<{ city: string; state: string } | null>(null)
    const [useLocationFilter, setUseLocationFilter] = useState(false)
    const [isLocationChecked, setIsLocationChecked] = useState(false)

    // Função assíncrona para obter e geocodificar a localização (pura, sem lógica de state/filtro)
    const requestUserLocation = useCallback(async () => {
        return new Promise<{ city: string; state: string } | null>((resolve) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords
                        try {
                            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                            const data = await response.json()
                            const city = data.address?.city || data.address?.town || data.address?.village
                            const stateFullName = data.address?.state
                            const state = locations.states.find(s => s.name === stateFullName)?.acronym || stateFullName

                            if (city && state) {
                                resolve({ city, state })
                            } else {
                                resolve(null)
                            }
                        } catch (geoError) {
                            console.error("Erro durante a geocodificação reversa:", geoError)
                            resolve(null)
                        }
                    },
                    (geoError) => {
                        console.error("Erro ao obter a localização do usuário:", geoError)
                        resolve(null)
                    },
                    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 } // Adiciona opções para forçar precisão
                )
            } else {
                console.log("Geolocalização não é suportada por este navegador.")
                resolve(null)
            }
        })
    }, [])

    // Efeito para checar o localStorage e obter a localização inicial
    useEffect(() => {
        const initializeLocationAndFilters = async () => {
            setLoading(true)
            const storedLocation = localStorage.getItem('userLocation')
            const storedUseLocationFilter = localStorage.getItem('useLocationFilter')
            const initialUseLocationFilter = storedUseLocationFilter === 'true'

            if (storedLocation && initialUseLocationFilter) {
                // Caso 1: Localização salva e filtro ATIVO. Carrega e usa.
                const parsedLocation = JSON.parse(storedLocation)
                setUserLocation(parsedLocation)
                // Não modifica currentFilters aqui para não disparar a busca desnecessariamente, 
                // o useEffect de busca fará isso baseado em useLocationFilter e userLocation
                setUseLocationFilter(true)
            } else if (storedUseLocationFilter === 'false') {
                // Caso 2: Filtro DESATIVADO explicitamente. Respeita.
                setUseLocationFilter(false)
                setUserLocation(storedLocation ? JSON.parse(storedLocation) : null); // Mantém a localização salva, mas não a usa
            } else {
                // Caso 3: Primeira visita ou estado desconhecido/limpo. Tenta geolocalização.
                const newLocation = await requestUserLocation()
                if (newLocation) {
                    setUserLocation(newLocation)
                    setUseLocationFilter(true)
                    localStorage.setItem('userLocation', JSON.stringify(newLocation))
                    localStorage.setItem('useLocationFilter', 'true')
                } else {
                    setUseLocationFilter(false)
                    localStorage.setItem('useLocationFilter', 'false')
                }
            }

            setIsLocationChecked(true)
        }

        initializeLocationAndFilters()
    }, [requestUserLocation])

    // Efeito para buscar veículos
    useEffect(() => {
        if (!isLocationChecked) {
            return
        }

        const fetchVehicles = async () => {
            setLoading(true)
            setError(null)
            try {
                let responseData: { vehicles: VehicleSummary[], currentPage: number, totalPages: number, totalVehicles: number }

                const filtersToSend: VehicleFilterType = { ...currentFilters, page: currentPage, limit: vehiclesPerPage }
                const finalFilters = { ...filtersToSend }

                if (useLocationFilter && userLocation) {
                    finalFilters.city = userLocation.city
                    finalFilters.state = userLocation.state
                } else {
                    delete finalFilters.city
                    delete finalFilters.state
                }

                // Verifica se há filtros ATIVOS (incluindo ou excluindo a localização)
                const hasActiveFilters = Object.keys(finalFilters).some(key =>
                    (key !== 'page' && key !== 'limit' && (finalFilters as Record<string, any>)[key] !== undefined && (finalFilters as Record<string, any>)[key] !== '')
                )

                if (hasActiveFilters) {
                    responseData = await searchVehicles(finalFilters)
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
    }, [currentPage, currentFilters, vehiclesPerPage, useLocationFilter, userLocation, isLocationChecked])

    const handleApplyFilters = (filters: VehicleFilterType) => {
        setCurrentFilters(filters)
        setCurrentPage(1)
        setShowFilterOptions(false)
        if (Object.keys(filters).some(key => key !== 'city' && key !== 'state')) {
            setUseLocationFilter(false)
            localStorage.setItem('useLocationFilter', 'false')
        }
    }

    const handleClearFilters = () => {
        setCurrentFilters({})
        setCurrentPage(1)
        setShowFilterOptions(false)
        setUseLocationFilter(false)
        localStorage.setItem('useLocationFilter', 'false')
    }

    const toggleFilterOptions = () => {
        setShowFilterOptions(prev => !prev)
    }

    const handleViewAllCars = () => {
        setCurrentFilters(prevFilters => {
            const newFilters = { ...prevFilters }
            delete newFilters.city
            delete newFilters.state
            return newFilters
        })
        setUseLocationFilter(false)
        localStorage.setItem('useLocationFilter', 'false')
        localStorage.removeItem('userLocation') // Garante que a localização salva seja removida
        setCurrentPage(1)
    }

    // Função corrigida para tentar obter a localização ao ser clicada
    const handleGetMyCityCars = async () => {
        if (!userLocation) {
            setLoading(true);
            const newLocation = await requestUserLocation();
            setLoading(false);

            if (newLocation) {
                // Localização obtida com sucesso no clique
                setUserLocation(newLocation);
                localStorage.setItem('userLocation', JSON.stringify(newLocation));
                localStorage.setItem('useLocationFilter', 'true');
                setUseLocationFilter(true);
                setCurrentPage(1);
            } else {
                alert("Não foi possível obter sua localização. Por favor, verifique se a permissão de geolocalização está concedida para este site.");
                setUseLocationFilter(false);
                localStorage.setItem('useLocationFilter', 'false');
                return;
            }
        } else {
            // Localização já existe, apenas ativa o filtro
            setUseLocationFilter(true);
            localStorage.setItem('useLocationFilter', 'true');
            setCurrentPage(1);
        }
    }

    if (loading) {
        // Tela de carregamento enquanto a geolocalização é verificada/obtida
        return (
            <section className={styles.container}>
                <VehicleFilter
                    onApplyFilters={handleApplyFilters}
                    onClearFilters={handleClearFilters}
                    showFilterOptions={showFilterOptions}
                    toggleFilterOptions={toggleFilterOptions}
                    currentAppliedFilters={currentFilters}
                />
                <div className={styles.vehiclesList}>
                    {Array.from({ length: vehiclesPerPage }).map((_, index) => (
                        <VehicleCardSkeleton key={index} />
                    ))}
                </div>
            </section>
        )
    }

    if (error) {
        return <section className={styles.container}><p className={styles.error}>Erro ao carregar veículos: {error}</p></section>
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            const newPage = currentPage + 1
            setCurrentPage(newPage)
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1
            setCurrentPage(newPage)
        }
    }

    return (
        <section className={styles.container}>
            <VehicleFilter
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                showFilterOptions={showFilterOptions}
                toggleFilterOptions={toggleFilterOptions}
                currentAppliedFilters={currentFilters}
            />
            <div className={styles.foundVehiclesArea}>
                {
                    totalVehicles > 1
                        ?
                        <span className={styles.foundVehicles}>{totalVehicles} veículos encontrados</span>
                        :
                        totalVehicles <= 0 ? <></> : <span className={styles.foundVehicles}>{totalVehicles} veículo encontrado</span>
                }
                {
                    userLocation && useLocationFilter ? (
                        <Button
                            text={userLocation.city}
                            onClick={handleViewAllCars}
                            svg='/assets/svg/close.svg'
                            invert
                        />
                    ) :
                        <Button
                            text="Próximos a mim"
                            onClick={handleGetMyCityCars}
                            invert
                            svg='/assets/svg/location.svg'
                            // Desabilita apenas se estiver no estado de carregamento e userLocation for null
                            disabled={loading && !userLocation}
                        />
                }
            </div>
            <div className={styles.vehiclesList}>
                {vehicles.length > 0 ? (
                    vehicles.map(vehicle => (
                        <VehicleCard key={vehicle._id} vehicle={vehicle} />
                    ))
                ) : (
                    <div className={styles.noVehiclesFound}>
                        <h3>Nenhum veículo encontrado</h3>
                        <p>Tente ajustar seus filtros ou limpar a pesquisa para ver mais veículos.</p>
                    </div>
                )}
            </div>
            {totalVehicles > 0 && (
                <div className={styles.pagination}>
                    <button onClick={handlePrevPage} disabled={currentPage === 1}>Anterior</button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>Próxima</button>
                </div>
            )}
        </section>
    )
}
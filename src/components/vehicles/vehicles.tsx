'use client'

import React, { useCallback, useEffect, useState } from 'react'
import styles from './styles.module.css'
import VehicleFilter from './vehicle-filter/vehicle-filter'
import { getVehicles, searchVehicles, VehicleFilter as VehicleFilterType } from '@/services/vehicles'
import { VehicleSummary } from '@/types/vehicles'
import VehicleCard from './vehicle-card/vehicle-card'
import VehicleCardSkeleton from './vehicle-card/vehicle-card-skeleton'
import Button from '../button/button'
import { locations } from '@/constants/locations'
import { toast } from 'react-toastify'; // Importa a função toast
import { useRouter, useSearchParams } from 'next/navigation'; // Importa useRouter e useSearchParams
import Pagination from './pagination/pagination'; // Importa o componente Pagination

export default function Vehicles() {
    const [vehicles, setVehicles] = useState<VehicleSummary[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalVehicles, setTotalVehicles] = useState(0)
    const [currentFilters, setCurrentFilters] = useState<VehicleFilterType>({})
    const [showFilterOptions, setShowFilterOptions] = useState(false)
    const vehiclesPerPage = 8
    const [userLocation, setUserLocation] = useState<{ city: string; state: string } | null>(null)
    const [useLocationFilter, setUseLocationFilter] = useState(false)
    const [isLocationChecked, setIsLocationChecked] = useState(false)

    const router = useRouter();
    const searchParams = useSearchParams();

    // Função assíncrona para obter e geocodificar a localização (pura, sem lógica de state/filtro)
    const requestUserLocation = useCallback(async () => {
        return new Promise<{ city: string; state: string } | null | { status: 'denied' | 'not_supported' | 'error' }>((resolve) => {
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
                                resolve({ status: 'error' })
                            }
                        } catch (geoError) {
                            console.warn("Erro durante a geocodificação reversa:", geoError)
                            resolve({ status: 'error' })
                        }
                    },
                    (geoError) => {
                        console.warn("Erro ao obter a localização do usuário:", geoError)
                        if (geoError.code === geoError.PERMISSION_DENIED) {
                            resolve({ status: 'denied' })
                        } else {
                            resolve({ status: 'error' })
                        }
                    },
                    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 } // Adiciona opções para forçar precisão
                )
            } else {
                console.log("Geolocalização não é suportada por este navegador.")
                resolve({ status: 'not_supported' })
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
                // Caso 3: Primeira visita ou estado desconhecido/limpo. Não tenta geolocalização automaticamente.
                setUseLocationFilter(false);
                localStorage.setItem('useLocationFilter', 'false');
            }

            setIsLocationChecked(true)
        }

        const pageParam = searchParams.get('page');
        const initialPage = pageParam ? parseInt(pageParam) : 1;
        if (!isNaN(initialPage) && initialPage >= 1) {
            setCurrentPage(initialPage);
        }

        initializeLocationAndFilters()
    }, [requestUserLocation, searchParams])

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

                // Prioriza os filtros de cidade e estado definidos manualmente em currentFilters
                if (useLocationFilter && userLocation) {
                    finalFilters.city = userLocation.city;
                    finalFilters.state = userLocation.state;
                } else if ((finalFilters.city || finalFilters.state) && useLocationFilter) {
                    // Se houver filtros de cidade/estado manuais e geolocalização ativa, desativa a geolocalização
                    setUseLocationFilter(false);
                    localStorage.setItem('useLocationFilter', 'false');
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
        setCurrentFilters(prevFilters => {
            const newFilters = { ...filters };

            // Se o usuário selecionou manualmente cidade ou estado, desativa a geolocalização
            if (newFilters.city || newFilters.state) {
                setUseLocationFilter(false);
                localStorage.setItem('useLocationFilter', 'false');
            } else if (useLocationFilter && userLocation) {
                // Caso contrário, se a geolocalização estiver ativa e houver userLocation, aplica-a
                newFilters.city = userLocation.city;
                newFilters.state = userLocation.state;
            }

            return newFilters;
        });
        setCurrentPage(1);
        setShowFilterOptions(false);
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

            if (newLocation && 'status' in newLocation) {
                if (newLocation.status === 'denied') {
                    toast.warning("A permissão de geolocalização foi negada. Por favor, habilite-a nas configurações do seu navegador para usar esta funcionalidade.");
                } else if (newLocation.status === 'not_supported') {
                    toast.error("Seu navegador não suporta geolocalização.");
                } else {
                    console.error("Não foi possível obter sua localização.");
                }
                setUseLocationFilter(false);
                localStorage.setItem('useLocationFilter', 'false');
                return;
            } else if (newLocation && !('status' in newLocation)) {
                // Localização obtida com sucesso no clique
                setUserLocation(newLocation);
                localStorage.setItem('userLocation', JSON.stringify(newLocation));
                localStorage.setItem('useLocationFilter', 'true');
                setUseLocationFilter(true);
                setCurrentPage(1);
                setCurrentFilters(prevFilters => ({
                    ...prevFilters,
                    city: (newLocation as { city: string; state: string }).city,
                    state: (newLocation as { city: string; state: string }).state,
                }));
            } else {
                toast.error("Não foi possível obter sua localização.");
                setUseLocationFilter(false);
                localStorage.setItem('useLocationFilter', 'false');
                return;
            }
        } else {
            // Localização já existe, apenas ativa o filtro
            setUseLocationFilter(true);
            localStorage.setItem('useLocationFilter', 'true');
            setCurrentPage(1);
            setCurrentFilters(prevFilters => ({
                ...prevFilters,
                city: userLocation.city,
                state: userLocation.state,
            }));
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
            router.push(`?page=${newPage}`, { scroll: false });
            setCurrentPage(newPage)
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1
            if (newPage === 1) {
                router.push('/', { scroll: false });
            } else {
                router.push(`?page=${newPage}`, { scroll: false });
            }
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
                        totalVehicles <= 0 ? <div /> : <span className={styles.foundVehicles}>{totalVehicles} veículo encontrado</span>
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
            {
                totalVehicles > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => {
                            if (page === 1) {
                                router.push('/', { scroll: false });
                            } else {
                                router.push(`?page=${page}`, { scroll: false });
                            }
                            setCurrentPage(page);
                        }}
                        onPrevPage={handlePrevPage}
                        onNextPage={handleNextPage}
                    />
                )
            }
        </section>
    )
}
'use client'

import React, { useCallback, useEffect, useState } from 'react'
import styles from './styles.module.css'
import VehicleFilterComponent from './vehicle-filter/vehicle-filter'
import { getVehicles, searchVehicles } from '@/services/vehicles'
import { VehicleFilter } from '@/types/vehicle-filters'
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
    const [currentFilters, setCurrentFilters] = useState<VehicleFilter>({})
    const [showFilterOptions, setShowFilterOptions] = useState(false)
    const vehiclesPerPage = 8
    const [userLocation, setUserLocation] = useState<{ city: string; state: string } | null>(null)
    const [useLocationFilter, setUseLocationFilter] = useState(false)
    const [isLocationChecked, setIsLocationChecked] = useState(false)
    const [hasActiveFilters, setHasActiveFilters] = useState(false) // Novo estado para controlar a visibilidade do botão Limpar Filtros

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

    // Efeito para checar o localStorage e obter a localização inicial e inicializar filtros da URL
    useEffect(() => {
        const initializeLocationAndFilters = async () => {
            // O loading será controlado pelo useEffect de fetchVehicles.
            // setLoading(true)
            const storedLocation = localStorage.getItem('userLocation')
            const storedUseLocationFilter = localStorage.getItem('useLocationFilter')
            const initialUseLocationFilter = storedUseLocationFilter === 'true'

            if (storedLocation && initialUseLocationFilter) {
                const parsedLocation = JSON.parse(storedLocation)
                setUserLocation(parsedLocation)
                setUseLocationFilter(true)
            } else if (storedUseLocationFilter === 'false') {
                setUseLocationFilter(false)
                setUserLocation(storedLocation ? JSON.parse(storedLocation) : null);
            } else {
                setUseLocationFilter(false);
                localStorage.setItem('useLocationFilter', 'false');
            }

            setIsLocationChecked(true)
        }

        initializeLocationAndFilters()
    }, [requestUserLocation]) // Dependência apenas em requestUserLocation

    // Efeito para buscar veículos baseado nos parâmetros da URL e estado de localização
    useEffect(() => {
        if (!isLocationChecked) {
            return
        }

        const fetchVehicles = async () => {
            setLoading(true)
            setError(null)
            try {
                let responseData: { vehicles: VehicleSummary[], currentPage: number, totalPages: number, totalVehicles: number }

                const filtersFromUrl: VehicleFilter = {};
                let pageFromUrl = 1;

                for (const [key, value] of searchParams.entries()) {
                    if (key === 'page') {
                        const parsedPage = parseInt(value);
                        if (!isNaN(parsedPage) && parsedPage >= 1) {
                            pageFromUrl = parsedPage;
                        }
                    } else if (key !== 'limit') { // 'limit' não é um filtro a ser aplicado pela UI
                        if (key === 'minPrice' || key === 'maxPrice' || key === 'minYear' || key === 'maxYear' || key === 'mileage' || key === 'maxMileage') {
                            const parsedValue = parseFloat(value);
                            if (!isNaN(parsedValue)) {
                                (filtersFromUrl as Record<string, any>)[key] = parsedValue;
                            }
                        } else {
                            (filtersFromUrl as Record<string, any>)[key] = value;
                        }
                    }
                }

                // Atualiza o currentPage e currentFilters baseando-se na URL
                setCurrentPage(pageFromUrl);
                setCurrentFilters(filtersFromUrl);

                const finalFilters = { ...filtersFromUrl, page: pageFromUrl, limit: vehiclesPerPage }

                if (useLocationFilter && userLocation) {
                    finalFilters.city = userLocation.city;
                    finalFilters.state = userLocation.state;
                } else if ((finalFilters.city || finalFilters.state) && useLocationFilter) {
                    // Se houver filtros de cidade/estado manuais e geolocalização ativa, desativa a geolocalização
                    setUseLocationFilter(false);
                    localStorage.setItem('useLocationFilter', 'false');
                }

                const hasFilters = Object.keys(finalFilters).some(key =>
                    (key !== 'page' && key !== 'limit' && (finalFilters as Record<string, any>)[key] !== undefined && (finalFilters as Record<string, any>)[key] !== '')
                )
                setHasActiveFilters(hasFilters || useLocationFilter); // Atualiza o estado

                if (hasFilters) {
                    responseData = await searchVehicles(finalFilters)
                } else {
                    responseData = await getVehicles(pageFromUrl, vehiclesPerPage) // Usa pageFromUrl aqui
                }

                setVehicles(responseData.vehicles)
                setTotalPages(responseData.totalPages)
                setTotalVehicles(responseData.totalVehicles)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchVehicles()
    }, [searchParams, vehiclesPerPage, useLocationFilter, userLocation, isLocationChecked])

    const handleApplyFilters = (filters: VehicleFilter) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.set(key, String(value));
            } else {
                params.delete(key);
            }
        });

        // Sempre reseta para a primeira página ao aplicar novos filtros
        params.delete('page');

        router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
    }

    const handleClearFilters = () => {
        router.push(window.location.pathname, { scroll: false });
        setShowFilterOptions(false)
        setUseLocationFilter(false)
        localStorage.setItem('useLocationFilter', 'false')
        localStorage.removeItem('userLocation')
    }

    const toggleFilterOptions = () => {
        setShowFilterOptions(prev => !prev)
    }

    const handleViewAllCars = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('city');
        params.delete('state');
        params.delete('page'); // Reset page when viewing all cars

        router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
        setUseLocationFilter(false);
        localStorage.setItem('useLocationFilter', 'false');
        localStorage.removeItem('userLocation');
    }

    const handleGetMyCityCars = async () => {
        if (!userLocation) {
            setLoading(true);
            const newLocation = await requestUserLocation();
            // setLoading(false); // setLoading será tratado pelo useEffect de fetchVehicles

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
                setLoading(false); // Garante que o loading é desativado em caso de erro/negação
                return;
            } else if (newLocation && !('status' in newLocation)) {
                setUserLocation(newLocation);
                localStorage.setItem('userLocation', JSON.stringify(newLocation));
                localStorage.setItem('useLocationFilter', 'true');
                setUseLocationFilter(true);

                const params = new URLSearchParams(searchParams.toString());
                params.delete('page'); // Resetar para a primeira página

                router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
                // setLoading(false); // setLoading será tratado pelo useEffect de fetchVehicles
            }
        } else {
            setUseLocationFilter(true);
            localStorage.setItem('useLocationFilter', 'true');

            const params = new URLSearchParams(searchParams.toString());
            params.delete('page'); // Resetar para a primeira página

            router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
        }
    }

    // Removido o useEffect para atualizar a URL, pois agora os handlers fazem isso diretamente.

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            const newPage = currentPage + 1;
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', newPage.toString());
            router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            const params = new URLSearchParams(searchParams.toString());
            if (newPage === 1) {
                params.delete('page'); // Remove page param for page 1
            } else {
                params.set('page', newPage.toString());
            }
            router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
        }
    }

    return (
        <section className={styles.container}>
            <VehicleFilterComponent
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
                            disabled={loading} // Only disable if actively loading, not just waiting for locationCheck
                        />
                }
            </div>
            <div className={styles.vehiclesList}>
                {loading && !error ? (
                    Array.from({ length: vehiclesPerPage }).map((_, index) => (
                        <VehicleCardSkeleton key={index} />
                    ))
                ) : vehicles.length > 0 ? (
                    vehicles.map(vehicle => (
                        <VehicleCard key={vehicle._id} vehicle={vehicle} />
                    ))
                ) : (
                    <div className={styles.noVehiclesFound}>
                        <h3>Nenhum veículo encontrado</h3>
                        <p>Tente ajustar seus filtros ou limpar a pesquisa para ver mais veículos.</p>
                        {
                            hasActiveFilters &&
                            <Button text="Limpar Filtros" onClick={handleClearFilters} />
                        }
                    </div>
                )}
            </div>
            {
                totalVehicles > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => {
                            const params = new URLSearchParams(searchParams.toString());
                            if (page === 1) {
                                params.delete('page');
                            } else {
                                params.set('page', page.toString());
                            }
                            router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
                        }}
                        onPrevPage={handlePrevPage}
                        onNextPage={handleNextPage}
                    />
                )
            }
        </section>
    )
}
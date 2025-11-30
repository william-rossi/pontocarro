'use client'

import React from 'react'
import styles from './styles.module.css'
import BackButtonAnnounce from '@/components/back-button-announce/back-button-announce'
import Button from '@/components/button/button'
import Select from '@/components/select/select'
import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { VehicleSummary } from '@/types/vehicles'
import { getMyVehicles, SortBy, SortOrder } from '@/services/vehicles'
import { useAuth } from '@/context/AuthContext'
import UserVehicleCard from '@/components/vehicles/user-vehicle-card/user-vehicle-card'
import UserVehicleCardSkeleton from '@/components/vehicles/user-vehicle-card-skeleton/user-vehicle-card-skeleton'; // Importa o skeleton
import { useRouter, useSearchParams } from 'next/navigation'
import Pagination from '@/components/vehicles/pagination/pagination'

export default function MeusVeiculos() {
    const { user, accessToken, refreshAccessToken } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [vehicles, setVehicles] = useState<VehicleSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalVehicles, setTotalVehicles] = useState(0);
    const [sortBy, setSortBy] = useState<SortBy>('createdAt');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const vehiclesPerPage = 5; // Definindo o limite por página

    const validSortBy: SortBy[] = ['createdAt', 'price', 'year', 'mileage'];
    const validSortOrder: SortOrder[] = ['asc', 'desc'];

    const fetchMyVehicles = useCallback(async () => {
        if (!user || !accessToken) {
            setError("Usuário não autenticado.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await getMyVehicles(user._id, accessToken, currentPage, vehiclesPerPage, sortBy, sortOrder, refreshAccessToken);
            setVehicles(response.vehicles);
            setTotalPages(response.totalPages);
            setTotalVehicles(response.totalVehicles);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user, accessToken, currentPage, vehiclesPerPage, sortBy, sortOrder, refreshAccessToken]);

    // Efeito para ler os parâmetros da URL e inicializar os estados
    useEffect(() => {
        const pageParam = searchParams.get('page');
        const sortByParam = searchParams.get('sortBy');
        const sortOrderParam = searchParams.get('sortOrder');

        const initialPage = pageParam ? parseInt(pageParam) : 1;
        const initialSortBy = sortByParam || 'createdAt';
        const initialSortOrder = sortOrderParam || 'desc';

        if (!isNaN(initialPage) && initialPage >= 1 && initialPage !== currentPage) {
            setCurrentPage(initialPage);
        }

        const finalSortBy: SortBy = validSortBy.includes(initialSortBy as SortBy) ? (initialSortBy as SortBy) : 'createdAt';
        const finalSortOrder: SortOrder = validSortOrder.includes(initialSortOrder as SortOrder) ? (initialSortOrder as SortOrder) : 'desc';

        if (finalSortBy !== sortBy) {
            setSortBy(finalSortBy);
        }
        if (finalSortOrder !== sortOrder) {
            setSortOrder(finalSortOrder);
        }

    }, [searchParams, setCurrentPage, setSortBy, setSortOrder, validSortBy, validSortOrder, currentPage, sortBy, sortOrder]);

    // Efeito para buscar veículos quando os parâmetros de paginação/ordenação ou autenticação mudam
    useEffect(() => {
        fetchMyVehicles();
    }, [fetchMyVehicles]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        if (page === 1) {
            router.push('/', { scroll: false });
        } else {
            router.push(`?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`, { scroll: false });
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            if (newPage === 1) {
                router.push('/', { scroll: false });
            } else {
                router.push(`?page=${newPage}&sortBy=${sortBy}&sortOrder=${sortOrder}`, { scroll: false });
            }
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            const newPage = currentPage + 1;
            setCurrentPage(newPage);
            router.push(`?page=${newPage}&sortBy=${sortBy}&sortOrder=${sortOrder}`, { scroll: false });
        }
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [newSortByStr, newSortOrderStr] = e.target.value.split('_');

        const finalNewSortBy: SortBy = validSortBy.includes(newSortByStr as SortBy) ? (newSortByStr as SortBy) : 'createdAt';
        const finalNewSortOrder: SortOrder = validSortOrder.includes(newSortOrderStr as SortOrder) ? (newSortOrderStr as SortOrder) : 'desc';

        setSortBy(finalNewSortBy);
        setSortOrder(finalNewSortOrder);
        setCurrentPage(1); // Resetar para a primeira página ao mudar a ordenação
        router.push(`?page=1&sortBy=${finalNewSortBy}&sortOrder=${finalNewSortOrder}`, { scroll: false });
    };

    const handleEditVehicle = (vehicleId: string) => {
        console.log("Editar veículo:", vehicleId);
        // Implementar navegação para a página de edição
    };

    const handleDeleteVehicle = (vehicleId: string) => {
        console.log("Excluir veículo:", vehicleId);
        // Implementar lógica de exclusão
    };

    const sortByOptions = [
        { value: 'createdAt_desc', label: 'Mais recentes' },
        { value: 'createdAt_asc', label: 'Mais antigos' },
        { value: 'price_asc', label: 'Menor preço' },
        { value: 'price_desc', label: 'Maior preço' },
    ];

    return (
        <section className={styles.container}>
            <BackButtonAnnounce text='Voltar ao marketplace' />
            <div className={styles.header}>
                <div className={styles.titleArea}>
                    <h1>Meus Veículos</h1>
                    <p>Gerencie seus anúncios de veículos</p>
                </div>
                <Link href="/anunciar" passHref>
                    <Button text="Novo Anúncio" svg="/assets/svg/plus.svg" />
                </Link>
            </div>

            <div className={styles.controlsArea}>
                <span className={styles.vehicleCount}>
                    {totalVehicles} veículo{totalVehicles !== 1 ? 's' : ''} anunciado{totalVehicles !== 1 ? 's' : ''}
                </span>
                <div className={styles.orderBy}>
                    <span>Ordenar por:</span>
                    <Select
                        options={sortByOptions}
                        value={`${sortBy}_${sortOrder}`}
                        onChange={handleSortChange}
                    />
                </div>
            </div>

            {loading && (
                <div className={styles.vehiclesList}>
                    {Array.from({ length: vehiclesPerPage }).map((_, index) => (
                        <UserVehicleCardSkeleton key={index} />
                    ))}
                </div>
            )}

            {error && (
                <div className={styles.errorState}>
                    <h3>Ocorreu um erro</h3>
                    <p>Não foi possível carregar seus veículos: {error}</p>
                </div>
            )}

            {!loading && !error && vehicles.length === 0 && (
                <div className={styles.noVehiclesFound}>
                    <h3>Nenhum veículo anunciado</h3>
                    <p>Você ainda não possui veículos anunciados. Clique em "Novo Anúncio" para começar.</p>
                </div>
            )}

            {
                !loading && !error && vehicles.length > 0 && (
                    <div className={styles.vehiclesList}>
                        {
                            vehicles.map(vehicle => (
                                <UserVehicleCard
                                    key={vehicle._id}
                                    vehicle={vehicle}
                                    onEdit={handleEditVehicle}
                                    onDelete={handleDeleteVehicle}
                                />
                            ))
                        }
                    </div>
                )
            }

            {!loading && !error && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onPrevPage={handlePrevPage}
                    onNextPage={handleNextPage}
                />
            )}
        </section>
    )
}

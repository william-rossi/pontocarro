'use client'

import React from 'react'
import styles from './styles.module.css'
import BackButtonAnnounce from '@/components/back-button-announce/back-button-announce'
import Button from '@/components/button/button'
import Select from '@/components/select/select'
import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { VehicleSummary } from '@/types/vehicles'
import { useAuth } from '@/context/AuthContext'
import UserVehicleCard from '@/components/vehicles/user-vehicle-card/user-vehicle-card'
import MeusVeiculosSkeleton from './meus-veiculos-skeleton'
import { useRouter, useSearchParams } from 'next/navigation'
import Pagination from '@/components/vehicles/pagination/pagination'
import Modal from '@/components/overlays/modal/modal'
import { toast } from 'react-toastify'
import { getMyVehicles, deleteVehicle } from '@/services/user-vehicles'
import { SortBy, SortOrder } from '@/types/vehicle-filters'

// Definições de tipos e constantes para a página 'Meus Veículos'
const VEHICLES_PER_PAGE = 5;
const VALID_SORT_BY: SortBy[] = ['createdAt', 'price', 'year', 'mileage'];
const VALID_SORT_ORDER: SortOrder[] = ['asc', 'desc'];
const DEFAULT_SORT_BY: SortBy = 'createdAt';
const DEFAULT_SORT_ORDER: SortOrder = 'desc';

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
    const [sortBy, setSortBy] = useState<SortBy>(DEFAULT_SORT_BY);
    const [sortOrder, setSortOrder] = useState<SortOrder>(DEFAULT_SORT_ORDER);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState<VehicleSummary | null>(null);

    // 1. Função de busca para obter os veículos do usuário, dependendo dos estados de paginação e ordenação.
    const fetchMyVehicles = useCallback(async (page: number, by: SortBy, order: SortOrder) => {
        if (!user || !accessToken) return;

        setLoading(true);
        setError(null);
        try {
            const response = await getMyVehicles(
                user._id,
                accessToken,
                page,
                VEHICLES_PER_PAGE,
                by,
                order,
                refreshAccessToken
            );
            setVehicles(response.vehicles);
            setTotalPages(response.totalPages);
            setTotalVehicles(response.totalVehicles);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocorreu um erro desconhecido');
            }
        } finally {
            setLoading(false);
        }
    }, [user, accessToken, refreshAccessToken]);

    // 2. Função centralizada para atualizar a URL com base nos filtros e paginação (Query String)
    const updateUrl = useCallback((page: number, by: SortBy, order: SortOrder) => {
        // Cria um novo objeto `URLSearchParams` com base nos parâmetros atuais da URL
        const params = new URLSearchParams();

        // Adiciona ou atualiza o parâmetro 'page' se for diferente de 1 (valor padrão)
        if (page > 1) {
            params.set('page', page.toString());
        }

        // Adiciona ou atualiza o parâmetro 'sortBy' se for diferente do padrão
        if (by !== DEFAULT_SORT_BY) {
            params.set('sortBy', by);
        }

        // Adiciona ou atualiza o parâmetro 'sortOrder' se for diferente do padrão
        if (order !== DEFAULT_SORT_ORDER) {
            params.set('sortOrder', order);
        }

        const queryString = params.toString();
        const currentPath = `/meus-veiculos${queryString ? `?${queryString}` : ''}`;

        // Verifica se a URL atual é diferente do caminho que estamos tentando navegar
        // Para evitar pushes desnecessários (spam no histórico do navegador)
        if (currentPath !== window.location.pathname + window.location.search) {
            router.push(currentPath, { scroll: false });
        }
    }, [router]);


    // Efeito 1: Lê os parâmetros da URL na montagem ou quando `searchParams` muda.
    useEffect(() => {
        const pageParam = searchParams.get('page');
        const sortByParam = searchParams.get('sortBy');
        const sortOrderParam = searchParams.get('sortOrder');

        // Análise e validação dos parâmetros da URL
        const initialPage = pageParam ? parseInt(pageParam) : 1;
        const finalPage = (!isNaN(initialPage) && initialPage >= 1) ? initialPage : 1;

        const finalSortBy: SortBy = VALID_SORT_BY.includes(sortByParam as SortBy) ? (sortByParam as SortBy) : DEFAULT_SORT_BY;
        const finalSortOrder: SortOrder = VALID_SORT_ORDER.includes(sortOrderParam as SortOrder) ? (sortOrderParam as SortOrder) : DEFAULT_SORT_ORDER;

        // Aplica os estados lidos e validados, evitando loop de dependências:
        // A busca dos veículos será acionada pelo Efeito 2.
        setCurrentPage(finalPage);
        setSortBy(finalSortBy);
        setSortOrder(finalSortOrder);

    }, [searchParams]); // Dependência apenas em searchParams

    // Efeito 2: Aciona a busca de veículos e atualiza a URL quando o estado interno (pagina, ordenação) muda.
    useEffect(() => {
        if (user && accessToken) {
            // 1. Aciona a busca de veículos com os estados atuais
            fetchMyVehicles(currentPage, sortBy, sortOrder);

            // 2. Garante que a URL reflita os estados atuais de paginação e ordenação
            updateUrl(currentPage, sortBy, sortOrder);
        }
    }, [user, accessToken, currentPage, sortBy, sortOrder, fetchMyVehicles, updateUrl]);

    // --- Manipuladores de Interação do Usuário ---

    const handlePageChange = (page: number) => {
        if (page !== currentPage) {
            setCurrentPage(page);
            // updateUrl será chamado pelo useEffect
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            // updateUrl será chamado pelo useEffect
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            // updateUrl será chamado pelo useEffect
        }
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [newSortByStr, newSortOrderStr] = e.target.value.split('_');

        const finalNewSortBy: SortBy = VALID_SORT_BY.includes(newSortByStr as SortBy) ? (newSortByStr as SortBy) : DEFAULT_SORT_BY;
        const finalNewSortOrder: SortOrder = VALID_SORT_ORDER.includes(newSortOrderStr as SortOrder) ? (newSortOrderStr as SortOrder) : DEFAULT_SORT_ORDER;

        if (finalNewSortBy !== sortBy || finalNewSortOrder !== sortOrder) {
            setSortBy(finalNewSortBy);
            setSortOrder(finalNewSortOrder);
            setCurrentPage(1); // Redefine para a primeira página ao mudar a ordenação
            // updateUrl será chamado pelo useEffect
        }
    };

    const handleDeleteClick = (vehicleItem: VehicleSummary) => {
        setVehicleToDelete(vehicleItem);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!vehicleToDelete || !accessToken || !user?._id) {
            toast.error("Não foi possível excluir o veículo. Dados incompletos.");
            return;
        }

        try {
            await deleteVehicle(vehicleToDelete._id, accessToken, refreshAccessToken);
            toast.success("Veículo excluído com sucesso!");

            // Recarrega a lista de veículos, mantendo a página atual se não for a última página
            // Ou volta uma página se for a última e não houver mais veículos nela
            const currentTotal = totalVehicles - 1;
            const newTotalPages = Math.ceil(currentTotal / VEHICLES_PER_PAGE) || 1;

            let newPage = currentPage;
            if (currentPage > newTotalPages) {
                newPage = newTotalPages;
            }

            // Força a atualização do estado da página e dispara a busca via Efeito 2
            if (newPage !== currentPage) {
                setCurrentPage(newPage);
            } else {
                fetchMyVehicles(currentPage, sortBy, sortOrder);
            }

        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(`Erro ao excluir veículo: ${err.message}`);
            } else {
                toast.error('Ocorreu um erro desconhecido');
            }
        } finally {
            setShowDeleteModal(false);
            setVehicleToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setVehicleToDelete(null);
    };

    const sortByOptions = [
        { value: 'createdAt_desc', label: 'Mais recentes' },
        { value: 'createdAt_asc', label: 'Mais antigos' },
        { value: 'price_asc', label: 'Menor preço' },
        { value: 'price_desc', label: 'Maior preço' },
        { value: 'year_desc', label: 'Ano (mais novo)' },
        { value: 'year_asc', label: 'Ano (mais antigo)' },
        { value: 'mileage_asc', label: 'Menor Km' },
        { value: 'mileage_desc', label: 'Maior Km' },
    ];

    // --- Renderização do Componente ---
    return (
        <section className={styles.container}>
            <BackButtonAnnounce destination='/' />
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
                <MeusVeiculosSkeleton />
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
                    <p>Você ainda não possui veículos anunciados. Clique em &quotNovo Anúncio&quot para começar.</p>
                </div>
            )}

            {!loading && !error && vehicles.length > 0 && (
                <div className={styles.vehiclesList}>
                    {vehicles.map(vehicle => (
                        <UserVehicleCard
                            key={vehicle._id}
                            vehicle={vehicle}
                            onDelete={() => handleDeleteClick(vehicle)}
                        />
                    ))}
                </div>
            )}

            {!loading && !error && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onPrevPage={handlePrevPage}
                    onNextPage={handleNextPage}
                />
            )}

            {showDeleteModal && (
                <Modal isOpen={showDeleteModal} onClose={handleCancelDelete} isInterceptRouting={false} options={{
                    animation: 'pop',
                    enableCloseButton: true,
                    closeButtonTheme: 'inverted',
                    headProps: {
                        headTitle: 'Confirmar Exclusão',
                    },
                    canClickOnOverlayToClose: true
                }}>
                    <div className={styles.modalContent}>
                        <span>Tem certeza que deseja excluir <b>{vehicleToDelete?.year} {vehicleToDelete?.brand} {vehicleToDelete?.vehicleModel} {vehicleToDelete?.engine}</b>?</span>
                        <p>Esta ação não poderá ser desfeita.</p>
                        <div className={styles.modalActions}>
                            <Button text="Confirmar" onClick={handleConfirmDelete} />
                            <Button text="Cancelar" onClick={handleCancelDelete} invert />
                        </div>
                    </div>
                </Modal>
            )}
        </section>
    )
}
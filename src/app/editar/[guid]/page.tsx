'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import VehicleForm, { VehicleFormData } from '@/components/vehicles/vehicle-form/vehicle-form'
import { getVehicleById, getVehicleImages } from '@/services/vehicles'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'react-toastify'
import { Vehicle } from '@/types/vehicles'
import BackButtonAnnounce from '@/components/back-button-announce/back-button-announce'
import styles from './styles.module.css'
import EditVehicleSkeleton from './edit-vehicle-skeleton'
import Image from 'next/image'
import { cleanPhoneNumber } from '@/utils/phone-helpers'
import { updateVehicle, deleteVehicleImage, uploadVehicleImages } from '@/services/user-vehicles'

interface ExistingImage {
    id: string;
    url: string;
}

export default function Editar() {
    const router = useRouter();
    const { user, accessToken, refreshAccessToken } = useAuth();
    const params = useParams();
    const { guid } = params;

    const [vehicleData, setVehicleData] = useState<VehicleFormData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);
    // Este estado conterá a lista ATUALIZADA de imagens que AINDA EXISTEM no veículo.
    const [currentExistingImageUrls, setCurrentExistingImageUrls] = useState<ExistingImage[]>([]);
    // IDs das imagens a serem deletadas no backend (o que foi excluído virtualmente)
    const [imageIdsToDelete, setImageIdsToDelete] = useState<string[]>([]);
    const [isFetched, setIsFetched] = useState(false);

    // Casting seguro para o GUID
    const vehicleGuid = Array.isArray(guid) ? guid[0] : (guid as string);

    // Efeito para carregar o veículo e suas imagens
    useEffect(() => {
        if (!user && !isFetched) {
            // Se não autenticado e não carregou, redireciona.
            router.push('/');
            return;
        }

        const fetchVehicle = async () => {
            if (!vehicleGuid || isFetched || !accessToken) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                // Necessário carregar o veículo
                const fetchedVehicle = await getVehicleById(vehicleGuid);

                // Necessário carregar as imagens separadamente (baseado na sua estrutura)
                const vehicleImages = await getVehicleImages(vehicleGuid);

                if (!fetchedVehicle) {
                    setNotFound(true);
                    return;
                }

                // Formata as imagens para o estado de URLs existentes
                const formattedImages: ExistingImage[] = vehicleImages.map(img => ({
                    id: img._id,
                    url: img.imageUrl,
                }));

                // Preenche os dados do formulário
                setVehicleData({
                    title: fetchedVehicle.title,
                    brand: fetchedVehicle.brand,
                    model: fetchedVehicle.vehicleModel,
                    engine: fetchedVehicle.engine,
                    year: fetchedVehicle.year,
                    price: fetchedVehicle.price,
                    mileage: fetchedVehicle.mileage,
                    state: fetchedVehicle.state,
                    city: fetchedVehicle.city,
                    fuel: fetchedVehicle.fuel,
                    transmission: fetchedVehicle.transmission,
                    bodyType: fetchedVehicle.bodyType,
                    color: fetchedVehicle.color,
                    description: fetchedVehicle.description,
                    features: fetchedVehicle.features,
                    images: [], // Novas imagens (FileList)
                    existingImageUrls: formattedImages, // Imagens existentes (URLs)
                    announcerName: fetchedVehicle.announcerName,
                    announcerPhone: fetchedVehicle.announcerPhone,
                    announcerEmail: fetchedVehicle.announcerEmail,
                });

                setCurrentExistingImageUrls(formattedImages); // Define as imagens iniciais que serão exibidas
                setIsFetched(true);

            } catch (err: any) {
                console.error("Erro ao carregar veículo para edição:", err);
                setError(err.message || "Erro ao carregar os dados do veículo.");
            } finally {
                setLoading(false);
            }
        };

        fetchVehicle();
    }, [vehicleGuid, user, router, isFetched, accessToken]); // Adicionado accessToken como dependência

    // Função para remover a imagem VIRTUALMENTE
    const handleRemoveExistingImage = (idToRemove: string) => {
        // Remove do array que será exibido no formulário
        setCurrentExistingImageUrls(prevUrls => prevUrls.filter(img => img.id !== idToRemove));

        // Adiciona o ID à lista de remoção para ser executada no onSubmit
        setImageIdsToDelete(prevIds => [...prevIds, idToRemove]);
    };

    const handleUpdateVehicle = async (data: VehicleFormData, id?: string) => {
        // Antes de tentar atualizar, a validação de 1 foto deve ser feita pelo zod no form

        if (!id || !accessToken || !user?._id) {
            toast.error("Não foi possível atualizar o veículo. Dados incompletos.");
            throw new Error("Dados incompletos para atualização.");
        }

        try {
            // 1. ATUALIZAÇÃO DOS DADOS DO VEÍCULO (campos de texto/número)
            const updatedVehicle: Omit<Vehicle, 'created_at' | 'images'> = {
                owner_id: user._id,
                _id: id,
                title: data.title,
                brand: data.brand,
                vehicleModel: data.model,
                engine: data.engine,
                year: data.year,
                price: data.price,
                mileage: data.mileage,
                state: data.state,
                city: data.city,
                fuel: data.fuel,
                transmission: data.transmission,
                bodyType: data.bodyType,
                color: data.color,
                description: data.description,
                features: data.features,
                announcerName: data.announcerName,
                announcerPhone: cleanPhoneNumber(data.announcerPhone),
                announcerEmail: data.announcerEmail,
            };

            await updateVehicle(id, updatedVehicle, accessToken, refreshAccessToken);

            // 2. DELEÇÃO DE IMAGENS MARCADAS
            // Itera e deleta todas as imagens que foram removidas virtualmente
            for (const imageId of imageIdsToDelete) {
                // Nota: O endpoint deleteVehicleImage deve receber o ID do veículo e o ID da imagem
                await deleteVehicleImage(id, imageId, accessToken, refreshAccessToken);
            }
            setImageIdsToDelete([]); // Limpa a lista de IDs após a deleção

            // 3. UPLOAD DE NOVAS IMAGENS
            if (data.images && data.images.length > 0) {
                const formData = new FormData();
                for (let i = 0; i < data.images.length; i++) {
                    formData.append('images', data.images[i]);
                }
                await uploadVehicleImages(id, formData, accessToken, refreshAccessToken);
            }

            toast.success("Veículo atualizado com sucesso!");
            router.push('/meus-veiculos');

        } catch (e: any) {
            console.error("Erro ao atualizar veículo:", e);
            toast.error(`Erro ao atualizar veículo: ${e.message}`);
            throw e;
        }
    };

    if (loading) {
        return (
            <EditVehicleSkeleton />
        );
    }

    if (notFound) {
        return (
            <section className={styles.container}>
                <BackButtonAnnounce text='Voltar aos meus veículos' />
                <div className={styles.errorState}>
                    <Image src={'/assets/svg/close.svg'} alt="Não encontrado" width={80} height={80} />
                    <h3>Veículo não encontrado</h3>
                    <p>O veículo que você tentou editar não existe ou não está disponível.</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className={styles.container}>
                <BackButtonAnnounce text='Voltar aos meus veículos' />
                <div className={styles.errorState}>
                    <Image src={'/assets/svg/close.svg'} alt="Erro" width={80} height={80} />
                    <h3>Ocorreu um erro</h3>
                    <p>Não foi possível carregar o veículo: {error}</p>
                </div>
            </section>
        );
    }

    if (!vehicleData) return null

    return (
        <section className={styles.container}>
            <BackButtonAnnounce text='Voltar aos meus veículos' />
            <VehicleForm
                vehicleId={vehicleGuid || undefined}
                initialData={vehicleData}
                onSubmit={handleUpdateVehicle}
                isEditing
                existingImageUrls={currentExistingImageUrls} // Passa o array ATUALIZADO
                onRemoveExistingImage={handleRemoveExistingImage} // Passa a função de remoção virtual
            />
        </section>
    );
}

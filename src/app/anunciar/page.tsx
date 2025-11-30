'use client'

import { useState, useEffect } from 'react'
import styles from './styles.module.css'
import BackButtonAnnounce from '@/components/back-button-announce/back-button-announce'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Vehicle } from '@/types/vehicles'
import VehicleForm, { VehicleFormData } from '@/components/vehicles/vehicle-form/vehicle-form'
import { toast } from 'react-toastify' // Importar toast
import { cleanPhoneNumber } from '@/utils/phone-helpers'
import { createVehicle, uploadVehicleImages } from '@/services/user-vehicles'

export default function Anunciar() {
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const { user, accessToken, refreshAccessToken } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!user) {
            router.push('/')
        }
    }, [user, router])

    const handleCreateVehicle = async (data: VehicleFormData) => {
        if (!user || !accessToken) {
            setErrorMessage("Usuário não autenticado. Faça login para anunciar um veículo.")
            toast.error("Usuário não autenticado. Faça login para anunciar um veículo.");
            throw new Error("Usuário não autenticado.")
        }

        // A validação de 1 foto será feita pelo Zod no VehicleForm

        const vehicle: Omit<Vehicle, '_id' | 'created_at'> = {
            owner_id: user._id,
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
        }

        try {
            const vehicleCreated = await createVehicle(vehicle, accessToken, refreshAccessToken)

            // Upload de imagens
            if (data.images && data.images.length > 0) {
                const formData = new FormData();
                for (let i = 0; i < data.images.length; i++) {
                    formData.append('images', data.images[i]);
                }
                await uploadVehicleImages(vehicleCreated._id, formData, accessToken, refreshAccessToken);
            }

            toast.success("Veículo anunciado com sucesso!")
            router.push('/meus-veiculos')

        } catch (e: any) {
            console.error("Erro ao anunciar veículo:", e);
            setErrorMessage(e.message || "Erro ao anunciar veículo. Tente novamente.");
            toast.error(e.message || "Erro ao anunciar veículo.");
            throw e;
        }
    }

    return (
        <section className={styles.container}>
            <BackButtonAnnounce text='Voltar aos anúncios' />
            <h1>Anunciar seu veículo</h1>
            {/* O VehicleForm usará o esquema Zod que exige 1 foto */}
            <VehicleForm onSubmit={handleCreateVehicle} />
            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        </section>
    )
}
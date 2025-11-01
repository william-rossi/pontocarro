'use client'

import { useState } from 'react'
import styles from './styles.module.css'
import BackButtonAnnounce from '@/components/back-button-announce/back-button-announce'
import Input from '@/components/input/input'
import Select from '@/components/select/select'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/button/button'
import Message from '@/components/message/message'
import LocationSelect from '@/components/location-select/location-select'
import TextArea from '@/components/textarea/textarea'
import FeatureInput from '@/components/feature-input/feature-input'
import ImageUpload from '@/components/image-upload/image-upload'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { createVehicle, uploadVehicleImages } from '@/services/vehicles'
import { Vehicle } from '@/types/vehicles'
import { NumericFormat, PatternFormat } from 'react-number-format'
import { BODY_TYPE, EXCHANGE, FUEL } from '../constants/select-box-items'

const announceVehicleSchema = z.object({
    title: z.string().min(1, "Título é obrigatório").max(100, "Título muito longo"),
    brand: z.string().min(1, "Marca é obrigatória").max(50, "Marca muito longa"),
    model: z.string().min(1, "Modelo é obrigatório").max(50, "Modelo muito longo"),
    engine: z.string().min(1, "Motorização é obrigatória").max(50, "Motorização muito longa"),
    year: z.number().min(1900, "Ano inválido").max(new Date().getFullYear() + 1, "Ano inválido"),
    price: z.number().min(0, "Preço inválido"),
    mileage: z.number().min(0, "Quilometragem inválida"),
    state: z.string().min(1, "Estado é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    fuel: z.string().min(1, "Combustível é obrigatório"),
    exchange: z.string().min(1, "Câmbio é obrigatório"),
    bodyType: z.string().min(1, "Tipo de carroceria é obrigatório"),
    color: z.string().min(1, "Cor é obrigatória").max(50, "Cor muito longa"),
    description: z.string().min(1, "Descrição é obrigatória").max(1000, "Descrição muito longa"),
    features: z.array(z.string()).optional(),
    images: z.array(z.instanceof(File)).optional(), // Update type to File array
}).extend({
    announcerName: z
        .string()
        .min(3, "Nome do anunciante deve ter no mínimo 3 caracteres")
        .max(100, "Nome do anunciante muito longo"),
    announcerPhone: z
        .string()
        .min(1, "Telefone do anunciante é obrigatório")
        .min(14, "Telefone do anunciante inválido (mínimo 14 caracteres)")
        .max(15, "Telefone do anunciante inválido (máximo 15 caracteres)"),
    announcerEmail: z
        .string()
        .min(1, "E-mail do anunciante é obrigatório")
        .max(150, "E-mail do anunciante muito longo")
        .email("E-mail do anunciante inválido"),
})

export type AnnounceVehicleFormData = z.infer<typeof announceVehicleSchema>

export default function Anunciar() {
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const { user, accessToken, refreshAccessToken } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!user) {
            router.push('/')
        }
    }, [user, router])

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm<AnnounceVehicleFormData>({
        resolver: zodResolver(announceVehicleSchema),
        defaultValues: {
            year: new Date().getFullYear(),
            state: "",
            city: "",
            features: [],
            images: [],
            // Default values for new fields
            announcerName: user?.username || "",
            announcerPhone: user?.phone || "",
            announcerEmail: user?.email || "",
        },
    })

    const onSubmit = async (data: AnnounceVehicleFormData) => {
        setErrorMessage(undefined)
        if (!user || !accessToken) {
            setErrorMessage("Usuário não autenticado. Faça login para anunciar um veículo.")
            return
        }

        try {
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
                exchange: data.exchange,
                bodyType: data.bodyType,
                color: data.color,
                description: data.description,
                features: data.features,
                announcerName: data.announcerName,
                announcerPhone: data.announcerPhone,
                announcerEmail: data.announcerEmail,
            }

            const vehicleCreated = await createVehicle(vehicle, accessToken, refreshAccessToken)

            if (data.images && data.images.length > 0) {
                const formData = new FormData();
                for (let i = 0; i < data.images.length; i++) {
                    formData.append('images', data.images[i]);
                }
                await uploadVehicleImages(vehicleCreated._id, formData, accessToken, refreshAccessToken);
            }

            alert("Veículo anunciado com sucesso!")
            router.push('/meus-veiculos') // Redirecionar para a página de meus veículos após o sucesso
        } catch (e) {
            const error = e as Error
            console.error(error)
            setErrorMessage(error.message || "Erro ao anunciar veículo. Tente novamente.")
        }
    }

    return (
        <section className={styles.container}>
            <BackButtonAnnounce />
            <h1>Anunciar seu veículo</h1>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.content}>
                <div className={styles.group}>
                    <h2>Informações básicas</h2>
                    <div className={styles.inputGroup}>
                        <Input
                            label="Título do anúncio"
                            placeholder="ex: Toyota Corolla bem conservado"
                            {...register("title")}
                            error={errors.title?.message}
                        />
                        <Input
                            label="Marca"
                            placeholder="ex: Toyota"
                            {...register("brand")}
                            error={errors.brand?.message}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <Input
                            label="Modelo"
                            placeholder="ex: Corolla"
                            {...register("model")}
                            error={errors.model?.message}
                        />
                        <Input
                            label="Motorização"
                            placeholder="ex: 1.6, 2.0, 1.0 Turbo"
                            {...register("engine")}
                            error={errors.engine?.message}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <Input
                            label="Ano"
                            type='number'
                            placeholder="2025"
                            {...register("year", { valueAsNumber: true })}
                            error={errors.year?.message}
                        />
                        <Controller
                            control={control}
                            name="price"
                            render={({ field }) => (
                                <NumericFormat
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    prefix="R$ "
                                    allowNegative={false}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    customInput={Input}
                                    type="text"
                                    label="Preço"
                                    placeholder="R$ 20.000,00"
                                    error={errors.price?.message}
                                    value={field.value ?? ""}
                                    onValueChange={(values) => {
                                        // O floatValue é um número, ideal para o z.number()
                                        field.onChange(values.floatValue ?? 0)
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <Controller
                            control={control}
                            name="mileage"
                            render={({ field }) => (
                                <NumericFormat
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    allowNegative={false}
                                    decimalScale={0}
                                    customInput={Input}
                                    type="text"
                                    label="Quilometragem (km)"
                                    placeholder="180.000"
                                    error={errors.mileage?.message}
                                    value={field.value ?? ""}
                                    onValueChange={(values) => {
                                        const onlyDigits = values.value.replace(/\D/g, "")
                                        if (onlyDigits.length <= 10) {
                                            // floatValue é número (ou undefined), ideal para o Zod
                                            field.onChange(values.floatValue ?? 0)
                                        }
                                    }}
                                    isAllowed={(values) => {
                                        const onlyDigits = values.value.replace(/\D/g, "")
                                        return onlyDigits.length <= 10
                                    }}
                                />
                            )}
                        />
                        <div className={styles.inputGroupFill} />
                    </div>
                    <LocationSelect
                        selectedStateValue={watch("state")}
                        selectedCityValue={watch("city")}
                        onStateChange={(value) => setValue("state", value)}
                        onCityChange={(value) => setValue("city", value)}
                        stateError={errors.state?.message}
                        cityError={errors.city?.message}
                        disabledCity={!watch("state")}
                    />
                </div>
                <div className={styles.group}>
                    <h2>Detalhes do veículo</h2>
                    <div className={styles.inputGroup}>
                        <Select
                            label="Combustível"
                            options={FUEL}
                            {...register("fuel")}
                            error={errors.fuel?.message}
                        />
                        <Select
                            label="Câmbio"
                            options={EXCHANGE}
                            {...register("exchange")}
                            error={errors.exchange?.message}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <Select
                            label="Tipo de carroceria"
                            options={BODY_TYPE}
                            {...register("bodyType")}
                            error={errors.bodyType?.message}
                        />
                        <Input
                            label="Cor"
                            placeholder="ex: Preto"
                            {...register("color")}
                            error={errors.color?.message}
                        />
                    </div>
                    <TextArea
                        label="Descrição"
                        placeholder="Descreva o estado do veículo, histórico de manutenção e outros detalhes importantes..."
                        {...register("description")}
                        error={errors.description?.message}
                        rows={5}
                    />
                </div>

                <div className={styles.group}>
                    <h2>Características</h2>
                    <FeatureInput setValue={setValue} watch={watch} errors={errors} control={control} />
                </div>

                <div className={styles.group}>
                    <h2>Fotos</h2>
                    <ImageUpload setValue={setValue} watch={watch} errors={errors} control={control} />
                </div>

                <div className={styles.group}>
                    <h2>Informações de contato</h2>
                    <div className={styles.inputGroup}>
                        <Input
                            label="Nome do anunciante"
                            max={100}
                            error={errors.announcerName?.message}
                            {...register("announcerName")}
                        />
                        <Controller
                            name="announcerPhone"
                            control={control}
                            render={({ field }) => {
                                const digits = (field.value || "").replace(/\D/g, "")
                                const isMobile = digits.length > 10

                                return (
                                    <PatternFormat
                                        value={field.value ?? ""}
                                        onValueChange={(vals) => field.onChange(vals.formattedValue)}
                                        format={isMobile ? "(##) #####-####" : "(##) ####-####"}
                                        customInput={Input}
                                        mask={'_'}
                                        label="Telefone"
                                        placeholder="(11) 99999-9999"
                                        type="tel"
                                        error={errors.announcerPhone?.message}
                                    />
                                )
                            }}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <Input
                            label="E-mail do anunciante"
                            type="email"
                            maxLength={150}
                            error={errors.announcerEmail?.message}
                            {...register("announcerEmail")}
                        />
                        <div className={styles.inputGroupFill} />
                    </div>
                </div>

                <div className={styles.btnGroup}>
                    <Button
                        text={'Cancelar'}
                        className={styles.btn}
                        invert
                        onClick={(e) => {
                            e.preventDefault();
                            router.back()
                        }}
                    />
                    <Button
                        text={isSubmitting ? "Anunciando..." : "Anunciar veículo"}
                        type="submit"
                        className={styles.btn}
                        disabled={isSubmitting}
                    />
                </div>
                {errorMessage && <Message message={errorMessage} type={'error'} />}
            </form>
        </section>
    )
}
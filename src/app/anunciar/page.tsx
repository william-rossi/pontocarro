'use client'

import { useState } from 'react'
import styles from './styles.module.css'
import BackButtonAnnounce from '@/components/back-button-announce/back-button-announce'
import Input from '@/components/input/input'
import Select from '@/components/select/select'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/button/button'
import Message from '@/components/message/message'
import LocationSelect from '@/components/location-select/location-select'
import TextArea from '@/components/textarea/textarea'
import FeatureInput from '@/components/feature-input/feature-input'
import ImageUpload from '@/components/image-upload/image-upload'

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
    features: z.array(z.string()).max(10, "Máximo de 10 características").optional(),
    images: z.array(z.string()).max(10, "Máximo de 10 fotos").optional(),
})

export type AnnounceVehicleFormData = z.infer<typeof announceVehicleSchema>

export default function Anunciar() {
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

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
            price: 0,
            mileage: 0,
            state: "",
            city: "",
            features: [],
            images: [],
        },
    })

    const onSubmit = async (data: AnnounceVehicleFormData) => {
        setErrorMessage(undefined)
        try {
            console.log("Dados do veículo:", data)
            // Aqui você integraria a chamada da API para anunciar o veículo
            // await announceVehicle(data);
            alert("Veículo anunciado com sucesso!")
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
                        <Input
                            label="Preço"
                            placeholder="R$ 20.000,00"
                            type='number'
                            {...register("price", { valueAsNumber: true })}
                            error={errors.price?.message}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <Input
                            label="Quilometragem (km)"
                            placeholder="180.000"
                            type='number'
                            {...register("mileage", { valueAsNumber: true })}
                            error={errors.mileage?.message}
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
                            options={[
                                { value: "", label: "Selecione" },
                                { value: "Gasolina", label: "Gasolina" },
                                { value: "Etanol", label: "Etanol" },
                                { value: "Diesel", label: "Diesel" },
                                { value: "Flex", label: "Flex" },
                                { value: "Elétrico", label: "Elétrico" },
                                { value: "Híbrido", label: "Híbrido" },
                            ]}
                            {...register("fuel")}
                            error={errors.fuel?.message}
                        />
                        <Select
                            label="Câmbio"
                            options={[
                                { value: "", label: "Selecione" },
                                { value: "Automático", label: "Automático" },
                                { value: "Manual", label: "Manual" },
                            ]}
                            {...register("exchange")}
                            error={errors.exchange?.message}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <Select
                            label="Tipo de carroceria"
                            options={[
                                { value: "", label: "Selecione" },
                                { value: "Sedã", label: "Sedã" },
                                { value: "SUV", label: "SUV" },
                                { value: "Hatch", label: "Hatch" },
                                { value: "Cupê", label: "Cupê" },
                                { value: "Conversível", label: "Conversível" },
                                { value: "Picape", label: "Picape" },
                                { value: "Van", label: "Van" },
                            ]}
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
                            label="Seu nome"
                            {...register("title")}
                            error={errors.title?.message}
                        />
                        <Input
                            label="Telefone"
                            {...register("brand")}
                            error={errors.brand?.message}
                        />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <Input
                        label="E-mail"
                        {...register("mileage", { valueAsNumber: true })}
                        error={errors.mileage?.message}
                    />
                    <div className={styles.inputGroupFill} />
                </div>

                {/* Ajuste as Informações de contato junto com o e-mail, se possível unifique a lógica do telefone,
                nome e e-mail como no cadastro do cliente. E consegui adicionar mais 10 fotos. */}

                <div className={styles.btnGroup}>
                    <Button
                        text={'Cancelar'}
                        className={styles.btn}
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

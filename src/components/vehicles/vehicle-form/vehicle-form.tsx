import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { NumericFormat, PatternFormat } from 'react-number-format';
import { useRouter } from 'next/navigation';

import styles from './styles.module.css';
import Input from '@/components/input/input';
import Select from '@/components/select/select';
import Button from '@/components/button/button';
import Message from '@/components/message/message';
import LocationSelect from '@/components/location-select/location-select';
import TextArea from '@/components/textarea/textarea';
import FeatureInput from '@/components/feature-input/feature-input';
import ImageUpload from '@/components/image-upload/image-upload';
import { useAuth } from '@/context/AuthContext';
// Importações de constantes assumidas no seu projeto
import { BODY_TYPE, FUEL, TRANSMISSION } from '@/constants/select-box-items';

// Interface para rastrear imagens existentes
interface ExistingImage {
    id: string;
    url: string;
}

// 1. ESQUEMA ZOD BASE
const vehicleFormSchema = z.object({
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
    transmission: z.string().min(1, "Câmbio é obrigatório"),
    bodyType: z.string().min(1, "Tipo de carroceria é obrigatório"),
    color: z.string().min(1, "Cor é obrigatória").max(50, "Cor muito longa"),
    description: z.string().min(1, "Descrição é obrigatória").max(1000, "Descrição muito longa"),
    features: z.array(z.string()).optional(),
    images: z.array(z.instanceof(File)).optional(), // Novos arquivos, opcional aqui
}).extend({
    announcerName: z
        .string()
        .min(3, "Nome do anunciante deve ter no mínimo 3 caracteres")
        .max(100, "Nome do anunciante muito longo"),
    announcerPhone: z
        .string()
        .min(1, "Telefone do anunciante é obrigatório")
        .superRefine((val, ctx) => {
            const _val = val.replace(/\D/g, '')
            if (_val.length < 10) {
                ctx.addIssue({
                    code: "too_small",
                    minimum: 10,
                    origin: "number",
                    message: "Telefone do anunciante inválido (mínimo 10 dígitos)",
                });
            }
            if (_val.length > 11) {
                ctx.addIssue({
                    code: "too_big",
                    maximum: 11,
                    origin: "number",
                    message: "Telefone do anunciante inválido (máximo 11 dígitos)",
                });
            }
        }),
    announcerEmail: z
        .string()
        .min(1, "E-mail do anunciante é obrigatório")
        .max(150, "E-mail do anunciante muito longo")
        .email("E-mail do anunciante inválido"),
    // Campo virtual para rastrear URLs existentes na edição
    existingImageUrls: z.array(z.object({
        id: z.string(),
        url: z.string(),
    })).optional(),
});

// 2. ESQUEMA ZOD COM VALIDAÇÃO DE IMAGEM (MIN 1)
const getVehicleFormSchema = () => {
    return vehicleFormSchema.refine((data) => {
        // Valida se o total de imagens (novas + existentes) é maior ou igual a 1
        const totalImages = (data.images?.length || 0) + (data.existingImageUrls?.length || 0);
        return totalImages >= 1;
    }, {
        message: "É necessário ter pelo menos uma imagem do veículo.",
        path: ["images"],
    });
};

export type VehicleFormData = z.infer<typeof vehicleFormSchema>;

interface VehicleFormProps {
    vehicleId?: string;
    initialData?: Partial<VehicleFormData>;
    onSubmit: (data: VehicleFormData, vehicleId?: string) => Promise<void>;
    isEditing?: boolean;
    existingImageUrls?: ExistingImage[];
    onRemoveExistingImage?: (id: string) => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ vehicleId, initialData, onSubmit, isEditing = false, existingImageUrls, onRemoveExistingImage }) => {
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const { user, accessToken } = useAuth();
    const router = useRouter();

    // 3. Inicialização do useForm
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        setValue,
        watch,
        trigger
    } = useForm<VehicleFormData>({
        resolver: zodResolver(getVehicleFormSchema()), // Usa o esquema com validação min 1
        defaultValues: {
            year: new Date().getFullYear(),
            state: "",
            city: "",
            features: [],
            images: [],
            existingImageUrls: existingImageUrls || [], // Define o valor inicial
            announcerName: user?.username || "",
            announcerPhone: user?.phone || "",
            announcerEmail: user?.email || "",
            ...initialData,
        },
    });

    // 4. Sincronização e Revalidação para Edição
    // Garante que o estado interno do RHF reflita as imagens existentes após a remoção virtual.
    useEffect(() => {
        if (isEditing) {
            // Atualiza o valor do campo virtual 'existingImageUrls' no RHF
            setValue("existingImageUrls", existingImageUrls || []);

            // Revalida o campo 'images' (onde o erro do refine está configurado)
            // Isso força a re-avaliação da regra de 'totalImages >= 1' após uma exclusão.
            trigger("images");
        }
    }, [existingImageUrls, setValue, trigger, isEditing]);


    const handleFormSubmit = async (data: VehicleFormData) => {
        setErrorMessage(undefined);

        if (!user || !accessToken) {
            setErrorMessage("Usuário não autenticado. Faça login para continuar.");
            return;
        }

        try {
            // Chama a função de submissão da rota (/anunciar ou /editar)
            await onSubmit(data, vehicleId);
        } catch (e) {
            const error = e as Error;
            console.error(error);
            setErrorMessage(error.message || "Erro ao processar veículo. Tente novamente.");
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.content}>
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
                                    const onlyDigits = values.value.replace(/\D/g, "");
                                    if (onlyDigits.length <= 10) {
                                        field.onChange(values.floatValue ?? 0);
                                    }
                                }}
                                isAllowed={(values) => {
                                    const onlyDigits = values.value.replace(/\D/g, "");
                                    return onlyDigits.length <= 10;
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
                        options={TRANSMISSION}
                        {...register("transmission")}
                        error={errors.transmission?.message}
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
                <ImageUpload
                    setValue={setValue}
                    watch={watch}
                    errors={errors}
                    control={control}
                    existingImageUrls={existingImageUrls}
                    onRemoveExistingImage={onRemoveExistingImage}
                    trigger={trigger}
                />
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
                            return (
                                <PatternFormat
                                    value={field.value ?? ""}
                                    onValueChange={(vals) => field.onChange(vals.formattedValue)}
                                    format={"(##) #####-####"}
                                    customInput={Input}
                                    mask={'_'}
                                    label="Telefone"
                                    placeholder="(11) 99999-9999"
                                    type="tel"
                                    error={errors.announcerPhone?.message}
                                />
                            );
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
                        router.back();
                    }}
                />
                <Button
                    text={isSubmitting ? (isEditing ? "Atualizando..." : "Anunciando...") : (isEditing ? "Atualizar veículo" : "Anunciar veículo")}
                    type="submit"
                    className={styles.btn}
                    disabled={isSubmitting}
                />
            </div>
            {errorMessage && <Message message={errorMessage} type={'error'} />}
        </form>
    );
};

export default VehicleForm;
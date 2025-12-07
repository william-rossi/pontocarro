"use client"

import React from 'react'
import { UseFormSetValue, UseFormWatch, FieldErrors, Control, Controller, UseFormTrigger } from 'react-hook-form'
import Button from '@/components/button/button'
import Message from '@/components/message/message'
import Image from 'next/image'
import styles from './style.module.css'
import { VehicleFormData } from '@/components/vehicles/vehicle-form/vehicle-form'
import { toast } from 'react-toastify'

interface ExistingImage {
    id: string;
    url: string;
}

interface ImageUploadProps {
    setValue: UseFormSetValue<VehicleFormData>;
    watch: UseFormWatch<VehicleFormData>;
    errors: FieldErrors<VehicleFormData>;
    control: Control<VehicleFormData>;
    existingImageUrls?: ExistingImage[]; // Alterado para um array de objetos `ExistingImage`
    onRemoveExistingImage?: (id: string) => void; // Recebe o ID da imagem a ser removida.
    trigger: UseFormTrigger<VehicleFormData>; // Adiciona a função `trigger` do `react-hook-form`
}

export default function ImageUpload({
    errors,
    control,
    existingImageUrls = [],
    onRemoveExistingImage,
    trigger // Recebe a função `trigger`
}: ImageUploadProps) {
    const maxImages = 10
    const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

    return (

        <Controller
            name="images"
            control={control}
            render={({ field }) => {
                const images = (field.value || []) as File[]

                const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files) {
                        const filesArray = Array.from(e.target.files);
                        const newValidImages: File[] = [];

                        const availableSlots = maxImages - images.length;
                        let filesProcessed = 0;

                        for (const file of filesArray) {
                            if (filesProcessed >= availableSlots) {
                                toast.warn(`Limite máximo de ${maxImages} fotos atingido.`);
                                break;
                            }

                            if (file.size > MAX_IMAGE_SIZE_BYTES) {
                                toast.error(`A imagem '${file.name}' excede o tamanho máximo de 10MB.`);
                                continue;
                            }
                            newValidImages.push(file);
                            filesProcessed++;
                        }

                        if (newValidImages.length > 0) {
                            field.onChange([...images, ...newValidImages]);
                            trigger('images'); // Dispara a validação do campo `images`
                        }
                    }
                }

                const handleRemoveImage = (indexToRemove: number) => {
                    field.onChange(images.filter((_, index) => index !== indexToRemove));
                    trigger('images'); // Dispara a validação do campo `images`
                }

                const handleRemoveExistingImageClick = (idToRemove: string) => {
                    if (onRemoveExistingImage) {
                        onRemoveExistingImage(idToRemove);
                        trigger('existingImageUrls'); // Dispara a validação para o campo `existingImageUrls`
                    }
                };

                return (
                    <>
                        <input
                            type="file"
                            id="image-upload"
                            multiple
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                            onClick={(e) => {
                                const target = e.target as HTMLInputElement;
                                target.value = '';
                            }} // Limpa o valor do input para permitir o re-upload da mesma imagem.
                            disabled={images.length + existingImageUrls.length >= maxImages}
                        />
                        <Button
                            text="Adicionar fotos"
                            type="button"
                            svg="/assets/svg/upload.svg"
                            iconSize={21}
                            className={styles.uploadButton}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('image-upload')?.click();
                            }}
                            disabled={images.length + existingImageUrls.length >= maxImages}
                        />
                        {errors.images && <Message message={errors.images.message as string || "Erro nas fotos"} type={'error'} />}
                        <div className={styles.imagePreviewsContainer}>
                            {existingImageUrls.map((image, index) => (
                                <div key={image.id} className={styles.imagePreviewWrapper}>
                                    <img src={image.url} alt={`Foto ${index + 1}`} width={100} height={100} className={styles.imagePreview} />
                                    {onRemoveExistingImage && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveExistingImageClick(image.id)} // Chama a função `handleRemoveExistingImageClick` para remover a imagem.
                                            className={styles.removeImageButton}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                            {images.map((file, index) => {
                                const imageUrl = URL.createObjectURL(file);
                                return (
                                    <div key={file.name + index} className={styles.imagePreviewWrapper}>
                                        <img src={imageUrl} alt={`Foto ${index + 1}`} className={styles.imagePreview} />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className={styles.removeImageButton}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )
            }}
        />
    )
}

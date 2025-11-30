"use client"

import React from 'react'
import { UseFormSetValue, UseFormWatch, FieldErrors, Path, Control, Controller, UseFormTrigger } from 'react-hook-form'
import Button from '@/components/button/button'
import Message from '@/components/message/message'
import Image from 'next/image'
import styles from './style.module.css'
import { VehicleFormData } from '@/components/vehicles/vehicle-form/vehicle-form'

interface ExistingImage {
    id: string;
    url: string;
}

interface ImageUploadProps {
    setValue: UseFormSetValue<VehicleFormData>;
    watch: UseFormWatch<VehicleFormData>;
    errors: FieldErrors<VehicleFormData>;
    control: Control<VehicleFormData>;
    existingImageUrls?: ExistingImage[]; // Alterado para array de objetos
    onRemoveExistingImage?: (id: string) => void; // Recebe o id
    trigger: UseFormTrigger<VehicleFormData>; // Adicionar trigger
}

export default function ImageUpload({
    errors,
    control,
    existingImageUrls = [],
    onRemoveExistingImage,
    trigger // Receber trigger
}: ImageUploadProps) {
    const maxImages = 10

    return (

        <Controller
            name="images"
            control={control}
            render={({ field }) => {
                const images = (field.value || []) as File[]

                const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files) {
                        const filesArray = Array.from(e.target.files);
                        const newImages: File[] = [];

                        const availableSlots = maxImages - images.length;
                        const filesToUpload = filesArray.slice(0, availableSlots);

                        field.onChange([...images, ...filesToUpload]);
                        trigger('images'); // Disparar validação
                    }
                }

                const handleRemoveImage = (indexToRemove: number) => {
                    field.onChange(images.filter((_, index) => index !== indexToRemove));
                    trigger('images'); // Disparar validação
                }

                const handleRemoveExistingImageClick = (idToRemove: string) => {
                    if (onRemoveExistingImage) {
                        onRemoveExistingImage(idToRemove);
                        trigger('existingImageUrls'); // Disparar validação para existingImageUrls
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
                            }} // Permite o upload da mesma imagem novamente
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
                                    <img src={image.url} alt={`Foto existente ${index + 1}`} width={100} height={100} className={styles.imagePreview} />
                                    {onRemoveExistingImage && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveExistingImageClick(image.id)} // Usar a nova função aqui
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
                                        <Image src={imageUrl} alt={`Foto ${index + 1}`} width={100} height={100} className={styles.imagePreview} />
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

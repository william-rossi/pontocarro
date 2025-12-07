"use client"

import React, { useState } from 'react'
import { UseFormSetValue, UseFormWatch, FieldErrors, Path, Control, Controller } from 'react-hook-form'
import Input from '@/components/input/input'
import Button from '@/components/button/button'
import Message from '@/components/message/message'
import styles from './style.module.css'
import { VehicleFormData } from '../vehicles/vehicle-form/vehicle-form'

interface FeatureInputProps {
    setValue: UseFormSetValue<VehicleFormData>;
    watch: UseFormWatch<VehicleFormData>;
    errors: FieldErrors<VehicleFormData>;
    control: Control<VehicleFormData>;
}

export default function FeatureInput({
    errors,
    control,
}: FeatureInputProps) {
    const [featureInput, setFeatureInput] = useState<string>("")

    const maxFeatures = 10

    return (
        <Controller
            name={"features" as Path<VehicleFormData>}
            control={control}
            render={({ field }) => {
                const features = (field.value || []) as string[]

                const handleAddFeature = () => {
                    if (featureInput.trim() !== "" && features.length < maxFeatures) {
                        field.onChange([...features, featureInput.trim()])
                        setFeatureInput("")
                    }
                }

                const handleRemoveFeature = (indexToRemove: number) => {
                    field.onChange(features.filter((_, index) => index !== indexToRemove))
                }

                return (
                    <>
                        <div className={styles.inputGroup}>
                            <Input
                                placeholder="ex: Bancos de couro, câmera de ré..."
                                value={featureInput}
                                onChange={(e) => setFeatureInput(e.target.value)}
                                disabled={features.length >= maxFeatures}
                            />
                            <Button
                                text="Adicionar"
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleAddFeature();
                                }}
                                disabled={featureInput.trim() === "" || features.length >= maxFeatures}
                            />
                        </div>
                        {errors.features && <Message message={errors.features.message as string || "Erro nas características"} type={'error'} />}
                        <div className={styles.featuresContainer}>
                            {features.map((feature, index) => (
                                <div key={index} className={styles.featureTag}>
                                    <span>{feature}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFeature(index)}
                                        className={styles.removeFeatureButton}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )
            }}
        />
    )
}

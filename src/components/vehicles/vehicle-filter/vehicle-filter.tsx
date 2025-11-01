'use client'

import Input from '@/components/input/input'
import React from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import Select from '@/components/select/select'
import { useEffect, useState } from 'react'
import { VehicleFilter as VehicleFilterType } from '@/services/vehicles'

interface VehicleFilterProps {
    onApplyFilters: (filters: VehicleFilterType) => void
    onClearFilters: () => void
    showFilterOptions: boolean
    toggleFilterOptions: () => void
}

export default function VehicleFilter({
    onApplyFilters,
    onClearFilters,
    showFilterOptions,
    toggleFilterOptions
}: VehicleFilterProps) {
    const [filters, setFilters] = useState<VehicleFilterType>({
        brand: '',
        vehicleModel: '',
        engine: '',
        fuel: '',
        exchange: '',
        bodyType: '',
        minPrice: undefined,
        maxPrice: undefined,
        minYear: undefined,
        maxYear: undefined,
        state: '',
        city: '',
        mileage: undefined,
    })

    const handleInputChange = (key: keyof VehicleFilterType, value: string | number | undefined) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [key]: value === "" ? undefined : value
        }))
    }

    const applyFilters = () => {
        onApplyFilters(filters)
    }

    const clearFilters = () => {
        setFilters({
            brand: '',
            vehicleModel: '',
            engine: '',
            fuel: '',
            exchange: '',
            bodyType: '',
            minPrice: undefined,
            maxPrice: undefined,
            minYear: undefined,
            maxYear: undefined,
            state: '',
            city: '',
            mileage: undefined,
        })
        onClearFilters()
    }

    const brands = [
        { value: "", label: "Todas as marcas" },
        { value: "Chevrolet", label: "Chevrolet" },
        { value: "Fiat", label: "Fiat" },
        { value: "Volkswagen", label: "Volkswagen" },
        { value: "Ford", label: "Ford" },
        { value: "Honda", label: "Honda" },
        { value: "Hyundai", label: "Hyundai" },
        { value: "Toyota", label: "Toyota" },
    ]

    const engineTypes = [
        { value: "", label: "Todas" },
        { value: "1.0", label: "1.0" },
        { value: "1.4", label: "1.4" },
        { value: "1.6", label: "1.6" },
        { value: "1.8", label: "1.8" },
        { value: "2.0", label: "2.0" },
        { value: "Outro", label: "Outro" },
    ]

    const bodyTypes = [
        { value: "", label: "Todos os tipos" },
        { value: "Hatch", label: "Hatch" },
        { value: "Sedan", label: "Sedan" },
        { value: "SUV", label: "SUV" },
        { value: "Picape", label: "Picape" },
        { value: "Perua", label: "Perua" },
    ]

    const fuelTypes = [
        { value: "", label: "Todos" },
        { value: "Gasolina", label: "Gasolina" },
        { value: "Etanol", label: "Etanol" },
        { value: "Flex", label: "Flex" },
        { value: "Diesel", label: "Diesel" },
        { value: "Elétrico", label: "Elétrico" },
        { value: "Híbrido", label: "Híbrido" },
    ]

    const exchangeTypes = [
        { value: "", label: "Todos" },
        { value: "Automático", label: "Automático" },
        { value: "Manual", label: "Manual" },
    ]

    const states = [
        { value: "", label: "Todos os estados" },
        { value: "SP", label: "São Paulo" },
        { value: "RJ", label: "Rio de Janeiro" },
        { value: "MG", label: "Minas Gerais" },
    ]

    return (
        <div className={styles.container}>
            <div className={styles.inputArea}>
                <Input
                    placeholder="Busca por marca, modelo, cor, localização..."
                    startIcon="/assets/svg/magnifying-glass.svg"
                    className={styles.input}
                    iconSize={23}
                    value={filters.vehicleModel || ""}
                    onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                />
                <div className={styles.filterBtn} onClick={toggleFilterOptions}>
                    <Image src={'/assets/svg/filter.svg'} alt='filter' width={21} height={21} />
                    <span>Filtros</span>
                </div>
            </div>

            {showFilterOptions && (
                <>
                    <div className={styles.filterOptions}>
                        <Select
                            label="Marca"
                            options={brands}
                            value={filters.brand || ""}
                            onChange={(e) => handleInputChange('brand', e.target.value)}
                        />
                        <Select
                            label="Motorização"
                            options={engineTypes}
                            value={filters.engine || ""}
                            onChange={(e) => handleInputChange('engine', e.target.value)}
                        />
                        <Select
                            label="Tipo"
                            options={bodyTypes}
                            value={filters.bodyType || ""}
                            onChange={(e) => handleInputChange('bodyType', e.target.value)}
                        />
                        <Select
                            label="Combustível"
                            options={fuelTypes}
                            value={filters.fuel || ""}
                            onChange={(e) => handleInputChange('fuel', e.target.value)}
                        />
                        <Select
                            label="Câmbio"
                            options={exchangeTypes}
                            value={filters.exchange || ""}
                            onChange={(e) => handleInputChange('exchange', e.target.value)}
                        />
                    </div>

                    <div className={styles.filterOptions}>
                        <Input
                            placeholder="Preço mínimo"
                            label="Faixa de Preço (R$)"
                            type="number"
                            value={filters.minPrice || ""}
                            onChange={(e) => handleInputChange('minPrice', parseFloat(e.target.value))}
                        />
                        <Input
                            placeholder="Preço máximo"
                            type="number"
                            value={filters.maxPrice || ""}
                            onChange={(e) => handleInputChange('maxPrice', parseFloat(e.target.value))}
                        />
                        <Input
                            placeholder="Ano mínimo"
                            label="Ano do Veículo"
                            type="number"
                            value={filters.minYear || ""}
                            onChange={(e) => handleInputChange('minYear', parseFloat(e.target.value))}
                        />
                        <Input
                            placeholder="Ano máximo"
                            type="number"
                            value={filters.maxYear || ""}
                            onChange={(e) => handleInputChange('maxYear', parseFloat(e.target.value))}
                        />
                        <Input
                            placeholder="Km mínimo"
                            label="Quilometragem (km)"
                            type="number"
                            value={filters.mileage || ""}
                            onChange={(e) => handleInputChange('mileage', parseFloat(e.target.value))}
                        />
                        <Input
                            placeholder="Km máximo"
                            type="number"
                            value={filters.mileage || ""}
                            onChange={(e) => handleInputChange('mileage', parseFloat(e.target.value))}
                        />
                    </div>

                    <div className={styles.filterOptions}>
                        <Select
                            label="Estado"
                            options={states}
                            value={filters.state || ""}
                            onChange={(e) => handleInputChange('state', e.target.value)}
                        />
                        {/* <Select
                            label="Cidade"
                            options={cities}
                            value={filters.city || ""}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                        /> */}
                    </div>
                    <div className={styles.filterActions}>
                        <button onClick={applyFilters} className={styles.applyButton}>Aplicar Filtros</button>
                        <button onClick={clearFilters} className={styles.clearButton}>Limpar Filtros</button>
                    </div>
                </>
            )}
        </div>
    )
}

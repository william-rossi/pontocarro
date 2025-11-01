'use client'

import Input from '@/components/input/input'
import React from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import Select from '@/components/select/select'
import { useEffect, useState } from 'react'
import { VehicleFilter as VehicleFilterType } from '@/services/vehicles'
import Button from '@/components/button/button'

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
        name: '',
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
        let processedValue: string | number | undefined = value
        if (typeof value === 'string' && (key === 'minPrice' || key === 'maxPrice' || key === 'minYear' || key === 'maxYear' || key === 'mileage')) {
            const parsedValue = parseFloat(value)
            processedValue = isNaN(parsedValue) ? undefined : parsedValue
        }

        setFilters(prevFilters => ({
            ...prevFilters,
            [key]: processedValue === "" ? undefined : processedValue
        }))
    }

    const validateFilters = (): boolean => {
        if (filters.minPrice !== undefined && filters.maxPrice !== undefined && filters.minPrice > filters.maxPrice) {
            alert("O preço mínimo não pode ser maior que o preço máximo.")
            return false
        }
        if (filters.minYear !== undefined && filters.maxYear !== undefined && filters.minYear > filters.maxYear) {
            alert("O ano mínimo não pode ser maior que o ano máximo.")
            return false
        }
        return true
    }

    const applyFilters = () => {
        if (validateFilters()) {
            onApplyFilters(filters)
        }
    }

    const clearFilters = () => {
        setFilters({
            brand: '',
            vehicleModel: '',
            name: '',
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

    const cities = [
        { value: "", label: "Todas as cidades" },
        { value: "São Paulo", label: "São Paulo" },
        { value: "Rio de Janeiro", label: "Rio de Janeiro" },
        { value: "Belo Horizonte", label: "Belo Horizonte" },
    ]

    return (
        <div className={styles.container}>
            <div className={styles.inputArea}>
                <Input
                    placeholder="Busca por marca, modelo, cor, localização..."
                    startIcon="/assets/svg/magnifying-glass.svg"
                    className={styles.input}
                    iconSize={23}
                    value={filters.name || ""}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            applyFilters()
                        }
                    }}
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
                            label="Ano mínimo"
                            type="number"
                            placeholder="Ex: 2000"
                            value={filters.minYear || ""}
                            onChange={(e) => handleInputChange('minYear', e.target.value)}
                            min="1900"
                            max={new Date().getFullYear()}
                        />
                        <Input
                            label="Ano máximo"
                            type="number"
                            placeholder="Ex: 2023"
                            value={filters.maxYear || ""}
                            onChange={(e) => handleInputChange('maxYear', e.target.value)}
                            min="1900"
                            max={new Date().getFullYear()}
                        />
                    </div>
                    <div className={styles.filterOptions}>
                        <Input
                            label="Preço mínimo"
                            type="number"
                            placeholder="Ex: 20.000"
                            value={filters.minPrice || ""}
                            onChange={(e) => handleInputChange('minPrice', e.target.value)}
                            min="0"
                        />
                        <Input
                            label="Preço máximo"
                            type="number"
                            placeholder="Ex: 100.000"
                            value={filters.maxPrice || ""}
                            onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                            min="0"
                        />
                    </div>
                    <div className={styles.filterOptions}>
                        <Input
                            label="Quilometragem mínima"
                            type="number"
                            placeholder="Ex: 10.000"
                            value={filters.mileage || ""}
                            onChange={(e) => handleInputChange('mileage', e.target.value)}
                            min="0"
                        />
                    </div>
                    <div className={styles.filterOptions}>
                        <Select
                            label="Estado"
                            options={states}
                            value={filters.state || ""}
                            onChange={(e) => handleInputChange('state', e.target.value)}
                        />
                        <Select
                            label="Cidade"
                            options={cities}
                            value={filters.city || ""}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                        />
                    </div>
                    <div className={styles.filterActions}>
                        <Button text="Aplicar Filtros" onClick={applyFilters} className={styles.applyButton} />
                        <Button text="Limpar Filtros" onClick={clearFilters} className={styles.clearButton} />
                    </div>
                </>
            )}
        </div>
    )
}

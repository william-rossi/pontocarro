'use client'

import Input from '@/components/input/input'
import React from 'react'
import styles from './styles.module.css'
import Select from '@/components/select/select'
import { useEffect, useState } from 'react'
import { VehicleFilter } from '@/types/vehicle-filters'
import Button from '@/components/button/button'
import { BODY_TYPE, TRANSMISSION, FUEL } from '@/constants/select-box-items'
import LocationSelect from '@/components/location-select/location-select' // Importa o componente `LocationSelect`
import Image from 'next/image'

interface VehicleFilterProps {
    onApplyFilters: (filters: VehicleFilter) => void
    onClearFilters: () => void
    showFilterOptions: boolean
    toggleFilterOptions: () => void
    currentAppliedFilters: VehicleFilter
}

export default function VehicleFilterComponent({
    onApplyFilters,
    onClearFilters,
    showFilterOptions,
    toggleFilterOptions,
    currentAppliedFilters // Recebo a nova prop
}: VehicleFilterProps) {
    const [filters, setFilters] = useState<VehicleFilter>(currentAppliedFilters) // Inicializa o estado com as propriedades fornecidas

    useEffect(() => {
        // Atualiza o estado interno dos filtros quando `currentAppliedFilters` do componente pai muda
        setFilters(currentAppliedFilters)
    }, [currentAppliedFilters])

    const handleInputChange = (key: keyof VehicleFilter, value: string | number | undefined) => {
        let processedValue: string | number | undefined = value
        if (typeof value === 'string' && (key === 'minPrice' || key === 'maxPrice' || key === 'minYear' || key === 'maxYear' || key === 'mileage')) {
            const parsedValue = parseFloat(value)
            processedValue = isNaN(parsedValue) ? undefined : parsedValue
        }

        setFilters((prevFilters: VehicleFilter) => ({
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
            transmission: '',
            bodyType: '',
            minPrice: undefined,
            maxPrice: undefined,
            minYear: undefined,
            maxYear: undefined,
            state: '',
            city: '',
            mileage: undefined,
            maxMileage: undefined,
        })
        onClearFilters()
    }

    const handleClearSearch = () => {
        setFilters((prevFilters: VehicleFilter) => ({ ...prevFilters, name: '' }))
        // Aciona uma nova busca com o filtro de nome limpo
        onApplyFilters({ ...currentAppliedFilters, name: '' })
    }

    return (
        <div className={styles.container}>
            <div className={styles.inputArea}>
                <Input
                    placeholder="Busca por marca, modelo, cor..."
                    startIcon="/assets/svg/magnifying-glass.svg"
                    endIcon={filters.name ? "/assets/svg/close.svg" : undefined}
                    onEndIconClick={filters.name ? handleClearSearch : undefined}
                    className={styles.input}
                    classNameInputWrapper={styles.inputWrapper}
                    iconSize={23}
                    value={filters.name || ""}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            applyFilters()
                        }
                    }}
                />

                <Button
                    text='Filtros'
                    onClick={toggleFilterOptions}
                    svg='/assets/svg/filter.svg'
                    iconSize={21}
                    className={styles.filterBtn}
                />
                <div className={styles.filterImg}>
                    <Image
                        src={'/assets/svg/filter-blue.svg'}
                        width={27}
                        height={27}
                        alt='Filter'
                        onClick={toggleFilterOptions}
                    />
                </div>
            </div>

            {showFilterOptions && (
                <>
                    <div className={styles.filterOptions}>
                        {/* Substitui o `Select` de Marca por um `Input` */}
                        <Input
                            label="Marca"
                            placeholder="Ex: Chevrolet"
                            value={filters.brand || ""}
                            onChange={(e) => handleInputChange('brand', e.target.value)}
                        />
                        {/* Adiciona um `Input` para o Modelo */}
                        <Input
                            label="Modelo"
                            placeholder="Ex: Onix"
                            value={filters.vehicleModel || ""}
                            onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                        />
                        {/* Substitui o `Select` de Motorização por um `Input` */}
                        <Input
                            label="Motorização"
                            placeholder="Ex: 1.0, 2.0 Turbo"
                            value={filters.engine || ""}
                            onChange={(e) => handleInputChange('engine', e.target.value)}
                        />
                        <Select
                            label="Tipo"
                            options={BODY_TYPE}
                            value={filters.bodyType || ""}
                            onChange={(e) => handleInputChange('bodyType', e.target.value)}
                        />
                        <Select
                            label="Combustível"
                            options={FUEL}
                            value={filters.fuel || ""}
                            onChange={(e) => handleInputChange('fuel', e.target.value)}
                        />
                        <Select
                            label="Câmbio"
                            options={TRANSMISSION}
                            value={filters.transmission || ""}
                            onChange={(e) => handleInputChange('transmission', e.target.value)}
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
                        {/* Remove o `Input` para Quilometragem mínima */}
                        <Input
                            label="Quilometragem máxima"
                            type="number"
                            placeholder="Ex: 100.000"
                            value={filters.maxMileage || ""}
                            onChange={(e) => handleInputChange('maxMileage', e.target.value)}
                            min="0"
                        />
                    </div>
                    {/* Substitui os `Selects` de Estado e Cidade pelo componente `LocationSelect` */}
                    <LocationSelect
                        className={styles.filterOptions}
                        selectedStateValue={filters.state || ""}
                        selectedCityValue={filters.city || ""}
                        onStateChange={(value) => handleInputChange('state', value)}
                        onCityChange={(value) => handleInputChange('city', value)}
                    />
                    <div className={styles.filterActions}>
                        <Button text="Aplicar Filtros" onClick={applyFilters} />
                        {Object.keys(currentAppliedFilters).length > 0 && (
                            <Button text="Limpar Filtros" onClick={clearFilters} invert />
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

'use client'

import Input from '@/components/input/input'
import React from 'react'
import styles from './styles.module.css'
import Select from '@/components/select/select'
import { useEffect, useState } from 'react'
import { VehicleFilter as VehicleFilterType } from '@/services/vehicles'
import Button from '@/components/button/button'
import { BODY_TYPE, TRANSMISSION, FUEL } from '@/app/constants/select-box-items'
import LocationSelect from '@/components/location-select/location-select' // Importa LocationSelect

interface VehicleFilterProps {
    onApplyFilters: (filters: VehicleFilterType) => void
    onClearFilters: () => void
    showFilterOptions: boolean
    toggleFilterOptions: () => void
    currentAppliedFilters: VehicleFilterType // Adicionei a nova prop
}

export default function VehicleFilter({
    onApplyFilters,
    onClearFilters,
    showFilterOptions,
    toggleFilterOptions,
    currentAppliedFilters // Recebo a nova prop
}: VehicleFilterProps) {
    const [filters, setFilters] = useState<VehicleFilterType>(currentAppliedFilters) // Inicializo com a prop

    useEffect(() => {
        // Atualiza o estado interno de filters quando currentAppliedFilters do pai muda
        setFilters(currentAppliedFilters)
    }, [currentAppliedFilters])

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

    // Removido os arrays brands e engineTypes, pois serão substituídos por Inputs de texto.

    const handleClearSearch = () => {
        setFilters(prevFilters => ({ ...prevFilters, name: '' }))
        // Trigger a new search with cleared name filter
        onApplyFilters({ ...currentAppliedFilters, name: '' })
    }

    return (
        <div className={styles.container}>
            <div className={styles.inputArea}>
                <Input
                    placeholder="Busca por marca, modelo, cor, localização..."
                    startIcon="/assets/svg/magnifying-glass.svg"
                    endIcon={filters.name ? "/assets/svg/close.svg" : undefined}
                    onEndIconClick={filters.name ? handleClearSearch : undefined}
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

                <Button
                    text='Filtros'
                    onClick={toggleFilterOptions}
                    svg='/assets/svg/filter.svg'
                    width={21}
                    height={21}
                    className={styles.filterBtn}
                />
            </div>

            {showFilterOptions && (
                <>
                    <div className={styles.filterOptions}>
                        {/* Substitui o Select de Marca por Input */}
                        <Input
                            label="Marca"
                            placeholder="Ex: Chevrolet"
                            value={filters.brand || ""}
                            onChange={(e) => handleInputChange('brand', e.target.value)}
                        />
                        {/* Substitui o Select de Motorização por Input */}
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
                        {/* Removido o Input para Quilometragem mínima */}
                        <Input
                            label="Quilometragem máxima"
                            type="number"
                            placeholder="Ex: 100.000"
                            value={filters.maxMileage || ""}
                            onChange={(e) => handleInputChange('maxMileage', e.target.value)}
                            min="0"
                        />
                    </div>
                    {/* Substitui os Selects de Estado e Cidade por LocationSelect */}
                    <LocationSelect
                        className={styles.filterOptions}
                        selectedStateValue={filters.state || ""}
                        selectedCityValue={filters.city || ""}
                        onStateChange={(value) => handleInputChange('state', value)}
                        onCityChange={(value) => handleInputChange('city', value)}
                    />
                    <div className={styles.filterActions}>
                        <Button text="Aplicar Filtros" onClick={applyFilters} />
                        <Button text="Limpar Filtros" onClick={clearFilters} invert />
                    </div>
                </>
            )}
        </div>
    )
}

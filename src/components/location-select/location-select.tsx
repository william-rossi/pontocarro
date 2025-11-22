"use client"

import React, { useState, useEffect } from "react"
import Select from "@/components/select/select"
import { locations, StateProps } from "@/constants/locations"
import styles from "./style.module.css"

interface LocationSelectProps {
    selectedStateValue: string;
    selectedCityValue: string;
    onStateChange: (value: string) => void;
    onCityChange: (value: string) => void;
    stateError?: string;
    cityError?: string;
    disabledCity?: boolean;
    className?: string
}

export default function LocationSelect({
    selectedStateValue,
    selectedCityValue,
    onStateChange,
    onCityChange,
    stateError,
    cityError,
    disabledCity,
    className
}: LocationSelectProps) {
    const [filteredCities, setFilteredCities] = useState<{ value: string; label: string }[]>([])

    useEffect(() => {
        if (selectedStateValue) {
            const stateObject = locations.states.find(s => s.acronym === selectedStateValue)
            const cities = locations.cities.filter(city => city.state_id === stateObject?.state_id)
            const mappedCities = cities.map((city) => ({ label: city.name, value: city.name }))
            setFilteredCities(mappedCities)
        } else {
            setFilteredCities([])
        }
    }, [selectedStateValue])

    return (
        <div className={`${styles.locationGroup} ${className}`}>
            <Select
                label="Estado"
                options={[
                    { value: "", label: "Selecione" },
                    ...locations.states.map(state => ({ value: state.acronym, label: state.acronym }))
                ]}
                error={stateError}
                onChange={(e) => onStateChange(e.target.value)}
                value={selectedStateValue}
            />
            <Select
                label="Cidade"
                options={[
                    { value: "", label: "Selecione uma cidade" },
                    ...filteredCities,
                ]}
                error={cityError}
                onChange={(e) => onCityChange(e.target.value)}
                value={selectedCityValue}
                disabled={disabledCity || !selectedStateValue}
            />
        </div>
    )
}

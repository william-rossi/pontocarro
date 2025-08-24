"use client"

import React, { useState, useEffect } from "react"
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form"
import Select from "@/components/select/select"
import { locations, StateProps } from "@/app/constants/locations"
import styles from "./style.module.css"

interface LocationSelectProps {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
    setValue: UseFormSetValue<any>;
}

export default function LocationSelect({ register, errors, setValue }: LocationSelectProps) {
    const [selectedState, setSelectedState] = useState<StateProps | undefined>(undefined)
    const [filteredCities, setFilteredCities] = useState<{ value: string; label: string }[]>([])

    useEffect(() => {
        if (selectedState) {
            const potentialCities = locations.cities.filter(city => city.state_id === selectedState!.state_id);
            const stateCities: { name: string }[] = potentialCities as { name: string }[];
            setFilteredCities(stateCities.map((city: { name: string }) => ({ value: city.name, label: city.name })))
            setValue("city", "")
        } else {
            setFilteredCities([])
            setValue("city", "")
        }
    }, [selectedState, setValue])

    return (
        <div className={styles.locationGroup}>
            <Select
                label="Estado"
                options={[
                    { value: "", label: "Selecione" },
                    ...locations.states.map(state => ({ value: state.acronym, label: state.acronym }))
                ]}
                error={errors.state?.message?.toString()}
                {...register("state", {
                    onChange: (e) => {
                        const stateAcronym = e.target.value;
                        const foundState = locations.states.find(state => state.acronym === stateAcronym);
                        setSelectedState(foundState);
                    },
                })}
            />
            <Select
                label="Cidade"
                options={[
                    { value: "", label: "Selecione uma cidade" },
                    ...filteredCities,
                ]}
                error={errors.city?.message?.toString()}
                {...register("city")}
                disabled={!selectedState}
            />
        </div>
    )
}

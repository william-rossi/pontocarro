"use client"
import React, { SelectHTMLAttributes } from "react"
import styles from "./style.module.css"

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    error?: string
    options: { value: string; label: string }[]
    defaultOptionLabel?: string // Nova propriedade para o rótulo da opção padrão
}

export default function Select({
    label,
    error,
    options,
    className,
    defaultOptionLabel, // Desestrutura a nova propriedade
    ...props
}: SelectProps) {
    return (
        <div className={styles.wrapper}>
            {label && <label className={styles.label}>{label}</label>}
            <div
                className={`${styles.selectWrapper} ${error ? styles.errorBorder : ""}`}
            >
                <select className={`${styles.select} ${className || ""}`} {...props}>
                    {defaultOptionLabel && (
                        <option value="" disabled selected hidden>
                            {defaultOptionLabel}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    )
}

"use client"
import React, { SelectHTMLAttributes } from "react"
import styles from "./style.module.css"

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    error?: string
    options: { value: string; label: string }[]
}

export default function Select({
    label,
    error,
    options,
    className,
    ...props
}: SelectProps) {
    return (
        <div className={styles.wrapper}>
            {label && <label className={styles.label}>{label}</label>}
            <div
                className={`${styles.selectWrapper} ${error ? styles.errorBorder : ""}`}
            >
                <select className={`${styles.select} ${className || ""}`} {...props}>
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

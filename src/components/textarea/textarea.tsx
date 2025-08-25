"use client"
import React, { TextareaHTMLAttributes } from "react"
import styles from "./style.module.css"

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
}

export default function TextArea({
    label,
    error,
    className,
    ...props
}: TextAreaProps) {
    return (
        <div className={styles.wrapper}>
            {label && <label className={styles.label}>{label}</label>}
            <div
                className={`${styles.textareaWrapper} ${error ? styles.errorBorder : ""}`}
            >
                <textarea
                    className={`${styles.textarea} ${className || ""}`}
                    {...props}
                />
            </div>
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    )
}

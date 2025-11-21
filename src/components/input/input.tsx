"use client"
import React, { InputHTMLAttributes, useState } from "react"
import styles from "./style.module.css"
import Image from "next/image"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    startIcon?: string
    endIcon?: string
    iconSize?: number
    togglePasswordIcons?: { show: string; hide: string }
    onEndIconClick?: () => void
}

export default function Input({
    label,
    error,
    startIcon,
    endIcon,
    className,
    iconSize = 20,
    type,
    togglePasswordIcons = {
        show: "/icons/eye.svg",
        hide: "/icons/eye-off.svg"
    },
    onEndIconClick,
    ...props
}: InputProps) {
    const [showPassword, setShowPassword] = useState(false)

    const isPassword = type === "password"
    const inputType = isPassword ? (showPassword ? "text" : "password") : type

    return (
        <div className={styles.wrapper}>
            {label && <label className={styles.label}>{label}</label>}
            <div
                className={`${styles.inputWrapper} ${error ? styles.errorBorder : ""}`}
            >
                {startIcon && (
                    <span className={styles.icon}>
                        <Image src={startIcon} alt="icon" width={iconSize} height={iconSize} />
                    </span>
                )}

                <input
                    className={`${styles.input} ${className || ""}`}
                    type={inputType}
                    {...props}
                />

                {isPassword ? (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={styles.icon}
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                    >
                        <Image
                            src={showPassword ? togglePasswordIcons.hide : togglePasswordIcons.show}
                            alt="toggle password"
                            width={iconSize}
                            height={iconSize}
                        />
                    </button>
                ) : ( // If not a password input
                    endIcon && (
                        <button
                            type="button"
                            onClick={onEndIconClick}
                            className={styles.icon}
                            style={{ background: "none", border: "none", cursor: "pointer" }}
                        >
                            <Image src={endIcon} alt="icon" width={iconSize} height={iconSize} />
                        </button>
                    )
                )}
            </div>
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    )
}

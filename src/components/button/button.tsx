import React, { InputHTMLAttributes } from 'react'
import styles from './style.module.css'
import Image from 'next/image'

interface Props extends InputHTMLAttributes<HTMLButtonElement> {
    svg?: string
    alt?: string
    text: string
    onClick?(): void
    disabled?: boolean
    className?: string
}

export default function Button({
    svg,
    alt,
    text,
    onClick,
    ...props
}: Props) {
    return (
        <button onClick={onClick && onClick} className={`${props.className ?? ''} ${styles.container}`}>
            {svg && <Image src={svg} width={16} height={16} alt={alt ?? ''} />}
            {text}
        </button>
    )
}

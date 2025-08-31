import React, { InputHTMLAttributes } from 'react'
import styles from './style.module.css'
import Image from 'next/image'

interface Props extends InputHTMLAttributes<HTMLButtonElement> {
    svg?: string
    iconSize?: number
    alt?: string
    text: string
    onClick?(event: React.MouseEvent<HTMLButtonElement>): void
    disabled?: boolean
    className?: string
    invert?: boolean
}

export default function Button({
    svg,
    alt,
    text,
    iconSize = 16,
    onClick,
    invert,
    ...props
}: Props) {
    return (
        <button onClick={onClick && onClick} className={`${props.className ?? ''} ${styles.container} ${invert ? styles.invert : ''}`}>
            {svg && <Image src={svg} width={iconSize} height={iconSize} alt={alt ?? ''} />}
            {text}
        </button>
    )
}

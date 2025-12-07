import React, { ButtonHTMLAttributes, MouseEvent } from 'react';
import styles from './style.module.css';
import Image from 'next/image';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
    svg?: string;
    alt?: string;
    iconSize?: number;
    invert?: boolean;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({ text, svg, alt, iconSize = 25, invert = false, onClick, ...props }: Props) {
    return (
        <button {...props} onClick={onClick} className={`${props.className ?? ''} ${styles.container} ${invert ? styles.invert : ''}`}>
            {svg && <Image src={svg} width={iconSize} height={iconSize} alt={alt ?? ''} />}
            {text}
        </button>
    )
}

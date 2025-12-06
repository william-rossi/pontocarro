'use client'

import React from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'

interface Props {
    text?: string
    destination?: string
}

export default function BackButtonAnnounce({ text, destination }: Props) {
    const router = useRouter()
    const pathname = usePathname()

    const handleBack = () => {
        if (destination) {
            router.push(destination)
            return
        }

        if (typeof window !== 'undefined') {
            const referrer = document.referrer
            const currentDomain = window.location.origin

            if (referrer && referrer.startsWith(currentDomain)) {
                router.back()
            } else {
                router.push('/')
            }
        } else {
            router.push('/')
        }
    }

    const displayTitle = text || 'Voltar'

    return (
        <div className={styles.container}>
            <Image src={'/assets/svg/arrow-left.svg'} alt='arrow' width={18} height={18} />
            <span onClick={handleBack}>{displayTitle}</span>
        </div>
    )
}

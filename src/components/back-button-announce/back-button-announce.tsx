'use client'

import React from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface Props {
    text: string
}

export default function BackButtonAnnounce({ text }: Props) {
    const router = useRouter()

    const handleBack = () => {
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

    return (
        <div className={styles.container}>
            <Image src={'/assets/svg/arrow-left.svg'} alt='arrow' width={18} height={18} />
            <span onClick={handleBack}>{text}</span>
        </div>
    )
}

'use client'

import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import Link from 'next/link'
import Image from 'next/image'
import Button from '../button/button'
import Modal from '../overlays/modal/modal'
import { Overlay } from '../overlays/overlay'
import AccountProcess from '../account/account-process'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function Header() {
    const [isModal, setIsModal] = useState(false)
    const { user } = useAuth();
    const router = useRouter()

    const handleUserPath = (isAnnounce = false) => {
        if (user && isAnnounce)
            router.push('/anunciar')

        if (!user)
            setIsModal(true)
    }

    useEffect(() => {
        Overlay.startWatch()
    }, [])

    return (
        <>
            {isModal && (
                <Modal onClose={() => setIsModal(false)} isOpen={isModal} isInterceptRouting={false} options={{ animation: 'fade', headProps: { headTitle: 'Entrar na sua conta' } }}>
                    <AccountProcess />
                </Modal>
            )}
            <header className={styles.container}>
                <div className={styles.subContainer}>
                    <Link href={'/'} className={styles.logoArea}>
                        <div className={styles.dot} />
                        <span>CARRO</span>
                    </Link>
                    <div className={styles.actionGroup}>
                        <Button
                            text='Anunciar'
                            onClick={() => handleUserPath(true)}
                            alt='plus'
                            svg='/assets/svg/plus.svg'
                        />
                        <div onClick={() => handleUserPath()} className={styles.user}>
                            <Image src={'/assets/svg/user.svg'} width={19} height={19} alt='user' />
                            <span>{user ? user.username : 'Entrar'}</span>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

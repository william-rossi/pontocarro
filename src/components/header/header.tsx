'use client'

import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import Link from 'next/link'
import Image from 'next/image'
import Button from '../button/button'
import Modal from '../overlays/modal/modal'
import { Overlay } from '../overlays/overlay'
import AccountProcess from '../account/account-process'

export default function Header() {
    const [isModal, setIsModal] = useState(false)

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
                            onClick={() => setIsModal(true)}
                            alt='plus'
                            svg='/assets/svg/plus.svg'
                        />
                        <div className={styles.user}>
                            <Image src={'/assets/svg/user.svg'} width={19} height={19} alt='user' />
                            <span>Entrar</span>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

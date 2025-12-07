'use client'

import React, { useEffect, useState, useRef } from 'react'
import styles from './styles.module.css'
import Link from 'next/link'
import Image from 'next/image'
import Button from '../button/button'
import Modal from '../overlays/modal/modal'
import { Overlay } from '../overlays/overlay'
import AccountProcess, { AccountProcessType } from '../account/account-process'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { getFirstName } from '@/utils/user-helpers'
import Logo from '../logo/logo'
import { destroyCookie, parseCookies, setCookie } from 'nookies'

export default function Header() {
    const [isModal, setIsModal] = useState(false)
    const [accountProccessType, setAccountProccessType] = useState<AccountProcessType | undefined>()
    const [modalHeaderLabel, setModalHeaderLabel] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const [mounted, setMounted] = useState(false); // Estado para controlar a montagem do componente no cliente
    const { user, logout } = useAuth();
    const router = useRouter()
    const dropdownRef = useRef<HTMLDivElement>(null); // Referência para o elemento dropdown
    const userButtonRef = useRef<HTMLDivElement>(null); // Referência para o botão do usuário
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Referência para o timeout do evento hover

    const handleUserClick = () => {
        if (!user) {
            setIsModal(true)
        }
    }

    const handleDropdownClose = () => {
        setShowDropdown(false);
    };

    const handleMouseEnter = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        if (user) {
            setShowDropdown(true);
        }
    };

    const handleMouseLeave = () => {
        if (user) {
            hoverTimeoutRef.current = setTimeout(() => {
                setShowDropdown(false);
            }, 150); // Pequeno atraso para permitir que o mouse se mova para o dropdown
        }
    };

    // Fecha o dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && userButtonRef.current && !userButtonRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef, userButtonRef]);

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
        router.push('/'); // Redireciona para a página inicial após o logout
    };

    const handleAnnounceClick = () => {
        if (user) {
            router.push('/anunciar');
        } else {
            setIsModal(true);
            setCookie(null, 'callback', '/anunciar')
        }
    };

    useEffect(() => {
        setMounted(true);
        Overlay.startWatch()
    }, [])

    return (
        <>
            {isModal && (
                <Modal
                    onClose={() => {
                        setIsModal(false);
                        const parsedCookies = parseCookies()
                        const callback = parsedCookies.callback
                        if (callback) destroyCookie(null, 'callback')
                    }}
                    isOpen={isModal}
                    isInterceptRouting={false}
                    options={{
                        animation: 'fade',
                        headProps: { headTitle: modalHeaderLabel },
                        canClickOnOverlayToClose: window.innerHeight > window.innerWidth
                    }}
                >
                    <AccountProcess
                        accountProccessType={accountProccessType}
                        setHeaderLabel={e => setModalHeaderLabel(e)}
                    />
                </Modal>
            )}
            <header className={styles.container}>
                <div className={styles.subContainer}>
                    <Logo />
                    <div className={styles.actionGroup}>
                        <Button
                            text='Anunciar'
                            onClick={handleAnnounceClick}
                            alt='plus'
                            svg='/assets/svg/plus.svg'
                        />
                        <div
                            className={styles.userWrapper}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div
                                onClick={handleUserClick}
                                className={styles.user}
                                ref={userButtonRef}
                            >
                                <Image src={'/assets/svg/user.svg'} width={21} height={21} alt='user' />
                                {mounted ? ( // Renderiza o nome do usuário/Entrar apenas no lado do cliente
                                    <span>{user ? getFirstName(user.username) : 'Entrar'}</span>
                                ) : (
                                    // Opcional: placeholder para evitar mudanças de layout, se necessário
                                    <span style={{ minWidth: '50px' }}></span>
                                )}
                            </div>

                            {mounted && user && showDropdown && (
                                <div className={styles.dropdownMenu} ref={dropdownRef}>
                                    <Link href="/meus-veiculos" className={styles.dropdownItem} onClick={handleDropdownClose}>
                                        <Image src={'/assets/svg/car.svg'} width={17} height={17} alt='settings' />
                                        <span>Meus veículos</span>
                                    </Link>
                                    <div className={styles.dropdownItem} onClick={() => { setIsModal(true); setAccountProccessType('updateAccount') }}>
                                        <Image src={'/assets/svg/settings.svg'} width={17} height={17} alt='settings' />
                                        <span>Editar perfil</span>
                                    </div>
                                    <button onClick={handleLogout} className={styles.dropdownItem}>
                                        <Image src={'/assets/svg/arrow-left.svg'} width={17} height={17} alt='logout' />
                                        <span>Sair</span>
                                    </button>
                                    <div onClick={() => setShowDropdown(false)} className={styles.closeMobile}>
                                        <Image src={'/assets/svg/arrow-up.svg'} width={30} height={30} alt='close' />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

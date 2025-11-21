'use client'

import React, { useEffect, useState, useRef } from 'react'
import styles from './styles.module.css'
import Link from 'next/link'
import Image from 'next/image'
import Button from '../button/button'
import Modal from '../overlays/modal/modal'
import { Overlay } from '../overlays/overlay'
import AccountProcess from '../account/account-process'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { getFirstName } from '@/utils/user-helpers'
import Logo from '../logo/logo'

export default function Header() {
    const [isModal, setIsModal] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false) // Novo estado
    const [mounted, setMounted] = useState(false); // Novo estado para controlar montagem do cliente
    const { user, logout } = useAuth(); // Adicionado logout
    const router = useRouter()
    const dropdownRef = useRef<HTMLDivElement>(null); // Ref para o dropdown
    const userButtonRef = useRef<HTMLDivElement>(null); // Ref para o botão do usuário
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref para o timeout do hover

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
            }, 150); // Pequeno atraso para permitir mover o mouse para o dropdown
        }
    };

    // Fechar dropdown ao clicar fora
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
        }
    };

    useEffect(() => {
        setMounted(true);
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
                                <Image src={'/assets/svg/user.svg'} width={19} height={19} alt='user' />
                                {mounted ? ( // Renderiza o nome do usuário/Entrar apenas no cliente
                                    <span>{user ? getFirstName(user.username) : 'Entrar'}</span>
                                ) : (
                                    // Opcional: placeholder para evitar mudanças de layout se necessário
                                    <span style={{ minWidth: '50px' }}></span>
                                )}
                            </div>

                            {mounted && user && showDropdown && (
                                <div className={styles.dropdownMenu} ref={dropdownRef}>
                                    <Link href="/veiculos" className={styles.dropdownItem} onClick={handleDropdownClose}>
                                        <Image src={'/assets/svg/settings.svg'} width={17} height={17} alt='settings' />
                                        <span>Meus Veículos</span>
                                    </Link>
                                    <Link href="/editar-perfil" className={styles.dropdownItem} onClick={handleDropdownClose}>
                                        <Image src={'/assets/svg/settings.svg'} width={17} height={17} alt='settings' />
                                        <span>Editar Perfil</span>
                                    </Link>
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

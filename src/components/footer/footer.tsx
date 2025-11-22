'use client'

import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import Link from 'next/link'
import Logo from '../logo/logo'
import Image from 'next/image'
import { setCookie, parseCookies } from 'nookies'

type Theme = 'light' | 'dark'

export default function Footer() {
    const [theme, setTheme] = useState<Theme>('light')

    const themeHandler = () => {
        const cookies = parseCookies()
        const themeCookie = cookies.theme
        let themeName: Theme

        if (!themeCookie || theme === 'light')
            themeName = 'dark'
        else
            themeName = 'light'

        const bodyEl = document.getElementsByTagName('body')[0]

        if (bodyEl) {
            if (themeName === 'dark')
                bodyEl.className = bodyEl.className.replace('light', 'dark')
            else
                bodyEl.className = bodyEl.className.replace('dark', 'light')

            setCookie(null, 'theme', `${themeName}`)
            setTheme(themeName)
        }
    }

    useEffect(() => {
        const cookies = parseCookies()
        const themeCookie = cookies.theme

        if (!themeCookie) return

        setTheme(themeCookie as Theme)
    }, [])

    return (
        <footer className={styles.container}>
            <div className={styles.subContainer}>
                <div className={styles.infos}>
                    <div className={styles.logoSection}>
                        <Logo />
                    </div>
                    <div className={styles.linksSection}>
                        <h4>Navegação</h4>
                        <ul>
                            <li><Link href="/">Início</Link></li>
                            <li><Link href="/anunciar">Anunciar</Link></li>
                            <li><Link href="/meus-veiculos">Meus Veículos</Link></li>
                        </ul>
                    </div>
                    <div className={styles.contactSection}>
                        <h4>Contato</h4>
                        <a href="mailto:william.ruiz.work.br@gmail.com">Email: william.ruiz.work.br@gmail.com</a>
                    </div>
                </div>
                <div className={styles.bottomBar}>
                    <p>&copy; {new Date().getFullYear()} PontoCarro. Todos os direitos reservados.</p>
                    <div onClick={themeHandler} className={styles.themeSwitcher}>
                        <Image
                            src={`${theme === 'light' ? '/assets/svg/moon.svg' : '/assets/svg/sun.svg'}`}
                            width={20}
                            height={20}
                            alt='theme'
                        />
                    </div>
                </div>
            </div>
        </footer>
    )
}

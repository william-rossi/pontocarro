'use client'

import React from 'react'
import styles from './styles.module.css'
import Link from 'next/link'
import Logo from '../logo/logo'

export default function Footer() {
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
                </div>
            </div>
        </footer>
    )
}

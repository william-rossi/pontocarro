import React from 'react'
import styles from './styles.module.css'
import Input from '@/components/input/input'
import Button from '@/components/button/button'
import { AccountProcessType } from '../account-process'
import Image from 'next/image'

interface Props {
    moveTo(e: AccountProcessType): void
}

export default function ForgotPassword({ moveTo }: Props) {
    return (
        <form className={styles.container}>
            <div className={styles.titleArea}>
                <div className={styles.padlock}>
                    <Image
                        src={'/assets/svg/padlock.svg'}
                        alt='padlock'
                        width={40}
                        height={40}
                    />
                </div>
                <h3>Recuperar senha</h3>
                <p>Não se preocupe! Digite seu e-mail abaixo e enviaremos um link para redefinir sua senha.</p>
            </div>
            <Input
                label='E-mail'
                placeholder='seu@email.com'
                startIcon='/assets/svg/email.svg'
            />
            <Button
                text='Enviar link de recuperação'
                svg='/assets/svg/email-white.svg'
                className={styles.sendBtn}
            />
            <Button
                text='Voltar para o login'
                svg='/assets/svg/arrow-left.svg'
                invert
                onClick={e => {
                    e.preventDefault()
                    moveTo('login')
                }}
            />
        </form>
    )
}

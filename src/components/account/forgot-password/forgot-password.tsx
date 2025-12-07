import React from 'react'
import styles from './styles.module.css'
import Input from '@/components/input/input'
import Button from '@/components/button/button'
import { AccountProcessType } from '../account-process'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPassword } from '@/services/auth'
import { useState } from 'react'
import Message from '@/components/message/message'

interface Props {
    moveTo(e: AccountProcessType): void
}

const forgotPasswordSchema = z.object({
    email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPassword({ moveTo }: Props) {
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    })

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setMessage(null)
        try {
            const response = await forgotPassword(data.email)
            setMessage({ type: 'success', text: response.message })
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Ocorreu um erro inesperado.' })
        }
    }

    return (
        <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
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
            {message && <Message type={message.type} message={message.text} />}
            <Input
                label='E-mail'
                placeholder='seu@email.com'
                startIcon='/assets/svg/email.svg'
                {...register('email')}
                error={errors.email?.message}
            />
            <Button
                text='Enviar link de recuperação'
                svg='/assets/svg/email-white.svg'
                className={styles.sendBtn}
                type='submit'
                disabled={isSubmitting}
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

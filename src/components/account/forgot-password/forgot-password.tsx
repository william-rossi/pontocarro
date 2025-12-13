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
import { useState, useEffect } from 'react'
import Message from '@/components/message/message'

interface Props {
    moveTo(e: AccountProcessType): void
}

const forgotPasswordSchema = z.object({
    email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPassword({ moveTo }: Props) {
    const [message, setMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null)
    const [cooldownActive, setCooldownActive] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [remainingTime, setRemainingTime] = useState(0)
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
            setIsLoading(true)
            const response = await forgotPassword(data.email)
            setMessage({ type: 'success', message: response.message })
            setCooldownActive(true)
            setRemainingTime(300) // 5 minutes in seconds
            localStorage.setItem('forgotPasswordCooldownEnd', (Date.now() + 300 * 1000).toString())
        } catch (error: unknown) {
            setMessage({ type: 'error', message: (error instanceof Error) ? error.message : 'Ocorreu um erro inesperado.' })
        }
        finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const savedCooldownEnd = localStorage.getItem('forgotPasswordCooldownEnd')
        if (savedCooldownEnd) {
            const timeLeft = Math.round((parseInt(savedCooldownEnd) - Date.now()) / 1000)
            if (timeLeft > 0) {
                setCooldownActive(true)
                setRemainingTime(timeLeft)
            } else {
                localStorage.removeItem('forgotPasswordCooldownEnd')
            }
        }
    }, [])

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (cooldownActive && remainingTime > 0) {
            timer = setInterval(() => {
                setRemainingTime((prevTime) => prevTime - 1)
            }, 1000)
        } else if (remainingTime === 0 && cooldownActive) {
            setCooldownActive(false)
            localStorage.removeItem('forgotPasswordCooldownEnd')
        }
        return () => clearInterval(timer)
    }, [cooldownActive, remainingTime])

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
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
            {message && <Message type={message.type} message={message.message} />}
            <Input
                label='E-mail'
                placeholder='seu@email.com'
                startIcon='/assets/svg/email.svg'
                {...register('email')}
                error={errors.email?.message}
            />
            <Button
                text={isLoading ? 'Enviando...' : cooldownActive ? `Reenviar em ${formatTime(remainingTime)}` : 'Enviar link de recuperação'}
                svg='/assets/svg/email-white.svg'
                className={styles.sendBtn}
                type='submit'
                disabled={isSubmitting || cooldownActive}
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

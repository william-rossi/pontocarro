'use client'

import React, { useState } from 'react'
import styles from './styles.module.css'
import Input from '@/components/input/input'
import Button from '@/components/button/button'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPassword } from '@/services/auth'
import { useParams, useRouter } from 'next/navigation'
import Message from '@/components/message/message'
import { toast } from 'react-toastify'

const resetPasswordSchema = z.object({
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
    const router = useRouter()
    const params = useParams();
    const { token } = params;
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    })

    const onSubmit = async (data: ResetPasswordFormData) => {
        setMessage(null)
        try {
            const response = await resetPassword(data.password, data.confirmPassword, token as string)
            toast.success(response.message || 'Senha redefinida com sucesso!')
            router.push('/')
        }
        catch (error: unknown) {
            if ((error instanceof Error) && error.message === "As senhas não coincidem.") {
                setError("confirmPassword", { type: "manual", message: error.message })
            } else {
                setMessage({ type: 'error', text: (error instanceof Error) ? error.message : 'Ocorreu um erro inesperado.' })
            }
        }
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.titleArea}>
                    <div className={styles.padlock}>
                        <Image
                            src={'/assets/svg/padlock.svg'}
                            alt='padlock'
                            width={40}
                            height={40}
                        />
                    </div>
                    <h3>Redefinir Senha</h3>
                    <p>Digite sua nova senha.</p>
                </div>
                {message && <Message type={message.type} message={message.text} />}
                <Input
                    label='Nova Senha'
                    placeholder='********'
                    type='password'
                    startIcon='/assets/svg/padlock.svg'
                    {...register('password')}
                    error={errors.password?.message}
                />
                <Input
                    label='Confirmar Nova Senha'
                    placeholder='********'
                    type='password'
                    startIcon='/assets/svg/padlock.svg'
                    {...register('confirmPassword')}
                    error={errors.confirmPassword?.message}
                />
                <Button
                    text='Redefinir Senha'
                    svg='/assets/svg/check-white.svg'
                    className={styles.sendBtn}
                    type='submit'
                    disabled={isSubmitting}
                />
            </form>
        </div>
    )
}

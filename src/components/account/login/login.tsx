"use client"

import React, { useState } from "react"
import styles from "./styles.module.css"
import Input from "@/components/input/input"
import Button from "@/components/button/button"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { AccountProcessType } from "../account-process"
import { useAuth } from '@/context/AuthContext';
import { loginUser } from '@/services/auth';
import { User } from '@/types/auth';
import Message from "@/components/message/message"
import { Overlay } from "@/components/overlays/overlay"

const loginSchema = z.object({
    email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
})

type LoginFormData = z.infer<typeof loginSchema>

interface Props {
    moveTo(e: AccountProcessType): void
}

export default function Login({ moveTo }: Props) {
    const [errorMessage, setErrorMessage] = useState<string>()

    const { login } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

    const onSubmit = async (data: LoginFormData) => {
        setErrorMessage(undefined)
        try {
            const loginResponse = await loginUser({ email: data.email, password: data.password });

            const user: User = {
                _id: loginResponse.user._id,
                username: loginResponse.user.username,
                email: loginResponse.user.email,
                phone: loginResponse.user.phone,
                location: loginResponse.user.location,
                created_at: loginResponse.user.created_at ? new Date(loginResponse.user.created_at) : undefined,
            };

            login(user, loginResponse.accessToken, loginResponse.refreshToken);

            Overlay.dismiss()
        }
        catch (e) {
            const error = e as Error
            console.error(error);
            setErrorMessage(error.message || "Erro ao realizar login. Tente novamente.")
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
            <Input
                label="E-mail"
                placeholder="seu@email.com"
                type="email"
                maxLength={150}
                startIcon="/assets/svg/magnifying-glass.svg"
                error={errors.email?.message}
                {...register("email")}
            />

            <Input
                label="Senha"
                placeholder="Sua senha"
                type="password"
                maxLength={50}
                startIcon="/assets/svg/magnifying-glass.svg"
                error={errors.password?.message}
                {...register("password")}
            />

            <label className={styles.forgotPassword}>Esqueceu sua senha?</label>

            <Button
                text={isSubmitting ? "Entrando..." : "Entrar"}
                type="submit"
                onClick={() => null}
                className={styles.btn}
            />

            {errorMessage && <Message message={errorMessage} type={'error'} />}

            <label className={styles.createAccount}>
                Não tem uma conta? <span onClick={() => moveTo('createAccount')}>Cadastre-se</span>
            </label>
        </form>
    )
}

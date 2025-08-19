"use client"

import React from "react"
import styles from "./styles.module.css"
import Input from "@/components/input/input"
import Button from "@/components/button/button"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { AccountProcessType } from "../account-process"

const loginSchema = z.object({
    email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
})

type LoginFormData = z.infer<typeof loginSchema>

interface Props {
    moveTo(e: AccountProcessType): void
}

export default function Login({ moveTo }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

    const onSubmit = (data: LoginFormData) => {
        console.log("Login data:", data)
        // aqui você pode chamar sua API de autenticação
    }

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

            <label className={styles.createAccount}>
                Não tem uma conta? <span onClick={() => moveTo('createAccount')}>Cadastre-se</span>
            </label>
        </form>
    )
}

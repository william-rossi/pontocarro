"use client"

import React, { useState } from "react"
import styles from "./styles.module.css"
import Input from "@/components/input/input"
import Button from "@/components/button/button"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { AccountProcessType } from "../account-process"
import { PatternFormat } from "react-number-format"
import { User } from "@/types"
import { registerUser } from "@/services/api"

const createAccountSchema = z
    .object({
        name: z
            .string()
            .min(3, "Nome deve ter no mínimo 3 caracteres")
            .max(100, "Nome muito longo"),
        email: z
            .string()
            .min(1, "E-mail é obrigatório")
            .max(150, "E-mail muito longo")
            .email("E-mail inválido"),
        password: z
            .string()
            .min(8, "A senha deve ter pelo menos 8 caracteres")
            .max(50, "A senha deve ter no máximo 50 caracteres")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial"
            ),
        confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
        phone: z
            .string()
            .min(14, "Telefone inválido")
            .regex(
                /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
                "Telefone deve estar no formato (11) 99999-9999 ou (11) 3333-3333"
            ),
        location: z
            .string()
            .min(2, "Localização é obrigatória")
            .max(80, "Localização muito longa"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "As senhas não coincidem",
    })

type CreateAccountFormData = z.infer<typeof createAccountSchema>

interface Props {
    moveTo(e: AccountProcessType): void
}

export default function CreateAccount({ moveTo }: Props) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<CreateAccountFormData>({
        resolver: zodResolver(createAccountSchema),
        defaultValues: {
            phone: "",
        },
    })

    const onSubmit = async (data: CreateAccountFormData) => {
        setErrorMessage(null)
        try {
            const newUser: Omit<User, "_id" | "created_at"> = {
                username: data.name,
                email: data.email,
                password: data.password,
                phone: data.phone,
                location: data.location,
            }

            const user = registerUser(newUser)

            alert("Conta criada com sucesso!")

            // Overlay.dismiss()
        }
        catch (e) {
            const error = e as Error
            console.error(e)
            setErrorMessage(error.message || "Erro ao criar conta. Tente novamente.")
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
            <Input
                label="Nome completo"
                placeholder="Seu nome completo"
                startIcon="/assets/svg/magnifying-glass.svg"
                max={100}
                error={errors.name?.message}
                {...register("name")}
            />

            <Input
                label="E-mail"
                placeholder="seu@email.com"
                type="email"
                maxLength={150}
                startIcon="/assets/svg/magnifying-glass.svg"
                error={errors.email?.message}
                {...register("email")}
            />

            <div className={styles.passwordGroup}>
                <Input
                    label="Senha"
                    placeholder="Mínimo 8 caracteres"
                    type="password"
                    startIcon="/assets/svg/magnifying-glass.svg"
                    error={errors.password?.message}
                    maxLength={50}
                    {...register("password")}
                />
                <Input
                    label="Confirmar senha"
                    placeholder="Confirme a senha"
                    type="password"
                    maxLength={50}
                    startIcon="/assets/svg/magnifying-glass.svg"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                />
            </div>

            <Controller
                name="phone"
                control={control}
                render={({ field }) => {
                    const digits = (field.value || "").replace(/\D/g, "")
                    const isMobile = digits.length > 10

                    return (
                        <PatternFormat
                            value={field.value ?? ""}
                            onValueChange={(vals) => field.onChange(vals.formattedValue)}
                            format={isMobile ? "(##) #####-####" : "(##) ####-####"}
                            customInput={Input}
                            mask={'_'}
                            label="Telefone"
                            placeholder="(11) 99999-9999"
                            type="tel"
                            startIcon="/assets/svg/magnifying-glass.svg"
                            error={errors.phone?.message}
                        />
                    )
                }}
            />

            <Input
                label="Localização"
                placeholder="São Paulo, SP"
                startIcon="/assets/svg/location.svg"
                maxLength={80}
                error={errors.location?.message}
                {...register("location")}
            />

            <Button
                text={isSubmitting ? "Criando conta..." : "Criar conta"}
                type="submit"
                className={styles.btn}
                disabled={isSubmitting}
            />

            <label className={styles.hasAccount}>
                Já tem uma conta?{" "}
                <span onClick={() => moveTo("login")}>Faça login</span>
            </label>
        </form>
    )
}

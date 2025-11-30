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
import { User } from "@/types/auth"
import { registerUser } from "@/services/auth"
import { useAuth } from '@/context/AuthContext';
import Message from "@/components/message/message"
import { Overlay } from "@/components/overlays/overlay"
import LocationSelect from "@/components/location-select/location-select"
import { cleanPhoneNumber } from "@/utils/phone-helpers"

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
            .min(1, "Campo obrigatório")
            .superRefine((val, ctx) => {
                const _val = val.replace(/\D/g, '')
                if (_val.length < 10) {
                    ctx.addIssue({
                        code: "too_big",
                        maximum: 3,
                        origin: "number",
                        message: "Telefone do anunciante inválido (mínimo 14 dígitos)",
                    });
                }
                if (_val.length > 11) {
                    ctx.addIssue({
                        code: "too_big",
                        maximum: 3,
                        origin: "number",
                        message: "Telefone do anunciante inválido (máximo 15 dígitos)",
                    });
                }
            }),
        state: z.string().min(1, "Campo obrigatório"),
        city: z.string().min(1, "Campo obrigatório"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem!",
        path: ["confirmPassword"],
    })
    .refine((data) => data.state !== "", {
        message: "Por favor, selecione um estado",
        path: ["state"],
    })
    .refine((data) => data.city !== "", {
        message: "Por favor, selecione uma cidade",
        path: ["city"],
    })

type CreateAccountFormData = z.infer<typeof createAccountSchema>

interface Props {
    moveTo(e: AccountProcessType): void
}

export default function CreateAccount({ moveTo }: Props) {
    const [errorMessage, setErrorMessage] = useState<string>()
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm<CreateAccountFormData>({
        resolver: zodResolver(createAccountSchema),
        defaultValues: {
            phone: "",
            state: "", // Define o valor padrão para o estado
            city: "",  // Define o valor padrão para a cidade
        },
    })

    const onSubmit = async (data: CreateAccountFormData) => {
        setErrorMessage(undefined)
        try {
            const newUser: Omit<User, "_id" | "created_at"> = {
                username: data.name,
                email: data.email,
                password: data.password,
                phone: cleanPhoneNumber(data.phone),
                city: data.city,
                state: data.state
            }

            const registeredUser = await registerUser(newUser)

            const user: User = {
                _id: registeredUser.userId,
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                phone: newUser.phone,
                city: newUser.city,
                state: newUser.state,
                refreshToken: registeredUser.refreshToken,
                created_at: new Date(),
            }

            login(user, registeredUser.accessToken, registeredUser.refreshToken); // Faz o login automático após o registro

            Overlay.dismiss()
        }
        catch (e) {
            const error = e as Error
            console.error(error)
            setErrorMessage(error.message || "Erro ao criar conta. Tente novamente.")
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
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
                    return (
                        <PatternFormat
                            value={field.value ?? ""}
                            onValueChange={(vals) => field.onChange(vals.formattedValue)}
                            format={"(##) #####-####"}
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

            <LocationSelect
                selectedStateValue={watch("state")}
                selectedCityValue={watch("city")}
                onStateChange={(value) => setValue("state", value)}
                onCityChange={(value) => setValue("city", value)}
                stateError={errors.state?.message}
                cityError={errors.city?.message}
                disabledCity={!watch("state")}
            />

            <Button
                text={isSubmitting ? "Criando conta..." : "Criar conta"}
                type="submit"
                className={styles.btn}
                disabled={isSubmitting}
            />

            {errorMessage && <Message message={errorMessage} type={'error'} />}

            <label className={styles.hasAccount}>
                Já tem uma conta?{" "}
                <span onClick={() => moveTo("login")}>Faça login</span>
            </label>
        </form>
    )
}

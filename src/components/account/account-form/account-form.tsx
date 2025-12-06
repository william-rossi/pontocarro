"use client"

import React, { useEffect, useState } from "react"
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
import { updateUser } from "@/services/user"
import { UpdateUserRequest } from "@/types/user"

// ESQUEMAS ZOD (Defina as validações que NUNCA mudam primeiro)

// 1. Defina o esquema base (sem validação de senha obrigatória)
const baseAccountFormSchema = z
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
        // No esquema base, password e confirmPassword são opcionais (usado para UPDATE)
        password: z
            .string()
            .optional(),
        confirmPassword: z.string().optional(),
        // ... (resto das validações inalteradas, phone, state, city)
        phone: z
            .string()
            .min(1, "Campo obrigatório")
            .superRefine((val, ctx) => {
                const _val = val.replace(/\D/g, '')
                if (_val.length < 10) {
                    ctx.addIssue({
                        code: "too_small",
                        minimum: 10,
                        origin: "number",
                        message: "Telefone do anunciante inválido (mínimo 10 dígitos)",
                    });
                }
                if (_val.length > 11) {
                    ctx.addIssue({
                        code: "too_big",
                        maximum: 11,
                        origin: "number",
                        message: "Telefone do anunciante inválido (máximo 11 dígitos)",
                    });
                }
            }),
        state: z.string().min(1, "Campo obrigatório"),
        city: z.string().min(1, "Campo obrigatório"),
    })
    // Validação de senhas coincidentes (sempre deve existir, mesmo que os campos estejam vazios no update)
    .refine((data) => {
        if (data.password || data.confirmPassword) {
            return data.password === data.confirmPassword;
        }
        return true;
    }, {
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
    });


// 2. Função que gera o esquema final baseado no modo
const getAccountFormSchema = (mode: 'create' | 'update') => {
    if (mode === 'update') {
        // No modo 'update', usamos o esquema base onde a senha é opcional.
        return baseAccountFormSchema;
    }

    // No modo 'create', aplicamos as regras de obrigatoriedade e complexidade
    return baseAccountFormSchema.extend({
        password: z
            .string()
            .min(8, "A senha deve ter pelo menos 8 caracteres")
            .max(50, "A senha deve ter no máximo 50 caracteres")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial"
            ),
        // Confirmação de senha deve ser string obrigatória também no create
        confirmPassword: z
            .string()
            .min(1, "Confirmação de senha é obrigatória"),
    });
};

export type AccountFormData = z.infer<typeof baseAccountFormSchema> // Use o esquema base para o tipo

interface Props {
    moveTo?(e: AccountProcessType): void
    mode: 'create' | 'update'
    initialData?: Partial<AccountFormData>
    onSuccess?: (user: User) => void
}

export default function AccountForm({ moveTo, mode, initialData, onSuccess }: Props) {
    const [errorMessage, setErrorMessage] = useState<string>()
    const { login, user, refreshAccessToken, accessToken } = useAuth();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        setValue,
        watch,
        reset
    } = useForm<AccountFormData>({
        resolver: zodResolver(getAccountFormSchema(mode)),
        defaultValues: {
            phone: "",
            state: "",
            city: "",
        },
    })

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const onSubmit = async (data: AccountFormData) => {
        setErrorMessage(undefined)
        try {
            if (mode === 'create') {
                const newUser: Omit<User, "_id" | "created_at"> = {
                    username: data.name!,
                    email: data.email!,
                    password: data.password!,
                    phone: cleanPhoneNumber(data.phone!),
                    city: data.city!,
                    state: data.state!
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
            }
            else { // mode === 'update'
                if (!user?._id || !accessToken) {
                    throw new Error("Usuário não autenticado.")
                }

                const updatedFields: Partial<Omit<User, "_id" | "created_at" | "password" | "refreshToken">> = {
                    username: data.name,
                    email: data.email,
                    phone: cleanPhoneNumber(data.phone!),
                    city: data.city,
                    state: data.state,
                }

                if (data.password) {
                    (updatedFields as Partial<User>).password = data.password;
                }

                const updateUserRequest: UpdateUserRequest = {
                    _id: user._id,
                    username: data.name!,
                    email: data.email!,
                    phone: cleanPhoneNumber(data.phone!),
                    city: data.city!,
                    state: data.state!,
                }

                if (data.password) {
                    updateUserRequest.password = data.password;
                }

                if (!accessToken) {
                    throw new Error("Access token não disponível.")
                }

                const updatedUserResponse = await updateUser(updateUserRequest, accessToken, refreshAccessToken);

                const updatedUserData: User = {
                    ...user,
                    username: data.name!,
                    email: data.email!,
                    phone: cleanPhoneNumber(data.phone!),
                    city: data.city!,
                    state: data.state,
                    // password: data.password, // Don't store password in context
                    refreshToken: updatedUserResponse.refreshToken,
                }

                // setUser(updatedUserData);
                // setCookie(null, 'user', JSON.stringify(updatedUserData), { maxAge: 30 * 24 * 60 * 60, path: '/' });
                if (onSuccess) {
                    onSuccess(updatedUserData);
                }
            }

            Overlay.dismiss()
        }
        catch (e) {
            const error = e as Error
            console.error(error)
            setErrorMessage(error.message || `Erro ao ${mode === 'create' ? 'criar conta' : 'atualizar perfil'}. Tente novamente.`)
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
                    label={mode === 'update' ? "Senha (opcional)" : "Senha"}
                    placeholder="Mínimo 8 caracteres"
                    type="password"
                    startIcon="/assets/svg/magnifying-glass.svg"
                    error={errors.password?.message}
                    maxLength={50}
                    autoComplete={mode === 'update' ? 'new-password' : 'current-password'}
                    {...register("password")}
                />
                <Input
                    label={"Confirmar senha"}
                    placeholder="Confirme a senha"
                    type="password"
                    maxLength={50}
                    startIcon="/assets/svg/magnifying-glass.svg"
                    error={errors.confirmPassword?.message}
                    autoComplete={mode === 'update' ? 'new-password' : 'current-password'}
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
                            format="(##) #####-####"
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
                text={isSubmitting ? (mode === 'create' ? "Criando conta..." : "Atualizando perfil...") : (mode === 'create' ? "Criar conta" : "Atualizar perfil")}
                type="submit"
                className={styles.btn}
                disabled={isSubmitting}
            />

            {errorMessage && <Message message={errorMessage} type={'error'} />}

            {mode === 'create' && (
                <label className={styles.hasAccount}>
                    Já tem uma conta?{" "}
                    <span onClick={() => moveTo!("login")}>Faça login</span>
                </label>
            )}
        </form>
    )
}

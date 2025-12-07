import { API_BASE_URL } from '@/constants/secrets'
import { User, LoginResponse, RegisterUserResponse, RefreshTokenResponse, RegisterUserRequest } from '../types/auth'
import { getErrorMessage } from './utils'

export const registerUser = async (newUser: RegisterUserRequest): Promise<RegisterUserResponse> => {
    const response = await fetch('/api/register-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)
    })

    if (!response.ok)
        throw new Error(await getErrorMessage(response))

    return response.json()
}

export const loginUser = async (credentials: Pick<User, 'email' | 'password'>): Promise<LoginResponse> => {
    const response = await fetch('/api/login-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
    })

    if (!response.ok)
        throw new Error(await getErrorMessage(response))

    return response.json()
}

export const refreshToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            refreshToken: refreshToken
        }),
    })

    if (!response.ok)
        throw new Error(await getErrorMessage(response))

    return response.json()
}

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    })
    if (!response.ok) {
        throw new Error('Falha ao enviar e-mail de redefinição de senha')
    }
    return response.json()
}

export const resetPassword = async (password: string, confirmPassword: string, resetToken: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password/${resetToken}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, confirmPassword }),
    })
    if (!response.ok) {
        throw new Error('Falha ao enviar e-mail de redefinição de senha')
    }
    return response.json()
}
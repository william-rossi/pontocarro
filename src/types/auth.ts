export interface User {
    _id: string
    username: string
    email: string
    password?: string
    phone?: string
    city?: string
    state?: string
    created_at?: Date
    refreshToken?: string
}

export type RegisterUserRequest = Omit<User, '_id' | 'created_at'>;

export interface RegisterUserResponse {
    message: string
    accessToken: string
    userId: string
    refreshToken: string
}

export interface LoginResponse {
    message: string
    accessToken: string
    user: User
    refreshToken: string
}

export interface RefreshTokenResponse {
    message: string;
    accessToken: string;
}

import { User } from "./auth"

export interface UpdateUserRequest extends Partial<Omit<User, 'created_at' | 'refreshToken'>> { }

export interface UpdateUserResponse {
    message: string
    refreshToken: string
}
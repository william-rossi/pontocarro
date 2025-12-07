import { User } from "./auth"

export type UpdateUserRequest = Partial<Omit<User, 'created_at' | 'refreshToken'>>;

export interface UpdateUserResponse {
    message: string
    refreshToken: string
}
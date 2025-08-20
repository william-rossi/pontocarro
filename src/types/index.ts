export interface User {
    _id: string
    username: string
    email: string
    password?: string
    phone?: string
    location?: string
    created_at?: Date
}

export interface RegisterUserResponse {
    message: string
    token: string
    userId: string
}

export interface Car {
    _id: string
    owner_id: string
    make: string
    carModel: string
    year: number
    price?: number | null
    description?: string
    location?: string
    engineType?: string
    vehicleType?: string
    fuelType?: string
    transmission?: string
    mileage?: number | null
    created_at?: Date
}

export interface LoginResponse {
    token: string
    user: User
}

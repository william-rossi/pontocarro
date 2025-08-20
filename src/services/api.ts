import { Car, User, LoginResponse, RegisterUserResponse } from '../types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

interface CarFilter {
    make?: string
    carModel?: string
    year?: number
    minPrice?: number
    maxPrice?: number
    location?: string
    engineType?: string
    vehicleType?: string
    fuelType?: string
    transmission?: string
    mileage?: number
}

// Cars API
export const getCars = async (): Promise<Car[]> => {
    const response = await fetch(`${API_BASE_URL}/cars`)
    if (!response.ok) {
        throw new Error('Failed to fetch cars')
    }
    return response.json()
}

export const searchCars = async (filters: CarFilter): Promise<Car[]> => {
    const query = new URLSearchParams(filters as Record<string, string>).toString()
    const response = await fetch(`${API_BASE_URL}/cars/search?${query}`)
    if (!response.ok) {
        throw new Error('Failed to search cars')
    }
    return response.json()
}

export const getCarsByLocation = async (location: string): Promise<Car[]> => {
    const response = await fetch(`${API_BASE_URL}/cars/by-location?location=${location}`)
    if (!response.ok) {
        throw new Error('Failed to fetch cars by location')
    }
    return response.json()
}

export const createCar = async (carData: Omit<Car, '_id' | 'created_at'>, token: string): Promise<Car> => {
    const response = await fetch(`${API_BASE_URL}/cars`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(carData),
    })
    if (!response.ok) {
        throw new Error('Failed to create car')
    }
    return response.json()
}

export const updateCar = async (id: string, carData: Partial<Car>, token: string): Promise<Car> => {
    const response = await fetch(`${API_BASE_URL}/cars/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(carData),
    })
    if (!response.ok) {
        throw new Error('Failed to update car')
    }
    return response.json()
}

export const deleteCar = async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/cars/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
    if (!response.ok) {
        throw new Error('Failed to delete car')
    }
}

// Auth API
export const registerUser = async (newUser: Omit<User, '_id' | 'created_at'>): Promise<RegisterUserResponse> => {
    const response = await fetch('/api/register-user', {
        method: 'POST',
        body: JSON.stringify(newUser)
    })

    const data = await response.json()

    if (data?.error)
        throw Error(data.error)

    const user = data.data as RegisterUserResponse

    return user
}

export const loginUser = async (credentials: Pick<User, 'email' | 'password'>): Promise<LoginResponse> => {
    const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    })

    const data = await response.json()

    if (data?.error)
        throw Error(data.error)

    const user = data.data as LoginResponse

    return user
}

export const forgotPassword = async (email: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    })
    if (!response.ok) {
        throw new Error('Failed to send reset password email')
    }
}

// User API
export const updateUserProfile = async (userData: Partial<User>, token: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    })
    if (!response.ok) {
        throw new Error('Failed to update user profile')
    }
    return response.json()
}

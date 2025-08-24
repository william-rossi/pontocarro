import { API_BASE_URL } from '@/app/constants/secrets'
import { Car } from '../types/cars'
import { getErrorMessage, fetchWithAuth } from './utils'

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

export const createCar = async (carData: Omit<Car, '_id' | 'created_at'>, token: string, refreshAccessToken: () => Promise<void>): Promise<Car> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/cars`, {
        method: 'POST',
        body: JSON.stringify(carData),
    }, token, refreshAccessToken)

    if (!response.ok)
        throw new Error(await getErrorMessage(response))
    
    return response.json()
}

export const updateCar = async (id: string, carData: Partial<Car>, token: string, refreshAccessToken: () => Promise<void>): Promise<Car> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/cars/${id}`, {
        method: 'PUT',
        body: JSON.stringify(carData),
    }, token, refreshAccessToken)

    if (!response.ok)
        throw new Error(await getErrorMessage(response))

    return response.json()
}

export const deleteCar = async (id: string, token: string, refreshAccessToken: () => Promise<void>): Promise<number> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/cars/${id}`, {
        method: 'DELETE',
    }, token, refreshAccessToken)

    if (!response.ok)
        throw new Error(await getErrorMessage(response))

    return response.status
}

import { API_BASE_URL } from '@/app/constants/secrets'
import { Vehicle } from "../types/vehicles"
import { getErrorMessage, fetchWithAuth } from './utils'

interface VehicleFilter {
    make?: string
    model?: string
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

// Vehicles API
export const getVehicles = async (): Promise<Vehicle[]> => {
    const response = await fetch(`${API_BASE_URL}/vehicles`)
    if (!response.ok) {
        throw new Error('Failed to fetch vehicles')
    }
    return response.json()
}

export const searchVehicles = async (filters: VehicleFilter): Promise<Vehicle[]> => {
    const query = new URLSearchParams(filters as Record<string, string>).toString()
    const response = await fetch(`${API_BASE_URL}/vehicles/search?${query}`)
    if (!response.ok) {
        throw new Error('Failed to search vehicles')
    }
    return response.json()
}

export const getVehiclesByLocation = async (location: string): Promise<Vehicle[]> => {
    const response = await fetch(`${API_BASE_URL}/vehicles/by-location?location=${location}`)
    if (!response.ok) {
        throw new Error('Failed to fetch vehicles by location')
    }
    return response.json()
}

export const createVehicle = async (vehicleData: Omit<Vehicle, '_id' | 'created_at'>, token: string, refreshAccessToken: () => Promise<void>): Promise<Vehicle> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/vehicles`, {
        method: 'POST',
        body: JSON.stringify(vehicleData),
    }, token, refreshAccessToken)

    if (!response.ok)
        throw new Error(await getErrorMessage(response))

    return response.json()
}

export const updateVehicle = async (id: string, vehicleData: Partial<Vehicle>, token: string, refreshAccessToken: () => Promise<void>): Promise<Vehicle> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(vehicleData),
    }, token, refreshAccessToken)

    if (!response.ok)
        throw new Error(await getErrorMessage(response))

    return response.json()
}

export const deleteVehicle = async (id: string, token: string, refreshAccessToken: () => Promise<void>): Promise<number> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'DELETE',
    }, token, refreshAccessToken)

    if (!response.ok)
        throw new Error(await getErrorMessage(response))

    return response.status
}

import { API_BASE_URL } from '@/app/constants/secrets'
import { Vehicle } from "../types/vehicles"
import { getErrorMessage, fetchWithAuth } from './utils'

interface VehicleFilter {
    brand?: string
    vehicleModel?: string
    year?: number
    minPrice?: number
    maxPrice?: number
    state?: string
    city?: string
    engine?: string
    fuel?: string
    exchange?: string
    bodyType?: string
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

export const getVehiclesByLocation = async (state: string, city: string): Promise<Vehicle[]> => {
    const response = await fetch(`${API_BASE_URL}/vehicles/by-city-state?state=${state}&city=${city}`)
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

export const uploadVehicleImages = async (vehicleId: string, images: FormData, token: string, refreshAccessToken: () => Promise<void>): Promise<Vehicle> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/vehicles/${vehicleId}/images`, {
        method: 'POST',
        body: images,
    }, token, refreshAccessToken, 1, false)

    if (!response.ok)
        throw new Error(await getErrorMessage(response))

    return response.json()
}

export const deleteVehicleImage = async (vehicleId: string, imageName: string, token: string, refreshAccessToken: () => Promise<void>): Promise<void> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/vehicles/${vehicleId}/images/${imageName}`, {
        method: 'DELETE',
    }, token, refreshAccessToken);

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }
}

export const updateVehicle = async (id: string, vehicleData: Partial<Omit<Vehicle, '_id' | 'created_at'>>, token: string, refreshAccessToken: () => Promise<void>): Promise<Vehicle> => {
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

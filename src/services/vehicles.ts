import { API_BASE_URL } from '@/app/constants/secrets'
import { Image, Vehicle } from "../types/vehicles"
import { getErrorMessage, fetchWithAuth } from './utils'

export interface VehicleFilter {
    brand?: string
    vehicleModel?: string
    name?: string // New filter for vehicle name
    minYear?: number
    maxYear?: number
    minPrice?: number
    maxPrice?: number
    state?: string
    city?: string
    engine?: string
    fuel?: string
    exchange?: string
    bodyType?: string
    mileage?: number
    maxMileage?: number
    page?: number
    limit?: number
}

// Vehicles API
export const getVehicles = async (page: number = 1, limit: number = 10, sortBy: string = 'created_at:desc'): Promise<{ vehicles: Vehicle[], currentPage: number, totalPages: number, totalVehicles: number }> => {
    const response = await fetch(`${API_BASE_URL}/vehicles?page=${page}&limit=${limit}&sortBy=${sortBy}`)

    if (!response.ok)
        throw new Error('Failed to fetch vehicles')

    const data = await response.json()
    const vehiclesWithImages = await Promise.all(data.vehicles.map(async (vehicle: Vehicle) => {
        try {
            const firstImage = await getVehicleImageFirst(vehicle._id)
            return { ...vehicle, firstImageUrl: firstImage.imageUrl }
        } catch (error) {
            console.error(`Failed to fetch first image for vehicle ${vehicle._id}:`, error)
            return { ...vehicle, firstImageUrl: 'https://via.placeholder.com/150' } // Fallback image
        }
    }))

    return { ...data, vehicles: vehiclesWithImages }
}

export const searchVehicles = async (filters: VehicleFilter): Promise<{ vehicles: Vehicle[], currentPage: number, totalPages: number, totalVehicles: number }> => {
    const query = new URLSearchParams(filters as Record<string, string>).toString()
    const response = await fetch(`${API_BASE_URL}/vehicles/search?${query}`)

    if (!response.ok)
        throw new Error(await getErrorMessage(response))

    const data = await response.json()
    const vehiclesWithImages = await Promise.all(data.vehicles.map(async (vehicle: Vehicle) => {
        try {
            const firstImage = await getVehicleImageFirst(vehicle._id)
            return { ...vehicle, firstImageUrl: firstImage.imageUrl }
        } catch (error) {
            console.error(`Failed to fetch first image for vehicle ${vehicle._id}:`, error)
            return { ...vehicle, firstImageUrl: 'https://via.placeholder.com/150' } // Fallback image
        }
    }))

    return { ...data, vehicles: vehiclesWithImages }
}

export const getVehiclesByLocation = async (state: string, city: string): Promise<Vehicle[]> => {
    const response = await fetch(`${API_BASE_URL}/vehicles/by-city-state?state=${state}&city=${city}`)

    if (!response.ok)
        throw new Error(await getErrorMessage(response))

    return response.json()
}

export const getVehicleById = async (id: string): Promise<Vehicle> => {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`)

    if (!response.ok)
        throw new Error(await getErrorMessage(response))

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

export const getVehicleImages = async (vehicleId: string): Promise<Image[]> => {
    const response = await fetch(`${API_BASE_URL}/images/${vehicleId}`)

    if (!response.ok)
        throw new Error(await getErrorMessage(response))

    const images: Image[] = await response.json()
    return images.map(image => ({ ...image, imageUrl: `http://localhost:3001${image.imageUrl}` }))
}

export const getVehicleImageFirst = async (vehicleId: string): Promise<Image> => {
    const response = await fetch(`${API_BASE_URL}/images/${vehicleId}/first`)

    if (!response.ok)
        throw new Error(await getErrorMessage(response))

    const image: Image = await response.json()
    return { ...image, imageUrl: `http://localhost:3001${image.imageUrl}` }
}

export const deleteVehicleImage = async (vehicleId: string, imageName: string, token: string, refreshAccessToken: () => Promise<void>): Promise<void> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/vehicles/${vehicleId}/images/${imageName}`, {
        method: 'DELETE',
    }, token, refreshAccessToken);

    if (!response.ok)
        throw new Error(await getErrorMessage(response));
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

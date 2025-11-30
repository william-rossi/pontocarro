import { API_BASE_URL } from '@/constants/secrets'
import { Image, Vehicle, VehiclesList } from "../types/vehicles"
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
    transmission?: string
    bodyType?: string
    mileage?: number
    maxMileage?: number
    page?: number
    limit?: number
}

export type SortBy = 'createdAt' | 'price' | 'year' | 'mileage'
export type SortOrder = 'asc' | 'desc'

// Vehicles API
export const getVehicles = async (
    page: number = 1,
    limit: number = 10,
    sortBy: SortBy = 'createdAt',
    sortOrder: SortOrder = 'desc'
): Promise<VehiclesList> => {
    const response = await fetch(`${API_BASE_URL}/vehicles?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`)

    if (!response.ok)
        throw new Error('Failed to fetch vehicles')

    const data = await response.json()

    return data
}

export const searchVehicles = async (filters: VehicleFilter): Promise<VehiclesList> => {
    const validFilters: Record<string, string> = {};
    (Object.keys(filters) as (keyof VehicleFilter)[]).forEach(key => {
        const value = filters[key];
        if (value !== undefined && value !== null && value !== '') {
            validFilters[key] = String(value);
        }
    });
    const query = new URLSearchParams(validFilters).toString();
    const response = await fetch(`${API_BASE_URL}/vehicles/search?${query}`)

    if (!response.ok)
        throw new Error(await getErrorMessage(response))

    const data = await response.json()

    return data
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

export const getMyVehicles = async (
    userId: string,
    token: string,
    page: number = 1,
    limit: number = 10,
    sortBy: SortBy = 'createdAt',
    sortOrder: SortOrder = 'desc',
    refreshAccessToken: () => Promise<void> // Adiciona refreshAccessToken como parâmetro
): Promise<VehiclesList> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/vehicles/${userId}/my-vehicles?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`, {
        method: 'GET',
    }, token, refreshAccessToken); // Passa refreshAccessToken para fetchWithAuth

    if (!response.ok)
        throw new Error(await getErrorMessage(response));

    return response.json();
};

export const getVehicleImages = async (vehicleId: string): Promise<Image[]> => {
    const response = await fetch(`${API_BASE_URL}/images/${vehicleId}`)

    if (!response.ok)
        throw new Error(await getErrorMessage(response))

    const images: Image[] = await response.json()
    return images.map(image => ({ ...image, imageUrl: `${process.env.NEXT_PUBLIC_API_URL}${image.imageUrl}` }))
}

export const getVehicleImageFirst = async (vehicleId: string): Promise<Image> => {
    const response = await fetch(`${API_BASE_URL}/images/${vehicleId}/first`)

    if (!response.ok)
        throw new Error(await getErrorMessage(response))

    const image: Image = await response.json()
    return { ...image, imageUrl: `${process.env.NEXT_PUBLIC_API_URL}${image.imageUrl}` }
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

export const deleteVehicleImage = async (vehicleId: string, imageId: string, token: string, refreshAccessToken: () => Promise<void>): Promise<number> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/vehicles/${vehicleId}/images/${imageId}`, {
        method: 'DELETE',
    }, token, refreshAccessToken)

    if (!response.ok)
        throw new Error(await getErrorMessage(response))

    return response.status
}

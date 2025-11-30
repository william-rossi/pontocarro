import { API_BASE_URL } from '@/constants/secrets'
import { Image, Vehicle, VehiclesList } from "../types/vehicles"
import { getErrorMessage } from './utils'
import { SortBy, SortOrder, VehicleFilter } from '@/types/vehicle-filters'

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
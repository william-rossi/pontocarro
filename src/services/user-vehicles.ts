import { API_BASE_URL } from "@/constants/secrets"
import { Vehicle, VehiclesList } from "@/types/vehicles"
import { fetchWithAuth, getErrorMessage } from "./utils"
import { SortBy, SortOrder } from "@/types/vehicle-filters";

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
import { API_BASE_URL } from '@/app/constants/secrets'
import { User } from '../types/auth'
import { getErrorMessage, fetchWithAuth } from './utils'

// User API
export const updateUserProfile = async (userData: Partial<User>, token: string, refreshAccessToken: () => Promise<void>): Promise<User> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        body: JSON.stringify(userData),
    }, token, refreshAccessToken)

    if (!response.ok)
        throw new Error(await getErrorMessage(response))
    
    return response.json()
}

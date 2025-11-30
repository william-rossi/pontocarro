import { API_BASE_URL } from '@/constants/secrets'
import { User } from '@/types/auth'
import { fetchWithAuth, getErrorMessage } from './utils'

export const updateUserProfile = async (
    userId: string,
    userData: Partial<Omit<User, '_id' | 'created_at' | 'password' | 'refreshToken'>>,
    token: string,
    refreshAccessToken: () => Promise<void>
): Promise<User> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
    }, token, refreshAccessToken)

    if (!response.ok)
        throw new Error(await getErrorMessage(response))

    return response.json()
}

import { API_BASE_URL } from "@/constants/secrets"
import { fetchWithAuth, getErrorMessage } from "./utils"
import { UpdateUserRequest, UpdateUserResponse } from "@/types/user"

export const updateUser = async (userData: UpdateUserRequest, token: string, refreshAccessToken: () => Promise<void>): Promise<UpdateUserResponse> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/user/${userData._id}/update`, {
        method: 'PUT',
        body: JSON.stringify(userData)
    }, token, refreshAccessToken)

    if (!response.ok)
        throw new Error(await getErrorMessage(response))

    const data: UpdateUserResponse = await response.json()

    return data
}
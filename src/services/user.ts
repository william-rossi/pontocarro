import { getErrorMessage } from "./utils"
import { UpdateUserRequest, UpdateUserResponse } from "@/types/user"

export const updateUser = async (userData: UpdateUserRequest): Promise<UpdateUserResponse> => {
    const response = await fetch('/api/update-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })

    if (!response.ok)
        throw new Error(await getErrorMessage(response))

    return response.json()
}
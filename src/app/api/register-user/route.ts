import { API_BASE_URL, JWT_SECRET } from "@/constants/secrets"
import { RegisterUserRequest } from "@/types/auth"
import { handleApiResponse, validateBody, handleInternalError } from "@/utils/api-routes"

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const bodyValidation = validateBody(body)
        if (bodyValidation) {
            return bodyValidation
        }

        const user = body as RegisterUserRequest

        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
                Authorization: `Bearer ${JWT_SECRET}`,
            },
            body: JSON.stringify(user),
        })

        return handleApiResponse(response)
    } catch (error) {
        return handleInternalError(error)
    }
}

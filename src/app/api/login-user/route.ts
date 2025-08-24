import { API_BASE_URL, JWT_SECRET } from "@/app/constants/secrets"
import {  User } from "@/types/auth"
import { handleApiResponse, validateBody, handleInternalError } from "@/utils/api-routes"

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const bodyValidation = validateBody(body)
        if (bodyValidation) {
            return bodyValidation
        }

        const user = body as Pick<User, 'email' | 'password'>

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
                Authorization: `Bearer ${JWT_SECRET}`,
            },
            body: JSON.stringify(user),
        })

        return handleApiResponse(response)
    } 
    catch (error) {
        return handleInternalError(error)
    }
}

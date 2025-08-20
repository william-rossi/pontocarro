import { RegisterUserResponse, User } from "@/types"
import { NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!

export async function POST(req: Request) {
    try {
        const body = await req.json()

        if (!body) {
            return NextResponse.json(
                { error: "Body vazio" },
                { status: 400 }
            )
        }

        const user = body as Omit<User, "_id" | "created_at">

        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
                Authorization: `Bearer ${process.env.JWT_SECRET!}`,
            },
            body: JSON.stringify(user),
        })

        const text = await response.text()

        if (!response.ok) {
            // tenta parsear JSON, senão devolve o texto cru
            try {
                const json = JSON.parse(text)
                return NextResponse.json(
                    { error: json.message ?? json },
                    { status: response.status }
                )
            } catch {
                return NextResponse.json(
                    { error: text },
                    { status: response.status }
                )
            }
        }

        // resposta de sucesso
        const data = JSON.parse(text) as RegisterUserResponse
        return NextResponse.json(
            { success: true, data },
            { status: response.status }
        )
    } catch (error) {
        console.error("Erro interno:", error)
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        )
    }
}

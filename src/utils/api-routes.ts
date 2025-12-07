import { NextResponse } from "next/server"

export const handleApiResponse = async (response: Response) => {
    const text = await response.text()

    if (!response.ok) {
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

    try {
        const data = JSON.parse(text)
        return NextResponse.json(
            data,
            { status: response.status }
        )
    } catch {
        // Se a resposta for OK, mas não JSON (ex: um 204 No Content), retorna uma resposta de sucesso vazia
        return NextResponse.json(
            { success: true },
            { status: response.status }
        )
    }
}

export const validateBody = (body: any) => {
    if (!body) {
        return NextResponse.json(
            { error: "Body vazio" },
            { status: 400 }
        )
    }
    return null;
}

export const handleInternalError = (error: any) => {
    console.error("Erro interno:", error)
    return NextResponse.json(
        { error: "Erro interno do servidor" },
        { status: 500 }
    )
}

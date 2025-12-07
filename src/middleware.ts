import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function isTokenExpired(token: string): boolean {
    try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
        const currentTime = Date.now() / 1000
        return payload.exp < currentTime
    } catch (error) {
        console.error("Erro ao decodificar ou verificar token:", error)
        return true
    }
}

export async function middleware(request: NextRequest) {
    let accessToken = request.cookies.get('accessToken')
    const { pathname } = request.nextUrl

    const privatePaths = ['/meus-veiculos', '/editar', '/anunciar']

    const isPrivatePath = privatePaths.some(path => {
        if (path.includes('[guid]')) {
            const regex = new RegExp(`^${path.replace('[guid]', '[a-zA-Z0-9-]+')}(/.*)?$`) // Adiciona `(/.*)?` para rotas aninhadas
            return regex.test(pathname)
        }
        return pathname === path || pathname.startsWith(`${path}/`)
    })

    let response = NextResponse.next()
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'

    if (isPrivatePath) {
        if (!accessToken || isTokenExpired(accessToken.value)) {
            // Token ausente ou expirado; limpa os cookies e redireciona
            response = NextResponse.redirect(redirectUrl)

            // Limpa os cookies de autenticação e usuário
            response.cookies.delete('accessToken')
            response.cookies.delete('refreshToken')
            response.cookies.delete('user')

            return response
        }
    }

    return response
}

export const config = {
    matcher: [
        '/',
        '/anunciar',
        '/meus-veiculos',
        '/veiculo/:path',
        '/editar/:path'
    ],
}

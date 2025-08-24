import { parseCookies } from 'nookies';

export const getErrorMessage = async (response: Response) => {
    const data = await response.json()
    return data.message || 'Falha ao buscar carros'
}

export const fetchWithAuth = async (url: string, options: RequestInit = {}, accessToken: string | null, refreshAccessToken: () => Promise<void>, maxRetries = 1): Promise<Response> => {
    let currentAccessToken = accessToken;
    let retries = 0;

    while (retries <= maxRetries) {
        if (!currentAccessToken) {
            await refreshAccessToken();
            // Após a atualização, o AuthContext deve ter atualizado o accessToken.
            // Precisamos de uma forma de obter o accessToken atualizado do AuthContext sem importá-lo novamente aqui.
            // Por enquanto, vamos assumir que refreshAccessToken atualiza o contexto e vamos buscar o token novamente de um estado compartilhado/cookie, se necessário.
            // Uma solução melhor seria passar setAccessToken também ou fazer refreshAccessToken retornar o novo token.
            // Para simplificar, vamos apenas tentar novamente com o accessToken existente (potencialmente atualizado).
            // Isso pode exigir uma mudança no AuthContext para retornar o novo token ou expô-lo de forma diferente.
            // Por enquanto, vamos assumir que a chamada externa refreshAccessToken atualiza o token no AuthContext.
            // O token real será recuperado dos cabeçalhos posteriormente.
            currentAccessToken = ""; // Placeholder, será substituído pelo token atualizado na próxima iteração
        }

        const headers = {
            ...options.headers,
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentAccessToken}`,
        };

        const response = await fetch(url, { ...options, headers });

        if (response.status === 401 && retries < maxRetries) {
            console.warn("Token de acesso expirado. Tentando atualizar...");
            await refreshAccessToken();
            const refreshedCookies = parseCookies(); // Re-analisa os cookies para obter o novo token
            currentAccessToken = refreshedCookies.accessToken; // Atualiza o token atual
            retries++;
            continue; // Tenta novamente a requisição com o novo token
        } else {
            return response;
        }
    }
    throw new Error("Falha ao concluir a requisição após retentativas devido a problemas de autenticação.");
};

# .CARRO

## Descrição do Projeto

O .CARRO é uma plataforma de classificados de veículos desenvolvida com Next.js, oferecendo uma experiência intuitiva e segura para usuários que desejam comprar e vender carros. Nosso objetivo é facilitar a conexão entre vendedores e compradores, proporcionando ferramentas robustas para anúncios detalhados, busca eficiente e gestão de veículos.

## Tecnologias Utilizadas

-   **Next.js**: Framework React para renderização do lado do servidor e geração de sites estáticos.
-   **React**: Biblioteca JavaScript para construção de interfaces de usuário interativas.
-   **TypeScript**: Superconjunto tipado do JavaScript que melhora a segurança e manutenibilidade do código.
-   **CSS Modules**: Para modularização e escopo de estilos.
-   **MongoDB (ou similar)**: Banco de dados NoSQL para armazenamento de dados de veículos e usuários.
-   **Autenticação JWT**: Para segurança e gerenciamento de sessões de usuário.
-   **Gerenciamento de Imagens**: Funcionalidade para upload e exibição de imagens de veículos.

## Funcionalidades

-   **Anúncios Detalhados**: Crie anúncios completos com especificações do veículo, fotos e descrições.
-   **Busca e Filtros Avançados**: Encontre veículos facilmente usando filtros por marca, modelo, ano, preço e muito mais.
-   **Gestão de Veículos**: Usuários autenticados podem gerenciar seus anúncios, editar informações e marcar como vendidos.
-   **Autenticação de Usuários**: Registro, login e perfis de usuário seguros.
-   **Design Responsivo**: Experiência otimizada em dispositivos móveis e desktops.

## Como Rodar o Projeto Localmente

Siga os passos abaixo para configurar e executar o projeto em seu ambiente de desenvolvimento:

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

-   Node.js (versão 18 ou superior)
-   npm ou Yarn
-   Git

### Instalação

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/.carro.git
    cd .carro
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configuração das Variáveis de Ambiente:**

    Crie um arquivo `.env.local` na raiz do projeto e adicione as seguintes variáveis de ambiente. Certifique-se de preencher com suas próprias chaves e configurações:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3001/api # URL da sua API de backend
    JWT_SECRET=your_jwt_secret # Chave secreta para JWT
    ```

### Executando o Servidor de Desenvolvimento

Para iniciar o aplicativo em modo de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000).

### Build para Produção

Para construir o aplicativo para produção:

```bash
npm run build
# ou
yarn build
```

Para iniciar o servidor de produção:

```bash
npm run start
# ou
yarn start
```

## Contribuição

Contribuições são bem-vindas! Se você deseja contribuir, por favor, siga estas etapas:

1.  Faça um fork do repositório.
2.  Crie uma nova branch para sua feature (`git checkout -b feature/nome-da-feature`).
3.  Faça suas alterações e commit (`git commit -m 'feat: adiciona nova feature'`).
4.  Envie suas alterações para o fork (`git push origin feature/nome-da-feature`).
5.  Abra um Pull Request.

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

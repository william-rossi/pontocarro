import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css"
import "../styles/themify.css"
import 'react-toastify/dist/ReactToastify.css'; // Importa o CSS do `React-Toastify`
import Header from "@/components/header/header";
import { AuthProvider } from '@/context/AuthContext';
import Footer from "@/components/footer/footer";
import { ToastContainer } from 'react-toastify'; // Importa o componente `ToastContainer`
import AuthErrorToastHandler from '@/components/auth-error-toast-handler';
import { cookies } from "next/headers";

const geistSans = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: ".CARRO | Seu próximo veículo é aqui",
  description: "Encontre seu próximo carro no .CARRO - a plataforma ideal para comprar e vender veículos com facilidade. Explore anúncios, compare modelos e faça o melhor negócio. Anuncie seu veículo gratuitamente e alcance compradores.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const _cookies = await cookies()
  const theme = _cookies.get('theme')?.value ?? 'light'

  return (
    <html lang="pt-BR">
      <body className={`${geistSans.className} ${theme}`}>
        <AuthProvider>
          <Header />
          <main>
            {children}
          </main>
          <Footer />
          <ToastContainer />
          <AuthErrorToastHandler />
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PW Loja & Painel Administrativo',
  description: 'Painel administrativo da Loja Oficial do PW (estilo Discord) integrado ao Supabase e Firebase.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="antialiased bg-[#313338] text-[#dbdee1] min-h-screen">
        {children}
      </body>
    </html>
  );
}

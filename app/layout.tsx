import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qr Cuidja — Gerador de QR Code Inteligente & Avaliações",
  description: "Crie, personalize e gerencie QR Codes dinâmicos com rastreamento e foco em avaliações 5 estrelas no Google.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="light">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#f8fafc", color: "#0f172a", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}

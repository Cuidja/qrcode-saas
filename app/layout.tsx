import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QRCG — QR Code Generator & Dynamic Management",
  description: "Create, customize, track and manage dynamic QR codes effortlessly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#f8fafc", color: "#0f172a", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "severo-transparencia",
  description: "Visualización abierta de resultados electorales argentinos con análisis por IA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

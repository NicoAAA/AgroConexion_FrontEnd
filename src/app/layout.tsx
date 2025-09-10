// src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from 'react-hot-toast'; // Librería para notificaciones tipo "toast"

/**
 * Metadata global del proyecto
 * - title: Título por defecto en pestañas/navegador
 * - description: Descripción para SEO
 */
export const metadata: Metadata = {
  title: "AgroConexión",
  description: "Plataforma de productos campesinos - Conectamos campo y ciudad",
};

/**
 * RootLayout
 * - Define la estructura principal de la aplicación
 * - Incluye el <Navbar /> fijo en todas las páginas
 * - Define el <main> donde se renderiza el contenido dinámico
 * - Configura el sistema de notificaciones con react-hot-toast
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-white text-black m-0 p-0">
        {/* Barra de navegación presente en todas las páginas */}
        <Navbar />

        {/* Contenido dinámico (cada página) */}
        <main className="bg-white text-black w-full">
          {children}
        </main>

        {/* Toaster: sistema de notificaciones global */}
        <Toaster
          position="top-right" // esquina superior derecha
          reverseOrder={false} // notificaciones nuevas abajo
          toastOptions={{
            style: {
              borderRadius: '12px',
              background: '#f0fff4', // verde claro (coherente con la temática)
              color: '#065f46', // verde oscuro para contraste
              padding: '12px 16px',
              fontWeight: '500',
            },
          }}
        />
      </body>
    </html>
  );
}

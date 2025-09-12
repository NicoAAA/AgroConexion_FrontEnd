// src/app/layout.tsx
"use client";

import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "react-hot-toast";
import ThemeToggleButton from "@/components/ui/ThemeToggleButton";
import { AppInitializer } from "@/components/layout/AppInitializer";

export const metadata: Metadata = {
  title: "AgroConexión",
  description: "Plataforma de productos campesinos - Conectamos campo y ciudad",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeInitScript = `
    (function() {
      try {
        var t = localStorage.getItem('theme');
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (t === 'dark' || (!t && prefersDark)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {
        console.error('theme init error', e);
      }
    })();
  `;

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="m-0 p-0 bg-white text-black dark:bg-slate-900 dark:text-slate-100 transition-colors">
        {/* Inicializador de autenticación */}
        <AppInitializer>
          {/* Barra de navegación presente en todas las páginas */}
          <Navbar />

          {/* Contenido dinámico (cada página) */}
          <main className="w-full">{children}</main>
        </AppInitializer>

        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            style: {
              borderRadius: "12px",
              background: "#f0fff4",
              color: "#065f46",
              padding: "12px 16px",
              fontWeight: "500",
            },
          }}
        />

        <ThemeToggleButton />
      </body>
    </html>
  );
}

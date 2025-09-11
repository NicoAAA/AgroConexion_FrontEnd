'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

/**
 * ThemeToggleButton
 * - Alterna entre 'light' y 'dark'
 * - Persiste la preferencia en localStorage
 * - Añade/quita la clase "dark" en <html> para que sea global
 * - Componente "cliente" (usa DOM / localStorage)
 */
export default function ThemeToggleButton() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false) // evita render mismatches SSR

  useEffect(() => {
    // Se ejecuta solo en cliente
    try {
      const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

      const initial = stored ?? (prefersDark ? 'dark' : 'light')
      setTheme(initial)
      document.documentElement.classList.toggle('dark', initial === 'dark')
    } catch (e) {
      // Si algo falla, dejamos en light (no romper)
      console.error('Theme init error', e)
    } finally {
      setMounted(true)
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    try {
      document.documentElement.classList.toggle('dark', next === 'dark')
      localStorage.setItem('theme', next)
    } catch (e) {
      console.error('Error toggling theme', e)
    }
  }

  // Evita que el botón muestre tema incorrecto antes de montar
  if (!mounted) {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white/90 dark:bg-gray-800/90 border shadow-md flex items-center justify-center" />
    )
  }

  return (
    <button
      aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
      aria-pressed={theme === 'dark'}
      onClick={toggleTheme}
      title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full border bg-white text-gray-800 shadow-lg hover:scale-105 transition-transform dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-400"
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  )
}

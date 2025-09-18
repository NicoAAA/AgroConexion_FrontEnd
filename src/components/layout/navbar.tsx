// src/components/layout/navbar.tsx

'use client'

import { useAuth } from '@/features/auth/hooks/useAuth'
import Image from 'next/image'
import Link from 'next/link'
import GetAllCategories from '@/components/products/Categories'
import NavUser from '@/components/user/NavUser'
import SearchBar from '../search/SearchBar'
import { ShoppingCart } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '@/lib/axios'
import Notifications from '../notification/notification'
import { GiFarmTractor } from 'react-icons/gi'
import { ROUTES } from '@/lib/constants'

// ⬇️ Importamos nuestro contexto de idioma
import { useLanguage } from '@/context/LanguageContext'

export function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const { isAuthenticated } = useAuth()

  // ⬇️ Hook del contexto
  const { t, language, toggleLanguage } = useLanguage()

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (isAuthenticated) {
          const { data } = await api.get('/cart/my-cart/')
          setCartCount(data.length)
        } else {
          setCartCount(0)
        }
      } catch (error) {
        console.error('Error al obtener carrito:', error)
      }
    }

    fetchCart()
  }, [isAuthenticated])

  return (
    <nav
      className="top-0 left-0 right-0 z-10 h-16 flex items-center justify-between 
                 bg-green-700 dark:bg-green-900 
                 shadow px-6 md:px-10 
                 transition-colors duration-500"
    >
      {/* Sección izquierda: Logo y categorías */}
      <div className="flex items-center gap-4 md:gap-6">
        <Link
          href="/"
          className="hidden sm:flex items-center gap-2 hover:opacity-90 transition"
        >
          <Image
            className="rounded-full border border-white dark:border-gray-200 shadow-md"
            width={42}
            height={42}
            src="/AgroConexion.svg"
            alt="Logo"
          />
          {/* 🔤 Nombre traducido */}
          <span className="text-white dark:text-gray-100 font-bold text-lg hidden md:inline">
            {t("AgroConexión")}
          </span>
        </Link>

        <div className="hidden sm:flex">
          <GetAllCategories />
        </div>
      </div>

      {/* Sección central: Barra de búsqueda */}
      <div className="flex-grow flex justify-center">
        <SearchBar />
      </div>

      {/* Sección derecha: Usuario + Carrito */}
      <div className="flex items-center gap-4">
        {/* Botón Carrito con contador */}
        <Link href="/cart" className="relative">
          <ShoppingCart
            size={28}
            className="text-white dark:text-gray-100 hover:text-gray-200 dark:hover:text-gray-300 transition"
          />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
              {cartCount}
            </span>
          )}
        </Link>
        <Link href={ROUTES.FAVORITECATEGORIES} className='text-white'>
          <GiFarmTractor className="text-4xl" />
        </Link>
        <Notifications />
        <NavUser />

        {/* 🔤 Botón para cambiar idioma */}
        <button
          onClick={toggleLanguage}
          className="text-xs text-white border px-2 py-1 rounded hover:bg-green-800"
        >
          {language === "es" ? "EN" : "ES"}
        </button>
      </div>
    </nav>
  )
}

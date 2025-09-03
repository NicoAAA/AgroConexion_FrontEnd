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

export function Navbar() {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await api.get('/cart/my-cart/')
        setCartCount(data.length)
      } catch (error) {
        console.error('Error al obtener carrito:', error)
      }
    }

    fetchCart()
  }, [])

  return (
    <nav className="top-0 left-0 right-0 z-10 h-16 flex items-center justify-between bg-green-700 shadow px-6 md:px-10">
      {/* Sección izquierda: Logo y categorías */}
      <div className="flex items-center gap-4 md:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-90 transition"
        >
          <Image
            className="rounded-full border border-white shadow-md"
            width={42}
            height={42}
            src="/AgroConexion.svg"
            alt="Logo"
          />
          <span className="text-white font-bold text-lg hidden sm:inline">
            AgroConexión
          </span>
        </Link>

        <div className="hidden md:flex">
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
            className="text-white hover:text-gray-200 transition"
          />
        </Link>
        <Notifications/>
        {/* Menú de usuario */}
        <NavUser />
      </div>
    </nav>
  )
}

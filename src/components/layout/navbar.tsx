'use client'

import { useAuth } from '@/features/auth/hooks/useAuth'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import GetAllCategories from '@/components/products/Categories'
import NavUser from '@/components/user/NavUser'
import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="top-0 left-0 right-0 z-10 h-16 flex items-center justify-between bg-green-700 shadow px-6 md:px-10">
      {/* Sección izquierda: Logo y categorías */}
      <div className="flex items-center gap-4 md:gap-6">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
          <Image
            className="rounded-full border border-white shadow-md"
            width={42}
            height={42}
            src="/AgroConexion.svg"
            alt="Logo"
          />
          <span className="text-white font-bold text-lg hidden sm:inline">AgroConexión</span>
        </Link>

        <div className="hidden md:flex">
          <GetAllCategories />
        </div>
      </div>

      {/* Sección derecha: Usuario */}
      <div className="flex items-center gap-4">
        <NavUser />
      </div>
    </nav>
  )
}

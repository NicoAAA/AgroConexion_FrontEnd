'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { LogOut, LogIn, UserPlus, UserCircle, ShoppingBag, FileText, BarChart } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ROUTES } from '@/lib/constants'
import Link from 'next/link'

const NavUser = () => {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout, initializeAuth } = useAuth()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initializeAuth()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handleLogout = () => {
    logout()
    toast.success('👋 Sesión cerrada correctamente')
    router.push('/login')
  }

  const handleLogin = () => router.push('/login')
  const handleRegister = () => router.push('/register')

  const getFullImageUrl = (path: string) =>
    path.startsWith('http') ? path : `http://127.0.0.1:8000${path}`

  if (isLoading) return null

  return (
    <div className="relative flex items-center gap-4" ref={dropdownRef}>
      {isAuthenticated && user ? (
        <>
          <button
            onClick={() => setOpen(!open)}
            className="focus:outline-none transition transform hover:scale-105"
            aria-label="Menú de usuario"
          >
            {user.userImage ? (
              <Image
                src={getFullImageUrl(user.userImage)}
                alt={user.userName}
                width={50}
                height={50}
                className="rounded-full border-2 border-green-500 shadow-md object-cover transition duration-300"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow-md">
                {user.userName?.charAt(0).toUpperCase() ?? 'U'}
              </div>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-14 w-56 bg-white rounded-xl shadow-xl z-50 border border-gray-200 animate-fade-in-up">
              <div className="p-4 border-b text-sm text-gray-800 font-semibold">
                👤 {user.userName}
              </div>
              <ul className="text-sm text-gray-700 py-2">
                <li className="px-4 py-2 hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
                  <BarChart className="w-4 h-4 text-green-600" />
                  <Link href={ROUTES.ESTADISTICAS}>
                    Estadísticas
                  </Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
                  <ShoppingBag className="w-4 h-4 text-green-600" />
                  Mis Productos
                </li>
                <li className="px-4 py-2 hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
                  <FileText className="w-4 h-4 text-green-600" />
                  Facturas
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 mt-2 hover:bg-red-50 flex items-center gap-2 text-red-600 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          )}
        </>
      ) : (
        <>
          <button
            onClick={handleLogin}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition"
          >
            <LogIn className="w-4 h-4" />
            Iniciar sesión
          </button>

          <button
            onClick={handleRegister}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 border border-green-600 hover:bg-green-50 rounded-lg shadow-sm transition"
          >
            <UserPlus className="w-4 h-4" />
            Registrarse
          </button>
        </>
      )}
    </div>
  )
}

export default NavUser

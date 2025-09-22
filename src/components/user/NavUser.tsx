'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import {LogOut, LogIn, UserPlus, ShoppingBag, FileText, BarChart, Apple} from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ROUTES } from '@/lib/constants'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext';



const NavUser = () => {
  const { t } = useLanguage();
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

  const handleLogout = async () => {
    await logout()
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
            {user.profile_image ? (
              <Image
                src={getFullImageUrl(user.profile_image)}
                alt={user.username}
                width={50}
                height={50}
                className="rounded-full border-2 border-green-600 shadow-md object-cover transition duration-300"
              />
            ) : (
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow-md">
                {user.userName?.charAt(0).toUpperCase() ?? 'U'}
              </div>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-14 w-60 bg-white rounded-xl shadow-lg z-50 border border-gray-200 overflow-hidden">
              {/* Cabecera */}
              <div className="p-4 bg-green-50 border-b text-sm text-gray-800 font-semibold flex items-center gap-2">
                <Link href={ROUTES.PERFIL}>🌱 {user.username}</Link>
              </div>

              {/* Opciones */}
              <ul className="text-sm text-gray-700">
                <li className="px-4 py-3 hover:bg-green-50 flex items-center gap-2 cursor-pointer transition">
                  <ShoppingBag className="w-4 h-4 text-green-600" />
                  <Link href={ROUTES.FAVORITOS}>{t("misFavoritos")}</Link>
                </li>
                <li className="px-4 py-3 hover:bg-green-50 flex items-center gap-2 cursor-pointer transition">
                  <FileText className="w-4 h-4 text-green-600" />
                  <Link href={ROUTES.FACTURACION}>{t("misFacturas")}</Link>
                </li>
                {user.is_seller && (
                  <>
                    <li className="px-4 py-3 hover:bg-green-50 flex items-center gap-2 cursor-pointer transition">
                      <Apple className="w-4 h-4 text-green-600" />
                      <Link href={ROUTES.NEWPRODUCT}>{t("nuevoProducto")}</Link>
                    </li>
                    <li className="px-4 py-3 hover:bg-green-50 flex items-center gap-2 cursor-pointer transition">
                      <Apple className="w-4 h-4 text-green-600" />
                      <Link href={ROUTES.MYPRODUCTS}>{t("misProductos")}</Link>
                    </li>
                    <li className="px-4 py-3 hover:bg-green-50 flex items-center gap-2 cursor-pointer transition">
                      <BarChart className="w-4 h-4 text-green-600" />
                      <Link href={ROUTES.ESTADISTICAS}>{t("registrarse")}</Link>
                    </li>
                    {/* <li className="px-4 py-3 hover:bg-green-50 flex items-center gap-2 cursor-pointer transition">
                      <FileText className="w-4 h-4 text-green-600" />
                      <Link href={ROUTES.FACTURACION}>Ventas</Link>
                    </li> */}
                  </>
                )}
                <li className="border-t">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-red-50 flex items-center gap-2 text-red-600 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    {t("cerrarSesion")}
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
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md transition"
          >
            <LogIn className="w-4 h-4" />
            {t("iniciarSesion")}
          </button>

          <button
            onClick={handleRegister}
            className="bg-white flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 border border-green-600 hover:bg-green-100 rounded-lg shadow-md transition"
          >
            <UserPlus className="w-4 h-4" />
            {t("registrarse")}
          </button>
        </>
      )}
    </div>
  )
}

export default NavUser

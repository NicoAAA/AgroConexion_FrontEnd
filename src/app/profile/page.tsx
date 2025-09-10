// src/app/profile/page.tsx

'use client'

// Importamos dependencias necesarias
import Image from 'next/image'
import { Mail, Phone, MapPin, Shield, User, Lock } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'

/**
 * Página de perfil del usuario
 * - Obtiene la información del usuario autenticado desde el hook `useAuth`.
 * - Muestra datos generales como nombre, correo, teléfono, dirección, rol, etc.
 * - Si el usuario pertenece a un grupo (agrupación campesina), muestra datos adicionales.
 */
const ProfilePage = () => {
  // Hook personalizado que trae la información del usuario autenticado
  const auth = useAuth()

  // Verificamos si hay sesión activa
  const isAuthenticated = (auth as any).isAuthenticated
  const rawUser = (auth as any).user as any

  /**
   * Función auxiliar para obtener un campo del usuario
   * - Intenta buscar diferentes posibles nombres de propiedad
   *   (ya que el backend podría devolver variaciones como userName, username, etc.)
   */
  const getField = (obj: any, ...keys: string[]) => {
    for (const k of keys) {
      if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k]
    }
    return undefined
  }

  // Campos principales del perfil (se buscan en diferentes posibles claves)
  const displayName = getField(rawUser, 'userName', 'username', 'name') || 'Usuario'
  const email = getField(rawUser, 'email')
  const phone = getField(rawUser, 'phoneNumber', 'phone_number', 'phone')
  const address = getField(rawUser, 'address')
  const profileImagePath = getField(rawUser, 'profileImage', 'profile_image', 'userImage', 'user_image')
  const isSeller = !!getField(rawUser, 'isSeller', 'is_seller')
  const userType = getField(rawUser, 'userType', 'user_type') || (isSeller ? 'group' : 'common')
  const twoFactor = !!getField(rawUser, 'twoFactorEnabled', 'two_factor_enabled')
  const groupProfile = getField(rawUser, 'groupProfile', 'group_profile')

  /**
   * Función para construir la URL completa de la imagen de perfil
   * - Si viene una ruta relativa desde el backend, se concatena con la base URL.
   */
  const getFullImageUrl = (path?: string) => {
    if (!path) return undefined
    return path.startsWith('http') ? path : `http://127.0.0.1:8000${path}`
  }

  // Si no hay sesión activa o no existe el usuario
  if (!isAuthenticated || !rawUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <User className="w-12 h-12 text-gray-400 mb-2" />
        <p>No hay información disponible del usuario.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-5xl px-6 py-12">
      {/* ----------------- ENCABEZADO DEL PERFIL ----------------- */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-green-50 to-green-100 shadow-xl rounded-3xl p-8 border border-green-200">
        {/* Imagen o inicial */}
        <div className="flex-shrink-0">
          {profileImagePath ? (
            <Image
              src={getFullImageUrl(profileImagePath) as string}
              alt={displayName}
              width={130}
              height={130}
              className="rounded-full border-4 border-green-600 object-cover shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center bg-gradient-to-br from-green-600 to-green-400 text-white text-4xl font-bold rounded-full shadow-lg">
              {displayName?.charAt(0).toUpperCase() ?? 'U'}
            </div>
          )}
        </div>

        {/* Nombre y tipo de usuario */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-gray-900">{displayName}</h1>
          <p className="text-lg text-gray-600 mt-2">
            {userType === 'group'
              ? '👥 Agrupación campesina'
              : userType === 'admin'
              ? '🛡️ Administrador'
              : '👤 Usuario común'}
          </p>
        </div>
      </div>

      {/* ----------------- INFORMACIÓN PRINCIPAL ----------------- */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {[
          { icon: Mail, label: 'Correo', value: email || 'No registrado' },
          { icon: Phone, label: 'Teléfono', value: phone || 'No registrado' },
          { icon: MapPin, label: 'Dirección', value: address || 'No registrada' },
          { icon: Shield, label: 'Rol', value: isSeller ? 'Vendedor' : 'Cliente' },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white shadow-md hover:shadow-lg transition rounded-2xl p-5 flex items-center gap-5 border border-gray-100"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 shadow-sm">
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-gray-800 font-semibold">{item.value}</p>
            </div>
          </div>
        ))}

        {/* Estado de autenticación en dos pasos (2FA) */}
        <div className="bg-white shadow-md hover:shadow-lg transition rounded-2xl p-5 flex items-center gap-5 border border-gray-100 md:col-span-2">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Autenticación en dos pasos</p>
            <p className="text-gray-800 font-semibold">
              {twoFactor ? '✅ Activada' : '❌ Desactivada'}
            </p>
          </div>
        </div>
      </div>

      {/* ----------------- INFORMACIÓN EXTRA PARA AGRUPACIONES ----------------- */}
      {userType === 'group' && groupProfile && (
        <div className="mt-10 bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-green-700 mb-4">📑 Información de la Agrupación</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <p><strong>NIT:</strong> {groupProfile.nit || 'No registrado'}</p>
            <p><strong>Tipo de organización:</strong> {groupProfile.organization_type || groupProfile.organizationType}</p>
            <p><strong>Representante:</strong> {groupProfile.legal_representative || groupProfile.legalRepresentative}</p>
            <p><strong>Cédula:</strong> {groupProfile.representative_cedula || groupProfile.representativeCedula}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage

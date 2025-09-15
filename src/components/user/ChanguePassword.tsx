// componente para enviar la solicitud de cambio de contraseña
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ROUTES } from '@/lib/constants'
import { Lock } from 'lucide-react'

const ChangePassword = () => {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  const handleClick = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const token = localStorage.getItem('access_token')
      if (!token) throw new Error('No se encontró el token')

      const response = await axios.post(
        'http://127.0.0.1:8000/api/users/change-password/request/',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.log(response.data)

      router.push(
        `${ROUTES.CHANGUEPASSWORD}?email=${encodeURIComponent(
          user?.email ?? ''
        )}`
      )
    } catch (error: any) {
      console.error(error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return <p>Cargando autenticación...</p>
  }

  if (!isAuthenticated) {
    return <p>No tienes acceso a esta acción. Por favor inicia sesión.</p>
  }

  return (
    <div className="">
      <button
        onClick={handleClick}
        disabled={loading}
        className="flex items-center space-x-3 p-3 rounded-xl text-slate-300 
            hover:bg-slate-700 hover:text-white transition-all duration-200
            hover:translate-x-1 group"
       >
        <Lock className="w-5 h-5 mr-3" />
        {loading ? 'Enviando...' : 'Cambiar contraseña'}
      </button>

      {message && <p className="mt-2">{message}</p>}
    </div>
  )
}

export default ChangePassword

// src/app/favorites/page.tsx
'use client'

/**
 * Página de favoritos de AgroConexión.
 *
 * Flujo:
 * 1. Verifica si el usuario está autenticado mediante `useAuth`.
 * 2. Si lo está, obtiene desde el backend (API) los productos favoritos.
 * 3. Maneja estados de carga, error y casos especiales (sin sesión o sin favoritos).
 * 4. Renderiza los productos favoritos usando `ProductCard`.
 */

import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import ProductCard from '@/components/products/ProductCard'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/features/auth/hooks/useAuth'

/** Tipado de la respuesta del backend para favoritos */
interface FavoriteResponse {
  product_detail: {
    id: number
    name: string
    description: string
    price: string | number | null
    images: { image: string }[]
  }
  added_at: string
}

const FavoritesPage = () => {
  /** Hook personalizado de autenticación */
  const { isAuthenticated, isLoading } = useAuth()

  /** Estado local con la lista de favoritos */
  const [favorites, setFavorites] = useState<FavoriteResponse[]>([])

  /** Estado de carga mientras se obtienen favoritos */
  const [loadingFavorites, setLoadingFavorites] = useState(true)

  /** Estado para almacenar errores */
  const [error, setError] = useState('')

  /**
   * Efecto que obtiene la lista de favoritos al cargar la página
   * Solo se ejecuta si el usuario está autenticado
   */
  useEffect(() => {
    if (!isAuthenticated) {
      setLoadingFavorites(false)
      return
    }

    const fetchFavorites = async () => {
      try {
        // Llamada al backend con credenciales (cookies o JWT)
        const response = await api.get('/cart/favorites/', {
          withCredentials: true,
        })

        // Guardamos la respuesta (lista de favoritos)
        setFavorites(response.data || [])
      } catch (err: any) {
        // Manejo de error si el usuario no está autenticado
        if (err.response?.status === 401) {
          toast.error('🔒 Debes iniciar sesión para ver tus favoritos')
        } else {
          // Otros errores
          setError(
            err.response?.data?.detail || 'Ocurrió un error al obtener favoritos'
          )
        }
      } finally {
        setLoadingFavorites(false)
      }
    }

    fetchFavorites()
  }, [isAuthenticated])

  /** Si la autenticación aún se está validando, no mostramos nada */
  if (isLoading) return null

  return (
    <div className="px-6 py-10">
      {/* Título de la página */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
          ❤️ Mis favoritos
        </h1>
        <p className="text-gray-500 mt-2">
          Aquí puedes ver todos los productos que has marcado como favoritos
        </p>
      </div>

      {/* Error en caso de que la API falle */}
      {error && (
        <div className="text-center bg-red-100 text-red-600 py-3 rounded-lg mb-6 shadow">
          {error}
        </div>
      )}

      {/* Estado de carga (spinner animado) */}
      {loadingFavorites ? (
        <div className="flex justify-center items-center h-60">
          <Loader2 className="w-10 h-10 animate-spin text-green-600" />
        </div>
      ) : !isAuthenticated ? (
        // Caso: usuario no autenticado
        <div className="text-center text-gray-500 mt-10">
          <p className="text-lg">🔒 Debes iniciar sesión para ver tus favoritos.</p>
        </div>
      ) : favorites.length === 0 ? (
        // Caso: no tiene productos favoritos
        <div className="text-center text-gray-500 mt-10">
          <p className="text-lg">🚫 No tienes productos favoritos aún.</p>
        </div>
      ) : (
        // Caso: renderizar productos favoritos
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {favorites.map((fav) => {
            const product = fav.product_detail
            const priceNumber = Number(product.price) || 0

            return (
              <div
                key={product.id}
                className="transform transition duration-300 hover:scale-105 hover:shadow-xl"
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={priceNumber}
                  imageUrl={product.images[0]?.image || '/default-placeholder.png'}
                  defaultFavorite={true} // Corazón rojo automático
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default FavoritesPage

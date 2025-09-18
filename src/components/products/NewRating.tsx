
'use client'

import { useState } from 'react'
import axios from 'axios'
import { Star } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import api from '@/lib/axios'
interface Props {
  productId: number
}

export default function NewRating({ productId }: Props) {
  const { accessToken } = useAuth() as any
  const [hovered, setHovered] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const submitRating = async (rating: number) => {

    setSubmitting(true)
    setMessage(null)
    try {
      await api.post('/products/new-rating/',
        { product: productId, 
            rating: rating },
      )

      // Notificamos al resto de la página para que recargue las estadísticas
      window.dispatchEvent(
        new CustomEvent('ratingUpdated', { detail: { productId } })
      )

      setMessage('Gracias por tu calificación')
      setTimeout(() => setMessage(null), 3000) 
    } catch (err) {
      setMessage('Error al enviar la calificación. Intenta de nuevo.')
      setTimeout(() => setMessage(null), 3000) 
    } finally {
      setSubmitting(false)
      setHovered(null)
    }
  }

  return (
    <div>
      <p className="text-sm font-medium mb-2">¿Cómo calificarías este producto?</p>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => submitRating(s)}
            disabled={submitting}
            aria-label={`Calificar ${s} estrellas`}
            className="p-1"
            >
            <Star
              className={`w-6 h-6 cursor-pointer ${
                (hovered ?? 0) >= s ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>

      {message && (
        <p className="mt-2 text-sm text-gray-700">{message}</p>
      )}
    </div>
  )
}
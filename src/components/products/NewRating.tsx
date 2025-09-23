
'use client'

import { useState } from 'react'
import axios from 'axios'
import { Star } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import api from '@/lib/axios'
import { useLanguage } from '@/context/LanguageContext'

interface Props {
  productId: number
}

export default function NewRating({ productId }: Props) {
  const { accessToken } = useAuth() as any
  const [hovered, setHovered] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const { t } = useLanguage()
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

      setMessage(t("graciasCalificacion"))
      setTimeout(() => setMessage(null), 3000) 
    } catch (err) {
      setMessage(t("errorEnvioCalificacion"))
      setTimeout(() => setMessage(null), 3000) 
    } finally {
      setSubmitting(false)
      setHovered(null)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {t("comoCalificarias")}
        </p>
      </div>
      
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => submitRating(s)}
            disabled={submitting}
            aria-label={`Calificar ${s} estrellas`}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Star
              className={`w-7 h-7 transition-all duration-200 group-hover:scale-110 ${
                (hovered ?? 0) >= s 
                  ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm' 
                  : 'text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-500'
              } ${submitting ? 'animate-pulse' : ''}`}
            />
          </button>
        ))}
        
        {submitting && (
          <div className="ml-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            <span>{t("enviando")}</span>
          </div>
        )}
      </div>

      {message && (
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-green-400 dark:border-green-500">
          <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
            {message}
          </p>
        </div>
      )}
    </div>
  )
}
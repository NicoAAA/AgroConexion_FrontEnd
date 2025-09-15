'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

import {Props, RatingStatsResp} from '@/types/ratings.types'

export default function RatingStats({ productId }: Props) {
  const [stats, setStats] = useState<RatingStatsResp | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const res = await axios.get(
        `http://127.0.0.1:8000/api/products/stats_rating/${productId}/`
      )
      setStats(res.data)
    } catch (err) {
      console.error('Error cargando estadísticas:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()

    const handler = (e: Event) => {
      const custom = e as CustomEvent
      if (!custom?.detail || custom.detail.productId !== productId) return
      fetchStats()
    }

    window.addEventListener('ratingUpdated', handler as EventListener)
    return () =>
      window.removeEventListener('ratingUpdated', handler as EventListener)
  }, [productId])

  if (loading) return <p className="text-sm text-gray-500">Cargando calificaciones...</p>
  if (!stats) return null

  const total = stats.total_ratings
  const average =
    total > 0
      ? stats.stars.reduce((acc, s) => acc + s.star * s.count, 0) / total
      : 0

  return (
    <div className="p-4 bg-white rounded-xl shadow-md w-full">
      <div className="flex items-center gap-4">
        <div>
          <div className="text-3xl font-semibold">{average.toFixed(1)}</div>
          <div className="text-sm text-gray-500">({total} votos)</div>
        </div>

        {/* mini visual de estrellas */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const starNumber = i + 1
            return (
              <svg key={i} className="w-5 h-5" viewBox="0 0 24 24" fill={average >= starNumber ? 'currentColor' : 'none'} stroke="currentColor">
                <path d="M12 .587l3.668 7.431L23.5 9.75l-5.75 5.602L19.335 24 12 19.897 4.665 24 6.25 15.352 0.5 9.75l7.832-1.732L12 .587z" />
              </svg>
            )
          })}
        </div>
      </div>

      {/* Distribución */}
      <div className="mt-4 space-y-2">
        {stats.stars
          .slice()
          .reverse()
          .map((s) => (
            <div key={s.star} className="flex items-center gap-3">
              <span className="w-10 text-sm">{s.star} ⭐</span>
              <div className="flex-1 h-2 bg-gray-200 rounded overflow-hidden">
                <div
                  className="h-2 bg-yellow-400"
                  style={{ width: `${s.percentage}%` }}
                />
              </div>
              <span className="w-10 text-sm text-gray-500 text-right">{s.count}</span>
            </div>
          ))}
      </div>
    </div>
  )
}

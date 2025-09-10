// src/app/finansas/page.tsx
'use client'

/**
 * Página de Finanzas del usuario.
 *
 * Flujo:
 * 1. Monta la interfaz asegurando que el renderizado sea compatible con SSR (Next.js).
 * 2. Obtiene estadísticas de compras y ventas desde la API `/invoices/stats/`.
 * 3. Muestra métricas clave como: total gastado, total ganado,
 *    producto más vendido y producto menos vendido.
 * 4. Presenta tarjetas de estadísticas (`StatCard`) y secciones de balance general y destacados.
 */

import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import {
  Loader2,
  TrendingUp,
  ShoppingCart,
  Wallet,
  DollarSign,
  Package,
  Star,
} from 'lucide-react'

// Tipado de un producto con cantidad
interface Product {
  name: string
  quantity: number
}

// Tipado de la respuesta del backend con estadísticas
interface StatsResponse {
  total_spent: number
  total_earned: number
  most_sold_product: Product
  least_sold_product: Product
}

export default function UserStats() {
  /** Estado con las estadísticas traídas desde la API */
  const [stats, setStats] = useState<StatsResponse | null>(null)

  /** Estado de carga */
  const [loading, setLoading] = useState(true)

  /** Estado para evitar problemas de renderizado SSR */
  const [hasMounted, setHasMounted] = useState(false)

  // Marca que el componente ya se montó (para evitar inconsistencias con Next.js)
  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Obtiene las estadísticas una vez montado el componente
  useEffect(() => {
    if (!hasMounted) return

    const fetchStats = async () => {
      try {
        const res = await api.get('/invoices/stats/')
        setStats(res.data)
      } catch (error) {
        console.error('Error al cargar las estadísticas', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [hasMounted])

  /**
   * Formatea un número como moneda en pesos colombianos
   */
  const formatCurrency = (amount: number) => {
    if (!hasMounted) return amount.toString()
    return amount.toLocaleString('es-CO')
  }

  /** Caso: aún no se ha montado el componente */
  if (!hasMounted) {
    return (
      <div className="min-h-screen flex">
        <div className="flex flex-col flex-1">
          <main className="mt-16 ml-64 p-6 bg-gradient-to-br from-slate-50 to-slate-100 flex-1">
            <div className="flex items-center justify-center h-40">
              <div className="animate-pulse text-gray-400">Cargando...</div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  /** Caso: cargando estadísticas */
  if (loading) {
    return (
      <div className="min-h-screen flex">
        <div className="flex flex-col flex-1">
          <main className="mt-16 ml-64 p-6 bg-gradient-to-br from-slate-50 to-slate-100 flex-1">
            <div className="max-w-7xl mx-auto py-10">
              <div className="flex items-center justify-center h-40">
                <div className="flex items-center space-x-3">
                  <Loader2 className="animate-spin w-8 h-8 text-indigo-600" />
                  <span className="text-lg font-medium text-gray-700">
                    Cargando estadísticas...
                  </span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  /** Caso: error al cargar estadísticas */
  if (!stats) {
    return (
      <div className="min-h-screen flex">
        <div className="flex flex-col flex-1">
          <main className="mt-16 ml-64 p-6 bg-gradient-to-br from-slate-50 to-slate-100 flex-1">
            <div className="max-w-7xl mx-auto py-10">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-700 font-medium">
                  No se pudieron cargar las estadísticas.
                </p>
                <p className="text-red-600 text-sm mt-2">
                  Por favor, inténtalo de nuevo más tarde.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  /** Render principal */
  return (
    <div className="min-h-screen flex">
      <div className="flex flex-col flex-1">
        <main className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 flex-1">
          <div className="max-w-6xl mx-auto py-10 flex flex-col items-center">
            {/* Grid de estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
              <StatCard
                icon={<ShoppingCart className="w-8 h-8" />}
                title="Total Gastado"
                value={`$${formatCurrency(stats.total_spent)}`}
                description="En todas tus compras"
                color="blue"
                trend="+2.5%"
              />
              <StatCard
                icon={<Wallet className="w-8 h-8" />}
                title="Total Ganado"
                value={`$${formatCurrency(stats.total_earned)}`}
                description="De tus ventas"
                color="green"
                trend="+8.2%"
              />
              <StatCard
                icon={<TrendingUp className="w-8 h-8" />}
                title="Producto Más Vendido"
                value={stats.most_sold_product.name}
                description={`${stats.most_sold_product.quantity} unidades`}
                color="emerald"
                trend="Popular"
              />
              <StatCard
                icon={<Package className="w-8 h-8" />}
                title="Producto Menos Vendido"
                value={stats.least_sold_product.name}
                description={`${stats.least_sold_product.quantity} unidades`}
                color="orange"
                trend="Mejorar"
              />
            </div>

            {/* Secciones adicionales */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
              {/* Balance General */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full hover:shadow-md hover:scale-[1.02] transition-transform">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Balance General
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ingresos</span>
                    <span className="font-medium text-green-600">
                      +${formatCurrency(stats.total_earned)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Gastos</span>
                    <span className="font-medium text-red-600">
                      -${formatCurrency(stats.total_spent)}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">
                        Balance Neto
                      </span>
                      <span
                        className={`font-bold ${
                          stats.total_earned - stats.total_spent >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        $
                        {formatCurrency(
                          stats.total_earned - stats.total_spent
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Productos destacados */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full hover:shadow-md hover:scale-[1.02] transition-transform">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Star className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Productos Destacados
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Más Vendido</p>
                      <p className="text-sm text-gray-600">
                        {stats.most_sold_product.name}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {stats.most_sold_product.quantity} vendidos
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Menos Vendido</p>
                      <p className="text-sm text-gray-600">
                        {stats.least_sold_product.name}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                      {stats.least_sold_product.quantity} vendidos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

/**
 * Componente de tarjeta para mostrar una estadística con icono, título, valor y descripción.
 */
function StatCard({
  icon,
  title,
  value,
  description,
  color,
  trend,
}: {
  icon: React.ReactNode
  title: string
  value: string
  description: string
  color: 'blue' | 'green' | 'emerald' | 'orange'
  trend: string
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    orange: 'bg-orange-100 text-orange-600',
  }

  const trendClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    orange: 'text-orange-600 bg-orange-50',
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 rounded-xl ${colorClasses[color]} group-hover:scale-110 transition-transform duration-200`}
        >
          {icon}
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${trendClasses[color]}`}
        >
          {trend}
        </span>
      </div>
      <div className="space-y-1">
        <h4 className="text-gray-600 text-sm font-medium">{title}</h4>
        <p
          className="text-2xl font-bold text-gray-900 truncate"
          title={value}
        >
          {value}
        </p>
        <p className="text-gray-500 text-xs">{description}</p>
      </div>
    </div>
  )
}

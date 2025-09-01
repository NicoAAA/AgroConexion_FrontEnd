'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import { Product } from '@/types/product.types'
import ProductCard from '@/components/products/ProductCard'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('query') || ''
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query) return
    const fetchResults = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/products/?search=${encodeURIComponent(query)}`
        )
        setResults(response.data)
      } catch (err) {
        console.error('❌ Error buscando productos:', err)
        setError('No pudimos cargar los resultados.')
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [query])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        Resultados para: <span className="text-gray-600">{query}</span>
      </h1>

      {loading && <p className="text-gray-500">Buscando productos...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {results.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                description={p.description}
                price={p.price}
                imageUrl={p.images?.[0]?.image || ''}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No se encontraron productos.</p>
        )
      )}
    </div>
  )
}

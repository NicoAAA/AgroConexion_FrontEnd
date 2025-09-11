'use client'

import Link from 'next/link'
import ProductCard from '@/components/products/ProductCard'
import { Product } from '@/types/product.types'

interface Props {
  title: string
  productos: Product[]
  bg?: string
}

export const ProductSection = ({
  title,
  productos,
  bg = 'bg-white dark:bg-gray-900',
}: Props) => (
  <section className={`${bg} py-8 px-4`}>
    <div className="max-w-7xl mx-auto">
      {/* Título y enlace */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-green-800 dark:text-green-300 tracking-tight">
          {title}
        </h2>
        <Link
          href="/products"
          className="text-sm font-medium text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-200 hover:underline transition"
        >
          Ver todos →
        </Link>
      </div>

      {/* Grid responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            imageUrl={product.images?.[0]?.image}
          />
        ))}
      </div>
    </div>
  </section>
)

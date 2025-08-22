'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import axios from 'axios'
import { Product } from '@/types/product.types'
import { Carousel } from '@/components/home/Carousel'
import { ProductSection } from '@/components/home/ProductSection'
import { HomeIntro } from '@/components/home/HomeIntro'
import { TickerText } from '@/components/ui/TickerText'
import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import TopProductsBuy from '@/components/home/ProductsTopSeller'
export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [errores, setErrores] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/products/list-products/')
        setProducts(res.data)
      } catch (err) {
        const msg = axios.isAxiosError(err)
          ? err.response?.data?.detail || 'Error al obtener productos.'
          : 'Error inesperado.'
        setErrores(msg)
      }
    }

    fetchProducts()
  }, [])

  const ofertas = products.slice(0, 3)
  const masVendidos = products.slice(3, 6)
  const recomendados = products.slice(6, 9)

  const selectedSlides = products
    .filter((p) => p.images?.[0]?.image)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      src: `http://127.0.0.1:8000${p.images[0].image}`,
      alt: p.name,
    }))

  const mensajes = [
    '🛒 ¡Compra directo del campesino sin intermediarios!',
    '🌽 Productos frescos cosechados con amor colombiano',
    '🚚 Entregas rápidas y seguras en toda Colombia',
    '💰 ¡Aprovecha ofertas semanales y descuentos exclusivos!',
    '🌱 Apoya el agro nacional con cada compra que haces',
    '🍅 Frutas y verduras frescas recién cosechadas',
    '📦 Envíos gratis por compras superiores a $50.000',
    '🥚 ¡Huevos, lácteos y más del campo a tu mesa!',
    '🧑‍🌾 Cada producto tiene una historia campesina detrás',
  ]

  return (
    <div className="flex flex-col gap-8 pb-8 bg-gradient-to-br from-green-100 via-white to-green-50">
      <HomeIntro />

      <div className="px-4">
        <Carousel slides={selectedSlides} />
      </div>

      <ProductSection title="🛒 Ofertas" productos={ofertas} />
      <TickerText items={mensajes} speed={70} />
      <TopProductsBuy/>
      <TickerText items={mensajes} speed={70} />
      <ProductSection title="🌱 Recomendados" productos={recomendados} />

      {errores && (
        <p className="text-center text-red-500 font-medium mt-4">{errores}</p>
      )}

      <CategoryShowcase />
    </div>
  )
}

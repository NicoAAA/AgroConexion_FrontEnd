// src/app/page.tsx  (HomePage)

'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Product } from '@/types/product.types'
import { Carousel } from '@/components/home/Carousel'
import { ProductSection } from '@/components/home/ProductSection'
import { HomeIntro } from '@/components/home/HomeIntro'
import { TickerText } from '@/components/ui/TickerText'
import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import Footer from '@/components/home/footer'
import TopProductsBuy from '@/components/home/ProductsTopSeller'

/**
 * Página principal (Landing Page) de AgroConexión
 * ------------------------------------------------------------
 * - Obtiene productos desde la API al cargarse.
 * - Presenta diferentes secciones dinámicas (ofertas, más vendidos, recomendados).
 * - Integra componentes visuales (carrusel, ticker de mensajes, showcase de categorías).
 * - Incluye soporte para modo oscuro gracias a clases `dark:`.
 */
export default function HomePage() {
  // Estado de productos cargados desde la API
  const [products, setProducts] = useState<Product[]>([])
  const [errores, setErrores] = useState('')

  /**
   * useEffect → carga inicial de productos desde el backend
   */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          'http://127.0.0.1:8000/api/products/list-products/'
        )
        setProducts(res.data)
      } catch (err) {
        // Manejo de errores: si es Axios, mostramos detalle; si no, genérico
        const msg = axios.isAxiosError(err)
          ? err.response?.data?.detail || 'Error al obtener productos.'
          : 'Error inesperado.'
        setErrores(msg)
      }
    }
    fetchProducts()
  }, [])

  /**
   * Segmentación de productos para distintas secciones
   */
  const ofertas = products.slice(0, 3)
  const masVendidos = products.slice(3, 6)
  const recomendados = products.slice(6, 9)

  /**
   * Selección de slides aleatorios para el carrusel
   */
  const selectedSlides = products
    .filter((p) => p.images?.[0]?.image)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      src: `http://127.0.0.1:8000${p.images[0].image}`,
      alt: p.name,
    }))

  /**
   * Mensajes que aparecen en el ticker animado
   */
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
    <div
      className="
        flex flex-col min-h-screen
        bg-gradient-to-br from-green-100 via-white to-green-50
        dark:from-slate-900 dark:via-slate-950 dark:to-slate-900
        transition-colors duration-300
      "
    >
      {/* ------------------ CONTENIDO PRINCIPAL ------------------ */}
      <main className="flex-1 flex flex-col gap-8 pb-8">
        {/* Intro de bienvenida */}
        <HomeIntro />

        {/* Carrusel principal */}
        <div className="px-4">
          <Carousel slides={selectedSlides} />
        </div>

        {/* Sección de ofertas */}
        <ProductSection title="🛒 Ofertas" productos={ofertas} />

        {/* Ticker con mensajes */}
        <TickerText items={mensajes} speed={70} />

        {/* Productos más vendidos */}
        <TopProductsBuy />

        {/* Segundo ticker para dinamismo */}
        <TickerText items={mensajes} speed={70} />

        {/* Recomendados */}
        <ProductSection title="🌱 Recomendados" productos={recomendados} />

        {/* Mensaje de error si algo falla en la API */}
        {errores && (
          <p className="text-center text-red-500 dark:text-red-400 font-medium mt-4">
            {errores}
          </p>
        )}

        {/* Showcase de categorías */}
        <CategoryShowcase />
      </main>

      {/* ------------------ FOOTER ------------------ */}
      <Footer />
    </div>
  )
}

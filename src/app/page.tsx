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
 * - Carga productos desde la API
 * - Muestra carrusel, secciones de productos, mensajes destacados y categorías
 * - Incluye footer fijo en la parte inferior
 */
export default function HomePage() {
  // Estado de productos cargados desde la API
  const [products, setProducts] = useState<Product[]>([])
  const [errores, setErrores] = useState('')

  /**
   * useEffect → Carga inicial de productos desde backend
   */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          'http://127.0.0.1:8000/api/products/list-products/'
        )
        setProducts(res.data)
      } catch (err) {
        // Manejo de errores de Axios vs. errores inesperados
        const msg = axios.isAxiosError(err)
          ? err.response?.data?.detail || 'Error al obtener productos.'
          : 'Error inesperado.'
        setErrores(msg)
      }
    }
    fetchProducts()
  }, [])

  /**
   * Segmentación de productos para secciones
   * - ofertas: primeros 3 productos
   * - más vendidos: del 4 al 6 (aún no usado aquí, pero sí en <TopProductsBuy />)
   * - recomendados: del 7 al 9
   */
  const ofertas = products.slice(0, 3)
  const masVendidos = products.slice(3, 6)
  const recomendados = products.slice(6, 9)

  /**
   * Selección aleatoria de imágenes para el carrusel principal
   * - Filtra productos que tengan imagen
   * - Mezcla aleatoriamente y selecciona 3
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
   * Mensajes dinámicos que se muestran en el ticker animado
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50">
      {/* Contenido principal */}
      <main className="flex-1 flex flex-col gap-8 pb-8">
        {/* Sección introductoria de bienvenida */}
        <HomeIntro />

        {/* Carrusel con imágenes seleccionadas */}
        <div className="px-4">
          <Carousel slides={selectedSlides} />
        </div>

        {/* Sección de ofertas */}
        <ProductSection title="🛒 Ofertas" productos={ofertas} />

        {/* Mensajes tipo ticker animado */}
        <TickerText items={mensajes} speed={70} />

        {/* Productos más vendidos */}
        <TopProductsBuy />

        {/* Repetición del ticker para dar dinamismo */}
        <TickerText items={mensajes} speed={70} />

        {/* Sección de recomendados */}
        <ProductSection title="🌱 Recomendados" productos={recomendados} />

        {/* Mensaje de error si falla la API */}
        {errores && (
          <p className="text-center text-red-500 font-medium mt-4">
            {errores}
          </p>
        )}

        {/* Showcase de categorías destacadas */}
        <CategoryShowcase />
      </main>

      {/* Footer fijo en la parte inferior */}
      <Footer />
    </div>
  )
}

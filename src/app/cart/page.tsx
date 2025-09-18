// src/app/cart/page.tsx

'use client'

// 📦 Importaciones necesarias
import { useState, useEffect } from 'react'
import api from '@/lib/axios'
import Image from 'next/image'
import { Minus, Plus, Trash2, Loader2 } from 'lucide-react'
import BuyCart from '@/components/cart/ComprarCarrito'
import { toast } from 'sonner'

/* 
 📑 Tipado local para un producto dentro del carrito.
 Esto asegura que cada item tenga la forma correcta.
*/
interface CartProduct {
  id: number
  product: {
    id: number
    name: string
    description: string
    price: number
    images: { image: string }[]
  }
  quantity: number
}

// 🔢 Función para formatear precios en pesos colombianos (COP)
const formatPrice = (value = 0) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value)

const GetCarrito = () => {
  // 🗂️ Estados locales
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]) // productos actuales
  const [loading, setLoading] = useState<boolean>(true) // estado de carga inicial
  const [updatingId, setUpdatingId] = useState<number | null>(null) // id del producto en actualización
  const [refreshKey, setRefreshKey] = useState(0) // trigger para recargar datos

  // 📥 Obtener productos del carrito desde el backend
  const fetchCart = async () => {
    setLoading(true)
    try {
      const response = await api.get('/cart/my-cart/')
      const data = response.data

      // 🛠️ Normalizar siempre a un array
      const items: CartProduct[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
        ? data.products
        : []

      setCartProducts(items)
    } catch (err: any) {
      console.error('Error al obtener el carrito', err?.response?.data ?? err?.message ?? err)
      toast.error('No se pudo cargar el carrito. Intenta recargar la página.')
    } finally {
      setLoading(false)
    }
  }

  // 🌀 Cargar carrito al iniciar y cada vez que cambie refreshKey
  useEffect(() => {
    fetchCart()
  }, [refreshKey])

  // 🔔 Escuchar evento global "cartUpdated"
  useEffect(() => {
    const handler = () => setRefreshKey((k) => k + 1)
    window.addEventListener('cartUpdated', handler)
    return () => window.removeEventListener('cartUpdated', handler)
  }, [])

  // 🔄 Cambiar cantidad de un producto (usando DELETE + POST)
  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return

    const prevState = [...cartProducts]
    setUpdatingId(productId)

    // 🟢 Optimismo en UI (mostramos el cambio antes de confirmación del backend)
    setCartProducts((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    )

    try {
      // 1. Eliminar el producto actual
      await api.delete(`/cart/delete-product/${productId}/`)
      // 2. Volver a agregarlo con la nueva cantidad
      await api.post('/cart/my-cart/', {
        product_id: productId,
        quantity: newQuantity,
      })
      toast.success('Cantidad actualizada ✅')
      fetchCart() // 🔄 refrescar carrito
    } catch (err: any) {
      console.error('Error al actualizar cantidad', err?.response?.data ?? err?.message ?? err)
      toast.error('No se pudo actualizar la cantidad ❌')
      setCartProducts(prevState) // rollback en caso de error
    } finally {
      setUpdatingId(null)
    }
  }

  // 📊 Totales de carrito
  const totalItems = cartProducts.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartProducts.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  )

  // 🎨 Renderizado principal
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          🛒 Tu carrito
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              // ⏳ Loader mientras carga
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-green-600" size={36} />
              </div>
            ) : cartProducts.length === 0 ? (
              // 🛑 Carrito vacío
              <div className="bg-white rounded-2xl p-8 text-center shadow">
                <p className="text-gray-600">No hay productos en el carrito.</p>
                <p className="mt-3 text-sm text-gray-400">
                  Explora nuestros productos y agrégalos al carrito.
                </p>
              </div>
            ) : (
              // ✅ Renderizar cada producto del carrito
              cartProducts.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-sm border"
                >
                  {/* Imagen */}
                  <div className="w-full md:w-36 h-28 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border">
                    <Image
                      src={
                        item.product.images?.[0]?.image
                          ? `http://127.0.0.1:8000${item.product.images[0].image}`
                          : '/placeholder.png'
                      }
                      alt={item.product.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  {/* Info del producto */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {item.product.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {formatPrice(item.product.price)}
                        </div>
                        <div className="text-sm text-gray-400">c/u</div>
                      </div>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="mt-4 flex items-center justify-between md:justify-start gap-4">
                      <div className="flex items-center gap-2">
                        {/* Botón - */}
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.product.id,
                              Math.max(item.quantity - 1, 1)
                            )
                          }
                          disabled={updatingId === item.product.id}
                          className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50"
                        >
                          <Minus size={16} />
                        </button>

                        {/* Cantidad */}
                        <div className="w-14 text-center font-medium text-gray-900">
                          {item.quantity}
                        </div>

                        {/* Botón + */}
                        <button
                          onClick={() =>
                            handleQuantityChange(item.product.id, item.quantity + 1)
                          }
                          disabled={updatingId === item.product.id}
                          className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50"
                        >
                          <Plus size={16} />
                        </button>

                        {/* Loader de actualización */}
                        {updatingId === item.product.id && (
                          <div className="ml-3 text-sm text-gray-500 flex items-center gap-2">
                            <Loader2 className="animate-spin" size={16} /> Actualizando...
                          </div>
                        )}
                      </div>

                      {/* Subtotal */}
                      <div className="ml-auto md:ml-6 text-right">
                        <div className="text-sm text-gray-500">Subtotal</div>
                        <div className="text-md font-semibold text-gray-900">
                          {formatPrice(item.quantity * item.product.price)}
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="mt-4 flex items-center gap-3 ">
                      <button
                        onClick={async () => {
                          try {
                            await api.delete(`/cart/delete-product/${item.product.id}/`)
                            toast.success('Producto eliminado 🗑️')
                            fetchCart()
                          } catch {
                            toast.error('No se pudo eliminar el producto ❌')
                          }
                        }}
                        className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 📌 Resumen del carrito */}
          <aside className="bg-white rounded-2xl p-5 shadow sticky top-24 border">
            <div className="text-sm text-gray-600">Resumen</div>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <div className="text-lg font-medium text-gray-900">
                  {totalItems} productos
                </div>
                <div className="text-sm text-gray-500">Artículos en tu carrito</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-green-600">
                  {formatPrice(totalPrice)}
                </div>
                <div className="text-xs text-gray-400">Total</div>
              </div>
            </div>

            {/* Botón de comprar */}
            <div className="mt-6">
              <BuyCart
                totalItems={totalItems}
                totalPrice={totalPrice}
                onCartCleared={() => setCartProducts([])} // 🗑️ limpiar carrito al comprar
              />
            </div>

            {/* Footer de beneficios */}
            <div className="mt-4 text-xs text-gray-400">
              Pago seguro • Entrega directa de productores • Cambios en 7 días
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default GetCarrito

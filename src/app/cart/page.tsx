// app/cart/GetCarrito.tsx
'use client'
import { useState, useEffect } from 'react'
import api from '@/lib/axios'
import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import EliminarProducto from '@/components/cart/eliminar'
import BuyCart from '@/components/cart/ComprarCarrito' // deja como está en tu proyecto
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

/* Tipado local para el carrito (ajusta si tu backend devuelve otras keys) */
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

const formatPrice = (value = 0) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)

const GetCarrito = () => {
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null) // para bloquear botones de un producto
  const [refreshKey, setRefreshKey] = useState(0) // forzar re-fetch si se necesita

  // Obtener productos del carrito
  const fetchCart = async () => {
    setLoading(true)
    try {
      // usa la ruta relativa correcta: api.baseURL ya incluye /api si tu lib lo define así
      const response = await api.get('/cart/my-cart/')
      // Soporta dos formatos comunes: response.data = array o response.data.products = array
      const data = response.data
      const items: CartProduct[] = Array.isArray(data) ? data : data?.products ?? []
      setCartProducts(items)
    } catch (err: any) {
      console.error('Error al obtener el carrito', err?.response?.data ?? err?.message ?? err)
      toast.error('No se pudo cargar el carrito. Intenta recargar la página.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [refreshKey])

  // Escucha eventos del sistema para cuando otro componente (p. ej. EliminarProducto)
  // dispare window.dispatchEvent(new CustomEvent('cartUpdated')) para refrescar.
  useEffect(() => {
    const handler = () => setRefreshKey((k) => k + 1)
    window.addEventListener('cartUpdated', handler)
    return () => window.removeEventListener('cartUpdated', handler)
  }, [])

  // Cambiar cantidad: optimista, revertir si falla
  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    // snapshot para revertir si falla
    const prevState = [...cartProducts]
    setUpdatingId(productId)

    // Optimistic update
    setCartProducts((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: newQuantity } : item))
    )

    try {
      // POST a /cart/my-cart/ con payload esperado por tu backend
      await api.post('/cart/my-cart/', {
        product_id: productId,
        quantity: newQuantity,
      })
      toast.success('Cantidad actualizada')
      // opcional: re-fetch para asegurar consistencia (descomenta si prefieres)
      // await fetchCart()
    } catch (err: any) {
      console.error('Error al actualizar cantidad', err?.response?.data ?? err?.message ?? err)
      toast.error('No se pudo actualizar la cantidad. Intenta nuevamente.')
      // revertir
      setCartProducts(prevState)
    } finally {
      setUpdatingId(null)
    }
  }

  // Totales
  const totalItems = cartProducts.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartProducts.reduce((sum, item) => sum + item.quantity * item.product.price, 0)

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">🛒 Tu carrito</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de productos (2/3 del ancho en desktop) */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-green-600" size={36} />
              </div>
            ) : cartProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow">
                <p className="text-gray-600">No hay productos en el carrito.</p>
                <p className="mt-3 text-sm text-gray-400">Explora nuestros productos y agrégalos al carrito.</p>
              </div>
            ) : (
              cartProducts.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-sm border"
                >
                  {/* Imagen */}
                  <div className="w-full md:w-36 h-28 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border">
                    <Image
                      src={
                        item.product.images && item.product.images.length > 0
                          ? `http://127.0.0.1:8000${item.product.images[0].image}`
                          : '/placeholder.png'
                      }
                      alt={item.product.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{item.product.name}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.product.description}</p>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{formatPrice(item.product.price)}</div>
                        <div className="text-sm text-gray-400">c/u</div>
                      </div>
                    </div>

                    {/* Cantidad y subtotal */}
                    <div className="mt-4 flex items-center justify-between md:justify-start gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          aria-label="Disminuir cantidad"
                          onClick={() =>
                            handleQuantityChange(item.product.id, Math.max(item.quantity - 1, 1))
                          }
                          disabled={updatingId === item.product.id}
                          className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50"
                        >
                          <Minus size={16} />
                        </button>

                        <div className="w-14 text-center font-medium text-gray-900">{item.quantity}</div>

                        <button
                          aria-label="Aumentar cantidad"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          disabled={updatingId === item.product.id}
                          className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50"
                        >
                          <Plus size={16} />
                        </button>

                        {updatingId === item.product.id && (
                          <div className="ml-3 text-sm text-gray-500 flex items-center gap-2">
                            <Loader2 className="animate-spin" size={16} /> Actualizando...
                          </div>
                        )}
                      </div>

                      <div className="ml-auto md:ml-6 text-right">
                        <div className="text-sm text-gray-500">Subtotal</div>
                        <div className="text-md font-semibold text-gray-900">{formatPrice(item.quantity * item.product.price)}</div>
                      </div>
                    </div>

                    {/* acciones pequeñas */}
                    <div className="mt-4 flex items-center gap-3">
                      {/* EliminarProducto debe despachar evento 'cartUpdated' tras borrar para que esto recarge */}
                      <EliminarProducto productId={item.product.id} />
                      <button
                        onClick={() => {
                          // acción rápida: eliminar localmente y re-fetch (no asumimos comportamiento de EliminarProducto)
                          (async () => {
                            try {
                              await api.delete(`/cart/delete-product/${item.product.id}/`)
                              toast.success('Producto eliminado del carrito')
                              // re-fetch
                              fetchCart()
                            } catch (err: any) {
                              console.error(err)
                              toast.error('No se pudo eliminar el producto')
                            }
                          })()
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

          {/* Resumen y compra (1/3 del ancho en desktop) */}
          <aside className="bg-white rounded-2xl p-5 shadow sticky top-24 border">
            <div className="text-sm text-gray-600">Resumen</div>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <div className="text-lg font-medium text-gray-900">{totalItems} productos</div>
                <div className="text-sm text-gray-500">Artículos en tu carrito</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-green-600">{formatPrice(totalPrice)}</div>
                <div className="text-xs text-gray-400">Total</div>
              </div>
            </div>

            <div className="mt-6">
              <BuyCart totalItems={totalItems} totalPrice={totalPrice} />
            </div>

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

// src/components/cart/ComprarCarrito.tsx
'use client'

import { useState } from 'react'
import api from '@/lib/axios'
import { toast } from 'sonner'
import { ShoppingCart, Loader2, PackageSearch } from 'lucide-react'
import axios from 'axios'
import Link from 'next/link'

interface ComprarCarritoProps {
  totalItems?: number
  totalPrice?: number
  onCartCleared?: () => void // callback opcional para resetear carrito en frontend
}

const ComprarCarrito = ({
  totalItems = 0,
  totalPrice = 0,
  onCartCleared,
}: ComprarCarritoProps) => {
  const [loading, setLoading] = useState(false)

  const handleBuyCart = async () => {
    if (totalItems === 0) {
      toast.error('Tu carrito está vacío ❌')
      return
    }

    setLoading(true)
    try {
      // 1. Obtener productos del carrito
      const { data } = await api.get('/cart/my-cart/')

      // 2. Eliminar cada producto con su id
      for (const item of data) {
        await api.delete(`/cart/delete-product/${item.product.id}/`)
      }

      // 3. Notificación
      toast.success('Compra realizada con éxito 🎉')

      // 4. Resetear carrito en frontend si existe callback
      if (onCartCleared) onCartCleared()
    } catch (err: any) {
      toast.error('Error al realizar la compra ❌')

      if (axios.isAxiosError(err)) {
        console.error(err.response?.data || err.message)
      } else {
        console.error(err)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-4 border border-gray-100">
      {/* Resumen del carrito */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Resumen de tu compra
          </h3>
          <p className="text-sm text-gray-500">
            {totalItems} producto(s) en tu carrito
          </p>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-green-600">
            ${totalPrice.toLocaleString()}
          </span>
          <p className="text-sm text-gray-500">Total a pagar</p>
        </div>
      </div>

      {/* Botón de comprar */}
      <button
        disabled={loading || totalItems === 0}
        onClick={handleBuyCart}
        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Procesando compra...
          </>
        ) : (
          <>
            <ShoppingCart size={20} />
            Comprar todo el carrito
          </>
        )}
      </button>

      {/* Botón para explorar más productos */}
      <Link
        href="/"
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
      >
        <PackageSearch size={20} />
        Explorar más productos
      </Link>

      {/* Nota */}
      <p className="text-xs text-gray-400 text-center">
        *Elige tu método de pago en el siguiente paso
      </p>
    </div>
  )
}

export default ComprarCarrito

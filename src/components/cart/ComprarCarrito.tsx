// components/BuyCart.tsx
'use client'

import { useState } from 'react'
import api from '@/lib/axios' // tu instancia con JWT
import { toast } from 'sonner'

const BuyCart = () => {
  const [loading, setLoading] = useState(false)

  const handleBuyCart = async () => {
    setLoading(true)
    try {
      const response = await api.post('/users/invoices/invoice/from-cart/', {
        method: 'efectivo', // o 'tarjeta_debito'
      })

      toast.success('Compra realizada con éxito')
      console.log(response.data)
    } catch (error: any) {
      toast.error('Error al realizar la compra')
      console.error(error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      disabled={loading}
      onClick={handleBuyCart}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
    >
      {loading ? 'Comprando...' : 'Comprar todo el carrito'}
    </button>
  )
}

export default BuyCart

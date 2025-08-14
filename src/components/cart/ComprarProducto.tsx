// components/BuyProduct.tsx
'use client'

import { useState } from 'react'
import api from '@/lib/axios'
import { toast } from 'sonner'

const BuyProduct = ({ productId }: { productId: number }) => {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  

  const handleBuy = async () => {
    setLoading(true)
    try {
      const response = await api.post('/users/invoices/create/', {
        method: 'efectivo', // o 'tarjeta_debito'
        items: [{ product_id: productId, quantity }],
      })

      toast.success('Producto comprado con éxito')
      console.log(response.data)
    } catch (error: any) {
      toast.error('Error al comprar producto')
      console.error(error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="border p-1 rounded"
      />
      <button
        disabled={loading}
        onClick={handleBuy}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {loading ? 'Comprando...' : 'Comprar producto'}
      </button>
    </div>
  )
}

export default BuyProduct

"use client"

import React, { useEffect, useState } from "react"
import api from "@/lib/axios"

interface Offer {
  id: number
  title: string
  description: string
  percentage: string
  start_date: string
  end_date: string
}

interface Coupon {
  id: number
  description: string
  percentage: string
  min_purchase_amount: string
  start_date: string
  end_date: string
  active: boolean
  code: string
  seller: number
  product: number
}

interface Detail {
  product_name: string
  seller_name: string
  quantity: number
  unit_price: string
  subtotal: string
  offer?: Offer | null
  coupon?: Coupon | null
}

interface Invoice {
  id: number
  user: string
  date_created: string
  method: string
  total: string
  details: Detail[]
}

export default function InvoicePageClient({ id }: { id: string }) {
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await api.get(`/invoices/detail/${id}/`)
        setInvoice(res.data)
      } catch (error) {
        console.error("Error cargando la factura:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchInvoice()
  }, [id])

  if (loading) return <p className="text-center">Cargando factura...</p>
  if (!invoice) return <p className="text-center text-red-500">Factura no encontrada</p>

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8 border mt-10">
      {/* Encabezado */}
      <div className="text-center border-b pb-6 mb-6">
        <h1 className="text-3xl font-bold text-green-700">Factura #{invoice.id}</h1>
        <p className="text-gray-500 text-sm">
          Fecha: {new Date(invoice.date_created).toLocaleString()}
        </p>
        <p className="text-gray-500 text-sm">Cliente: {invoice.user}</p>
        <p className="text-gray-500 text-sm">Método: {invoice.method}</p>
      </div>

      {/* Detalles */}
      <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
        <thead>
          <tr className="bg-green-100 text-green-800 text-sm uppercase">
            <th className="p-3">Producto</th>
            <th className="p-3">Vendedor</th>
            <th className="p-3 text-center">Cantidad</th>
            <th className="p-3 text-right">Precio</th>
            <th className="p-3 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {invoice.details.map((item, i) => (
            <tr key={i} className="border-b text-sm hover:bg-gray-50">
              <td className="p-3 font-medium">{item.product_name}</td>
              <td className="p-3 text-gray-600">{item.seller_name}</td>
              <td className="p-3 text-center">{item.quantity}</td>
              <td className="p-3 text-right">${item.unit_price}</td>
              <td className="p-3 text-right font-semibold">${item.subtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Ofertas y cupones */}
      <div className="mt-6 space-y-3">
        {invoice.details.map(
          (item, i) =>
            (item.offer || item.coupon) && (
              <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                {item.offer && (
                  <p className="text-sm text-green-700">
                    <b>Oferta:</b> {item.offer.title} ({item.offer.percentage}%)
                  </p>
                )}
                {item.coupon && (
                  <p className="text-sm text-blue-700">
                    <b>Cupón:</b> {item.coupon.code} ({item.coupon.percentage}%)
                  </p>
                )}
              </div>
            )
        )}
      </div>

      {/* Total */}
      <div className="border-t mt-6 pt-6 flex justify-between items-center">
        <p className="text-xl font-bold">Total</p>
        <p className="text-xl font-bold text-green-700">${invoice.total}</p>
      </div>
    </div>
  )
}

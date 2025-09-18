"use client"

import React, { useEffect, useState } from "react"
import api from "@/lib/axios"
import { Receipt, Calendar, User, CreditCard, Package, ShoppingCart, Tag, Gift, Sprout } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Contenedor principal de la factura */}
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border-2 border-green-100">
          
          {/* Header premium con diseño campesino */}
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 px-6 sm:px-8 py-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full transform -translate-x-12 translate-y-12"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                    <Receipt className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Factura #{invoice.id}</h1>
                    <p className="text-green-100 flex items-center gap-2 mt-1">
                      <Sprout className="w-4 h-4" />
                      Productos del Campo
                    </p>
                  </div>
                </div>
                
                <div className="text-sm sm:text-right space-y-1">
                  <div className="flex items-center gap-2 text-green-100">
                    <Calendar className="w-4 h-4" />
                    {new Date(invoice.date_created).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-green-100">
                    <User className="w-4 h-4" />
                    {invoice.user}
                  </div>
                  <div className="flex items-center gap-2 text-green-100">
                    <CreditCard className="w-4 h-4" />
                    {invoice.method}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Tabla responsiva con mejor diseño */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-green-600" />
                Detalles de la Compra
              </h2>
              
              {/* Vista de tabla para desktop */}
              <div className="hidden md:block">
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Producto</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Vendedor</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">Cantidad</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold">Precio Unit.</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {invoice.details.map((item, i) => (
                        <tr key={i} className="hover:bg-green-50 transition-colors duration-200">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">{item.product_name}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-green-700 font-medium">{item.seller_name}</div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-semibold text-gray-900">
                            ${item.unit_price}
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-green-700 text-lg">
                            ${item.subtotal}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Vista de cards para móvil */}
              <div className="md:hidden space-y-4">
                {invoice.details.map((item, i) => (
                  <div key={i} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-l-4 border-green-500 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 text-sm">{item.product_name}</h3>
                      <span className="text-lg font-bold text-green-700">${item.subtotal}</span>
                    </div>
                    <div className="text-sm text-green-600 mb-2 flex items-center gap-1">
                      <Sprout className="w-3 h-3" />
                      {item.seller_name}
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        <span className="font-semibold">{item.quantity}</span> × ${item.unit_price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ofertas y cupones con mejor diseño */}
            <div className="mb-8">
              {invoice.details.some(item => item.offer || item.coupon) && (
                <>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-orange-600" />
                    Descuentos Aplicados
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {invoice.details.map(
                      (item, i) =>
                        (item.offer || item.coupon) && (
                          <div key={i} className="relative overflow-hidden">
                            {item.offer && (
                              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white shadow-lg">
                                <div className="flex items-center gap-2 mb-1">
                                  <Tag className="w-4 h-4" />
                                  <span className="font-semibold text-sm">OFERTA ESPECIAL</span>
                                </div>
                                <p className="font-bold">{item.offer.title}</p>
                                <p className="text-green-100 text-sm">
                                  Descuento del {item.offer.percentage}%
                                </p>
                                <div className="absolute top-0 right-0 w-16 h-16 bg-white bg-opacity-10 rounded-full transform translate-x-8 -translate-y-8"></div>
                              </div>
                            )}
                            {item.coupon && (
                              <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-4 text-white shadow-lg">
                                <div className="flex items-center gap-2 mb-1">
                                  <Gift className="w-4 h-4" />
                                  <span className="font-semibold text-sm">CUPÓN</span>
                                </div>
                                <p className="font-bold">Código: {item.coupon.code}</p>
                                <p className="text-orange-100 text-sm">
                                  Descuento del {item.coupon.percentage}%
                                </p>
                                <div className="absolute top-0 right-0 w-16 h-16 bg-white bg-opacity-10 rounded-full transform translate-x-8 -translate-y-8"></div>
                              </div>
                            )}
                          </div>
                        )
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Total con diseño premium */}
            <div className="bg-gradient-to-r from-gray-50 to-green-50 rounded-2xl p-6 border-2 border-green-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Total a Pagar</h3>
                    <p className="text-sm text-gray-600">Productos frescos del campo</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl sm:text-4xl font-bold text-green-700">
                    ${invoice.total}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Pesos colombianos</p>
                </div>
              </div>
            </div>

            {/* Footer con información adicional */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-green-50 rounded-xl p-4 flex items-start gap-3">
                <Sprout className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-700">
                  <p className="font-semibold mb-1">🌱 Gracias por apoyar a nuestros campesinos</p>
                  <p>Con tu compra apoyas directamente a las familias rurales y contribuyes al desarrollo sostenible del campo colombiano.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

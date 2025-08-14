'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

const AgregarCarrito = ({ productId }: { productId: number }) => {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      await api.post('/users/cart/user/cart/', {
        product_id: productId,
        quantity: 1,
      });
      toast.success('Producto agregado al carrito 🛒');
    } catch (error: any) {
      const msg = error?.response?.data?.detail || 'Error al agregar al carrito';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2 disabled:opacity-50"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
      </svg>
      <span>{loading ? 'Agregando...' : 'Agregar al Carrito'}</span>
    </button>
  );
};

export default AgregarCarrito;

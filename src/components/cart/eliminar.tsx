'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

const EliminarProducto = ({ productId }: { productId: number }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/users/cart/cart/${productId}/`);
      toast.success('Producto eliminado del carrito');
    } catch (error: any) {
      const msg = error?.response?.data?.detail || 'Error al eliminar del carrito';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-8 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2 disabled:opacity-50"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
      <span>{loading ? 'Eliminando...' : 'Eliminar'}</span>
    </button>
  );
};

export default EliminarProducto;



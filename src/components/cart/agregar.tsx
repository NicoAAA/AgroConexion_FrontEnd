'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Loader2, ShoppingCart } from 'lucide-react';

const AgregarCarrito = ({ 
  productId, 
  onError 
}: { 
  productId: number; 
  onError?: (msg: string) => void 
}) => {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      await api.post('/cart/my-cart/', {
        product_id: productId,
        quantity: 1,
      });
      toast.success('Producto agregado al carrito 🛒');
    } catch (error: any) {
      const msg = error?.response?.data?.detail || 'Error al agregar al carrito';
      toast.error(msg);
      if (onError) onError(msg); // 🔥 avisamos al padre
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-5 rounded-lg 
                 hover:bg-blue-700 transition-colors duration-200 
                 font-medium text-base shadow-md hover:shadow-lg
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
<<<<<<< HEAD
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Agregando...</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          <span>Agregar al Carrito</span>
        </>
      )}
=======
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
      </svg>
      <span>{loading ? 'Agregando...' : 'Agregar al Carrito'}</span>
>>>>>>> origin/carousel
    </button>
  );
};

export default AgregarCarrito;


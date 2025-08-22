'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Loader2, ShoppingCart } from 'lucide-react';

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
      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-5 rounded-lg 
                 hover:bg-blue-700 transition-colors duration-200 
                 font-medium text-base shadow-md hover:shadow-lg
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
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
    </button>
  );
};

export default AgregarCarrito;

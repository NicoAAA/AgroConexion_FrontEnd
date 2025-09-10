// src/components/cart/agregar.tsx

'use client';

import { useState } from 'react';
import api from '@/lib/axios'; // cliente Axios configurado
import { toast } from 'sonner'; // librería de notificaciones
import { Loader2, ShoppingCart } from 'lucide-react'; // iconos (algunos no usados en el render final)

/**
 * Componente AgregarCarrito
 * ---------------------------------
 * - Permite añadir un producto al carrito de compras
 * - Envía una petición POST al backend con el id del producto y cantidad
 * - Muestra notificaciones de éxito o error con `sonner`
 * - Puede informar errores al componente padre mediante `onError`
 *
 * Props:
 * - productId: número que identifica el producto a agregar
 * - onError?: callback opcional para manejar errores desde el padre
 */
const AgregarCarrito = ({ 
  productId, 
  onError 
}: { 
  productId: number; 
  onError?: (msg: string) => void 
}) => {
  const [loading, setLoading] = useState(false); // estado de carga

  /**
   * handleAddToCart
   * ----------------
   * - Ejecuta la petición POST al endpoint del carrito
   * - Controla el estado de `loading` para evitar clics múltiples
   * - Maneja notificaciones y errores
   */
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
      if (onError) onError(msg); // 🔥 Avisamos al padre si mandó callback
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
      {/* Ícono del carrito */}
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
        />
      </svg>

      {/* Texto dinámico según estado */}
      <span>{loading ? 'Agregando...' : 'Agregar al Carrito'}</span>
    </button>
  );
};

export default AgregarCarrito;

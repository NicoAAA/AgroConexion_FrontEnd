// src/components/cart/eliminar.tsx
'use client';

import { useState } from 'react';
import api from '@/lib/axios'; // cliente Axios configurado con backend
import { toast } from 'sonner'; // librería para notificaciones

/**
 * Componente EliminarProducto
 * -----------------------------------------------------
 * - Recibe un productId como prop (id del producto en el carrito).
 * - Permite eliminar un producto específico del carrito del usuario.
 * - Muestra un estado de carga mientras se ejecuta la petición.
 * - Notifica al usuario si la eliminación fue exitosa o falló.
 */
const EliminarProducto = ({ productId }: { productId: number }) => {
  const [loading, setLoading] = useState(false); // estado de carga

  /**
   * handleDelete
   * -----------------------------------------------------
   * - Llama al backend para eliminar el producto del carrito.
   * - Maneja errores y muestra notificaciones con `toast`.
   */
  const handleDelete = async () => {
    try {
      setLoading(true);

      // Petición al backend para eliminar producto del carrito
      await api.delete(`/users/cart/cart/${productId}/`);

      // Notificación de éxito
      toast.success('Producto eliminado del carrito 🗑️');
    } catch (error: any) {
      // Captura de error y mensaje amigable
      const msg =
        error?.response?.data?.detail || 'Error al eliminar del carrito';
      toast.error(msg);
      console.error('❌ Error al eliminar producto:', error);
    } finally {
      setLoading(false); // siempre desactivar loading
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-8 rounded-xl 
                 hover:from-red-700 hover:to-red-800 transition-all duration-200 
                 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 
                 flex items-center justify-center space-x-2 disabled:opacity-50"
    >
      {/* Ícono X */}
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
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>

      {/* Texto dinámico según estado */}
      <span>{loading ? 'Eliminando...' : 'Eliminar'}</span>
    </button>
  );
};

export default EliminarProducto;

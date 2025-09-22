// src/components/cart/agregar.tsx

'use client';

import { useState } from 'react';
import api from '@/lib/axios'; // cliente Axios configurado
import { toast } from 'sonner'; // librería de notificaciones
import { Loader2, ShoppingCart } from 'lucide-react'; // iconos (algunos no usados en el render final)
import { useLanguage } from '@/context/LanguageContext';


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
  const { t } = useLanguage();

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
      toast.success(t("productoAgregado")); // Notificación de éxito
    } catch (error: any) {
      const msg = error?.response?.data?.detail || (t("errorAgregar")); // Mensaje de error
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
      className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white py-4 px-6 rounded-xl 
                 hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 
                 transition-all duration-300 font-semibold text-base shadow-lg hover:shadow-xl
                 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 group relative overflow-hidden"
    >
      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      
      <div className="relative flex items-center gap-3">
        {loading ? (
          <>
            {/* Spinner de carga */}
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>{t("agregando")}</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </>
        ) : (
          <>
            {/* Ícono del carrito mejorado */}
            <div className="relative">
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
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
              {/* Indicador de cantidad (opcional) */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
            </div>

            <span className="group-hover:tracking-wide transition-all duration-200">
              {t("agregarAlCarrito")}
            </span>

            {/* Flecha decorativa */}
            <svg 
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200 opacity-0 group-hover:opacity-100" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </>
        )}
      </div>

      {/* Efecto de ondas en click */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-100 transition-opacity duration-150">
        <div className="absolute inset-2 bg-white/20 rounded-lg animate-ping"></div>
      </div>
    </button>
  );
};

export default AgregarCarrito;

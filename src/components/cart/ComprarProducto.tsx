// src/components/cart/ComprarProducto.tsx
"use client";

import { useState } from "react";
import api from "@/lib/axios"; // cliente Axios con configuración base
import { toast } from "sonner"; // notificaciones modernas
import { ShoppingBasket, Minus, Plus } from "lucide-react"; // íconos
import { useRouter } from 'next/navigation';
/**
 * Props del componente BuyProduct
 * - productId: identificador único del producto a comprar
 */
const BuyProduct = ({ productId }: { productId: number }) => {
  const [quantity, setQuantity] = useState(1); // cantidad de productos seleccionada
  const [loading, setLoading] = useState(false); // estado de carga de la compra
  const router = useRouter()
  /**
   * handleBuy
   * -----------------------------------------------------
   * - Valida que la cantidad sea mayor a 0
   * - Llama al backend para crear la factura (simulación de compra)
   * - Maneja errores de validación, autenticación y conexión
   * - Notifica al usuario con `toast` el resultado
   */

  const handleGoCheckout = () => {
    if (quantity < 1) {
      toast.error("❌ La cantidad debe ser mayor a 0");
      return;
    }
    router.push(`/checkout/${productId}?qty=${quantity}`);
  };

  // const handleBuy = async () => {
  //   if (quantity < 1) {
  //     toast.error("❌ La cantidad debe ser mayor a 0");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     // 1. Crear factura con el producto seleccionado
  //     const response = await api.post("/invoices/create/", {
  //       method: "efectivo", // método de pago simulado
  //       items: [{ product_id: productId, quantity }],
  //     });

  //     // 2. Éxito
  //     toast.success("🌾 ¡Producto comprado con éxito!");
  //     console.log("✅ Respuesta del backend:", response.data);
  //   } catch (error: any) {
  //     // 3. Manejo de errores detallado
  //     if (error.response) {
  //       const status = error.response.status;
  //       const data = error.response.data;

  //       if (status === 400)
  //         toast.error("⚠️ Datos inválidos. Verifica la cantidad o el producto");
  //       else if (status === 401)
  //         toast.error("🔒 Debes iniciar sesión para comprar");
  //       else if (status === 404)
  //         toast.error("❌ Producto no encontrado");
  //       else
  //         toast.error(
  //           `❌ Error inesperado: ${data?.message || data || error.message}`
  //         );
  //     } else {
  //       toast.error(`❌ Error de conexión: ${error.message}`);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Aumentar cantidad
  const increaseQty = () => setQuantity((prev) => prev + 1);

  // Disminuir cantidad (mínimo 1)
  const decreaseQty = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="w-full p-6 rounded-2xl shadow-lg border border-green-200 dark:border-green-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm space-y-6 hover:shadow-xl transition-all duration-300">

      {/* Selector de cantidad */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
          Cantidad
        </label>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={decreaseQty}
            className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full hover:bg-green-200 dark:hover:bg-green-800/50 transition-all duration-200 hover:scale-110 group"
          >
            <Minus className="w-4 h-4 text-green-700 dark:text-green-400 group-hover:scale-110 transition-transform" />
          </button>

          <div className="relative">
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 text-center border-2 border-green-200 dark:border-green-700 rounded-xl p-3 font-semibold text-green-800 dark:text-green-300 bg-white dark:bg-gray-700 focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all duration-200"
            />
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
          </div>

          <button
            onClick={increaseQty}
            className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full hover:bg-green-200 dark:hover:bg-green-800/50 transition-all duration-200 hover:scale-110 group"
          >
            <Plus className="w-4 h-4 text-green-700 dark:text-green-400 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Botón de compra */}
      <button
        disabled={loading}
        onClick={handleGoCheckout}
        className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 hover:from-green-700 hover:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-105 group relative overflow-hidden"
      >
        {/* Efecto de brillo en hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        
        <div className="relative flex items-center gap-3">
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Procesando compra...</span>
            </>
          ) : (
            <>
              <ShoppingBasket className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span>Comprar ahora</span>
              <div className="w-2 h-2 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </>
          )}
        </div>
      </button>
    </div>
  );
};

export default BuyProduct;

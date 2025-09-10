//src/app/invoices/page.tsx

'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { isAuthenticated as checkAuth, getStoredTokens } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ReceiptText } from 'lucide-react';

/**
 * Componente principal que lista todas las facturas del usuario.
 * 
 * Características:
 * - Valida autenticación del usuario (cliente y servidor).
 * - Redirige al login si no está autenticado.
 * - Consume la API `/invoices/list-invoice/` para obtener las facturas.
 * - Muestra las facturas ordenadas por fecha de creación (más recientes primero).
 * - Cada factura puede expandirse para mostrar el detalle de productos.
 * - Incluye animaciones con Framer Motion al expandir/colapsar.
 */
const ListInvoices = () => {
  const router = useRouter();

  // Estado que guarda la lista de facturas obtenidas de la API
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  // Estado de carga para mostrar "Cargando..."
  const [loading, setLoading] = useState(true);
  // Estado de autenticación proporcionado por el hook de autenticación global
  const { isAuthenticated } = useAuth();
  // Estado para manejar errores relacionados a autenticación u obtención de datos
  const [error, setError] = useState('');
  // Token de acceso obtenido del almacenamiento local
  const [accessToken, setAccessToken] = useState<string | null>(null);
  // Estado que guarda el ID de la factura actualmente expandida (o null si ninguna está abierta)
  const [expandedInvoice, setExpandedInvoice] = useState<number | null>(null);
  // Controla si el componente ya se montó en el cliente (para evitar problemas de SSR)
  const [hasMounted, setHasMounted] = useState(false);
  // Estado que indica si el cliente está autenticado correctamente
  const [isClientAuthenticated, setIsClientAuthenticated] = useState(false);

  /**
   * Marca que el componente ya se montó en el cliente.
   */
  useEffect(() => {
    setHasMounted(true);
  }, []);

  /**
   * Verifica si el usuario está autenticado.
   * Si no lo está, muestra un error y lo redirige al login en 3 segundos.
   * Si lo está, guarda el accessToken y permite continuar.
   */
  useEffect(() => {
    if (!hasMounted) return;

    const { access } = getStoredTokens();
    if (!access || !checkAuth()) {
      setError('No estás autenticado. Serás redirigido al login...');
      setIsClientAuthenticated(false);
      setTimeout(() => router.push('/login'), 3000);
    } else {
      setAccessToken(access);
      setIsClientAuthenticated(true);
    }
  }, [router, hasMounted]);

  /**
   * Obtiene la lista de facturas desde la API.
   * Ordena las facturas de más reciente a más antigua por `date_created`.
   */
  useEffect(() => {
    if (!hasMounted || !isClientAuthenticated) return;

    const fetchInvoices = async () => {
      try {
        const response = await api.get('/invoices/list-invoice/');
        const sorted = response.data.sort(
          (a: Invoice, b: Invoice) =>
            new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
        );
        setInvoices(sorted);
      } catch (error) {
        toast.error('Error al cargar las facturas');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [hasMounted, isClientAuthenticated]);

  /**
   * Alterna entre mostrar u ocultar los detalles de una factura.
   * @param id - ID de la factura seleccionada
   */
  const toggleDetails = (id: number) => {
    setExpandedInvoice((prev) => (prev === id ? null : id));
  };

  /**
   * Da formato legible a una fecha en español (ej: "12 de agosto de 2025").
   */
  const formatDate = (dateString: string) => {
    if (!hasMounted) return dateString;
    return new Date(dateString).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  /**
   * Da formato de moneda a valores numéricos en COP.
   */
  const formatCurrency = (amount: string) => {
    if (!hasMounted) return amount;
    return parseFloat(amount).toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
    });
  };

  // --- VISTAS SEGÚN EL ESTADO DEL COMPONENTE ---

  if (!hasMounted) {
    return <div className="text-center py-10 text-gray-500">Cargando...</div>;
  }

  if (!isClientAuthenticated) {
    return (
      <div className="text-center text-red-600 font-semibold mt-10">
        {error || 'Debes iniciar sesión para ver tus facturas.'}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">Cargando facturas...</div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No tienes facturas registradas.
      </div>
    );
  }

  // --- RENDER PRINCIPAL ---
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Título de la página */}
      <h1 className="text-4xl font-extrabold mb-8 text-green-900 text-center">
        🌾 Mis Facturas
      </h1>

      {/* Listado de facturas */}
      {invoices.map((invoice) => (
        <motion.div
          key={invoice.id}
          className="rounded-2xl mb-6 overflow-hidden shadow-xl"
          whileHover={{ scale: 1.01 }}
        >
          {/* Cabecera con resumen de la factura */}
          <div
            className="bg-green-600 p-6 flex justify-between items-center cursor-pointer text-white"
            onClick={() => toggleDetails(invoice.id)}
          >
            <div className="flex items-center gap-4">
              {/* Icono de factura */}
              <div className="bg-white p-3 rounded-full shadow-md">
                <ReceiptText className="text-green-700 w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Factura #{invoice.id}</h2>
                <p className="text-sm opacity-90">
                  {formatDate(invoice.date_created)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Monto total */}
              <span className="bg-white text-green-700 px-3 py-1 rounded-full font-bold shadow">
                {formatCurrency(invoice.total)}
              </span>
              {/* Icono de expandir/colapsar */}
              {expandedInvoice === invoice.id ? (
                <ChevronUp className="w-6 h-6" />
              ) : (
                <ChevronDown className="w-6 h-6" />
              )}
            </div>
          </div>

          {/* Detalles expandibles de la factura */}
          <AnimatePresence>
            {expandedInvoice === invoice.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden bg-gradient-to-b from-green-50 to-amber-50 p-6"
              >
                {invoice.details.length > 0 ? (
                  <table className="w-full text-sm rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-green-200 text-green-900">
                        <th className="py-2 px-3 text-left">🌽 Producto</th>
                        <th className="py-2 px-3 text-left">👨‍🌾 Vendedor</th>
                        <th className="py-2 px-3 text-left">📦 Cantidad</th>
                        <th className="py-2 px-3 text-left">💲 Precio Unitario</th>
                        <th className="py-2 px-3 text-left">🧾 Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.details.map((item, index) => (
                        <tr
                          key={index}
                          className={`${
                            index % 2 === 0 ? 'bg-white' : 'bg-green-100'
                          } text-gray-800`}
                        >
                          <td className="py-2 px-3 font-medium">{item.product_name}</td>
                          <td className="py-2 px-3">{item.seller_name}</td>
                          <td className="py-2 px-3">{item.quantity}</td>
                          <td className="py-2 px-3">{formatCurrency(item.unit_price)}</td>
                          <td className="py-2 px-3 font-semibold text-green-700">
                            {formatCurrency(item.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-gray-600 mt-2 italic">
                    Esta factura no tiene productos.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

export default ListInvoices;

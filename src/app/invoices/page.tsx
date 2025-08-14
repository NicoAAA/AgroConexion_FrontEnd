'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { isAuthenticated as checkAuth, getStoredTokens } from '@/lib/auth';



const ListInvoices = () => {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState('');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [expandedInvoice, setExpandedInvoice] = useState<number | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [isClientAuthenticated, setIsClientAuthenticated] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

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

  useEffect(() => {
    if (!hasMounted || !isClientAuthenticated) return;

    const fetchInvoices = async () => {
      try {
        const response = await api.get('/users/invoices/list-invoice/');
        setInvoices(response.data);
      } catch (error) {
        toast.error('Error al cargar las facturas');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [hasMounted, isClientAuthenticated]);

  const toggleDetails = (id: number) => {
    setExpandedInvoice((prev) => (prev === id ? null : id));
  };

  const formatDate = (dateString: string) => {
    if (!hasMounted) return dateString; // Evita diferencias de hidratación
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: string) => {
    if (!hasMounted) return amount; // Evita diferencias de hidratación
    return parseFloat(amount).toLocaleString('es-CO');
  };

  // Mostrar un loading inicial hasta que el componente esté montado
  if (!hasMounted) {
    return (
      <div className="text-center py-10 text-gray-500">Cargando...</div>
    );
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
      <div className="text-center py-10 text-gray-500">No tienes facturas registradas.</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Mis Facturas</h1>
      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className="bg-white shadow-md rounded-xl mb-4 p-4 border border-gray-200 cursor-pointer hover:bg-gray-50 transition"
          onClick={() => toggleDetails(invoice.id)}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Factura #{invoice.id}</h2>
            <span className="text-sm text-gray-500">
              {formatDate(invoice.date_created)}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-700">
            <p><strong>Método de Pago:</strong> {invoice.method.replace('_', ' ')}</p>
            <p><strong>Total:</strong> ${formatCurrency(invoice.total)}</p>
          </div>

          {expandedInvoice === invoice.id && invoice.details.length > 0 && (
            <table className="w-full mt-4 text-sm table-auto border-t border-b border-gray-300">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="py-2">Producto</th>
                  <th className="py-2">Vendedor</th>
                  <th className="py-2">Cantidad</th>
                  <th className="py-2">Precio Unitario</th>
                  <th className="py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {invoice.details.map((item, index) => (
                  <tr key={index} className="border-b last:border-none text-black">
                    <td className="py-2">{item.product_name}</td>
                    <td className="py-2">{item.seller_name}</td>
                    <td className="py-2">{item.quantity}</td>
                    <td className="py-2">${formatCurrency(item.unit_price)}</td>
                    <td className="py-2">${formatCurrency(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {expandedInvoice === invoice.id && invoice.details.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">Esta factura no tiene productos.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ListInvoices;
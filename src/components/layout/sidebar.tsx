'use client';
import { Package, Home, Users, Settings } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export function Sidebar() {

  return (
    <aside className="fixed top-0 left-0 z-20 w-64 h-screen bg-gray-400 shadow p-6">
      <nav className="space-y-4 mt-20">
        <Link href={ROUTES.PRODUCTOS} className="block text-gray-700 hover:text-blue-600">
          Productos
        </Link>
        <Link href={ROUTES.NEWPRODUCT} className="block text-gray-700 hover:text-blue-600">
          Añadir un producto
        </Link>
        <Link href={ROUTES.CARRITO} className="block text-gray-700 hover:text-blue-600">
          Carrito
        </Link>
        <Link href={ROUTES.FACTURACION} className="block text-gray-700 hover:text-blue-600">
          Facturación
        </Link>
        <Link href={ROUTES.ESTADISTICAS} className="block text-gray-700 hover:text-blue-600">
          Estadísticas
        </Link>
      </nav>
    </aside>
  );
}

'use client'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants'
import { useLanguage } from '@/context/LanguageContext';

export function Sidebar() {
  const { t } = useLanguage();
  return (
    <aside className="fixed top-0 left-0 z-20 w-64 h-screen 
      bg-gray-100 dark:bg-gray-900 shadow p-6 transition-colors duration-300">
      <nav className="space-y-4 mt-20">
        <Link
          href={ROUTES.PRODUCTOS}
          className="block text-gray-700 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-400 transition-colors"
        >
          {t("productos")}
        </Link>
        <Link
          href={ROUTES.NEWPRODUCT}
          className="block text-gray-700 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-400 transition-colors"
        >
          Añadir un producto
        </Link>
        <Link
          href={ROUTES.CARRITO}
          className="block text-gray-700 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-400 transition-colors"
        >
          Carrito
        </Link>
        <Link
          href={ROUTES.FACTURACION}
          className="block text-gray-700 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-400 transition-colors"
        >
          Facturación
        </Link>
        <Link
          href={ROUTES.ESTADISTICAS}
          className="block text-gray-700 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-400 transition-colors"
        >
          Estadísticas
        </Link>
        <Link
          href={ROUTES.NEWPRODUCT}
          className="block text-gray-700 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-400 transition-colors"
        >
          Nuevo producto
        </Link>
      </nav>
    </aside>
  )
}

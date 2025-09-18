'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

/**
 * Componente introductorio para la página principal (landing) de AgroConexión
 * - Presenta un mensaje de bienvenida al usuario
 * - Incluye un CTA (call-to-action) para ver los productos
 * - Muestra una ilustración representativa
 * - Compatible con modo oscuro
 */
export const HomeIntro = () => {
  const { t } = useLanguage()

  return (
    <section
      className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 md:gap-12 px-4 md:px-10 py-12 
      bg-gradient-to-br from-green-100 via-white to-green-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 
      rounded-2xl shadow-md transition-colors duration-500"
    >
      {/* Contenido de texto */}
      <div className="flex-1 space-y-5 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 dark:text-green-300 leading-tight">
          {t('welcome')} <span className="text-green-600 dark:text-green-400">AgroConexión</span>
        </h1>

        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-lg mx-auto md:mx-0">
          {t('description')}
        </p>

        <Link href="/products">
          <button
            className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 
              text-white px-6 py-3 rounded-xl text-lg font-semibold transition-transform hover:scale-105 shadow-lg"
          >
            {t('viewProducts')}
          </button>
        </Link>
      </div>

      {/* Imagen decorativa */}
      <div className="flex-1 flex justify-center">
        <Image
          src="/AgroConexion.svg"
          alt={t('welcome')}
          width={260}
          height={260}
          className="mx-auto rounded-full shadow-md dark:brightness-90 transition-all"
        />
      </div>
    </section>
  )
}

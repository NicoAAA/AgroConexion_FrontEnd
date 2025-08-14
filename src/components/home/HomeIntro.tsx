'use client'

import Image from 'next/image'
import Link from 'next/link'

export const HomeIntro = () => {
  return (
    <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 md:gap-12 px-4 md:px-10 py-10 bg-gradient-to-br from-green-100 via-white to-green-50 rounded-xl shadow-sm">
      {/* Text Content */}
      <div className="flex-1 space-y-5 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 leading-tight">
          Bienvenido a <span className="text-green-600">AgroConexión</span>
        </h1>
        <p className="text-lg text-gray-700 max-w-lg mx-auto md:mx-0">
          Conecta directamente con productos del campo colombiano. Calidad, frescura y apoyo al campesinado en un solo lugar.
        </p>
        <Link href="/products">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-lg font-semibold transition">
            Ver productos
          </button>
        </Link>
      </div>

      {/* Image */}
      <div className="flex-1">
        <Image
          src="/AgroConexion.svg" // puedes usar una imagen decorativa relacionada
          alt="Ilustración AgroConexión"
          width={200}
          height={100}
          className="mx-auto rounded-full"
        />
      </div>
    </section>
  )
}

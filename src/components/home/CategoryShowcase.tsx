'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  LucideIcon,
  Apple,
  Carrot,
  Fish,
  Milk,
  Leaf
} from 'lucide-react'

interface CategoryCardProps {
  name: string
  imageUrl: string
  icon: LucideIcon
  href: string
}

const CategoryCard = ({ name, imageUrl, icon: Icon, href }: CategoryCardProps) => {
  return (
    <Link href={href} className="group">
      <div className="relative w-44 sm:w-56 h-72 sm:h-80 rounded-3xl overflow-hidden shadow-xl bg-white transition-transform transform group-hover:scale-105 group-hover:shadow-2xl">
        {/* Imagen de fondo */}
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
        />

        {/* Capa oscura */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition duration-300" />

        {/* Burbuja de ícono */}
        <div className="absolute bottom-5 left-5 bg-orange-500 text-white rounded-full p-2 shadow-md group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6" />
        </div>

        {/* Nombre categoría */}
        <div className="absolute bottom-5 left-16 text-white font-bold text-base sm:text-lg drop-shadow-md group-hover:text-orange-200 transition-colors">
          {name}
        </div>
      </div>
    </Link>
  )
}

export const CategoryShowcase = () => {
  const categories: CategoryCardProps[] = [
    {
      name: 'Frutas 🍎',
      imageUrl: '/categories/frutas.jpg',
      icon: Apple,
      href: '/categories/1',
    },
    {
      name: 'Verduras 🥕',
      imageUrl: '/categories/verduras.jpg',
      icon: Carrot,
      href: '/categories/2',
    },
    {
      name: 'Lácteos 🧀',
      imageUrl: '/categories/lacteos.jpg',
      icon: Milk,
      href: '/categories/4',
    },
    {
      name: 'Pescados 🐟',
      imageUrl: '/categories/pescado.jpg',
      icon: Fish,
      href: '/categories/5',
    },
    {
      name: 'Hierbas 🌿',
      imageUrl: '/categories/hierbas.jpg',
      icon: Leaf,
      href: '/categories/15',
    },
  ]

  return (
    <section className="bg-gradient-to-br from-green-50 via-white to-green-100 py-10 px-6 sm:px-12 rounded-3xl shadow-inner mt-8">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-green-800 mb-10 text-center">
        ✨ Explora por Categorías
      </h2>
      <div className="flex justify-center flex-wrap gap-6">
        {categories.map((cat, index) => (
          <CategoryCard key={index} {...cat} />
        ))}
      </div>
    </section>
  )
}

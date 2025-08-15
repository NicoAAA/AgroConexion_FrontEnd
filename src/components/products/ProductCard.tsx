'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductCardProps } from '@/types/product.types';

const ProductCard: React.FC<ProductCardProps> = ({ id, name, description, price, imageUrl }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="group relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 border border-green-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fondo degradado cálido */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/20 to-amber-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />

      {/* Imagen del producto */}
      <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-green-50 to-amber-50">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-green-100 via-amber-100 to-green-100 animate-pulse" />
        )}
        <Image
          src={`http://127.0.0.1:8000${imageUrl}`}
          alt={name}
          fill
          className={`transition-all duration-700 group-hover:scale-105 object-cover ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => console.error(`Error al cargar imagen: ${imageUrl}`)}
        />

        {/* Nombre flotante */}
        <div
          className={`absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-green-800 px-3 py-1 rounded-full text-sm font-medium shadow-md transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}
        >
          {name}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5 space-y-3">
        <h2 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-green-700 transition-colors duration-300 line-clamp-2">
          {description}
        </h2>

        {/* Precio */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-lime-600 bg-clip-text text-transparent">
            ${price}
          </span>
        </div>

        {/* Botón */}
        <Link href={`/products/${id}`}>
          <button className="w-full bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg">
            <span className="flex items-center justify-center space-x-2">
              <span>Ver más</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${
                  isHovered ? 'translate-x-1' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </Link>
      </div>

      {/* Borde decorativo */}
      <div className="absolute inset-0 rounded-2xl border-2 border-green-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default ProductCard;

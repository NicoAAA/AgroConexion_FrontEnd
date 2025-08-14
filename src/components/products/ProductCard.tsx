'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'
import { ProductCardProps } from '@/types/product.types';
import { id } from 'zod/v4/locales';

const ProductCard: React.FC<ProductCardProps> = ({ id, name, description, price, imageUrl }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div 
      className="group relative bg-white backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
        
        {/* Image container with enhanced effects */}
            <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                {/* Loading shimmer effect */}
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
                )}
                    <Image
                    src={`http://127.0.0.1:8000${imageUrl}`}
                    alt={name}
                    layout="fill"
                    objectFit="cover"
                    className={`transition-all duration-700 group-hover:scale-110 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => console.error(`Error al cargar imagen: ${imageUrl}`)}
                    />
                    
                {/* Subtle overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Floating badge */}
                <div className={`absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-lg transition-all duration-300 ${
                    isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                    }`}>
                    {name}
                </div>
            </div>

            {/* Content section */}
            <div className="p-6 space-y-4">
                {/* Product name with truncation */}
                <h2 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                    {description}
                </h2>
                
                {/* Price with enhanced styling */}
                <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ${price}
                    </span>
                    <span className="text-sm text-gray-500 line-through opacity-70">
                        ${price * 1.2}
                    </span>
                </div>
                
                {/* Action button with improved design */}
                <Link href={`/products/${id}`}>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
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
        
        {/* Subtle border glow effect */}
        <div className="absolute inset-0 rounded-2xl border-2 border-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default ProductCard;
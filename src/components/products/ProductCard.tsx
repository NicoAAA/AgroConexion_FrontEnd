// components/products/ProductCard.tsx
'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductCardProps } from '@/types/product.types';
import { Heart, ShoppingCart, MessageSquare, Star } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';

const ProductCard: React.FC<ProductCardProps> = ({ id, name, description, price, imageUrl }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [commentsCount, setCommentsCount] = useState<number>(0);

  useEffect(() => {
    fetchRating();
    fetchComments();
  }, []);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await api.delete(`/cart/delete-favorites/${id}/`);
        setIsFavorite(false);
        toast.success('Producto eliminado de favoritos ❤️');
      } else {
        await api.post(`/cart/favorites/`, { product_id: id });
        setIsFavorite(true);
        toast.success('Producto agregado a favoritos ❤️');
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const errorMessage = err?.response?.data?.detail || err?.message || 'Error desconocido';
      
      if (status === 401) {
        toast.error('🔒 Inicia sesión para gestionar favoritos');
      } else if (status === 500) {
        toast.error('❌ El producto ya está en favoritos o hay un error en el servidor');
      } else {
        toast.error(`❌ Error al actualizar favoritos: ${errorMessage}`);
      }

      console.error(err?.response?.data || err?.message || err);
    }
  };

  const toggleCart = async () => {
    try {
      if (inCart) {
        await api.delete(`/cart/delete-product/${id}/`);
        setInCart(false);
        toast.success('Producto eliminado del carrito 🛒');
      } else {
        await api.post(`/cart/my-cart/`, { product_id: id, quantity: 1 });
        setInCart(true);
        toast.success('Producto agregado al carrito 🛒');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || err?.message || 'Error desconocido';
      if (err?.response?.status === 401) {
        toast.error('🔒 Inicia sesión para agregar productos al carrito');
      } else {
        toast.error(`❌ Error al actualizar el carrito: ${errorMessage}`);
      }
      console.error(err.response?.data || err.message);
    }
  };

  const fetchRating = async () => {
    try {
      const res = await api.get(`/products/stats_rating/${id}/`);
      setRating(res.data.average || 0);
    } catch (error) {
      console.error('Error obteniendo rating:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/product-comments/${id}/`);
      setCommentsCount(res.data.length || 0);
    } catch (error) {
      console.error('Error obteniendo comentarios:', error);
    }
  };

  return (
    <div
      className="group relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 border border-green-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fondo degradado */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/20 to-amber-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />

      {/* Imagen */}
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
        />

        {/* Botón favoritos */}
        <button
          onClick={toggleFavorite}
          className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md hover:scale-110 transition"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
      </div>

      {/* Contenido */}
      <div className="p-5 space-y-3">
        <h2 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2">{description}</h2>

        {/* Precio y rating */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-lime-600 bg-clip-text text-transparent">
            ${price}
          </span>
          <div className="flex items-center space-x-1 text-yellow-500">
            <Star className="w-4 h-4 fill-yellow-400" />
            <span className="text-sm text-gray-700">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Comentarios */}
        <div className="flex items-center text-gray-500 text-sm space-x-2">
          <MessageSquare className="w-4 h-4" />
          <span>{commentsCount} comentarios</span>
        </div>

        {/* Botones */}
        <div className="flex gap-3 mt-3">
          <button
            onClick={toggleCart}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold transition-all shadow-md ${
              inCart
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gradient-to-r from-green-600 to-lime-600 text-white hover:from-green-700 hover:to-lime-700'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {inCart ? 'Quitar' : 'Añadir'}
          </button>

          <Link href={`/products/${id}`} className="flex-1">
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-xl transition-all shadow-sm">
              Ver más
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

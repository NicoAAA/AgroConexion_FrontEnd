'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import Image from 'next/image';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { Minus, Plus } from 'lucide-react';
import EliminarProducto from '@/components/cart/eliminar';
import BuyCart from '@/components/cart/ComprarCarrito'

const GetCarrito = () => {
  const [cartProducts, setCartProducts] =  useState<CartProduct[]>([]);

  // Obtener productos del carrito
  const fetchCart = async () => {
    try {
      const response = await api.get('/users/cart/user/cart/');
      setCartProducts(response.data.products);
    } catch (error) {
      console.error('Error al obtener el carrito', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Función para cambiar la cantidad
  const handleQuantityChange = (productId:number, newQuantity:number) => {
    setCartProducts(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  return (
    <div className="min-h-screen flex">
     <div className="max-w-4xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🛒 Carrito de Compras</h2>

        {cartProducts.length === 0 ? (
          <p className="text-center text-gray-500">No hay productos en el carrito.</p>
        ) : (
          <ul className="space-y-6">
            {cartProducts.map((item) => (
              <li
                key={item.id}
                className="flex flex-col md:flex-row items-center justify-between p-6 bg-gray-400 rounded-2xl shadow-lg transition hover:shadow-xl"
              >
                <div className="flex items-center space-x-6 w-full md:w-2/3">
                  <div className="w-24 h-24 relative rounded-xl overflow-hidden border border-gray-200">
                    <Image
                      src={
                        item.product.images.length > 0
                          ? `http://127.0.0.1:8000${item.product.images[0].image}`
                          : '/placeholder.png'
                      }
                      alt={item.product.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{item.product.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">{item.product.description}</p>
                    <p className="text-md font-bold text-green-600">${item.product.price}</p>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex items-center space-x-3">
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item.product.id,
                        Math.max(item.quantity - 1, 1)
                      )
                    }
                    className="w-9 h-9 flex items-center justify-center bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="text-lg font-medium w-6 text-center text-zinc-950">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item.product.id,
                        item.quantity + 1
                      )
                    }
                    className="w-9 h-9 flex items-center justify-center bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className='ml-3'>
                  <EliminarProducto productId={item.product.id}/>
                </div>
              </li>
            ))}
          </ul>
        )}
        <BuyCart/>
      </div>
    </div>
  );
};

export default GetCarrito;


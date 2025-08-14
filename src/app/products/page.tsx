'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {Product} from '@/types/product.types'
import ProductCard from '@/components/products/ProductCard';
import api from '@/lib/axios'

const ListProducts = () => {
  
  const URL = '/products/list-products/';
  const [products, setProducts] = useState<Product[]>([]);
  const [errores, setError] = useState('');

  useEffect(() => {
    const GetAllProducts = async () => {
      const response = await api.get(URL);
      try {
        setProducts(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.detail ||
              'Ocurrió un error al obtener los productos.'
          );
        } else {
          setError('Error inesperado');
        }
      }
    };
    GetAllProducts();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Todos los productos</h1>
      {errores && <p className="text-red-500 mb-4">{errores}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            imageUrl={
              product.images[0]?.image || '/default-placeholder.png'
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ListProducts;

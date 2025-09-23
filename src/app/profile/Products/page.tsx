// src/app/my-products/page.tsx
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import UserProducts from "@/components/user/MyProducts";
import { Product } from "@/types/product.types";

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products/my-products/");
        setProducts(res.data.products); // 👈 tu API devuelve { user_id, username, total_products, products: [...] }
        console.log(res.data.products)
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p className="p-6">Cargando productos...</p>;
  }
    
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Mis productos</h1>
      {products.length > 0 ? (
        <UserProducts products={products} />
      ) : (
        <p>No tienes productos registrados.</p>
      )}
    </div>
  );
}


// src/app/categorias/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import Image from "next/image";
import { Leaf, ShoppingBag } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: { image: string }[];
}

interface Category {
  id: number;
  name: string;
  description: string;
  products: Product[];
}

export default function CategoriaPage() {
  const { id } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/products/categories/${id}/`
        );
        if (!res.ok) throw new Error("Error al obtener categoría");

        const categoryData: Category = await res.json();
        setCategory(categoryData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCategory();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="animate-pulse text-green-700 text-lg">
          Cargando productos...
        </p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600 text-lg">No se encontró la categoría</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* HERO con imagen de fondo */}
      <div className="">
        <div className="inset-0 bg-gradient-to-r flex flex-col justify-center items-center text-dark text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold drop-shadow-lg">
            {category.name}
          </h1>
          <p className="mt-2 text-base sm:text-lg max-w-2xl">
            {category.description}
          </p>
        </div>
      </div>

      {/* SECCIÓN DE PRODUCTOS */}
      <div className="  px-4 py-10">
        {category.products && category.products.length > 0 ? (
          <>
            <div className="flex items-center gap-2 mb-6">
              <Leaf className="text-green-700 w-6 h-6" />
              <h2 className="text-2xl font-semibold text-green-800">
                Productos disponibles
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {category.products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  imageUrl={
                    product.images && product.images.length > 0
                      ? product.images[0].image
                      : "/default-placeholder.png"
                  }
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-10 bg-green-50 rounded-lg">
            <ShoppingBag className="w-12 h-12 text-green-700 mb-4" />
            <p className="text-lg text-green-700 font-medium">
              No hay productos en esta categoría
            </p>
            <p className="text-gray-500 text-sm">
              Vuelve pronto, nuestros campesinos están cosechando más productos
              para ti.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

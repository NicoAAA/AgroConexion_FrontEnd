// src/app/categorias/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import { Leaf, ShoppingBag, Sprout } from "lucide-react";
import Footer from "@/components/home/footer";

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
      {/* HERO con colores cálidos */}
      <section className="relative bg-gradient-to-r from-amber-600 via-yellow-400 to-orange-600 text-white py-10 px-6 text-center shadow-md">
        <h1 className="text-4xl sm:text-5xl font-extrabold drop-shadow-lg flex justify-center items-center gap-3">
          <Sprout className="w-10 h-10" />
          {category.name}
        </h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto opacity-90">
          {category.description}
        </p>
      </section>

      {/* SECCIÓN INTRODUCTORIA */}
      <section className="px-6 md:px-12 py-6 bg-amber-50 text-center">
        <h2 className="text-2xl font-semibold text-amber-800 mb-3">
          Conoce nuestros productos campesinos
        </h2>
        <p className="max-w-3xl mx-auto text-gray-700">
          Cada producto en esta categoría proviene directamente de campesinos locales, 
          cultivado con dedicación y respeto por la tierra. Comprar aquí significa apoyar 
          a las comunidades rurales y disfrutar de alimentos frescos y de calidad.
        </p>
      </section>

      {/* PRODUCTOS */}
      <section className="px-6 md:px-12 py-3">
        {category.products && category.products.length > 0 ? (
          <>
            <div className="flex items-center gap-2 mb-8">
              <Leaf className="text-green-700 w-7 h-7" />
              <h2 className="text-3xl font-bold text-green-800">
                Productos disponibles
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
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
          <div className="flex flex-col items-center justify-center text-center p-10 bg-amber-100 rounded-xl shadow-sm">
            <ShoppingBag className="w-12 h-12 text-amber-700 mb-4" />
            <p className="text-lg text-amber-700 font-semibold">
              No hay productos en esta categoría
            </p>
            <p className="text-gray-600 text-sm">
              Vuelve pronto, nuestros campesinos están cosechando más productos
              para ti.
            </p>
          </div>
        )}
      </section>

      {/* CTA FINAL (colores tierra) */}
      <section className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white text-center py-8 px-6">
        <h3 className="text-2xl sm:text-3xl font-bold mb-4">
          🌾 Gracias por apoyar a nuestros campesinos
        </h3>
        <p className="max-w-2xl mx-auto mb-6 opacity-90">
          Cada compra impulsa el trabajo de las familias rurales y fomenta un
          comercio justo. Explora más categorías y descubre la riqueza del campo colombiano.
        </p>
        <a
          href="/"
          className="inline-block bg-white text-orange-600 font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-amber-100 transition mt-0"
        >
          Ver más productos
        </a>
      </section>
      <div className="">  
        <Footer />
      </div>
    </div>
  );
}

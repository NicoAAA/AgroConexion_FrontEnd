// src/app/categories/[id]/page.tsx
"use client";

/**
 * Página dinámica que muestra los productos de una categoría específica.
 * 
 * Flujo:
 * 1. Obtiene el `id` de la categoría desde la URL con `useParams`.
 * 2. Llama al backend para obtener la información de la categoría y sus productos.
 * 3. Renderiza un hero visual con la información de la categoría.
 * 4. Lista los productos con un diseño en cards.
 * 5. Incluye mensajes en caso de error o cuando no hay productos disponibles.
 * 6. Finaliza con un llamado a la acción (CTA) y el footer.
 */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import { Leaf, ShoppingBag, Sprout, Heart } from "lucide-react";
import Footer from "@/components/home/footer";
import api from "@/lib/axios";
import toast from "react-hot-toast";
/** Tipado del producto */
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: { image: string }[];
}

/** Tipado de la categoría */
interface Category {
  id: number;
  name: string;
  description: string;
  products: Product[];
}

export default function CategoriaPage() {
  // Obtiene el ID de la categoría desde la URL dinámica
  const { id } = useParams();

  // Estado local para guardar la categoría obtenida
  const [category, setCategory] = useState<Category | null>(null);

  // Estado de carga mientras se obtiene la información
  const [loading, setLoading] = useState(true);

  const [adding, setAdding] = useState(false);
  /**
   * Efecto que llama al backend para traer la información de la categoría
   * Cada vez que cambia el `id` se vuelve a ejecutar
   */
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        // Llamada a la API del backend (Django o FastAPI según tu implementación)
        const res = await fetch(
          `http://127.0.0.1:8000/api/products/categories/${id}/`
        );
        if (!res.ok) throw new Error("Error al obtener categoría");

        // Conversión de la respuesta a JSON con tipado de Category
        const categoryData: Category = await res.json();
        setCategory(categoryData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Se desactiva el loader siempre
      }
    };

    if (id) fetchCategory();
  }, [id]);

  const handleAddFavorite = async () => {
    if (!id) return;
    setAdding(true);
    try {
      await api.post("/cart/categories/", { category: Number(id) });
      toast.success("✅ Categoría añadida a favoritos");
    } catch (error: any) {
      // Si la API devuelve error porque ya está añadida
      if (error.response?.status === 400) {
        toast.error("⚠️ Esta categoría ya está en favoritos");
      } else {
        toast.error("❌ Error al añadir a favoritos");
      }
    } finally {
      setAdding(false);
    }
  };

  /** Renderizado cuando los datos están cargando */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="animate-pulse text-green-700 text-lg">
          Cargando productos...
        </p>
      </div>
    );
  }

  /** Renderizado cuando no se encuentra la categoría */
  if (!category) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600 text-lg">No se encontró la categoría</p>
      </div>
    );
  }

  return (
    <div className="w-full dark:bg-gray-900 transition-colors duration-300">
      {/* HERO - Encabezado con degradado cálido */}
      <section className=" dark:bg-black/20 relative bg-gradient-to-r from-amber-600 via-yellow-400 to-orange-600 text-white py-10 px-6 text-center shadow-md dark:from-amber-700 dark:via-yellow-500 dark:to-orange-700">
        <h1 className="text-4xl sm:text-5xl font-extrabold drop-shadow-lg flex justify-center items-center gap-3">
          <Sprout className="w-10 h-10" />
          {category.name}
        </h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto opacity-90">
          {category.description}
        </p>
      </section>

      {/* SECCIÓN INTRODUCTORIA */}
      <section className="px-6 md:px-12 py-6 bg-amber-50 text-center dark:bg-gray-800">
        <h2 className="text-2xl font-semibold text-amber-800 mb-3 dark:text-amber-200">
          Conoce nuestros productos campesinos
        </h2>
        <p className="max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
          Cada producto en esta categoría proviene directamente de campesinos
          locales, cultivado con dedicación y respeto por la tierra. Comprar aquí
          significa apoyar a las comunidades rurales y disfrutar de alimentos
          frescos y de calidad.
        </p>
      </section>

      {/* LISTADO DE PRODUCTOS */}
      <section className="px-6 md:px-12 py-3">
        {category.products && category.products.length > 0 ? (
          <>
            {/* Encabezado de productos */}
            <div className="flex items-center gap-2 mb-8">
              <Leaf className="text-green-700 w-7 h-7 dark:text-green-400" />
              <h2 className="text-3xl font-bold text-green-800 dark:text-green-400 dark:to-green-300">
                Productos disponibles
              </h2>
            </div>

            {/* Grid responsivo de productos */}
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
                      : "/default-placeholder.png" // Imagen de respaldo
                  }
                />
              ))}
            </div>
          </>
        ) : (
          // Renderizado cuando no hay productos
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

      {/* CTA FINAL - Agradecimiento */}
      <section className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white text-center py-8 px-6">
        <h3 className="text-2xl sm:text-3xl font-bold mb-4">
          🌾 Gracias por apoyar a nuestros campesinos
        </h3>
        <p className="max-w-2xl mx-auto mb-6 opacity-90">
          Cada compra impulsa el trabajo de las familias rurales y fomenta un
          comercio justo. Explora más categorías y descubre la riqueza del campo
          colombiano.
        </p>
        <section className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white text-center py-8 px-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/"
              className="inline-block bg-white text-orange-600 font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-amber-100 transition"
            >
              Ver más productos
            </a>

            <button
              onClick={handleAddFavorite}
              disabled={adding}
              className="flex items-center gap-2 bg-red-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-red-700 transition disabled:opacity-50"
            >
              <Heart className="w-5 h-5" />
              {adding ? "Añadiendo..." : "Añadir a favoritos"}
            </button>
        </section>
      </section>

      {/* Footer */}
      <div className="">
        <Footer />
      </div>
    </div>
  );
}

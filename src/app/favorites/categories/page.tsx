// src/components/cart/FavoriteCategories.tsx
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { FavoriteCategory } from "@/types/product.types";

export default function FavoriteCategories() {
  const [favorites, setFavorites] = useState<FavoriteCategory[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar las categorías favoritas
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get("/cart/categories/");
        setFavorites(res.data);
      } catch (error) {
        toast.error("❌ Error al cargar categorías favoritas");
      }
    };
    fetchFavorites();
  }, []);

  // Eliminar categoría
  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await api.delete(`/cart/delete-category/${id}/`);
      setFavorites((prev) => prev.filter((fav) => fav.id !== id));
      toast.success("✅ Eliminado de favoritos");
    } catch (error) {
      toast.error("❌ Error al eliminar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">⭐ Mis Categorías Favoritas</h2>
      {favorites.length === 0 ? (
        <p className="text-gray-500">No tienes categorías favoritas aún.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-transform"
            >
              {/* Imagen */}
              <div className="relative w-full h-40">
                <Image
                  src={`http://127.0.0.1:8000${fav.category.image!}`}
                  alt={fav.category.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Contenido */}
              <div className="p-4">
                <h3 className="text-lg font-semibold">{fav.category.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {fav.category.description}
                </p>

                <button
                  onClick={() => handleDelete(fav.id)}
                  disabled={loading}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar de favoritos
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

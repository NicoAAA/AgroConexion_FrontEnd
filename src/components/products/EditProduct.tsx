"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";

interface Category {
  id: number;
  name: string;
}

interface ProductImage {
  id: number;
  image: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categories: Category[];
  images: ProductImage[];
}

export default function EditProductForm({ productId }: { productId: number }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [deleteImages, setDeleteImages] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Cargar producto y categorías
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          api.get(`/products/detail/${productId}/`),
          api.get("/products/categories/"),
        ]);

        setProduct(productRes.data);
        setCategories(categoriesRes.data);
        console.log(productRes.data.images);
        // Extraer ids de categorías del producto
        if (productRes.data.categories) {
          setSelectedCategories(productRes.data.categories.map((c: Category) => c.id));
        }
      } catch (error) {
        toast.error("Error cargando datos del producto");
        console.error(error);
      }
    };

    fetchData();
  }, [productId]);

  // 2. Manejo de selección de categorías
  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // 3. Manejo de imágenes nuevas
  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  // 4. Manejo de eliminar imágenes existentes
  const handleDeleteImage = (id: number) => {
    setDeleteImages((prev) =>
      prev.includes(id) ? prev.filter((imgId) => imgId !== id) : [...prev, id]
    );
  };

  // 5. Submit edición
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", String(product.price));
      formData.append("stock", String(product.stock));

      formData.append("categories", JSON.stringify(selectedCategories));
      newImages.forEach((img) => formData.append("images", img));
      deleteImages.forEach((id) => formData.append("delete_images", String(id)));

      // Debug 👇
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      await api.put(`/products/edit-product/${product.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("✅ Producto actualizado con éxito");
    } catch (error) {
      toast.error("❌ Error al actualizar producto");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <p className="text-center text-gray-500">Cargando producto...</p>;

  return (
  <form
    onSubmit={handleSubmit}
    className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-8 border border-gray-100"
  >
    <h2 className="text-3xl font-extrabold text-gray-800 text-center">
      ✏️ Editar producto
    </h2>

    {/* Nombre */}
    <div>
      <label className="block text-sm font-semibold text-gray-700">Nombre</label>
      <input
        type="text"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
        className="mt-2 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-3"
        placeholder="Ej. Café orgánico premium"
      />
    </div>

    {/* Descripción */}
    <div>
      <label className="block text-sm font-semibold text-gray-700">Descripción</label>
      <textarea
        value={product.description}
        onChange={(e) => setProduct({ ...product, description: e.target.value })}
        className="mt-2 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-3"
        rows={4}
        placeholder="Agrega detalles sobre el producto..."
      />
    </div>

    {/* Precio y Stock */}
    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700">Precio</label>
        <input
          type="number"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
          className="mt-2 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-3"
          placeholder="0"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700">Stock</label>
        <input
          type="number"
          value={product.stock}
          onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })}
          className="mt-2 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-3"
          placeholder="0"
        />
      </div>
    </div>

    {/* Categorías */}
    <div>
      <label className="block text-sm font-semibold text-gray-700">Categorías</label>
      <div className="flex flex-wrap gap-3 mt-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => toggleCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition ${
              selectedCategories.includes(cat.id)
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>

    {/* Imágenes existentes */}
    <div>
      <label className="block text-sm font-semibold text-gray-700">Imágenes actuales</label>
      <div className="flex flex-wrap gap-5 mt-3">
        {product.images?.length > 0 ? (
          product.images.map((img) => (
            <div key={img.id} className="relative group">
              <img
                src={`http://127.0.0.1:8000${img.image}`}
                alt="Product"
                className={`w-28 h-28 object-cover rounded-xl border shadow ${
                  deleteImages.includes(img.id) ? "opacity-40" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => handleDeleteImage(img.id)}
                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-lg shadow-md"
              >
                {deleteImages.includes(img.id) ? "Deshacer" : "Eliminar"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">No hay imágenes registradas</p>
        )}
      </div>
    </div>

    {/* Nuevas imágenes */}
    <div>
      <label className="block text-sm font-semibold text-gray-700">Agregar imágenes</label>
      <input
        type="file"
        multiple
        onChange={handleNewImages}
        className="mt-2 block w-full text-sm text-gray-700 border border-gray-300 rounded-xl cursor-pointer focus:outline-none file:bg-green-600 file:text-white file:px-4 file:py-2 file:rounded-lg file:border-0 hover:file:bg-green-700"
      />
    </div>

    {/* Botón */}
    <div className="flex justify-end">
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition disabled:opacity-50"
      >
        {loading ? "💾 Guardando..." : "✅ Guardar cambios"}
      </button>
    </div>
  </form>
);

}

// src/app/products/[id]/page.tsx

"use client";

// Importaciones necesarias
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Product } from "@/types/product.types";
import { useParams } from "next/navigation";

// Componentes propios
import AgregarCarrito from "@/components/cart/agregar";
import BuyProduct from "@/components/cart/ComprarProducto";
import ComentsProduct from "@/components/comments/comments";

// Iconos de lucide-react
import { Home, ChevronRight, Heart, Truck, ShieldCheck } from "lucide-react";

// Manejo de navegación entre páginas
import Link from "next/link";

const DetailProduct = () => {
  // Estado del producto cargado desde la API
  const [product, setProduct] = useState<Product | null>(null);

  // Estados de control de la interfaz
  const [loading, setLoading] = useState<boolean>(true); // Para mostrar "Cargando"
  const [error, setError] = useState<string | null>(null); // Para errores en la carga
  const [selectedImage, setSelectedImage] = useState<string>(""); // Imagen seleccionada
  const [imageLoaded, setImageLoaded] = useState<boolean>(false); // Control del efecto de carga
  const [favorites, setFavorites] = useState<number[]>([]); // IDs de favoritos

  // Obtener el parámetro dinámico de la URL (/products/[id])
  const params = useParams();
  const productId = params.id;

  /**
   * 📌 useEffect para cargar la información del producto desde la API
   * Cuando cambia el `productId`, se hace una petición HTTP
   */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Llamada a la API para obtener detalles del producto
        const res = await axios.get(
          `http://127.0.0.1:8000/api/products/detail/${productId}/`
        );
        setProduct(res.data);

        // Si hay imágenes, se selecciona la primera por defecto
        if (res.data.images?.length > 0) {
          setSelectedImage(res.data.images[0].image);
        }
      } catch (err) {
        // Manejo de error si la API falla
        setError("No se pudo cargar el producto. Inténtalo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  /**
   * 📌 Manejo de favoritos (toggle)
   * Si ya está en favoritos → eliminar
   * Si no está → agregar
   */
  const toggleFavorite = async () => {
    if (!product) return;
    try {
      if (favorites.includes(product.id)) {
        // Eliminar de favoritos
        await axios.delete(
          `http://127.0.0.1:8000/api/cart/favorites/${product.id}/`
        );
        setFavorites(favorites.filter((id) => id !== product.id));
      } else {
        // Agregar a favoritos
        await axios.post(`http://127.0.0.1:8000/api/cart/favorites/`, {
          product: product.id,
        });
        setFavorites([...favorites, product.id]);
      }
    } catch (error) {
      console.error("Error al manejar favoritos:", error);
    }
  };

  // 📌 Estado de carga inicial
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-lg text-gray-500 animate-pulse">
          Cargando producto...
        </p>
      </div>
    );
  }

  // 📌 Manejo de error o producto inexistente
  if (error || !product) {
    return (
      <div className="text-center p-10">
        <p className="text-red-600 font-medium">
          {error || "Producto no encontrado"}
        </p>
      </div>
    );
  }

  // 📌 Render principal del detalle del producto
  return (
    <>
      {/* 🧭 Breadcrumb de navegación */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Home className="w-4 h-4 text-gray-400" />
            <Link href="/" className="hover:text-blue-600">Inicio</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href="/products" className="hover:text-blue-600">Productos</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-800 font-medium truncate">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* 📦 Contenido principal */}
      <div className="container mx-auto px-6 py-3 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* 🖼️ Galería de imágenes */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-2xl border bg-gray-100 overflow-hidden shadow-md">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
              {selectedImage && (
                <Image
                  src={`http://127.0.0.1:8000${selectedImage}`}
                  alt={product.name}
                  fill
                  className={`object-cover transition-all duration-500 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
              )}
            </div>

            {/* Miniaturas */}
            {product.images?.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => {
                      setSelectedImage(img.image);
                      setImageLoaded(false);
                    }}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 ${
                      selectedImage === img.image
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Image
                      src={`http://127.0.0.1:8000${img.image}`}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 📝 Información del producto */}
          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-3xl font-semibold text-blue-600">
              ${product.price.toLocaleString("es-CO")}
            </p>

            {/* Acciones (Carrito, Comprar, Favorito) */}
            <div className="flex items-center space-x-4">
              <AgregarCarrito productId={product.id} />
              <BuyProduct productId={product.id} />
              <button
                onClick={toggleFavorite}
                className={`p-3 rounded-xl border shadow-sm transition ${
                  favorites.includes(product.id)
                    ? "bg-red-100 text-red-600 border-red-300"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Descripción */}
            <div className="bg-gray-50 rounded-2xl p-6 border shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Descripción</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* Características adicionales */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 bg-white border rounded-xl p-4 shadow-sm">
                <Truck className="text-green-600 w-6 h-6" />
                <span className="text-sm text-gray-700">
                  Envío gratis en compras +$50.000
                </span>
              </div>
              <div className="flex items-center space-x-3 bg-white border rounded-xl p-4 shadow-sm">
                <ShieldCheck className="text-blue-600 w-6 h-6" />
                <span className="text-sm text-gray-700">Garantía de calidad</span>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              Stock disponible: {product.stock}
            </p>
          </div>
        </div>

        {/* 💬 Sección de comentarios */}
        <div className="mt-16">
          <ComentsProduct productId={product.id} />
        </div>
      </div>
    </>
  );
};

export default DetailProduct;

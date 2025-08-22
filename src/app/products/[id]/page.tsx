'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Product } from '@/types/product.types';
import { useParams } from 'next/navigation';
import AgregarCarrito from '@/components/cart/agregar';
import BuyProduct from '@/components/cart/ComprarProducto';
import { Home, ChevronRight } from 'lucide-react';

const DetailProduct = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [thumbnailsLoaded, setThumbnailsLoaded] = useState<{ [key: number]: boolean }>({});

  const params = useParams();
  const productId = params.id;

  useEffect(() => {
    const GetDetailProduct = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await axios.get(
          `http://127.0.0.1:8000/api/products/detail/${productId}/`
        );

        setProduct(response.data);

        if (response.data.images && response.data.images.length > 0) {
          setSelectedImage(response.data.images[0].image);
          setImageLoaded(false);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.detail ||
            error.response?.data?.message ||
            `Error ${error.response?.status}: ${error.response?.statusText}` ||
            'Ocurrió un error al obtener el producto';
          setError(errorMessage);
        } else {
          setError('Error inesperado al conectar con el servidor');
        }
      } finally {
        setLoading(false);
      }
    };

    if (productId) GetDetailProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <div className="animate-pulse text-lg text-gray-500">Cargando producto...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <div className="bg-red-50 border border-red-300 text-red-700 px-5 py-4 rounded-xl shadow-sm">
          <h2 className="font-semibold text-lg">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold text-gray-700">Producto no encontrado</h2>
        <p className="text-gray-600">No se pudo cargar la información del producto.</p>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb más limpio */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Home className="w-4 h-4 text-gray-400" />
            <span className="hover:text-blue-600 cursor-pointer">Inicio</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="hover:text-blue-600 cursor-pointer">Productos</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-800 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-1 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagen principal */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="relative aspect-square overflow-hidden bg-white rounded-2xl shadow-md border border-gray-200">
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl" />
                )}

                {selectedImage ? (
                  <Image
                    src={`http://127.0.0.1:8000${selectedImage}`}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={`object-cover transition-all duration-700 group-hover:scale-105 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => console.error(`Error al cargar imagen: ${selectedImage}`)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                    <span className="text-lg">Sin imagen</span>
                  </div>
                )}
              </div>
            </div>

            {/* Miniaturas */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => {
                      setSelectedImage(image.image);
                      setImageLoaded(false);
                    }}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === image.image
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {!thumbnailsLoaded[image.id] && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                    )}

                    <Image
                      src={`http://127.0.0.1:8000${image.image}`}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      sizes="80px"
                      className={`object-cover transition-all duration-500 ${
                        thumbnailsLoaded[image.id] ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() =>
                        setThumbnailsLoaded(prev => ({ ...prev, [image.id]: true }))
                      }
                      onError={() => console.error(`Error al cargar thumbnail: ${image.image}`)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info producto */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                Disponible
              </span>

              <h1 className="text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>

              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-blue-600">
                  ${product.price.toLocaleString('es-CO')}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Descripción</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Acciones (Carrito y Comprar) */}
            <div className="space-y-4 flex-col lg:flex">
                <BuyProduct productId={product.id} />
                
                <AgregarCarrito productId={product.id} />
            </div>


            <div className="border-t border-gray-200 pt-4">
              <span className="text-sm text-gray-600">Stock disponible: {product.stock}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailProduct;

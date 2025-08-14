'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Product } from '@/types/product.types';
import api from '@/lib/axios';
import { useParams } from 'next/navigation';
import AgregarCarrito from '@/components/cart/agregar';
import BuyProduct from '@/components/cart/ComprarProducto';

const DetailProduct = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    const [thumbnailsLoaded, setThumbnailsLoaded] = useState<{ [key: number]: boolean }>({});
    
    const params = useParams();
    const productId = params.id;
    
    console.log('Params:', params);
    console.log('ProductId:', productId);
    
    useEffect(() => {
        const GetDetailProduct = async () => {
            try {
                setLoading(true);
                setError('');
                
                console.log('Haciendo petición para ID:', productId);
                
                const response = await api.get(`/products/product/${productId}/`);
                
                console.log('Respuesta:', response.data);
                setProduct(response.data);
                
                // Establecer la primera imagen como seleccionada por defecto
                if (response.data.images && response.data.images.length > 0) {
                    setSelectedImage(response.data.images[0].image);
                    setImageLoaded(false); // Reset para nueva imagen
                }
                
            } catch (error) {
                console.error('Error al obtener producto:', error);
                
                if (axios.isAxiosError(error)) {
                    const errorMessage = error.response?.data?.detail || 
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
        
        GetDetailProduct();
    }, [productId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg text-gray-600">Cargando producto...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <h2 className="font-bold">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center p-4">
                <h2 className="text-2xl font-bold text-gray-700">Producto no encontrado</h2>
                <p className="text-gray-600">No se pudo cargar la información del producto.</p>
            </div>
        );
    }

    return (
        <>
            {/* Hero Section con breadcrumbs */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-6 py-4 max-w-7xl">
                    <nav className="flex items-center space-x-2 text-sm text-gray-600 mt-16">
                        <span className="hover:text-blue-600 cursor-pointer transition-colors">Inicio</span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="hover:text-blue-600 cursor-pointer transition-colors">Productos</span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-gray-900 font-medium">{product.name}</span>
                    </nav>
                </div>
            </div>

            {/* Contenido Principal */}
            <div className="container mx-auto px-6 py-8 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Sección de Imágenes */}
                    <div className="space-y-6">
                        {/* Imagen Principal */}
                        <div className="relative group">
                            <div className="relative aspect-square overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-200">
                                {!imageLoaded && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-2xl" />
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
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-50">
                                        <div className="text-center">
                                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-lg font-medium">Sin imagen disponible</span>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Overlay con efectos */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                                
                                {/* Botón de zoom */}
                                <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110">
                                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        {/* Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                {product.images.map((image, index) => (
                                    <button
                                        key={image.id}
                                        onClick={() => {
                                            setSelectedImage(image.image);
                                            setImageLoaded(false);
                                        }}
                                        className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:shadow-lg ${
                                            selectedImage === image.image 
                                                ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' 
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    >
                                        {!thumbnailsLoaded[image.id] && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
                                        )}
                                        
                                        <Image
                                            src={`http://127.0.0.1:8000${image.image}`}
                                            alt={`${product.name} - ${index + 1}`}
                                            fill
                                            sizes="80px"
                                            className={`object-cover transition-all duration-500 ${
                                                thumbnailsLoaded[image.id] ? 'opacity-100' : 'opacity-0'
                                            }`}
                                            onLoad={() => setThumbnailsLoaded(prev => ({ ...prev, [image.id]: true }))}
                                            onError={() => console.error(`Error al cargar thumbnail: ${image.image}`)}
                                        />
                                        
                                        {selectedImage === image.image && (
                                            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Información del Producto */}
                    <div className="space-y-8">
                        {/* Header del producto */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                                    Disponible
                                </span>
                                <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                    {/* <span className="text-sm text-gray-600 ml-2">(24 reseñas)</span> */}
                                </div>
                            </div>
                            
                            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                                {product.name}
                            </h1>
                            
                            <div className="flex items-baseline space-x-3">
                                <span className="text-3xl font-bold text-green-600">
                                    ${product.price.toLocaleString('es-CO')}
                                </span>
                                <span className="text-lg text-gray-500 line-through">
                                    ${(product.price * 1.2).toLocaleString('es-CO')}
                                </span>
                                <span className="bg-red-100 text-red-800 text-sm font-semibold px-2.5 py-1 rounded-full">
                                    -20%
                                </span>
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Descripción
                            </h2>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                {product.description}
                            </p>
                        </div>

                        {/* Características adicionales */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-green-100 p-2 rounded-lg">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Envío Gratis</h3>
                                        <p className="text-sm text-gray-600">En compras +$50.000</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="space-y-4">
                            <div className="flex space-x-4">
                                
                                <AgregarCarrito productId={product.id} />
                                
                                <button className="bg-white text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold border border-gray-300 shadow-sm hover:shadow-md transform hover:-translate-y-1">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>
                            <BuyProduct productId={product.id}/>
                        </div>

                        {/* Información de entrega */}
                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2z" />
                                    </svg>
                                    <span>Stock: {product.stock}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DetailProduct;
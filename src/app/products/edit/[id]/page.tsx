'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Product, Categories, UnitOfMeasure } from '@/types/product.types';
import api from '@/lib/axios';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import toast from 'react-hot-toast';

const EditProduct = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Categories[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);

    const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        unit_of_measure: '',
        category: [] as number[],
        images: [] as File[]
    });

    const [imagePreview, setImagePreview] = useState<{file: File, image: string}[]>([]);

    const params = useParams();
    const router = useRouter();
    const productId = params.id;

    const unitOfMeasureOptions: UnitOfMeasure[] = [
        { value: 'kg', label: 'Kilogramos' },
        { value: 'g', label: 'Gramos' },
        { value: 'l', label: 'Litros' },
        { value: 'ml', label: 'Mililitros' },
        { value: 'unidad', label: 'Unidad' },
        { value: 'li', label: 'Libra' },
    ];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/products/categories/');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Error al cargar las categorías');
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const GetDetailProduct = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await api.get(`/products/product/${productId}/`);
                const productData = response.data;
                
                setProduct(productData);
                setFormData({
                    name: productData.name || '',
                    description: productData.description || '',
                    price: productData.price?.toString() || '',
                    stock: productData.stock?.toString() || '',
                    unit_of_measure: productData.unit_of_measure || '',
                    category: productData.category
                        ?.map((cat: Categories) => cat.id)
                        ?.filter((id: number | undefined): id is number => id !== undefined) || [],
                    images: []
                });
                
                if (productData.images && productData.images.length > 0) {
                    setSelectedImage(productData.images[0].image);
                    setImageLoaded(false);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                if (axios.isAxiosError(error)) {
                    const errorMessage = error.response?.data?.detail || 'Error al obtener el producto';
                    setError(errorMessage);
                    toast.error(errorMessage);
                } else {
                    setError('Error inesperado al conectar con el servidor');
                    toast.error('Error inesperado al conectar con el servidor');
                }
            } finally {
                setLoading(false);
            }
        };
        
        if (productId) {
            GetDetailProduct();
        }
    }, [productId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (categoryId: number) => {
        setFormData(prev => {
            const currentCategories = prev.category.filter(id => id !== undefined);
            const newCategories = currentCategories.includes(categoryId)
                ? currentCategories.filter(id => id !== categoryId)
                : [...currentCategories, categoryId];
            
            return {
                ...prev,
                category: newCategories
            };
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Validar tamaño máximo (5MB)
        const MAX_SIZE = 5 * 1024 * 1024;
        const oversizedFiles = files.filter(f => f.size > MAX_SIZE);
        
        if (oversizedFiles.length > 0) {
            toast.error(`Algunas imágenes superan el tamaño máximo de 5MB`);
            return;
        }

        setFormData(prev => ({ ...prev, images: files }));

        const newPreviews: {file: File, image: string}[] = [];
        let loadedCount = 0;

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    newPreviews.push({ file, image: e.target.result as string });
                    loadedCount++;
                    if (loadedCount === files.length) {
                        setImagePreview(newPreviews);
                    }
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImageFromPreview = (index: number) => {
        setImagePreview(prev => prev.filter((_, i) => i !== index));
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleRemoveCurrentImage = (imageId: number) => {
        if (!imagesToDelete.includes(imageId)) {
            setImagesToDelete(prev => [...prev, imageId]);
        }
        
        setProduct(prev => {
            if (!prev) return prev;
            
            const updatedImages = prev.images.filter(img => img.id !== imageId);
            
            if (selectedImage && prev.images.find(img => img.id === imageId)?.image === selectedImage) {
                if (updatedImages.length > 0) {
                    setSelectedImage(updatedImages[0].image);
                    setImageLoaded(false);
                } else {
                    setSelectedImage('');
                }
            }
            
            return {
                ...prev,
                images: updatedImages
            };
        });
    };

    const validateForm = () => {
        const validCategories = formData.category.filter(c => c !== undefined);
        
        if (!formData.name.trim()) {
            toast.error('El nombre del producto es requerido');
            return false;
        }
        if (!formData.description.trim()) {
            toast.error('La descripción es requerida');
            return false;
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            toast.error('El precio debe ser mayor a 0');
            return false;
        }
        if (!formData.stock || parseInt(formData.stock) < 0) {
            toast.error('El stock debe ser mayor o igual a 0');
            return false;
        }
        if (!formData.unit_of_measure) {
            toast.error('La unidad de medida es requerida');
            return false;
        }
        if (validCategories.length === 0) {
            toast.error('Debe seleccionar al menos una categoría válida');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        try {
            const submitData = new FormData();
            submitData.append('name', formData.name.trim());
            submitData.append('description', formData.description.trim());
            submitData.append('price', formData.price);
            submitData.append('stock', formData.stock);
            submitData.append('unit_of_measure', formData.unit_of_measure);

            // Agregar categorías válidas
            formData.category
                .filter(categoryId => categoryId !== undefined && typeof categoryId === 'number')
                .forEach(categoryId => {
                    submitData.append('category', categoryId.toString());
                });

            // Agregar nuevas imágenes
            formData.images.forEach(image => {
                submitData.append('images', image);
            });

            // Agregar imágenes a eliminar
            imagesToDelete.forEach(imageId => {
                submitData.append('images_to_delete', imageId.toString());
            });

            // URL corregida para coincidir con el backend
            const response = await api.put(`/products/edit-product/${productId}/`, submitData);

            toast.success('Producto actualizado exitosamente');
            router.push(`/products/${productId}`);
            
        } catch (error) {
            console.error('Error completo:', error);
            
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    toast.error('Endpoint no encontrado. Verifica la URL.');
                } else if (error.response?.status === 400) {
                    const errorData = error.response.data;
                    if (typeof errorData === 'object' && errorData !== null) {
                        Object.values(errorData).forEach((err: any) => {
                            if (Array.isArray(err)) {
                                err.forEach(e => toast.error(e));
                            } else {
                                toast.error(err.toString());
                            }
                        });
                    }
                }
            } else {
                toast.error('Error inesperado al actualizar producto');
            }
        } finally {
            setSubmitting(false);
        }
    };

    // ... (resto del código JSX permanece igual) ...
    // Resto del JSX igual (puedes mantener el formulario, imágenes, etc.)
    return (
        <>
             {/* Breadcrumbs */}
            <div className="bg-white shadow-sm border-b border-gray-200 mt-20">
                <div className="container mx-auto px-6 py-4 max-w-4xl">
                    <nav className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="hover:text-blue-600 cursor-pointer transition-colors">Inicio</span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="hover:text-blue-600 cursor-pointer transition-colors">Productos</span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-gray-900 font-medium">Editar Producto</span>
                    </nav>
                </div>
            </div>

            {/* Formulario */}
            <div className="container mx-auto px-6 py-8 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Editar Producto
                        </h1>
                        <p className="text-blue-100">
                            Modifica la información de tu producto
                        </p>
                    </div>

                    {/* Contenido */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Imágenes actuales */}
                        {product?.images && product.images.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Imágenes Actuales
                                </h3>
                                
                                {/* Imagen principal */}
                                <div className="relative group max-w-md">
                                    <div className="relative aspect-square overflow-hidden bg-white rounded-xl shadow-lg border border-gray-200">
                                        {!imageLoaded && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-xl" />
                                        )}
                                        
                                        {selectedImage && (
                                            <Image
                                                src={`http://127.0.0.1:8000${selectedImage}`}
                                                alt={product.name}
                                                fill
                                                sizes="400px"
                                                className={`object-cover transition-all duration-700 ${
                                                    imageLoaded ? 'opacity-100' : 'opacity-0'
                                                }`}
                                                onLoad={() => setImageLoaded(true)}
                                                onError={() => console.error(`Error al cargar imagen: ${selectedImage}`)}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Thumbnails */}
                                {product.images.length > 1 && (
                                    <div className="flex space-x-3 overflow-x-auto pb-2">
                                        {product.images.map((image, index) => (
                                            <button
                                                key={image.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedImage(image.image);
                                                    setImageLoaded(false);
                                                }}
                                                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                                    selectedImage === image.image 
                                                        ? 'border-blue-500 shadow-lg' 
                                                        : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                            >
                                                <Image
                                                    src={`http://127.0.0.1:8000${image.image}`}
                                                    alt={`${product.name} - ${index + 1}`}
                                                    fill
                                                    sizes="64px"
                                                    className="object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Información básica */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Nombre del Producto *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black"
                                    placeholder="Ingresa el nombre del producto"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Precio *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Stock *
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black"
                                    placeholder="0"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Unidad de Medida *
                                </label>
                                <select
                                    name="unit_of_measure"
                                    value={formData.unit_of_measure}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black"
                                >
                                    <option value="">Selecciona una unidad</option>
                                    {unitOfMeasureOptions.map((unit) => (
                                        <option key={unit.value} value={unit.value}>
                                            {unit.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Descripción *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-black"
                                placeholder="Describe tu producto..."
                            />
                        </div>

                        {/* Categorías */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Categorías
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {categories.map((category) => (
                                    <label
                                        key={category.id}
                                        className="flex items-center space-x-3 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.category.includes(category.id)}
                                            onChange={() => handleCategoryChange(category.id)}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">
                                            {category.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Nuevas imágenes */}
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-gray-700">
                                Agregar Nuevas Imágenes
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                <input
                                    type="file"
                                    id="images"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <label htmlFor="images" className="cursor-pointer">
                                    <div className="flex flex-col items-center">
                                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="text-gray-600 mb-2">Haz clic aquí para subir imágenes</p>
                                        <p className="text-sm text-gray-500">PNG, JPG, WebP hasta 10MB</p>
                                    </div>
                                </label>
                            </div>
                            
                            {/* Preview de nuevas imágenes */}
                            {imagePreview.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Nuevas imágenes seleccionadas:</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {imagePreview.map((image, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={image.image}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-colors"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImageFromPreview(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors shadow-md"
                                                >
                                                    ×
                                                </button>
                                                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                                    {index + 1}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="flex space-x-4 pt-6">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                            >
                                {submitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Actualizando...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Actualizar Producto</span>
                                    </>
                                )}
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="bg-gray-600 text-white py-4 px-8 rounded-xl hover:bg-gray-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditProduct;
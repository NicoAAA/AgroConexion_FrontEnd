'use client'
import {NewProduct, Categories, UnitOfMeasure, Image, CategoryProducs} from '@/types/product.types'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import {isAuthenticated, getStoredTokens} from '@/lib/auth'
import axios from 'axios';
import api from '@/lib/axios'
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';

const CreateProduct = ()=>{
    const router = useRouter()
    const [errores, setError] = useState('')
    const [accessToken, setAccessToken] = useState<string | null>(null)

    // verificamos que el usuario este logeado
    useEffect(() => {
        const { access } = getStoredTokens()
        if (!access || !isAuthenticated()) {
            setError('No estás autenticado. Serás redirigido al login...')
            setTimeout(() => router.push('/login'), 3000)
        } else {
            setAccessToken(access)
        }
    }, [router])


    // URLS de la peticiones
    const UrlNewProduct:string = '/products/form/new-product/'
    const UrlCategories:string = '/products/categories/'

    const unitOptions: UnitOfMeasure[] = [
        { value: 'kg', label: 'Kilogramos' },
        { value: 'g', label: 'Gramos' },
        { value: 'l', label: 'Litros' },
        { value: 'ml', label: 'Mililitros' },
        { value: 'unidad', label: 'Unidad' },
        { value: 'li', label: 'Libra' },
    ]

    const [form, setForm] = useState<NewProduct>({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        unit_of_measure: [],
        images: [],
        category: [],
    })

    const [success, setSuccess] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [categories, setCategories] = useState<CategoryProducs[]>([])
    const [imageFiles, setImageFiles] = useState<File[]>([])
    
    // Estados para dropdowns
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState<boolean>(false)
    const [unitDropdownOpen, setUnitDropdownOpen] = useState<boolean>(false)

    // Obtenemos la informnacion de las categorias
    useEffect(()=>{
        const loadInitialData = async() => {
            try{
                if (!isAuthenticated()) {
                    setError('No estás autenticado. Serás redirigido al login...')
                    
                    const timeout = setTimeout(() => {
                    router.push('/login')
                }, 3000)

                return () => clearTimeout(timeout)
                }

                const responseCategories = await api.get(UrlCategories)
                // categorias
                setCategories(responseCategories.data)
            // Manejo de errores
            }catch(error){
                if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.detail ||
                    'Ocurrió un error al obtener las categorias'
                );
                } else {
                setError('Error inesperado');
                }
            }
        }
        loadInitialData()
    },[])

    // Manejo de ambios en el formulario
    const hanleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        const {name, value} = e.target
        setForm(prev =>({
            ...prev, [name]: name === 'price' || name === 'stock' ? Number(value): value
        }))
    }

    // Manejo de cambio en la selcion de categorias
    const hanleChangeCategory = (categoryId: number)=>{
        const selectCategory = categories.find(cat => cat.id === categoryId)
        if(!selectCategory) return

        setForm(prev=>{
            const isSelected = prev.category.some(cat=> cat.id === categoryId)
            if(isSelected){
                return{
                    ...prev, category: prev.category.filter(cat => cat.id !== categoryId)
                }
            }else{
                return{
                    ...prev,
                    category: [...prev.category, selectCategory]
                }
            }
        })
    }

    // Manejo de cambios en la seleccion de unidades de medida
    const hanleChangeUnit = (unitValue: string) => {
        const selectedUnit = unitOptions.find(unit => unit.value === unitValue)
        if (!selectedUnit) return

        setForm(prev => {
            const isAlreadySelected = prev.unit_of_measure?.[0]?.value === unitValue

            return {
                ...prev,
                unit_of_measure: isAlreadySelected ? [] : [selectedUnit]  // solo una unidad seleccionada
            }
        })
    }

    // Manejo de cambios de imagenes
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            const fileArray = Array.from(files)
            setImageFiles(prev => [...prev, ...fileArray])
            
            // Convertir archivos a formato Image para el form
            const imagePromises = fileArray.map(file => {
                return new Promise<Image>((resolve) => {
                    const reader = new FileReader()
                    reader.onload = (e) => {
                        resolve({
                            image: e.target?.result as string
                        })
                    }
                    reader.readAsDataURL(file)
                })
            })
            
            Promise.all(imagePromises).then(imageObjects => {
                setForm(prev => ({
                    ...prev,
                    images: [...prev.images, ...imageObjects]
                }))
            })
        }
    }

    // Manjo de eliminacion de iumagenes
    const removeImage = (index: number) => {
        setForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }))
        setImageFiles(prev => prev.filter((_, i) => i !== index))
    }

    // Validacion a la horta de enviar el formulario
    const validateForm = (): boolean => {
        if (!form.name.trim()) {
            setError('El nombre del producto es requerido')
            return false
        }
        if (!form.description.trim()) {
            setError('La descripción es requerida')
            return false
        }
        if (form.price <= 0) {
            setError('El precio debe ser mayor a 0')
            return false
        }
        if (form.stock < 0) {
            setError('El stock no puede ser negativo')
            return false
        }
        if (form.category.length === 0) {
            setError('Debe seleccionar al menos una categoría')
            return false
        }
        if (form.unit_of_measure.length === 0) {
            setError('Debe seleccionar al menos una unidad de medida')
            return false
        }
        
        setError('')
        return true
    }

    // Manejo de formulario
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
        // Convertimo la informacion del formulario en json
        const formData = new FormData()
        formData.append('name', form.name)
        formData.append('description', form.description)
        formData.append('price', form.price.toString())
        formData.append('stock', form.stock.toString())

        
        form.category.forEach(cat => {
            formData.append('category', String(cat.id))
        })

        
        form.unit_of_measure.forEach(unit => {
            formData.append('unit_of_measure', unit.value)
        })

        
        imageFiles.forEach(file => {
            formData.append('images', file)
        })

        const { access } = getStoredTokens()

        // Peticion para crear un producto
        const response = await api.post(UrlNewProduct, formData, {
            headers: {
                Authorization: `Bearer ${access}`,
                'Content-Type': 'multipart/form-data'
            }
        })

        // reseteamos el formulario
        setSuccess(true)
        setForm({
            name: '',
            description: '',
            price: 0,
            stock: 0,
            unit_of_measure: [],
            images: [],
            category: [],
        })
        setImageFiles([])

        setTimeout(() => setSuccess(false), 3000)

        setTimeout(() => router.push('/login'), 3000)

    // Manejko de errores
    } catch (error: any) {
        console.error('Error creating product:', error)
        setError(
            error.response?.data?.message ||
            'Error al crear el producto. Inténtalo de nuevo.'
        )
    } finally {
        setLoading(false)
    }
}


    if (!accessToken) {
    return (
        <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded-lg shadow-md text-center">
            <p className="text-red-600 font-medium">{errores || 'Cargando...'}</p>
        </div>
        )
    }

    return (

        <>
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md my-10">
                <h2 className="text-center text-2xl mt-8 font-bold mb-6 text-gray-800">Crear Nuevo Producto</h2>
                
                {success && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded text-center">
                        ¡Producto creado exitosamente!
                    </div>
                )}
                
                {errores && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded text-center">
                        {errores}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6 text-black border-gray-500">
                    {/* Nombre del producto */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1  text-black">
                            Nombre del Producto
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={hanleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                            placeholder="Ingresa el nombre del producto"
                            required
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium  text-black mb-1">
                            Descripción
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={hanleChange}
                            rows={4}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Describe el producto..."
                            required
                        />
                    </div>

                    {/* Precio y Stock */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium  text-black mb-1">
                                Precio
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={form.price}
                                onChange={hanleChange}
                                min="0"
                                step="0.01"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                placeholder="0.00"
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium  text-black mb-1">
                                Stock
                            </label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                value={form.stock}
                                onChange={hanleChange}
                                min="0"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                placeholder="0"
                                required
                            />
                        </div>
                    </div>

                    {/* Categorías - Dropdown */}
                    <div>
                        <label className="block text-sm font-medium  text-black mb-2">
                            Categorías
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                                className="w-full p-3 border border-gray-300 rounded-md bg-white text-left focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
                            >
                                <span className=" text-black">
                                    {form.category.length === 0 
                                        ? 'Selecciona categorías...' 
                                        : `${form.category.length} categoría(s) seleccionada(s)`
                                    }
                                </span>
                                <svg className={`w-5 h-5 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            
                            {categoryDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {categories.map((category) => (
                                        <label key={category.id} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={form.category.some(cat => cat.id === category.id)}
                                                onChange={() => hanleChangeCategory(category.id)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                                            />
                                            <span className="text-gray-700">{category.name}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {form.category.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {form.category.map(cat => (
                                    <span key={cat.id} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                        {cat.name}
                                        <button
                                            type="button"
                                            onClick={() => hanleChangeCategory(cat.id)}
                                            className="ml-1 text-blue-600 hover:text-blue-800"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Unidades de medida - Dropdown */}
                    <div>
                        <label className="block text-sm font-medium  text-black mb-2">
                            Unidades de Medida *
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
                                className="w-full p-3 border border-gray-300 rounded-md bg-white text-left focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
                            >
                                <span className="text-gray-700">
                                    {form.unit_of_measure.length === 0 
                                        ? 'Selecciona unidades de medida...' 
                                        : `${form.unit_of_measure.length} unidad(es) seleccionada(s)`
                                    }
                                </span>
                                <svg className={`w-5 h-5 transition-transform ${unitDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            
                            {unitDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {unitOptions.map((unit) => (
                                        <label key={unit.value} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={form.unit_of_measure.some(u => u.value === unit.value)}
                                                onChange={() => hanleChangeUnit(unit.value)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                                            />
                                            <span className="text-gray-700">{unit.label}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {form.unit_of_measure.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {form.unit_of_measure.map(unit => (
                                    <span key={unit.value} className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                        {unit.label}
                                        <button
                                            type="button"
                                            onClick={() => hanleChangeUnit(unit.value)}
                                            className="ml-1 text-green-600 hover:text-green-800"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Imágenes */}
                    <div>
                        <label htmlFor="images" className="block text-sm font-medium  text-black mb-2">
                            Imágenes del Producto
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                            <input
                                type="file"
                                id="images"
                                name="images"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            <label htmlFor="images" className="cursor-pointer">
                                <div className="flex flex-col items-center">
                                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="text-gray-600 mb-2">Haz clic aquí para subir imágenes</p>
                                    <p className="text-sm text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                                </div>
                            </label>
                        </div>
                        
                        {/* Preview de imágenes mejorado */}
                        {form.images.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-medium  text-black mb-2">Imágenes seleccionadas:</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {form.images.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={image.image}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-colors"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
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

                    {/* Botón de envío */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        {loading ? 'Creando Producto...' : 'Crear Producto'}
                    </button>
                </form>
            </div>
        </>
        
    )
}

export default CreateProduct
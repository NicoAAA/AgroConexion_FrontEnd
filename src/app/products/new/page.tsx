// src/app/products/new/page.tsx

'use client'

// Importación de tipos y dependencias
import { NewProduct, Categories, UnitOfMeasure, Image, CategoryProducs } from '@/types/product.types'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { isAuthenticated, getStoredTokens } from '@/lib/auth'
import axios from 'axios';
import api from '@/lib/axios'

/**
 * Componente CreateProduct
 * 
 * Pantalla para crear un nuevo producto en AgroConexión.
 * Incluye:
 * - Validación de autenticación
 * - Formulario con inputs controlados
 * - Manejo de imágenes
 * - Selección de categorías y unidades de medida
 * - Petición POST al backend
 */
const CreateProduct = () => {
  const router = useRouter()

  // Estado para mensajes de error
  const [errores, setError] = useState('')
  // Token de autenticación (JWT)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  /**
   * useEffect inicial:
   * - Revisa si el usuario está autenticado.
   * - Si no, lo redirige al login en 3 segundos.
   */
  useEffect(() => {
    const { access } = getStoredTokens()
    if (!access || !isAuthenticated()) {
      setError('No estás autenticado. Serás redirigido al login...')
      setTimeout(() => router.push('/login'), 3000)
    } else {
      setAccessToken(access)
    }
  }, [router])

  // Endpoints de la API
  const UrlNewProduct: string = '/products/form/new-product/'
  const UrlCategories: string = '/products/categories/'

  /**
   * Opciones de unidades de medida para el formulario
   */
  const unitOptions: UnitOfMeasure[] = [
    { value: 'kg', label: 'Kilogramos' },
    { value: 'g', label: 'Gramos' },
    { value: 'l', label: 'Litros' },
    { value: 'ml', label: 'Mililitros' },
    { value: 'unidad', label: 'Unidad' },
    { value: 'li', label: 'Libra' },
  ]

  /**
   * Estado principal del formulario
   */
  const [form, setForm] = useState<NewProduct>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    unit_of_measure: [],
    images: [],
    category: [],
  })

  // Estados auxiliares
  const [success, setSuccess] = useState<boolean>(false) // Producto creado
  const [loading, setLoading] = useState<boolean>(false) // Spinner de carga
  const [categories, setCategories] = useState<CategoryProducs[]>([]) // Categorías de BD
  const [imageFiles, setImageFiles] = useState<File[]>([]) // Archivos físicos seleccionados
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState<boolean>(false) // Dropdown categorías
  const [unitDropdownOpen, setUnitDropdownOpen] = useState<boolean>(false) // Dropdown unidades

  /**
   * Cargar categorías desde el backend al montar el componente
   */
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        if (!isAuthenticated()) {
          setError('No estás autenticado. Serás redirigido al login...')
          const timeout = setTimeout(() => {
            router.push('/login')
          }, 3000)
          return () => clearTimeout(timeout)
        }
        const responseCategories = await api.get(UrlCategories)
        setCategories(responseCategories.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.detail ||
            'Ocurrió un error al obtener las categorías'
          );
        } else {
          setError('Error inesperado');
        }
      }
    }
    loadInitialData()
  }, [])

  /**
   * Manejo de inputs de texto y textarea (nombre, descripción, precio, stock)
   */
  const hanleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev, [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }))
  }

  /**
   * Selección/deselección de categorías
   */
  const hanleChangeCategory = (categoryId: number) => {
    const selectCategory = categories.find(cat => cat.id === categoryId)
    if (!selectCategory) return
    setForm(prev => {
      const isSelected = prev.category.some(cat => cat.id === categoryId)
      if (isSelected) {
        return { ...prev, category: prev.category.filter(cat => cat.id !== categoryId) }
      } else {
        return { ...prev, category: [...prev.category, selectCategory] }
      }
    })
  }

  /**
   * Selección de unidades de medida (solo una a la vez)
   */
  const hanleChangeUnit = (unitValue: string) => {
    const selectedUnit = unitOptions.find(unit => unit.value === unitValue)
    if (!selectedUnit) return
    setForm(prev => {
      const isAlreadySelected = prev.unit_of_measure?.[0]?.value === unitValue
      return { ...prev, unit_of_measure: isAlreadySelected ? [] : [selectedUnit] }
    })
  }

  /**
   * Manejo de carga de imágenes locales
   */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const fileArray = Array.from(files)
      setImageFiles(prev => [...prev, ...fileArray])

      // Convertir a base64 para previsualización inmediata
      const imagePromises = fileArray.map(file => {
        return new Promise<Image>((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            resolve({ image: e.target?.result as string })
          }
          reader.readAsDataURL(file)
        })
      })

      Promise.all(imagePromises).then(imageObjects => {
        setForm(prev => ({ ...prev, images: [...prev.images, ...imageObjects] }))
      })
    }
  }

  /**
   * Eliminar imagen del formulario y de la vista previa
   */
  const removeImage = (index: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
    setImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  /**
   * Validaciones básicas del formulario
   */
  const validateForm = (): boolean => {
    if (!form.name.trim()) { setError('El nombre del producto es requerido'); return false }
    if (!form.description.trim()) { setError('La descripción es requerida'); return false }
    if (form.price <= 0) { setError('El precio debe ser mayor a 0'); return false }
    if (form.stock < 0) { setError('El stock no puede ser negativo'); return false }
    if (form.category.length === 0) { setError('Debe seleccionar al menos una categoría'); return false }
    if (form.unit_of_measure.length === 0) { setError('Debe seleccionar al menos una unidad de medida'); return false }
    setError(''); return true
  }

  /**
   * Envío del formulario:
   * - Convierte datos en FormData (incluye imágenes)
   * - Llama al endpoint con autenticación
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('description', form.description)
      formData.append('price', form.price.toString())
      formData.append('stock', form.stock.toString())
      form.category.forEach(cat => formData.append('category', String(cat.id)))
      form.unit_of_measure.forEach(unit => formData.append('unit_of_measure', unit.value))
      imageFiles.forEach(file => formData.append('images', file))

      const { access } = getStoredTokens()
      await api.post(UrlNewProduct, formData, {
        headers: { Authorization: `Bearer ${access}`, 'Content-Type': 'multipart/form-data' }
      })

      // Resetear formulario
      setSuccess(true)
      setForm({ name: '', description: '', price: 0, stock: 0, unit_of_measure: [], images: [], category: [] })
      setImageFiles([])
      setTimeout(() => setSuccess(false), 3000)
    } catch (error: any) {
      console.error('Error creating product:', error)
      setError(error.response?.data?.message || 'Error al crear el producto. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Si no hay token de acceso, se muestra un mensaje
   */
  if (!accessToken) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded-lg shadow-md text-center">
        <p className="text-red-600 font-medium">{errores || 'Cargando...'}</p>
      </div>
    )
  }

  /**
   * Renderizado del formulario
   */
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg my-10 border border-gray-200">
      <h2 className="text-center text-3xl font-bold mb-6 text-green-700">🌱 Crear Nuevo Producto</h2>

      {/* Mensajes de éxito o error */}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded text-center font-semibold">
          ✅ ¡Producto creado exitosamente!
        </div>
      )}
      {errores && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded text-center font-semibold">
          ⚠️ {errores}
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6 text-black">

        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Nombre del Producto</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={hanleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Ej: Tomate cherry fresco"
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={hanleChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="Agrega una descripción atractiva del producto..."
            required
          />
        </div>

        {/* Precio y Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Precio</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={hanleChange}
              min="0"
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={hanleChange}
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="0"
              required
            />
          </div>
        </div>

        {/* Categorías */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Categorías</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-left focus:ring-2 focus:ring-green-500 flex justify-between items-center"
            >
              <span>{form.category.length === 0 ? 'Selecciona categorías...' : `${form.category.length} seleccionadas`}</span>
              <svg className={`w-5 h-5 ${categoryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {categoryDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center p-3 hover:bg-green-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.category.some(cat => cat.id === category.id)}
                      onChange={() => hanleChangeCategory(category.id)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500 mr-3"
                    />
                    <span className="text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Unidades */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Unidades de Medida</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-left focus:ring-2 focus:ring-green-500 flex justify-between items-center"
            >
              <span>{form.unit_of_measure.length === 0 ? 'Selecciona unidades...' : `${form.unit_of_measure.length} seleccionada(s)`}</span>
              <svg className={`w-5 h-5 ${unitDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {unitDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {unitOptions.map((unit) => (
                  <label key={unit.value} className="flex items-center p-3 hover:bg-green-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.unit_of_measure.some(u => u.value === unit.value)}
                      onChange={() => hanleChangeUnit(unit.value)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500 mr-3"
                    />
                    <span className="text-gray-700">{unit.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Imágenes */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Imágenes del Producto</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition">
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="images" />
            <label htmlFor="images" className="cursor-pointer text-green-600 hover:text-green-800 font-medium">
              📷 Haz clic aquí para subir imágenes
            </label>
          </div>
          {form.images.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2 text-gray-700">Imágenes seleccionadas:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {form.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-green-400 transition"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 shadow"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Botón submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition font-semibold"
        >
          {loading ? '🌱 Creando Producto...' : '✅ Crear Producto'}
        </button>
      </form>
    </div>
  )
}

export default CreateProduct

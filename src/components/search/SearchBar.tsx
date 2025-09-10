'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react' // 👈 Importamos la lupa

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todas')
  const [open, setOpen] = useState(false)
  const [showInput, setShowInput] = useState(false) // 👈 controla si se muestra input en mobile

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(
      `/search?query=${encodeURIComponent(query)}&category=${category}`
    )
    setShowInput(false) // 👈 en móvil se cierra al buscar
  }

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-3xl mx-auto px-3 sm:px-4"
    >
      <div className="relative flex w-full items-stretch bg-green-100 border border-green-300 rounded-lg shadow-sm overflow-hidden">
        
        {/* Botón de categorías (oculto en mobile) */}
        <div className="relative hidden sm:block">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="flex items-center justify-between gap-2 h-full px-4 text-sm font-medium text-green-900 bg-green-200 hover:bg-green-300 transition"
          >
            {category}
            <svg
              className="w-3 h-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          {open && (
            <div className="absolute mt-1 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-md w-44">
              <ul className="py-2 text-sm text-gray-700" role="listbox">
                {['Todas', 'Frutas', 'Verduras', 'Granos', 'Lácteos'].map(
                  (cat) => (
                    <li key={cat}>
                      <button
                        type="button"
                        onClick={() => {
                          setCategory(cat)
                          setOpen(false)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-green-50 transition"
                      >
                        {cat}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Input de búsqueda (hidden en mobile hasta que se toque la lupa) */}
        <div
          className={`relative flex-1 ${
            showInput ? 'block' : 'hidden sm:block'
          }`}
        >
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar frutas, verduras, lácteos..."
            className="block w-full p-2.5 text-sm text-gray-900 bg-white border-none focus:ring-0"
            required
          />
          <button
            type="submit"
            className="absolute top-0 right-0 h-full px-3 sm:px-4 bg-green-600 hover:bg-green-700 transition flex items-center justify-center"
          >
            <Search size={18} className="text-white" /> {/* 👈 Lupa en vez de imagen */}
            <span className="sr-only">Buscar</span>
          </button>
        </div>

        {/* Solo en mobile: botón lupa flotante que abre input */}
        <button
          type="button"
          onClick={() => setShowInput(!showInput)}
          className="sm:hidden flex items-center justify-center p-2 bg-green-600 text-white hover:bg-green-700"
        >
          <Search size={20} />
        </button>
      </div>
    </form>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todas')
  const [open, setOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/search?query=${encodeURIComponent(query)}&category=${category}`)
  }

  return (
    <form onSubmit={handleSearch} className="max-w-lg w-full">
      <div className="flex">
        {/* Botón de categorías */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-green-900 bg-green-200 border border-green-400 rounded-s-lg hover:bg-green-200 focus:ring-4 focus:outline-none focus:ring-green-200"
          >
            {category}
            <svg
              className="w-2.5 h-2.5 ml-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
            </svg>
          </button>

          {/* Dropdown de categorías */}
          {open && (
            <div className="absolute mt-1 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44">
              <ul className="py-2 text-sm text-gray-700">
                {['Todas', 'Frutas', 'Verduras', 'Granos', 'Lácteos'].map((cat) => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => {
                        setCategory(cat)
                        setOpen(false)
                      }}
                      className="inline-flex w-full px-4 py-2 hover:bg-green-50"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Input de búsqueda */}
        <div className="relative w-full max-w-lg">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="block p-2.5 w-[500px] z-20 text-sm text-gray-900 bg-[#fefdf9] rounded-e-lg border border-green-300 focus:ring-green-500 focus:border-green-500"
            placeholder="Buscar frutas, verduras, lácteos..."
            required
          />
          <button
            type="submit"
            className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-green-600 rounded-e-lg border border-green-300 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300"
          >
            <Image src="/icons/leaf.svg" alt="Buscar" width={16} height={16} />
            <span className="sr-only">Buscar</span>
          </button>
        </div>
      </div>
    </form>
  )
}

'use client';

import api from '@/lib/axios';
import { Categories } from '@/types/product.types';
import { useEffect, useState, useRef } from 'react';

const GetAllCategories = () => {
  const [category, setCategory] = useState<Categories[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const URL: string = '/products/categories/';

  useEffect(() => {
    const GetCategory = async () => {
      try {
        const response = await api.get(URL);
        setCategory(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    GetCategory();
  }, []);

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
            onClick={() => setOpen(!open)}
            className="text-white text-sm font-medium hover:underline focus:outline-none"
            type="button"
        >
            Categorías
            <svg
                className="w-2.5 h-2.5 ms-1 inline"
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
        <div className="absolute mt-2 w-44 bg-white rounded-lg shadow z-20 dark:bg-gray-700">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            {category.map((cat) => (
              <li key={cat.id}>
                <a
                  title={cat.description}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                >
                  {cat.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GetAllCategories;

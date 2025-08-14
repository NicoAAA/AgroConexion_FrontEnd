'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { LogOut, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth'; // Ajusta si tu path es diferente

const NavUser = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, initializeAuth } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Inicializar autenticación una sola vez
  useEffect(() => {
    initializeAuth();
  }, []);

  // Cerrar dropdown si se hace clic fuera
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

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada correctamente');
    router.push('/login');
  };

  const handleLogin = () => router.push('/login');
  const handleRegister = () => router.push('/register');

  const getFullImageUrl = (path: string) => {
    return path.startsWith('http') ? path : `http://127.0.0.1:8000${path}`;
  };

  // Esperar a que cargue el estado desde localStorage
  if (isLoading) return null;

  return (
    <div className="relative flex items-center space-x-4" ref={dropdownRef}>
      {isAuthenticated && user ? (
        <>
          <button onClick={() => setOpen(!open)} className="focus:outline-none">
            {user.userImage ? (
              <Image
                src={getFullImageUrl(user.userImage)}
                alt={user.userName}
                width={40}
                height={40}
                className="rounded-full object-cover border-2 border-blue-600"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.userName?.charAt(0).toUpperCase() ?? 'U'}
              </div>
            )}
          </button>

          {open && (
            <div className="p-3 absolute right-0 top-full mt-2 w-44 bg-white rounded-lg shadow z-20 dark:bg-gray-700">
              <ul className="space-x-2 space-y-2 py-2 text-sm text-gray-700 dark:text-gray-200">
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2 text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </li>
                <li>Finanzas</li>
                <li>Mis Productos</li>
                <li>Facturas</li>
              </ul>
            </div>
          )}
        </>
      ) : (
        <>
          <button
            onClick={handleLogin}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Iniciar sesión
          </button>

          <button
            onClick={handleRegister}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Registrarse
          </button>
        </>
      )}
    </div>
  );
};

export default NavUser;


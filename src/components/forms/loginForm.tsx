// Indicamos que este componente se utilizara en el ladodel cliente 
'use client';

import { useState } from 'react';
// Funcion para manejo de formularios
import { useForm } from 'react-hook-form';
// Validaciones de esquemas
import { zodResolver } from '@hookform/resolvers/zod';
// Navegacion del usuario
import Link from 'next/link';
import { Eye, EyeOff, LogIn } from 'lucide-react';

import { useLogin } from '@/features/auth/hooks/useLogin';
import { LoginFormData, loginSchema } from '@/features/auth/utils/validation';
import { ROUTES } from '@/lib/constants';

// Funcion del login
export function LoginForm() {
  // Estado para visializar la contraseña
  const [showPassword, setShowPassword] = useState(false);
  // Obtenemos la funcion de validacion de errores en el login
  const { login, isLoading, errors } = useLogin();

  const {
    // Escucha los eventos de los inputs
    register,
    // Funcion de envio de formulario, validadion de datos
    handleSubmit,
    // Contiene los errores de los campos y los nombramos como formErrors
    formState: { errors: formErrors }, 
    // Obtenemos la validacion del formulario echo por zod
  } = useForm<LoginFormData>({
    // Obtenemos el esquema de validacion
    resolver: zodResolver(loginSchema),
  });

  // Envía los datos (ya validados) a la función login.
  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
          <p className="text-gray-600 mt-2">Accede a tu cuenta</p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de usuario
            </label>
            <input
              id="username"
              type="text"
              {...register('username')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                formErrors.username || errors.username
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="Ingresa tu nombre de usuario"
            />
            {formErrors.username && (
              <p className="mt-1 text-sm text-red-600">{formErrors.username.message}</p>
            )}
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black  ${
                  formErrors.password || errors.password
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Ingresa tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-600">{formErrors.password.message}</p>
            )}
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <LogIn className="h-5 w-5 mr-2" />
                Iniciar Sesión
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link href={ROUTES.REGISTER} className="font-medium text-blue-600 hover:text-blue-500">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
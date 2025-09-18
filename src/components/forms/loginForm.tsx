'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { LoginFormData, loginSchema } from '@/features/auth/utils/validation';
import { ROUTES } from '@/lib/constants';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

// Funcion del login
export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, errors } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-white to-green-500">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/90 shadow-2xl rounded-3xl px-10 py-10 w-full max-w-md mx-auto"
      >
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/AgroConexion.svg"
            alt="Logo"
            height={80}
            width={80}
            className="rounded-full border-4 border-green-300 shadow-md bg-white"
          />
          <h2 className="mt-4 text-3xl font-bold tracking-wide">{t("iniciarSesion")}</h2>
          <p className="text-gray-600 mt-2">{t("accedeCuenta")}</p>
        </div>

        {/* Errores generales */}
        {errors.general && (
          <div className="text-red-600 text-sm font-semibold text-center mb-4">
            {errors.general}
          </div>
        )}

        <div className="flex flex-col gap-5">
          {/* Username */}
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="font-semibold">
              {t("nombreUsuario")}
            </label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              {...register('username')}
              className={`rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition ${
                formErrors.username || errors.username
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-green-200 focus:ring-green-400'
              }`}
            />
            {formErrors.username && (
              <p className="text-red-600 text-sm">{formErrors.username.message}</p>
            )}
            {errors.username && (
              <p className="text-red-600 text-sm">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1 relative">
            <label htmlFor="password" className="font-semibold">
              {t("contraseña")}
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Password"
              {...register('password')}
              className={`rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition pr-12 ${
                formErrors.password || errors.password
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-green-200 focus:ring-green-400'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-9 text-xl focus:outline-none"
              tabIndex={-1}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                <EyeOff className="w-6 h-6 text-gray-500" />
              ) : (
                <Eye className="w-6 h-6 text-gray-500" />
              )}
            </button>
            {formErrors.password && (
              <p className="text-red-600 text-sm">{formErrors.password.message}</p>
            )}
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Cargando...' : t('iniciarSesion')}
          </button>

          {/* Links */}
          <div className="flex justify-between gap-4 mt-4">
            <Link href={ROUTES.REGISTER}>
              <p className="text-blue-500 hover:text-blue-600">{t("crearCuenta")}</p>
            </Link>
            <Link href={ROUTES.LOSTPASSWORD}>
              <p className="text-blue-500 hover:text-blue-600">{t("recuperarContraseña")}</p>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

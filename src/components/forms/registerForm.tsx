'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useRegister } from '@/features/auth/hooks/useRegister';
import { RegisterFormData, registerSchema } from '@/features/auth/utils/validation';
import { ROUTES } from '@/lib/constants';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';


export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const { register: registerUser, isLoading, errors } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    await registerUser(data);
  };
  
  const { t } = useLanguage();

return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-white to-green-500">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/90 shadow-2xl rounded-3xl px-10 py-10 w-full max-w-md mx-auto"
      >
        {/* Logo + título */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/AgroConexion.svg"
            alt="Logo"
            height={80}
            width={80}
            className="rounded-full border-4 border-green-300 shadow-md bg-white"
          />
          <h2 className="mt-4 text-3xl font-bold tracking-wide text-gray-800">{t("crearCuenta")}</h2>
          <p className="text-gray-600 mt-1">{t("unetePlataforma")}</p>
        </div>

        {/* Errores generales */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
            {errors.general}
          </div>
        )}

        {/* Campos */}
        <div className="flex flex-col gap-5">
          {/* Username */}
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="font-semibold">
              {t("nombreUsuario")}
            </label>
            <input
              id="username"
              type="text"
              {...register('username')}
              placeholder="Username"
              className={`rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition ${
                formErrors.username || errors.username ? 'border-red-500' : 'border-green-200'
              }`}
            />
            {formErrors.username && (
              <p className="text-sm text-red-600">{formErrors.username.message}</p>
            )}
            {errors.username && <p className="text-sm text-red-600">{errors.username}</p>}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold">
              {t("email")}
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              placeholder="tu@email.com"
              className={`rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition ${
                formErrors.email || errors.email ? 'border-red-500' : 'border-green-200'
              }`}
            />
            {formErrors.email && <p className="text-sm text-red-600">{formErrors.email.message}</p>}
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1 relative">
            <label htmlFor="password" className="font-semibold">
              {t("contraseña")}
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder={t("minimo8Caracteres")}
              className={`rounded-lg border px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-green-400 transition ${
                formErrors.password || errors.password ? 'border-red-500' : 'border-green-200'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-9 text-xl focus:outline-none"
              tabIndex={-1}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff className="w-6 h-6 text-gray-500" /> : <Eye className="w-6 h-6 text-gray-500" />}
            </button>
            {formErrors.password && <p className="text-sm text-red-600">{formErrors.password.message}</p>}
            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1 relative">
            <label htmlFor="password2" className="font-semibold">
              {t("confirmarContrasena")}
            </label>
            <input
              id="password2"
              type={showPassword2 ? 'text' : 'password'}
              {...register('password2')}
              placeholder={t("repetirContrasena")}
              className={`rounded-lg border px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-green-400 transition ${
                formErrors.password2 || errors.password2 ? 'border-red-500' : 'border-green-200'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword2((v) => !v)}
              className="absolute right-3 top-9 text-xl focus:outline-none"
              tabIndex={-1}
              aria-label={showPassword2 ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword2 ? <EyeOff className="w-6 h-6 text-gray-500" /> : <Eye className="w-6 h-6 text-gray-500" />}
            </button>
            {formErrors.password2 && <p className="text-sm text-red-600">{formErrors.password2.message}</p>}
            {errors.password2 && <p className="text-sm text-red-600">{errors.password2}</p>}
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg shadow-md transition flex justify-center items-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <UserPlus className="h-5 w-5 mr-2" />
                {t("crearCuenta")}
              </>
            )}
          </button>

          {/* Links */}
          <div className="flex justify-between gap-4 mt-4 text-sm">
            <Link href={ROUTES.LOGIN} className="text-blue-500 hover:text-blue-600">
              {t("yaTengoCuenta")}
            </Link>
            <Link href={ROUTES.REGISTERAGROUP} className="text-blue-500 hover:text-blue-600">
              {t("registrarAgrupacion")}
            </Link>
          </div>
        </div>
      </form>
    </main>
  );
}
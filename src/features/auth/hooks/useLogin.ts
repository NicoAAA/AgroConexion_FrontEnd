import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { authService } from '../services/authService';
import { useAuth } from './useAuth';
import { LoginRequest, ApiError } from '@/types/auth.types';
import { setStoredTokens } from '@/lib/auth';
import { ROUTES } from '@/lib/constants';

// Funcion que nos permite iniciar sesion
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const { setUser } = useAuth();

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setErrors({});

    try {
      // 1. Petición login
      const response = await authService.login(credentials);
      console.log(response)
      if(response.message){
        if(response.email){
          const email = response.email
          router.push(`${ROUTES.LOGIN2FA}?email=${encodeURIComponent(email)}`)
          return
        }
        
      }
      // 2. Guardar tokens
      setStoredTokens(response.access, response.refresh);

      // 3. Obtener usuario completo con el access token
      const user = await authService.getUserInfo(response.access);

      // 4. Actualizar el store con la información real del backend
      setUser(user);

      toast.success('¡Inicio de sesión exitoso!');
      router.push(ROUTES.HOME);
    } catch (error: any) {
      const apiError = error.response?.data as ApiError;

      if (apiError) {
        if (apiError.detail) {
          setErrors({ general: apiError.detail });
        } else {
          const fieldErrors: Record<string, string> = {};
          if (apiError.username) fieldErrors.username = apiError.username[0];
          if (apiError.password) fieldErrors.password = apiError.password[0];
          if (apiError.non_field_errors) fieldErrors.general = apiError.non_field_errors[0];
          setErrors(fieldErrors);
        }
      } else {
        setErrors({ general: 'Error de conexión. Intenta nuevamente.' });
      }
      toast.error('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, errors };
};

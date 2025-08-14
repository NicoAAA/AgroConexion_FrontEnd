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
  // Estado de carga de la peticion
  const [isLoading, setIsLoading] = useState(false);
  // Estado que nos permite guardar errores
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Funcion que nos permite redirigir a el usuareio
  const router = useRouter();
  // Obtenemos a el usuario para actualizar su contexto
  const { setUser } = useAuth();

  // Indicamos los capos a utilizar con el modelo  LoginRequest
  const login = async (credentials: LoginRequest) => {
    // Estado de carga de la peticion
    setIsLoading(true);
    // Inicializamos los errores en blanco
    setErrors({});

    try {
      // Haemos la peticion login enviando los datos
      const response = await authService.login(credentials);
      
      // Guardar tokens
      setStoredTokens(response.access, response.refresh);
      
      // Guardar información del usuario
      const user = {
        username: response.userName,
        email: response.userEmail,
        userImage: response.userImage,
        userName: response.userName,
        userEmail: response.userEmail,
        isSeller: response.isSeller,
        isBuyer: response.isBuyer,
      };
      // Actualizamos la informacion del usuario
      setUser(user);
      // Mensaje de exito
      toast.success('¡Inicio de sesión exitoso!');
      // Redirecciondel usuario
      router.push(ROUTES.PRODUCTOS);
      
    } catch (error: any) {
      // Obtenemos el tipo de error
      const apiError = error.response?.data as ApiError;
      
      if (apiError) {
        // Manejar errores específicos de la API
        if (apiError.detail) {
          setErrors({ general: apiError.detail });
        } else {
          // Manejar errores de campos específicos
          const fieldErrors: Record<string, string> = {};
          if (apiError.username) fieldErrors.username = apiError.username[0];
          if (apiError.password) fieldErrors.password = apiError.password[0];
          if (apiError.non_field_errors) fieldErrors.general = apiError.non_field_errors[0];
          // Guardamos los errores de campos
          setErrors(fieldErrors);
        }
      } else {
        // Mostramos error en caso de que no tengamos respuesta del servidor
        setErrors({ general: 'Error de conexión. Intenta nuevamente.' });
      }
      toast.error('Error al iniciar sesión');
    } finally {
      // Indicamos el tiempo de carga de la peticion
      setIsLoading(false);
    }
  };

  return { login, isLoading, errors };
};
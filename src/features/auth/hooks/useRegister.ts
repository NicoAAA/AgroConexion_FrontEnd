import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { authService } from '../services/authService';
import { RegisterRequest, ApiError } from '@/types/auth.types';
import { ROUTES } from '@/lib/constants';

// 
export const useRegister = () => {
  // Estado de carga del componente
  const [isLoading, setIsLoading] = useState(false);
  // Estado de errores
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Manejo de rutas
  const router = useRouter();

  // Funcion que obtiene los datos del usuario
  const register = async (userData: RegisterRequest) => {
    // Estado de carga
    setIsLoading(true);
    // Errores
    setErrors({});

    
    try {
      // Peticion para registrar un nuevo usuario
      await authService.register(userData);
      // Mensaje de exito
      toast.success('¡Registro exitoso! Ahora puedes iniciar sesión.');
      // Redirigimos al usuario al login
      router.push(ROUTES.LOGIN);
      
    } catch (error: any) {
      // En caso de error
      const apiError = error.response?.data as ApiError;
      // En caso de erro en la api creamos una lista de objetos para manejar los errores
      if (apiError) {
        const fieldErrors: Record<string, string> = {};
        // Obtenemos el error especifico por campo
        if (apiError.username) fieldErrors.username = apiError.username[0];
        if (apiError.email) fieldErrors.email = apiError.email[0];
        if (apiError.password) fieldErrors.password = apiError.password[0];
        if (apiError.password2) fieldErrors.password2 = apiError.password2[0];
        if (apiError.non_field_errors) fieldErrors.general = apiError.non_field_errors[0];
        // Guardamos los errores
        setErrors(fieldErrors);
      } else {
        // En caso de error pero que no sea de campod e formulario imprimimos mensaje general
        setErrors({ general: 'Error de conexión. Intenta nuevamente.' });
      }
      // Mensaje de error
      toast.error('Error al registrar usuario');
    } finally {
      // Estado de carga
      setIsLoading(false);
    }
  };

  return { register, isLoading, errors };
};
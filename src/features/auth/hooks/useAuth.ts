// Función que nos permite crear un contexto sencillo (store global)
import { create } from 'zustand';

// Modelo que definimos para el contexto del usuario
import { User } from '@/types/auth.types';

// Funciones para manejar la autenticación desde el localStorage
import { getStoredUser, setStoredUser, clearStoredAuth } from '@/lib/auth';

// Modelo de estado para la creación del contexto de autenticación
interface AuthState {
  // Usuario actual (o null si no está autenticado)
  user: User | null;
  // Indica si el usuario está autenticado
  isAuthenticated: boolean;
  // Indica si se está cargando el estado de autenticación
  isLoading: boolean;
  // Función para actualizar el usuario en el contexto
  setUser: (user: User | null) => void;
  // Función para cambiar el estado de carga
  setLoading: (loading: boolean) => void;
  // Función para cerrar sesión y limpiar datos
  logout: () => void;
  // Función para inicializar el estado de autenticación desde localStorage
  initializeAuth: () => void;
}

// Creamos el store de Zustand con el modelo AuthState.
// La función `set` se usa para actualizar el estado.
export const useAuth = create<AuthState>((set) => ({
  // Estado inicial
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // Función para actualizar el usuario en el contexto
  setUser: (user) => {
    if (user) {
      // Guardamos el usuario en localStorage
      setStoredUser(user);
      // Actualizamos el estado
      set({ user, isAuthenticated: true });
    } else {
      // Si no hay usuario, limpiamos el estado
      set({ user: null, isAuthenticated: false });
    }
  },

  // Actualiza el estado de carga
  setLoading: (loading) => set({ isLoading: loading }),

  // Función para cerrar sesión
  logout: () => {
    // Limpiamos el localStorage
    clearStoredAuth();
    // Limpiamos el estado del contexto
    set({ user: null, isAuthenticated: false });
  },

  // Inicializa la autenticación cargando desde localStorage
  initializeAuth: () => {
    const storedUser = getStoredUser();
    if (storedUser) {
      set({ user: storedUser, isAuthenticated: true, isLoading: false });
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

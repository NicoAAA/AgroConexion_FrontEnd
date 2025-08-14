// Rutas para peticiones
export const AUTH_ENDPOINTS = {
  LOGIN: '/users/login/',
  REGISTER: '/users/register/',
  REFRESH: '/token/refresh/',
  LOGOUT: '/users/logout/',
} as const;

// Rutas de navegacion
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCTOS: '/products',
  CARRITO: '/cart',
  NEWPRODUCT: '/products/new',
  FACTURACION: '/invoices',
  ESTADISTICAS: '/finansas',
} as const;
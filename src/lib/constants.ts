// Rutas para peticiones
export const AUTH_ENDPOINTS = {
  LOGIN: '/users/login/',
  REGISTER: '/users/register/',
  REFRESH: '/token/refresh/',
  LOGOUT: '/users/logout/',
  MYINFO: '/users/my-info/'
} as const;

// Rutas de navegacion
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  LOGIN2FA: '/login/2fa',

  VERIFYACCOUTN: '/verify-account',

  REGISTER: '/register',
  REGISTERAGROUP: '/register/agroup',

  PRODUCTOS: '/products',
  CARRITO: '/cart',
  NEWPRODUCT: '/products/new',
  FACTURACION: '/invoices',
  ESTADISTICAS: '/finansas',
  PERFIL: '/profile',
  FAVORITOS: '/favorites',

  CHANGUEPASSWORD: '/password/changue-my-password',
  LOSTPASSWORD: '/password/lost-my-password',
} as const;
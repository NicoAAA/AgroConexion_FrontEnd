import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Idiomas soportados
  locales: ['es', 'en'],
  defaultLocale: 'es'
});

export const config = {
  // Middleware corre en todas las rutas bajo el App Router
  matcher: ['/((?!_next|.*\\..*).*)']
};

"use client";

import { createContext, useContext, useState, useEffect } from "react";

/* ============================================================
   TIPOS
============================================================ */

type Language = "es" | "en";

type LanguageContextType = {
  language: Language;              // Idioma actual
  toggleLanguage: () => void;      // Cambiar entre idiomas
  t: (key: string) => string;      // Función para traducir textos
};

/* ============================================================
   TRADUCCIONES (clave → [es, en])
============================================================ */

const translations: Record<string, [string, string]> = {
  offers: ["Te pueden gustar", "You may like"],
  recommended: ["🌱 Recomendados", "🌱 Recommended"],
  messages1: [
    "🛒 ¡Compra directo del campesino sin intermediarios!",
    "🛒 Buy directly from farmers, no middlemen!",
  ],
  messages2: [
    "🌽 Productos frescos cosechados con amor colombiano",
    "🌽 Fresh products harvested with Colombian love",
  ],
  messages3: [
    "🚚 Entregas rápidas y seguras en toda Colombia",
    "🚚 Fast and secure delivery across Colombia",
  ],
  messages4: [
    "💰 ¡Aprovecha ofertas semanales y descuentos exclusivos!",
    "💰 Enjoy weekly offers and exclusive discounts!",
  ],
  messages5: [
    "🌱 Apoya el agro nacional con cada compra que haces",
    "🌱 Support local farmers with every purchase",
  ],
  messages6: [
    "🍅 Frutas y verduras frescas recién cosechadas",
    "🍅 Freshly harvested fruits and vegetables",
  ],
  messages7: [
    "📦 Envíos gratis por compras superiores a $50.000",
    "📦 Free shipping on orders over $50,000",
  ],
  messages8: [
    "🥚 ¡Huevos, lácteos y más del campo a tu mesa!",
    "🥚 Eggs, dairy, and more from farm to table!",
  ],
  messages9: [
    "🧑‍🌾 Cada producto tiene una historia campesina detrás",
    "🧑‍🌾 Every product has a farmer’s story behind it",
  ],
  welcome: ['Bienvenido a', 'Welcome to'],
  description: [
    'Conecta directamente con productos del campo colombiano. Calidad, frescura y apoyo al campesinado en un solo lugar.',
    'Connect directly with Colombian farm products. Quality, freshness, and support for farmers all in one place.'
  ],
  viewProducts: ['Ver productos', 'View products'],
  categorias: ['Categorías', 'Categories'],
  notificaciones: ['Notificaciones', 'Notifications'],
  detallenotificacion: ['📭 No tienes notificaciones aún', '📭 You have no notifications yet'],
  cargandoNotificaciones: ['Cargando notificaciones', 'Loading notifications'],
  iniciaSesionNotificaciones: ["🔒 Inicia sesión para ver tus notificaciones", "🔒 Log in to see your notifications"],
  footerDescription: ["Conectamos el campo colombiano con las familias, ofreciendo productos frescos, naturales y de calidad directamente de los campesinos.", "We connect Colombian farmers with families, offering fresh, natural, and quality products directly from farmers.",],
  enlaces: ["Enlaces", "Links"],
  sobreNosotros: ["Sobre Nosotros", "About Us"],
  contacto: ["Contacto", "Contact"],
  politicaDePrivacidad: ["Política de Privacidad", "Privacy Policy"],
  siguenos: ["Síguenos", "Follow Us"],
  contactoTitle: ["Contacto", "Contact"],
  todosLosDerechosReservados: ["Todos los derechos reservados.", "All rights reserved."], stock: ["Stock: ", "Stock: "],
  unitOfMeasure: ["Medida: ", "Unit: "],
  viewProduct: ["Ver producto", "View product"],
  VerTodos: ["Ver todos", "View all"],
  // Botones
  agregarCarrito: ['Añadir', 'Add'],
  quitarCarrito: ['Quitar', 'Remove'],
  verMas: ['Ver más', 'View More'],

  // Mensajes de favoritos
  productoAgregadoFavoritos: ['Producto agregado a favoritos ❤️', 'Product added to favorites ❤️'],
  productoEliminadoFavoritos: ['Producto eliminado de favoritos ❤️', 'Product removed from favorites ❤️'],
  iniciaSesionFavoritos: ['🔒 Inicia sesión para gestionar favoritos', '🔒 Log in to manage favorites'],
  errorFavoritos: ['❌ Error al actualizar favoritos', '❌ Error updating favorites'],

  // Mensajes del carrito
  productoAgregadoCarrito: ['Producto agregado al carrito 🛒', 'Product added to cart 🛒'],
  productoEliminadoCarrito: ['Producto eliminado del carrito 🛒', 'Product removed from cart 🛒'],
  iniciaSesionCarrito: ['🔒 Inicia sesión para agregar productos al carrito', '🔒 Log in to add products to cart'],
  errorCarrito: ['❌ Error al actualizar el carrito', '❌ Error updating cart'],

  // Información de producto
  exploraPorCategorias: ["✨ Explora por Categorías", "✨ Explore by Categories"],
  frutas: ["Frutas 🍎", "Fruits 🍎"],
  verduras: ["Verduras 🥕", "Vegetables 🥕"],
  lacteos: ["Lácteos 🧀", "Dairy 🧀"],
  pescados: ["Pescados 🐟", "Fish 🐟"],
  hierbas: ["Hierbas 🌿", "Herbs 🌿"],
  infproductos: ["Explora la variedad de productos campesinos disponibles en nuestra plataforma", "Explore the variety of farmer products available on our platform."],
  buscar: ["Buscar frutas, verduras, lácteos...", "Search fruits, vegetables, dairy..."],
  todos: ["Todas", "All"],

  // LoginForm
  iniciarSesion: ["Iniciar Sesión", "Log In"],
  accedeCuenta: ["Accede a tu cuenta", "Access your account"],
  nombreUsuario: ["Nombre de usuario", "Username"],
  contraseña: ["Contraseña", "Password"],
  mostrarContraseña: ["Mostrar contraseña", "Show password"],
  ocultarContraseña: ["Ocultar contraseña", "Hide password"],
  cargando: ["Cargando...", "Loading..."],
  crearCuenta: ["Crear Cuenta", "Create Account"],
  recuperarContraseña: ["Recuperar Contraseña", "Forgot Password"],

  // RegisterForm
  unetePlataforma: ["Únete a nuestra plataforma", "Join our platform"],
  email: ["Email", "Email"],
  minimo8Caracteres: ["Mínimo 8 caracteres", "At least 8 characters"],
  repetirContrasena: ["Repite tu contraseña", "Repeat your password"],
  confirmarContrasena: ["Confirmar contraseña", "Confirm Password"],
  yaTengoCuenta: ["Ya tengo cuenta", "Already have an account"],
  registrarAgrupacion: ["Registrar agrupación", "Register group"],

  // NavUser
  menuUsuario: ["Menú de usuario", "User menu"],
  sesionCerrada: ["👋 Sesión cerrada correctamente", "👋 Logged out successfully"],
  misFavoritos: ["Mis favoritos", "My favorites"],
  misFacturas: ["Mis Facturas", "My Invoices"],
  nuevoProducto: ["Nuevo producto", "New Product"],
  misProductos: ["Mis productos", "My Products"],
  estadisticas: ["Estadísticas", "Statistics"],
  ventas: ["Ventas", "Sales"],
  cerrarSesion: ["Cerrar sesión", "Log out"],
  registrarse: ["Registrarse", "Register"],

  // DetailProduct
  cargandoProducto: ["Cargando producto...", "Loading product..."],
  errorCargarProducto: ["No se pudo cargar el producto. Inténtalo más tarde.", "Could not load product. Please try again later."],
  productoNoEncontrado: ["Producto no encontrado", "Product not found"],
  inicio: ["Inicio", "Home"],
  productos: ["Productos", "Products"],
  ahorras: ["¡Ahorras", "You save"],
  stockDisponible: ["Stock disponible:", "Available stock:"],
  descripcion: ["Descripción", "Description"],
  cuponDisponible: ["¡Cupón disponible!", "Coupon available!"],
  productosPremium: ["Productos premium", "Premium products"],
  disfrutaProductos: ["Disfruta de los mejores productos", "Enjoy the best products"],
  garantiaTotal: ["Garantía total", "Full warranty"],
  garantiaCalidad: ["Garantía de calidad", "Quality guarantee"],

  comentariosYResenas: ["Comentarios y reseñas", "Comments & Reviews"],

  // AgregarCarrito
  productoAgregado: ["Producto agregado al carrito 🛒", "Product added to cart 🛒"],
  errorAgregar: ["Error al agregar al carrito", "Error adding to cart"],

  agregando: ["Agregando...", "Adding..."],
  agregarAlCarrito: ["Agregar al carrito", "Add to cart"],

  // ComprarProducto
  cantidad: ["Cantidad", "Quantity"],
  procesandoCompra: ["Procesando compra...", "Processing purchase..."],
  comprarAhora: ["Comprar", "Buy now"],

  errorCantidad: ["❌ La cantidad debe ser mayor a 0", "❌ Quantity must be greater than 0"],

  // NewRating
  comoCalificarias: [
    "¿Cómo calificarías este producto?",
    "How would you rate this product?"
  ],
  graciasCalificacion: [
    "Gracias por tu calificación",
    "Thanks for your rating"
  ],
  errorCalificacion: [
    "Error al enviar la calificación. Intenta de nuevo.",
    "Error sending rating. Please try again."
  ],
  enviando: ["Enviando...", "Sending..."],
  calificarEstrellas: [
    "Calificar {n} estrellas",
    "Rate {n} stars"
  ],
  // Comments
  opinionUsuarios: [
    "Opiniones de usuarios",
    "User reviews"
  ],
  comentarios: ["comentarios", "comments"],
  noComentarios: [
    "Aún no hay comentarios",
    "No comments yet"
  ],
  sePrimeroOpinar: [
    "¡Sé el primero en compartir tu opinión!",
    "Be the first to share your opinion!"
  ],
  escribeOpinion: [
    "Escribe tu opinión",
    "Write your opinion"
  ],
  placeholderComentario: [
    "Comparte tu experiencia con este producto...",
    "Share your experience with this product..."
  ],
  imagenesAdjuntas: [
    "Imágenes adjuntas",
    "Attached images"
  ],
  agregarFotos: ["Agregar fotos", "Add photos"],
  publicar: ["Publicar", "Post"],

  // Toasts
  errorCargarComentarios: [
    "No se pudieron cargar los comentarios.",
    "Failed to load comments."
  ],
  comentarioAgregado: [
    "Comentario agregado 🌱",
    "Comment added 🌱"
  ],
  errorAgregarComentario: [
    "No se pudo agregar el comentario.",
    "Failed to add comment."
  ],
  comentarioActualizado: [
    "Comentario actualizado ✨",
    "Comment updated ✨"
  ],
  errorActualizarComentario: [
    "No se pudo actualizar el comentario.",
    "Failed to update comment."
  ],
  comentarioEliminado: [
    "Comentario eliminado 🗑️",
    "Comment deleted 🗑️"
  ],
  errorEliminarComentario: [
    "No se pudo eliminar el comentario.",
    "Failed to delete comment."
  ],
  guardar: ["Guardar", "Save"],
  cancelar: ["Cancelar", "Cancel"],
  eliminar: ["Eliminar", "Delete"],
  editar: ["Editar", "Edit"],


};

/* ============================================================
   CONTEXTO
============================================================ */

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

/* ============================================================
   PROVIDER
============================================================ */

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("es");

  // Cargar idioma guardado en localStorage al iniciar
  useEffect(() => {
    const savedLang = (localStorage.getItem("language") as Language) || "es";
    setLanguage(savedLang);
  }, []);

  // Cambiar idioma (es <-> en)
  const toggleLanguage = () => {
    const newLang = language === "es" ? "en" : "es";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  // Función de traducción usando array [es, en]
  const t = (key: string) => {
    const index = language === "es" ? 0 : 1;
    return translations[key]?.[index] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

/* ============================================================
   HOOK PERSONALIZADO
============================================================ */

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx)
    throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

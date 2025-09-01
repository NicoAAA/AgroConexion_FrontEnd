import React from "react";
import Image from "next/image";
// Importamos logos de marcas desde react-icons/simple-icons
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";

const Footer: React.FC = () => (
  <footer className="bg-green-700 text-white pt-10 pb-6 ">
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
      
      {/* Logo + Descripción */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Image
            src="/AgroConexion.svg"
            alt="AgroConexión"
            width={40}
            height={40}
            className="rounded-full border border-white"
          />
          <h2 className="text-xl font-bold">AgroConexión</h2>
        </div>
        <p className="text-sm text-gray-200">
          Conectamos el campo colombiano con las familias, ofreciendo productos frescos, naturales y de calidad directamente de los campesinos.
        </p>
      </div>

      {/* Enlaces rápidos */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Enlaces</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="/about" className="hover:text-green-300">Sobre Nosotros</a></li>
          <li><a href="/contact" className="hover:text-green-300">Contacto</a></li>
          <li><a href="/privacy" className="hover:text-green-300">Política de Privacidad</a></li>
          <li><a href="/products" className="hover:text-green-300">Productos</a></li>
        </ul>
      </div>

      {/* Redes Sociales */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Síguenos</h3>
        <div className="flex space-x-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-300">
            <SiFacebook className="w-6 h-6" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-300">
            <SiInstagram className="w-6 h-6" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-300">
            <SiX className="w-6 h-6" />
          </a>
        </div>
      </div>

      {/* Contacto */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Contacto</h3>
        <p className="text-sm">📍 Funza, Cundinamarca</p>
        <p className="text-sm">📧 contacto@agroconexion.com</p>
        <p className="text-sm">📞 +57 350 742 7337</p>
      </div>
    </div>

    {/* Línea divisoria */}
    <div className="pt-5 text-center text-md text-gray-200">
      © {new Date().getFullYear()} AgroConexión. Todos los derechos reservados.
    </div>
  </footer>
);

export default Footer;

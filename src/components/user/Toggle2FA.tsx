"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Shield, ShieldCheck, ShieldX, Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function Toggle2FA() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Obtener el estado desde el usuario autenticado
  const enabled = user?.two_factor_enabled || false;

  const toggle2FA = async () => {
    if (!user) {
      toast.error("Usuario no autenticado");
      return;
    }

    setLoading(true);
    try {
      await api.post("/users/toggle-2fa/", { enable: !enabled });
      
      // Actualizar el usuario completo con el nuevo estado de 2FA
      const updatedUser = {
        ...user,
        two_factor_enabled: !enabled
      };
      setUser(updatedUser);
      
      toast.success(
        !enabled
          ? "🔐 Autenticación en dos pasos activada"
          : "❌ Autenticación en dos pasos desactivada"
      );
    } catch (error) {
      console.error("Error al cambiar configuración de 2FA:", error);
      toast.error("Error al cambiar configuración de 2FA");
    } finally {
      setLoading(false);
    }
  };

  // Si no hay usuario autenticado, mostrar mensaje
  if (!user) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center py-8">
          <ShieldX className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Debes iniciar sesión para configurar la autenticación en dos pasos
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-2xl">
      {/* Header con icono */}
      <div className="flex items-center justify-center mb-6">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 transition-colors duration-300 ${
          enabled 
            ? 'bg-green-100 dark:bg-green-900/30' 
            : 'bg-orange-100 dark:bg-orange-900/30'
        }`}>
          {enabled ? (
            <ShieldCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
          ) : (
            <ShieldX className="w-8 h-8 text-orange-500 dark:text-orange-400" />
          )}
        </div>
      </div>

      {/* Título */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Autenticación de Dos Factores
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Protege tu cuenta con una capa adicional de seguridad
        </p>
      </div>

      {/* Estado actual */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
          enabled
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
            : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 transition-colors duration-300 ${
            enabled 
              ? 'bg-green-500 dark:bg-green-400' 
              : 'bg-orange-500 dark:bg-orange-400'
          }`}></div>
          {enabled ? "Activada" : "Desactivada"}
        </div>
        
        {/* Información del usuario */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Usuario: {user.username}
        </p>
      </div>

      {/* Descripción del estado */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {enabled 
            ? "Tu cuenta está protegida con autenticación de dos factores. Necesitarás tu dispositivo móvil para iniciar sesión."
            : "Activa la autenticación de dos factores para añadir una capa extra de seguridad a tu cuenta."
          }
        </p>
      </div>

      {/* Botón de acción */}
      <div className="text-center">
        <button
          onClick={toggle2FA}
          disabled={loading}
          className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-4 ${
            enabled
              ? 'bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 focus:ring-red-200 dark:focus:ring-red-900/30'
              : 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 focus:ring-green-200 dark:focus:ring-green-900/30'
          } shadow-lg disabled:opacity-70 disabled:hover:scale-100`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Cambiando...
            </>
          ) : (
            <>
              <Shield className="w-5 h-5 mr-2" />
              {enabled ? "Desactivar 2FA" : "Activar 2FA"}
            </>
          )}
        </button>
      </div>

      {/* Información adicional */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600/50">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-0.5">
            <div className="w-2.5 h-2.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1">
              💡 Consejo de seguridad
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {enabled
                ? "Mantén siempre acceso a tu aplicación de autenticación y guarda los códigos de respaldo en un lugar seguro."
                : "La autenticación de dos factores reduce significativamente el riesgo de acceso no autorizado a tu cuenta."
              }
            </p>
          </div>
        </div>
      </div>

      {/* Lista de beneficios/información adicional */}
      {!enabled && (
        <div className="mt-4 space-y-3">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center">
            <Shield className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            Beneficios de activar 2FA:
          </h4>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
            <li className="flex items-center">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
              Protección contra accesos no autorizados
            </li>
            <li className="flex items-center">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
              Seguridad adicional para tus datos personales
            </li>
            <li className="flex items-center">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
              Notificaciones de intentos de acceso sospechosos
            </li>
            <li className="flex items-center">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
              Compatible con aplicaciones como Google Authenticator
            </li>
          </ul>
        </div>
      )}

      {/* Información cuando está activado */}
      {enabled && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center">
            <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
            <p className="text-xs font-semibold text-green-800 dark:text-green-300">
              Tu cuenta está protegida
            </p>
          </div>
          <p className="text-xs text-green-700 dark:text-green-400 mt-1 leading-relaxed">
            Recuerda guardar los códigos de respaldo en un lugar seguro y mantener acceso a tu aplicación de autenticación.
          </p>
        </div>
      )}
    </div>
  );
}

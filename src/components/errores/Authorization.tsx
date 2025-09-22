"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LockKeyhole } from "lucide-react";
import toast from "react-hot-toast";

export default function NotAuthenticated() {
  const router = useRouter();

  useEffect(() => {
    // toast.error("⚠️ No estás autenticado. Serás redirigido al login...");
    const timeout = setTimeout(() => {
      router.push("/login");
    }, 9000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="bg-red-100 text-red-600 p-6 rounded-full mb-6 shadow-md">
        <LockKeyhole className="w-12 h-12" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Acceso restringido</h2>
      <p className="text-gray-600 max-w-md">
        Debes iniciar sesión para ver tus facturas. Serás redirigido
        automáticamente al login en unos segundos.
      </p>
    </motion.div>
  );
}

// Componenete que englobara la aplicacion para saber si el usuario esta autenticado y traer sus datos
"use client";

import { useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuth((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}
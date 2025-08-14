"use client"

import { ReactNode, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { isAuthenticated } from '@/lib/auth';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { initializeAuth, isLoading, isAuthenticated: auth } = useAuth();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (!isLoading && !auth) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex">
      <h1>pagina con carrusel, productos mas vendidos y recomendaciones</h1>
    </div>
  );
}

'use client'

import { useState } from 'react';
import { Menu, X, BarChart3, TrendingUp, Package, Lock, Home } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ROUTES } from '@/lib/constants';
import ChanguePassword from '@/components/user/ChanguePassword'
import Link from 'next/link';
const SideBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, isAuthenticated, isLoading, logout, initializeAuth } = useAuth()
    const menuItems = [
        { name: 'Ventas', icon: BarChart3, href: '#' },
        { name: 'Estadísticas', icon: TrendingUp, href: '#' },
        { name: 'Mis Productos', icon: Package, href: '#' },
        // { name: 'Constraseña', icon: Lock, href: ROUTES.CHANGUEPASSWORD }
    ];

    return (
        <>
            {/* Overlay para móvil */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Botón hamburguesa para móvil */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-gray-700" />
                ) : (
                    <Menu className="w-6 h-6 text-gray-700" />
                )}
            </button>

            {/* Sidebar */}
            <div className={`
                fixed top-16 left-0 h-[calc(100vh-4rem)]  bg-green-300 
                text-black shadow-2xl z-40 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                w-72 lg:w-64
                mr-5
            `}>
                {/* Header */}
                <div className="p-6 border-b border-slate-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">M</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Mi Cuenta
                            </h1>
                            <p className="text-slate-400 text-sm">Panel de control</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="mt-8 px-4">
                    <ul className="space-y-2">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <Link
                                    href={item.href}
                                    className="flex items-center space-x-3 p-3 rounded-xl text-slate-300 
                                             hover:bg-slate-700 hover:text-white transition-all duration-200
                                             hover:translate-x-1 group"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            </li>
                        ))}
                        <li>
                            <ChanguePassword/>
                        </li>
                    </ul>
                </nav>
                

                {/* Footer */}
                <div className="absolute bottom-6 left-4 right-4">
                    <div className="bg-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">U</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">Usuario</p>
                                <p className="text-slate-400 text-xs truncate">usuario@ejemplo.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content area spacer */}
            <div className="w-64 flex-shrink-0"></div>
        </>
    );
};

export default SideBar;
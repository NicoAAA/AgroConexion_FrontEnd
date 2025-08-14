'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import GetAllCategories from '@/components/products/Categories';
import NavUser from '@/components/user/NavUser';
import Link from 'next/link';


export function Navbar() {

  return (
    <nav className="top-0 left-0 right-0 z-10 h-16 flex items-center justify-between bg-green-700 shadow px-10">
      {/* Sección izquierda: Logo + Categorías */}
      <div className="flex items-center space-x-6">
        <div className="text-xl font-bold text-blue-600">
          <Link href={'/'}>
            <Image
              className='rounded-full'
              width={50}
              height={50}
              src='/AgroConexion.svg'
              alt='Logo'
            />
          </Link>
        </div>
        
        <GetAllCategories/>
      </div>

      {/* Sección derecha: Usuario */}
      <NavUser/>
    </nav>
  );
}
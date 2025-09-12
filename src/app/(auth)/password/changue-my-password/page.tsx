'use client'
import ChanguePassword from '@/components/forms/changuePassword'
import { useSearchParams } from 'next/navigation';

const ChanguePasswordPage = () => {
    // Obtenemos el parametro enviado por la url
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const URL = 'http://127.0.0.1:8000/api/users/change-password/confirm/'
    // Formulario de cambio de contraseña
    return <ChanguePassword email={email} URL={URL}/>;
}

export default ChanguePasswordPage
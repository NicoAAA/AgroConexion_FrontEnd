// Archivo: app/(auth)/login/2fa/page.tsx

import { Suspense } from 'react';
import TwoFactorForm from './TwoFactorForm'; // Importamos el componente que acabamos de crear

// Este es el componente que se mostrará mientras el formulario de cliente carga.
function LoadingState() {
    return (
        <div>
            <p>Cargando formulario...</p>
        </div>
    );
}

export default function TwoFactorPage() {
    return (
        // Suspense se encarga de esperar por los componentes de cliente.
        <Suspense fallback={<LoadingState />}>
            <TwoFactorForm />
        </Suspense>
    );
}

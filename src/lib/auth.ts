import {User} from '@/types/auth.types'

// fUNCION QUE NOS PERMITE OBTENER A EL USUARIO AUTENTICADO
// La funcion retorna una instancia de usuario o null
export const getStoredUser = (): User | null =>{
    // Verificamos que la funcion se llame desde el navegador, si no es asi se retorna null
    if(typeof window === 'undefined') return null

    // Obtenemos el usuario almacenado en localstorage
    const userStr = localStorage.getItem('user')
    // Si no encontramos al usuario retornamos null
    if(!userStr) return null
    
    // Convertimos el usuario encontrado a un objeto 
    try{
        return JSON.parse(userStr)
    // En caso de erroro retornamos null
    }catch{
        return null
    }
}

// Funcion que nos permite guardar a un usuario en localstorage
export const setStoredUser =  (user: User) =>{
    // Verificamos que estemos desde un navegador
    if(typeof window !== 'undefined'){
        // Insertamos a el usuario en string
        localStorage.setItem('user', JSON.stringify(user))
    }
}

// Funcion que nos permite obtener los tokens del usuario
export const getStoredTokens = () => {
    // Verificamos que estemos desde un navegador si no es asi, indicamos que los tokens son nulos
    if (typeof window === 'undefined') return { access: null, refresh: null };
    // D e lo contrario obtenemos los tokens y los guardamos en un diccionario
    return {
        access: localStorage.getItem('access_token'),
        refresh: localStorage.getItem('refresh_token'),
    };
};

// Funcion que nos permite ghuardar los tokens en localstorage
export const setStoredTokens = (access: string, refresh: string) => {
    // Verificamos que estemos en un navegador
    if (typeof window !== 'undefined') {
        // alamcenamos los tokens en localstorage
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
    }
};

// Funcion que nos permite eliminar informacion del local;storage
export const clearStoredAuth = () => {
    // Verificamos que estemos en un navegador
    if (typeof window !== 'undefined') {
        // Removemos la informacion del locastorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    }
};

// Funcion que nos permite saver si el usuario esta autenticado
export const isAuthenticated = (): boolean => {
    // Obtenemos el token de acceso
    const { access } = getStoredTokens();
    // verificamso que obtenemos el token y retornamos un true o false
    return !!access;
};
'use client'
import axios from "axios";
import Image from "next/image"
import { useRef, useState } from "react";
import {VerifyAccountProps, VerifyPayload} from '@/types/auth.types'
import { useRouter } from "next/navigation";
import { authService } from '@/features/auth/services/authService'
import { ROUTES } from "@/lib/constants";

// Funcion para verificar la cuenta recibe como parametro el email del usuario y la ruta del ENDPOINT 
const VerifyAccount = ({ email, URL }: VerifyAccountProps) => {
    const router = useRouter();
    // Funcion que actualiza el estadoi del codigo
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    // Funcion que actualiza el estado de los mensajes
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    // Guardara una array de inputs
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    // L afuncion se ejecutara cuando cambia de inpurt
    const handleChange = (idx: number, value: string) => {
        // Verifica que el input solo reciba 1 digito y un numero
        if (!/^[0-9]?$/.test(value)) return;
        // Actualiza el valor de la array
        const newCode = [...code];
        // Esvribe el valor en el inpurt asociado
        newCode[idx] = value;
        // Actualiza el estado
        setCode(newCode);
        setError("");
        // Auto-focus siguiente
        if (value && idx < 5) {
            inputsRef.current[idx + 1]?.focus();
        }
    };


    const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Verifica el tipo de letra
        if (e.key === "Backspace") {
            // Verifica si el input que esta focus tiene algun valor
            if (code[idx]) {
                // Si hay valor, solo lo borra
                const newCode = [...code];
                // De ser asi lo limpia
                newCode[idx] = "";
                // Actualiza el estado
                setCode(newCode);
            } else if (idx > 0) {
                // Si está vacío, borra el anterior y mueve el foco
                const newCode = [...code];
                newCode[idx - 1] = "";
                setCode(newCode);
                inputsRef.current[idx - 1]?.focus();
            }
        }
    };

    // Funcion que se ejecutara a la hora de enviar el codigo
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        // Evitamso que el formulario pierda la data
        e.preventDefault();
        // Obtenemos el codigo en uno solo
        const fullCode = code.join("");
        // Verificamso que se envien los seis dijitos
        if (fullCode.length !== 6) {
            setError("Debes ingresar los 6 dígitos del código");
            return;
        }

        // Almacenamos la data
        const data: VerifyPayload ={
            email: email,
            code : Number(fullCode)
        }

        try {
            // Hacemos la peticion
            const response = await axios.post(URL, data,{
                headers: { "Content-Type": "application/json" }
            })
             
            // verificamos que el usuario este inciando sesion
            if(response.data.access && response.data.refresh){
                // Guardamos los tokens en el local storage
                localStorage.setItem('access_token', response.data.access)
                localStorage.setItem('refresh_token', response.data.refresh)
                
                // Obtenemos los datos del usuario
                const user = await authService.getUserInfo(response.data.access);
                localStorage.setItem("user", JSON.stringify(user));
                // Redirigimos al home
                router.push(ROUTES.HOME)
            }else{
                // Redirigimos a el login
                router.push(ROUTES.LOGIN)
            }
        } catch (error: any) {
            if(error.response?.data){
                const apiErrors = error.response.data
                if(apiErrors.error){
                    setError('Código inválido o expirado.')
                }
            } else {
                setError("No se pudo conectar con el servidor");
            }
        }
    };

    // Retornamos componente XML
    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-white to-green-500">
            <form onSubmit={handleSubmit} className="bg-white/90 shadow-2xl rounded-3xl px-10 py-10 w-full max-w-md mx-auto">
                <div className="flex flex-col items-center mb-8">
                    <Image
                        src='/AgroConexion.svg'
                        alt="Logo"
                        height={80}
                        width={80}
                        className="rounded-full border-4 border-green-300 shadow-md bg-white"
                    />
                    <h2 className="mt-4 text-3xl font-bold tracking-wide">Verify Account</h2>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <label className="text-lg text-center font-semibold mb-2">Ingresa el código de 6 dígitos enviado a <span className="text-green-700">{email}</span></label>
                    <div className="flex gap-2 justify-center">
                        {code.map((digit, idx) => (
                            <input
                                key={idx}
                                ref={el => { inputsRef.current[idx] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                className="w-12 h-12 text-center text-2xl border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none bg-emerald-50"
                                value={digit}
                                onChange={e => handleChange(idx, e.target.value)}
                                onKeyDown={e => handleKeyDown(idx, e)}
                            />
                        ))}
                    </div>
                    {error && <div className="text-red-600 text-sm font-semibold mt-2">{error}</div>}
                    {success && <div className="text-green-600 text-sm font-semibold mt-2">{success}</div>}
                    <button type="submit" className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-8 rounded-lg shadow-md transition">Verificar</button>
                </div>
            </form>
        </div>
    )
}

export default VerifyAccount
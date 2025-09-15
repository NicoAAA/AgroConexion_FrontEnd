'use client'
import axios from "axios";
import Image from "next/image"
import { useRef, useState } from "react";
import {VerifyAccountProps, NewPassword} from '@/types/auth.types'
import { useRouter } from "next/navigation";
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ROUTES } from "@/lib/constants";
// Funcion para verificar la cuenta recibe como parametro el email del usuario y la ruta del ENDPOINT 
const ChanguePassword = ({ email, URL}: VerifyAccountProps) => {
    const {logout} = useAuth()
    const access = localStorage.getItem('access_token')
    const refresh = localStorage.getItem('refresh_token')
    const router = useRouter();
    // Funcion que actualiza el estadoi del codigo
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [form, setForm] = useState({
        new_password: '',
        new_password2: '',
    })
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
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

    const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Se hace una copia del formulario y se actualiza con lso cambios echos por el usuario
        setForm({ ...form, [e.target.id]: e.target.value });
        // Limpiamos los mnesajes 
        setError("");
        setSuccess("");
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
        const data: NewPassword ={
            new_password: form.new_password,
            new_password2: form.new_password2,
            email: email,
            code : Number(fullCode)
        }

        try {
            // Hacemos la peticion
            const response = await axios.post(URL, data,{
                headers: {
                    "Authorization": `Bearer ${access}`,
                     "Content-Type": "application/json" }
            })
            // verificamos que tengamos lso tokens
            if (access && refresh) {
                // cerramos sesion 
                await logout()
            }
            // redirigimos al usuario al login
            router.push(ROUTES.CHANGUEPASSWORD)
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
                </div>
                <div className="flex flex-col gap-1 relative mt-3 mb-3">
                    <label htmlFor="new_password" className=" font-semibold">New Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="new_password"
                        placeholder="Password"
                        value={form.new_password}
                        onChange={handleChangePassword}
                        className="rounded-lg border border-green-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition pr-12"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-9 text-xl focus:outline-none"
                        tabIndex={-1}
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12c2.083 3.61 6.017 6 9.75 6 1.662 0 3.26-.368 4.646-1.022M6.423 6.423A9.956 9.956 0 0 1 12 6c3.733 0 7.667 2.39 9.75 6a10.477 10.477 0 0 1-1.227 1.977M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM3 3l18 18" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12C3.735 7.943 7.523 5.25 12 5.25c4.477 0 8.265 2.693 9.75 6.75-1.485 4.057-5.273 6.75-9.75 6.75-4.477 0-8.265-2.693-9.75-6.75z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                            </svg>
                        )}
                    </button>
                </div>
                <div className="flex flex-col gap-1 relative">
                    <label htmlFor="new_password2" className=" font-semibold">Confirm new Password</label>
                    <input
                        type={showPassword2 ? "text" : "password"}
                        id="new_password2"
                        placeholder="Confirm Password"
                        value={form.new_password2}
                        onChange={handleChangePassword}
                        className="rounded-lg border border-green-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition pr-12"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword2((v) => !v)}
                        className="absolute right-3 top-9  text-xl focus:outline-none"
                        tabIndex={-1}
                        aria-label={showPassword2 ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                        {showPassword2 ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12c2.083 3.61 6.017 6 9.75 6 1.662 0 3.26-.368 4.646-1.022M6.423 6.423A9.956 9.956 0 0 1 12 6c3.733 0 7.667 2.39 9.75 6a10.477 10.477 0 0 1-1.227 1.977M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM3 3l18 18" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12C3.735 7.943 7.523 5.25 12 5.25c4.477 0 8.265 2.693 9.75 6.75-1.485 4.057-5.273 6.75-9.75 6.75-4.477 0-8.265-2.693-9.75-6.75z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                            </svg>
                        )}
                    </button>
                </div>
                <div className="flex justify-center w-full mt-4">
                    <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-8 rounded-lg shadow-md transition">Recover Password</button>
                </div>
            </form>
        </div>
    )
}

export default ChanguePassword
'use client'
import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation";
import {LostPassword} from '@/types/auth.types'
import Image from "next/image"
import { ROUTES } from "@/lib/constants";
const RecoverPassword =()=>{
    const URL = 'http://127.0.0.1:8000/api/users/password-reset/request/'
    const router = useRouter();
    const [form, setForm] = useState({
        email: ""
    })

    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Se hace una copia del formulario y se actualiza con lso cambios echos por el usuario
        setForm({ ...form, [e.target.id]: e.target.value });
        // Limpiamos los mnesajes 
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // Evitamso que el formulario pierda la data
        e.preventDefault();

        // Limpiamois los mensajes
        setError('')
        setSuccess('')

        // Indicamos la data que enviaremos
        const data: LostPassword = {
            email: form.email,
        }

        try {
            // Hacemos la peticion
            const response = await axios.post(URL, data, {
                headers: { "Content-Type": "application/json" }
            });
        
        // Mostramos mensaje por el Back
        setSuccess(response.data.message);
        // Redirigios al usuario a autenticar el usuario pasandole el email como parametro
        router.push(`${ROUTES.RECOREVYPASSWORD}?email=${encodeURIComponent(form.email)}`);
        } catch (error: any) {
            console.log("Error completo:", error);
            console.log("Error response:", error.response); 
            // Verificamos si la respuesta de error tienes alguno de los campos y retornamos elmensaje
            if (error.response?.data) {
                const apiErrors = error.response.data;
                if (apiErrors.error) {
                    setError("El correo no exite. Verifca que sea el correcto");
                }else {
                    setError("No se pudo conectar con el servidor");
                }
            }
        }
    };

    return (
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
                    <h2 className="mt-4 text-3xl font-bold tracking-wide">Recover My Password</h2>
                </div>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className=" font-semibold">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            className="rounded-lg border border-green-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                        />
                    </div>
                    {error && <div className="text-red-600 text-sm font-semibold text-center mt-2">{error}</div>}
                    {success && <div className="text-green-600 text-sm font-semibold text-center mt-2">{success}</div>}
                    <button type="submit" className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg shadow-md transition">Recover</button>
                </div>
            </form>
        </div>
    )
}

export default RecoverPassword
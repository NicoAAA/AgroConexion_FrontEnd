"use client";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { RegisterAgroup} from "@/types/auth.types";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop";
import Link from "next/link";
import {ROUTES} from '@/lib/constants'
const organization_type = {
  cooperative: "Cooperativa",
  association: "Asociación",
  informal: "Grupo informal",
  other: "Otro",
};

// Funcion para registarr a un usuario
const RegisterAgropu = () => {
    const removeCedulaImage = () => {
        setCedulaImagePreview(null);
        setForm((prev) => ({ ...prev, image_cedula: null }));
        const input = document.getElementById("image_cedula") as HTMLInputElement;
        if (input) input.value = "";
    };
    // Permite navegar
    const router = useRouter();
    // URL de la solicitud
    const BACKEND_URL = " http://127.0.0.1:8000/api/users/group/register/";
    // Funcion para actualizar el estado de la vision de la contraseña
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
        null
    );
    const [cedulaImagePreview, setCedulaImagePreview] = useState<string | null>(
        null
    );
    const [rutPreview, setRutPreview] = useState<string | null>(null);
    const [form, setForm] = useState<RegisterAgroup>({
        username: "",
        email: "",
        phone_number: "",
        address: "",
        profile_image: null,
        password: "",
        password2: "",
        group_profile: {
        nit: "",
        organization_type: "",
        legal_representative: "",
        representative_cedula: "",
        image_cedula: null,
        rut_document: null,
        },
    });

    // Limpiar imagen seleccionada
    const removeProfileImage = () => {
        setProfileImagePreview(null);
        setForm((prev) => ({ ...prev, profile_image: null }));
        // Limpiar el input file visualmente
        const input = document.getElementById("profile_image") as HTMLInputElement;
        if (input) input.value = "";
    };

    // Funcion que actualiza los mensajes
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Estado para el cropper
    const [showCropper, setShowCropper] = useState<"profile" | "cedula" | null>(
        null
    );
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [tempImage, setTempImage] = useState<string | null>(null);

    const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    async function getCroppedImg(
        imageSrc: string,
        crop: Area
    ): Promise<Blob | null> {
        const image = new window.Image();
        image.src = imageSrc;
        await new Promise((resolve) => {
        image.onload = resolve;
        });
        const canvas = document.createElement("canvas");
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;
        ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
        );
        return new Promise((resolve) => {
            canvas.toBlob((blob) => resolve(blob), "image/jpeg");
        });
    }

    const handleImageInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "profile" | "cedula"
    ) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
        const url = window.URL.createObjectURL(file);
        setTempImage(url);
        setShowCropper(type);
        }
    };

    const handleCropSave = async () => {
        if (!tempImage || !croppedAreaPixels) return;
        const croppedBlob = await getCroppedImg(tempImage, croppedAreaPixels);
        if (croppedBlob) {
            const croppedFile = new File([croppedBlob], "cropped.jpg", {
                type: "image/jpeg",
            });
        if (showCropper === "profile") {
            setForm((prev) => ({ ...prev, profile_image: croppedFile }));
            setProfileImagePreview(window.URL.createObjectURL(croppedFile));
        } else if (showCropper === "cedula") {
            setForm((prev) => ({
            ...prev,
            group_profile: prev.group_profile
                ? { ...prev.group_profile, image_cedula: croppedFile }
                : null,
            }));
                setCedulaImagePreview(window.URL.createObjectURL(croppedFile));
            }
        }
        setShowCropper(null);
        setTempImage(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
    };

    const handleCropCancel = () => {
        setShowCropper(null);
        setTempImage(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
    };

    // Funcion para manejar los combios echos por el usuario
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { id, value, type, files } = e.target as HTMLInputElement;
        // Campos de agrupación
        const agroupFields = [
            "nit",
            "organization_type",
            "legal_representative",
            "representative_cedula",
            "image_cedula",
            "rut_document",
        ];
        if (type === "file") {
            const file = files && files.length > 0 ? files[0] : null;
        if (id === "profile_image") {
            setForm((prev) => ({ ...prev, profile_image: file }));
            if (file) setProfileImagePreview(window.URL.createObjectURL(file));
        } else if (id === "image_cedula") {
            setForm((prev) => ({
            ...prev,
            group_profile: prev.group_profile
                ? { ...prev.group_profile, image_cedula: file }
                : null,
            }));

            if (file) setCedulaImagePreview(window.URL.createObjectURL(file));
        } else if (id === "rut_document") {
            setForm((prev) => ({
            ...prev,
            group_profile: prev.group_profile
                ? { ...prev.group_profile, rut_document: file }
                : null,
            }));

            if (file && file.type === "application/pdf")
            setRutPreview(window.URL.createObjectURL(file));
        }
        } else {
        if (agroupFields.includes(id)) {
            setForm((prev) => ({
            ...prev,
            group_profile: prev.group_profile
                ? { ...prev.group_profile, [id]: value }
                : null,
            }));
        } else {
            setForm((prev) => ({ ...prev, [id]: value }));
        }
        }
        setError("");
        setSuccess("");
    };

    // Funcion que se ejecutara cuando se envie el formulario
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!form.username || !form.email || !form.password || !form.password2) {
            setError("Todos los campos son obligatorios");
            return;
        }

        if (form.password !== form.password2) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setError("");
        setSuccess("");
        const formData = new FormData();
            formData.append("username", form.username);
            formData.append("email", form.email);
            formData.append("password", form.password);
            formData.append("password2", form.password2);
            formData.append("phone_number", form.phone_number);
            formData.append("address", form.address);

        if (form.profile_image) {
            formData.append("profile_image", form.profile_image);
        }

        formData.append("group_profile.nit", form.group_profile?.nit ?? "");
            formData.append(
                "group_profile.organization_type",
            form.group_profile?.organization_type ?? "other"
        );
        formData.append(
            "group_profile.legal_representative",
            form.group_profile?.legal_representative ?? ""
        );
        formData.append(
            "group_profile.representative_cedula",
            form.group_profile?.representative_cedula ?? ""
        );

        if (form.group_profile?.image_cedula) {
            formData.append("group_profile.image_cedula", form.group_profile.image_cedula);
        }
        if (form.group_profile?.rut_document) {
            formData.append("group_profile.rut_document", form.group_profile.rut_document);
        }

        try {
            const response = await axios.post(BACKEND_URL, formData, {
                headers: { "Content-Type": "multipart/form-data" }, 
            });
            setSuccess(response.data.message);
            router.push(`${ROUTES.VERIFYACCOUTN}=${encodeURIComponent(form.email)}`);
        } catch (error: any) {
            console.error(error.response?.data);
            if (error.response?.data) {
                const apiErrors = error.response.data;
                if (apiErrors.username) {
                    setError("Este nombre de usuario ya está en uso. Intenta con otro.");
                } else if (apiErrors.email) {
                    setError("Este correo ya está registrado. Usa uno diferente.");
                } else {
                    setError("Error en el registro. Intenta nuevamente.");
                }
            } else {
                setError("No se pudo conectar con el servidor");
            }
        }
    };

    // Componente que retorna la funcion XMl
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-white to-green-500">
            <form
                onSubmit={handleSubmit}
                className="bg-white/90 shadow-2xl rounded-3xl px-10 py-10 w-full max-w-3xl mx-auto m-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <Image
                        src="/AgroConexion.svg"
                        alt="Logo"
                        height={80}
                        width={80}
                        className="rounded-full border-4 border-green-300 shadow-md bg-white"
                    />
                    <h2 className="mt-4 text-3xl font-bold tracking-wide">
                        Sign Up Agroup
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1">
                    <label htmlFor="username" className="font-semibold">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        className="rounded-lg border border-green-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className=" font-semibold">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="rounded-lg border border-green-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="phone_number" className="font-semibold">
                        Phone Number
                    </label>
                    <input
                        type="text"
                        id="phone_number"
                        placeholder="Phone Number"
                        value={form.phone_number}
                        onChange={handleChange}
                        className="rounded-lg border border-green-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="address" className="font-semibold">
                        Address
                    </label>
                    <input
                        type="text"
                        id="address"
                        placeholder="Address"
                        value={form.address}
                        onChange={handleChange}
                        className="rounded-lg border border-green-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="organization_type" className="font-semibold">
                        Tipo de organización
                    </label>
                    <select
                        id="organization_type"
                        value={form.group_profile?.organization_type || ""}
                        onChange={handleChange}
                        className="rounded-lg border border-green-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    >
                        <option value="">Selecciona una opción</option>
                        {Object.entries(organization_type).map(([key, label]) => (
                            <option key={key} value={key}>
                            {label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="nit" className="font-semibold">
                        NIT
                    </label>
                    <input
                        type="text"
                        id="nit"
                        placeholder="NIT"
                        value={form.group_profile?.nit || ""}
                        onChange={handleChange}
                        className="rounded-lg border border-green-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="legal_representative" className="font-semibold">
                        Representante legal
                    </label>
                    <input
                        type="text"
                        id="legal_representative"
                        placeholder="Representante legal"
                        value={form.group_profile?.legal_representative || ""}
                        onChange={handleChange}
                        className="rounded-lg border border-green-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="representative_cedula" className="font-semibold">
                        Cédula del representante
                    </label>
                    <input
                        type="text"
                        id="representative_cedula"
                        placeholder="Cédula del representante"
                        value={form.group_profile?.representative_cedula || ""}
                        onChange={handleChange}
                        className="rounded-lg border border-green-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    />
                </div>

                {/* Inputs de imagen y PDF, mejorados visualmente */}
                <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
                    {/* Imagen de perfil */}
                    <div className="flex flex-col gap-2 w-full bg-green-50 border-2 border-green-200 rounded-xl p-4 shadow-sm hover:border-green-400 transition">
                        <label
                            htmlFor="profile_image"
                            className="font-semibold flex items-center gap-2"
                        >
                            <svg
                                className="w-5 h-5 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Imagen de perfil
                        </label>
                        <input
                            type="file"
                            id="profile_image"
                            accept="image/*"
                            onChange={(e) => handleImageInput(e, "profile")}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 w-full cursor-pointer bg-white border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                        />
                        {profileImagePreview && (
                            <div className="relative mt-2 w-40 h-40 rounded-lg overflow-hidden border-2 border-green-300 shadow group">
                            <img
                                src={profileImagePreview}
                                alt="Previsualización perfil"
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay de cuadrícula */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                backgroundImage:
                                    "linear-gradient(to right, rgba(0,0,0,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.12) 1px, transparent 1px)",
                                backgroundSize: "20px 20px",
                                }}
                            />
                            <button
                                type="button"
                                onClick={removeProfileImage}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-base shadow hover:bg-red-700"
                            >
                                ✕
                            </button>
                            </div>
                        )}
                    </div>

                    {/* Imagen de cédula */}
                    <div className="flex flex-col gap-2 w-full bg-green-50 border-2 border-green-200 rounded-xl p-4 shadow-sm hover:border-green-400 transition">
                        <label
                            htmlFor="image_cedula"
                            className="font-semibold flex items-center gap-2"
                        >
                            <svg
                                className="w-5 h-5 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4v16m8-8H4"
                            />
                            </svg>
                            Imagen de cédula
                        </label>
                        <input
                            type="file"
                            id="image_cedula"
                            accept="image/*"
                            onChange={(e) => handleImageInput(e, "cedula")}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 w-full cursor-pointer bg-white border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                        />
                        {cedulaImagePreview && (
                        <div className="relative mt-2 w-40 h-40 rounded-lg overflow-hidden border-2 border-green-300 shadow group">
                            <img
                                src={cedulaImagePreview}
                                alt="Previsualización cédula"
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={removeCedulaImage}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-base shadow hover:bg-red-700"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                    </div>
                    {/* PDF RUT */}
                    <div className="flex flex-col gap-2 w-full bg-green-50 border-2 border-green-200 rounded-xl p-4 shadow-sm hover:border-green-400 transition">
                        <label
                            htmlFor="rut_document"
                            className="font-semibold flex items-center gap-2"
                        >
                            <svg
                                className="w-5 h-5 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4v16m8-8H4"
                            />
                            </svg>
                            Documento RUT (PDF)
                        </label>
                        <input
                            type="file"
                            id="rut_document"
                            accept="application/pdf"
                            onChange={handleChange}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 w-full cursor-pointer bg-white border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                        />
                        {rutPreview && (
                            <div className="mt-2 w-full rounded-lg overflow-hidden border-2 border-green-300 shadow">
                            <embed
                                src={rutPreview}
                                type="application/pdf"
                                width="100%"
                                height="220px"
                                className="rounded border-none"
                            />
                            </div>
                        )}
                    </div>
                </div>

                {/* Contraseña y confirmar contraseña en la misma fila, con botón de ver contraseña dentro del input y centrado visualmente */}
                <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-5">
                    <div className="flex flex-col gap-1 w-full relative">
                        <label htmlFor="password" className="font-semibold">
                            Contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                className="rounded-lg border border-green-200 px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl focus:outline-none"
                                tabIndex={-1}
                                aria-label={
                                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                                }
                            >
                                {showPassword ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6 text-green-500"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12c2.083 3.61 6.017 6 9.75 6 1.662 0 3.26-.368 4.646-1.022M6.423 6.423A9.956 9.956 0 0 1 12 6c3.733 0 7.667 2.39 9.75 6a10.477 10.477 0 0 1-1.227 1.977M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM3 3l18 18"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6 text-green-500"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.25 12C3.735 7.943 7.523 5.25 12 5.25c4.477 0 8.265 2.693 9.75 6.75-1.485 4.057-5.273 6.75-9.75 6.75-4.477 0-8.265-2.693-9.75-6.75z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 w-full relative">
                        <label htmlFor="password2" className="font-semibold">
                            Confirmar contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword2 ? "text" : "password"}
                                id="password2"
                                placeholder="Confirm Password"
                                value={form.password2}
                                onChange={handleChange}
                                className="rounded-lg border border-green-200 px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword2((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl focus:outline-none"
                                tabIndex={-1}
                                aria-label={
                                    showPassword2 ? "Ocultar contraseña" : "Mostrar contraseña"
                                }
                            >
                                {showPassword2 ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6 text-green-500"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12c2.083 3.61 6.017 6 9.75 6 1.662 0 3.26-.368 4.646-1.022M6.423 6.423A9.956 9.956 0 0 1 12 6c3.733 0 7.667 2.39 9.75 6a10.477 10.477 0 0 1-1.227 1.977M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM3 3l18 18"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6 text-green-500"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.25 12C3.735 7.943 7.523 5.25 12 5.25c4.477 0 8.265 2.693 9.75 6.75-1.485 4.057-5.273 6.75-9.75 6.75-4.477 0-8.265-2.693-9.75-6.75z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                                        />
                                    </svg>
                                )}
                                </button>
                            </div>
                        </div>
                    </div>
                    {error && (
                        <div className="text-red-600 text-sm font-semibold text-center mt-2">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="text-green-600 text-sm font-semibold text-center mt-2">
                            {success}
                        </div>
                    )}
                {/* Centrar el botón de enviar */}
                <div className="col-span-1 md:col-span-2 flex justify-center mt-6">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-8 rounded-lg shadow-md transition text-lg"
                    >
                        Sign Up
                    </button>
                </div>
                </div>

                {/* Cropper modal */}
                {showCropper && tempImage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                        <div className="bg-white rounded-xl shadow-lg p-6 w-[90vw] max-w-md flex flex-col items-center">
                            <div className="relative w-64 h-64 bg-gray-200">
                                <Cropper
                                    image={tempImage}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                />
                            </div>
                            <div className="flex gap-4 mt-4 w-full items-center">
                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.01}
                                    value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCropSave}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600"
                                >
                                    Recortar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCropCancel}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex justify-between gap-4 mt-4">
                    <Link href={ROUTES.LOGIN}>
                        <p className="text-blue-500 hover:text-blue-600">Iniciar Sesion</p>
                    </Link>
                    <Link href={ROUTES.REGISTER}>
                        <p className="text-blue-500 hover:text-blue-600">Registrarme como Uusuario</p>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default RegisterAgropu;